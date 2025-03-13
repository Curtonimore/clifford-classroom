import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getAuthSession();
    
    // Check if user is authenticated and an admin
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { userId, subscription } = body;
    
    // Validate input
    if (!userId || !subscription) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and subscription' },
        { status: 400 }
      );
    }
    
    // Validate subscription tier
    if (subscription.tier && !['free', 'basic', 'premium'].includes(subscription.tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier. Must be one of: free, basic, premium' },
        { status: 400 }
      );
    }
    
    // Convert userId to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Prepare update object based on what was provided
    const updateObject = {};
    
    if (subscription.tier) {
      updateObject['subscription.tier'] = subscription.tier;
      
      // Set default features based on tier
      switch (subscription.tier) {
        case 'free':
          updateObject['subscription.features'] = ['demo_lesson_plans', 'basic_profile'];
          break;
        case 'basic':
          updateObject['subscription.features'] = [
            'demo_lesson_plans', 
            'basic_profile',
            'save_lesson_plans',
            'basic_customization'
          ];
          break;
        case 'premium':
          updateObject['subscription.features'] = [
            'unlimited_lesson_plans',
            'advanced_customization',
            'export_all_formats',
            'priority_support',
            'save_lesson_plans',
            'community_sharing'
          ];
          break;
      }
    }
    
    if (subscription.expiresAt !== undefined) {
      updateObject['subscription.expiresAt'] = subscription.expiresAt;
    }
    
    if (subscription.aiCreditsRemaining !== undefined) {
      updateObject['subscription.aiCreditsRemaining'] = subscription.aiCreditsRemaining;
    }
    
    if (subscription.features) {
      updateObject['subscription.features'] = subscription.features;
    }
    
    // Update user subscription
    const result = await db.collection('users').updateOne(
      { _id: objectId },
      { $set: updateObject }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'User subscription updated successfully'
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update user subscription. Please try again.' },
      { status: 500 }
    );
  }
} 