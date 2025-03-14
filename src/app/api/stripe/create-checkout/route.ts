import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/stripe';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { tier } = body;

    // Validate tier
    if (!tier || !['basic', 'premium'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier. Must be either "basic" or "premium".' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const { success: customerSuccess, customerId, error: customerError } = 
      await getOrCreateCustomer(
        session.user.id,
        session.user.email || '',
        session.user.name || undefined
      );

    if (!customerSuccess || !customerId) {
      return NextResponse.json(
        { error: customerError || 'Failed to create Stripe customer.' },
        { status: 500 }
      );
    }

    // Store Stripe customer ID in MongoDB if it's not already there
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { 
        $set: { 
          'stripeCustomerId': customerId 
        } 
      }
    );

    // Create checkout session
    const { success, sessionId, url, error } = await createCheckoutSession(
      customerId,
      tier as 'basic' | 'premium',
      session.user.email || '',
      `${process.env.NEXTAUTH_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXTAUTH_URL}/subscription/canceled`
    );

    if (!success || !url) {
      return NextResponse.json(
        { error: error || 'Failed to create checkout session.' },
        { status: 500 }
      );
    }

    // Return the checkout session URL
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
} 