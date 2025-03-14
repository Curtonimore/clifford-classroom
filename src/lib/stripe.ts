import Stripe from 'stripe';

// Initialize Stripe with optimized settings for serverless environments
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion, // Use the latest API version
  timeout: 30000, // 30 second timeout (default is 80 seconds which is too long for serverless)
  maxNetworkRetries: 3, // Automatically retry failed requests
  telemetry: false, // Disable telemetry in production for better performance
  httpAgent: new (require('http').Agent)({ keepAlive: true }), // Keep connections alive
});

// Pricing IDs - replace these with your actual price IDs from Stripe Dashboard after creating products
const SUBSCRIPTION_PRICES = {
  basic: process.env.STRIPE_PRICE_BASIC || 'price_basic',
  premium: process.env.STRIPE_PRICE_PREMIUM || 'price_premium',
};

// Helper for handling Stripe API errors
const handleStripeError = (error: any, operation: string) => {
  const errorMessage = error?.message || 'Unknown error occurred';
  console.error(`Stripe ${operation} error:`, {
    type: error?.type,
    code: error?.code,
    message: errorMessage,
    requestId: error?.requestId
  });
  return { success: false, error: errorMessage, code: error?.code };
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
      // Speed up checkout by prefilling customer details
      billing_address_collection: 'auto',
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session'  // Don't save card for future use
        }
      },
      // Add tax ID collection if needed
      // tax_id_collection: { enabled: true },
    });
    
    return { success: true, sessionId: session.id, url: session.url };
  } catch (error: any) {
    return handleStripeError(error, 'checkout session creation');
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
    return handleStripeError(error, 'customer creation');
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
    return handleStripeError(error, 'subscription retrieval');
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
    return handleStripeError(error, 'subscription cancellation');
  }
}

export default stripe; 