import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion, // Use the latest API version
});

// Pricing IDs - replace these with your actual price IDs from Stripe Dashboard after creating products
const SUBSCRIPTION_PRICES = {
  basic: process.env.STRIPE_PRICE_BASIC || 'price_basic',
  premium: process.env.STRIPE_PRICE_PREMIUM || 'price_premium',
};

/**
 * Create a Stripe Checkout Session for subscription
 */
export async function createCheckoutSession(
  customerId: string,
  tier: 'basic' | 'premium',
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    // Get the price ID for the selected tier
    const priceId = SUBSCRIPTION_PRICES[tier];
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerId ? undefined : userEmail,
      metadata: {
        userId: customerId,
        tier: tier,
      },
    });
    
    return { success: true, sessionId: session.id, url: session.url };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create or get a Stripe customer
 */
export async function getOrCreateCustomer(userId: string, email: string, name?: string) {
  try {
    // Search for existing customers with the same email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });
    
    // If customer exists, return it
    if (customers.data.length > 0) {
      return { success: true, customerId: customers.data[0].id };
    }
    
    // Otherwise create a new customer
    const customer = await stripe.customers.create({
      email: email,
      name: name || undefined,
      metadata: {
        userId: userId,
      },
    });
    
    return { success: true, customerId: customer.id };
  } catch (error: any) {
    console.error('Error creating/getting customer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update MongoDB user subscription based on Stripe event
 */
export async function handleSubscriptionChange(
  subscriptionId: string,
  customerId: string,
  status: string
) {
  // This function will be implemented in the webhook handler
  // It will update the user's subscription in MongoDB when Stripe events occur
  return { 
    subscriptionId,
    customerId,
    status,
    action: 'This will update the user subscription in MongoDB'
  };
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return { success: true, subscription };
  } catch (error: any) {
    console.error('Error retrieving subscription:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return { success: true, subscription };
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return { success: false, error: error.message };
  }
}

export default stripe; 