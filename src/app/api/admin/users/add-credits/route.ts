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
    const { userId, credits } = body;
    
    // Validate input
    if (!userId || typeof credits !== 'number' || credits <= 0) {
      return NextResponse.json(
        { error: 'Invalid input. userId must be provided and credits must be a positive number' },
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
    
    // Get current credits
    const user = await db.collection('users').findOne(
      { _id: objectId },
      { projection: { 'subscription.aiCreditsRemaining': 1 } }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Calculate new credits value
    let currentCredits = user.subscription?.aiCreditsRemaining || 0;
    
    // Handle Infinity case
    if (currentCredits === Infinity) {
      return NextResponse.json({
        success: true,
        message: 'User already has unlimited credits',
        newCredits: Infinity
      });
    }
    
    const newCredits = currentCredits + credits;
    
    // Update user credits
    const result = await db.collection('users').updateOne(
      { _id: objectId },
      { $set: { 'subscription.aiCreditsRemaining': newCredits } }
    );
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: `Added ${credits} credits successfully`,
      newCredits: newCredits
    });
  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json(
      { error: 'Failed to add credits. Please try again.' },
      { status: 500 }
    );
  }
} 