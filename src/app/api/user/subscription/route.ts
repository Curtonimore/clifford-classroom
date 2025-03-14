export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';
import clientPromise from '@/lib/mongodb-client';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    
    // Get user info from MongoDB via NextAuth adapter
    const client = await clientPromise;
    const usersCollection = client.db().collection('users');
    
    // Find user by email (which is unique)
    const user = await usersCollection.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return subscription information
    // If user is admin, override with unlimited features
    const isAdmin = session.user.role === 'admin';
    
    const subscription = isAdmin 
      ? {
          tier: 'premium',
          expiresAt: null,
          features: [
            'unlimited_lesson_plans',
            'advanced_customization',
            'admin_dashboard',
            'export_all_formats',
            'priority_support'
          ],
          aiCreditsRemaining: Infinity
        }
      : user.subscription || {
          tier: 'free',
          expiresAt: null,
          features: ['demo_lesson_plans', 'basic_profile'],
          aiCreditsRemaining: 5
        };
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 