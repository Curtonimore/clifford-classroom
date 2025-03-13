import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';
import mongoose from 'mongoose';

// Define storage limits per subscription tier - keep in sync with the save endpoint
const STORAGE_LIMITS = {
  free: 25,      // Free users can store up to 25 lesson plans
  basic: 100,    // Basic users can store up to 100 lesson plans
  premium: 500,  // Premium users can store up to 500 lesson plans
  admin: Infinity // Admins have unlimited storage
};

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view storage usage.' },
        { status: 401 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get user info for subscription tier check
    const user = await db.collection('users').findOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { projection: { 'role': 1, 'subscription.tier': 1 } }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      );
    }
    
    // Determine storage limit based on role and subscription tier
    let storageLimit;
    if (user.role === 'admin') {
      storageLimit = STORAGE_LIMITS.admin;
    } else {
      const subscriptionTier = user.subscription?.tier || 'free';
      storageLimit = STORAGE_LIMITS[subscriptionTier];
    }
    
    // Count existing lesson plans for this user
    const userLessonPlansCount = await db.collection('lessonplans').countDocuments({ 
      user: new mongoose.Types.ObjectId(userId) 
    });
    
    // Calculate storage usage statistics
    const percentUsed = storageLimit === Infinity ? 0 : Math.round((userLessonPlansCount / storageLimit) * 100);
    
    return NextResponse.json({
      success: true,
      storageInfo: {
        used: userLessonPlansCount,
        limit: storageLimit,
        percentUsed: percentUsed,
        remaining: storageLimit === Infinity ? Infinity : storageLimit - userLessonPlansCount,
        subscription: user.subscription?.tier || 'free'
      }
    });
    
  } catch (error) {
    console.error('Error fetching storage usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storage usage. Please try again.' },
      { status: 500 }
    );
  }
} 