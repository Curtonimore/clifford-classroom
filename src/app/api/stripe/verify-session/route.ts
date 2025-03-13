import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import stripe from '@/lib/stripe';
import clientPromise from '@/lib/mongodb-client';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Get the session ID from the query string
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID.' },
        { status: 400 }
      );
    }

    // Retrieve the Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify that this session belongs to the current user
    // This could be by comparing customer IDs or metadata
    const client = await clientPromise;
    const db = client.db();

    // Get the subscription
    const subscriptionId = checkoutSession.subscription as string;
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'No subscription found for this session.' },
        { status: 404 }
      );
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Find the user in our database
    const customerId = subscription.customer as string;
    const user = await db.collection('users').findOne({
      $or: [
        { _id: new ObjectId(session.user.id) },
        { stripeCustomerId: customerId }
      ]
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Get the product details to determine the tier
    const priceId = subscription.items.data[0].price.id;
    const productId = subscription.items.data[0].price.product as string;
    const product = await stripe.products.retrieve(productId);

    // Determine tier from product metadata or name
    const tier = product.metadata.tier || 
                (product.name.toLowerCase().includes('premium') ? 'premium' : 'basic');

    // Return subscription details
    return NextResponse.json({
      success: true,
      tier: tier,
      status: subscription.status,
      expiresAt: new Date(subscription.current_period_end * 1000).toISOString(),
    });
  } catch (error: any) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
} 