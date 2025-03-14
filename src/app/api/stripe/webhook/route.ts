import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import clientPromise from '@/lib/mongodb-client';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// This is your Stripe webhook handler for Next.js
export async function POST(request: NextRequest) {
  try {
    // Get the request body and Stripe signature
    const body = await request.text();
    const signature = headers().get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Webhook secret is not configured.' },
        { status: 500 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Find customer in our database
        let customerId = session.customer as string;
        let userId = session.metadata?.userId;
        
        if (!userId && customerId) {
          // If userId is not in metadata, look it up from the customer
          const user = await db.collection('users').findOne({ 
            stripeCustomerId: customerId 
          });
          
          if (user) {
            userId = user._id.toString();
          }
        }
        
        if (!userId) {
          console.error('Could not find user associated with Stripe customer', customerId);
          return NextResponse.json({ received: true });
        }
        
        // Get subscription details
        const subscriptionId = session.subscription as string;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Get the product and price details
          const priceId = subscription.items.data[0].price.id;
          const productId = subscription.items.data[0].price.product as string;
          const product = await stripe.products.retrieve(productId);
          
          // Determine tier from product metadata or name
          const tier = product.metadata.tier || 
                      (product.name.toLowerCase().includes('premium') ? 'premium' : 'basic');
          
          // Calculate expiration date
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          
          // Determine features based on tier
          const features = tier === 'premium' 
            ? ['unlimited_lesson_plans', 'advanced_customization', 'export_all_formats']
            : ['increased_storage', 'download_pdf'];
          
          // Update user subscription in MongoDB
          await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                role: tier === 'premium' ? 'premium' : 'user',
                'subscription.tier': tier,
                'subscription.expiresAt': currentPeriodEnd,
                'subscription.features': features,
                'subscription.stripeSubscriptionId': subscriptionId,
                'subscription.stripePriceId': priceId,
                'subscription.status': subscription.status,
                'subscription.aiCreditsRemaining': tier === 'premium' ? 150 : 30,
                'permissions.canAccessPremiumFeatures': tier === 'premium'
              }
            }
          );
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user with this customer ID
        const user = await db.collection('users').findOne({ 
          stripeCustomerId: customerId 
        });
        
        if (!user) {
          console.error('Could not find user for customer', customerId);
          return NextResponse.json({ received: true });
        }
        
        // Get the product and price details
        const priceId = subscription.items.data[0].price.id;
        const productId = subscription.items.data[0].price.product as string;
        const product = await stripe.products.retrieve(productId);
        
        // Determine tier from product metadata or name
        const tier = product.metadata.tier || 
                    (product.name.toLowerCase().includes('premium') ? 'premium' : 'basic');
        
        // Calculate expiration date
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        
        // Update user subscription
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              role: tier === 'premium' ? 'premium' : 'user',
              'subscription.tier': tier,
              'subscription.expiresAt': currentPeriodEnd,
              'subscription.stripePriceId': priceId,
              'subscription.status': subscription.status,
              'permissions.canAccessPremiumFeatures': tier === 'premium'
            }
          }
        );
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user with this customer ID
        const user = await db.collection('users').findOne({ 
          stripeCustomerId: customerId 
        });
        
        if (!user) {
          console.error('Could not find user for customer', customerId);
          return NextResponse.json({ received: true });
        }
        
        // Downgrade user to free tier
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              role: 'user',
              'subscription.tier': 'free',
              'subscription.status': 'canceled',
              'subscription.features': [],
              'permissions.canAccessPremiumFeatures': false
            }
          }
        );
        break;
      }
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
} 