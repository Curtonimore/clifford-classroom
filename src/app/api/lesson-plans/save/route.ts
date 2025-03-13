import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';
import LessonPlan from '@/models/LessonPlan';
import AIUsage from '@/models/AIUsage';
import mongoose from 'mongoose';

// Define storage limits per subscription tier
const STORAGE_LIMITS = {
  free: 25,      // Free users can store up to 25 lesson plans
  basic: 100,    // Basic users can store up to 100 lesson plans
  premium: 500,  // Premium users can store up to 500 lesson plans
  admin: Infinity // Admins have unlimited storage
};

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to save lesson plans.' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const {
      title,
      subject,
      audience,
      time,
      topic,
      objectives,
      content,
      isPublic = false,
      tags = []
    } = await request.json();
    
    // Basic validation
    if (!title || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, subject, and content are required.' },
        { status: 400 }
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
    
    // Check if user has reached their storage limit
    if (userLessonPlansCount >= storageLimit && storageLimit !== Infinity) {
      return NextResponse.json({
        error: `Storage limit reached. You can save up to ${storageLimit} lesson plans with your current subscription.`,
        storageInfo: {
          used: userLessonPlansCount,
          limit: storageLimit,
          subscription: user.subscription?.tier || 'free'
        }
      }, { status: 403 });
    }
    
    // Create a new lesson plan document
    const lessonPlanData = {
      title,
      subject,
      audience,
      time,
      topic,
      objectives,
      content,
      user: new mongoose.Types.ObjectId(userId),
      isPublic,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the lesson plan
    const result = await db.collection('lessonplans').insertOne(lessonPlanData);
    
    // If the lesson plan was created successfully, track AI usage if needed
    if (result.insertedId && !request.headers.get('X-Force-Demo-Mode')) {
      // Track AI usage (if not in demo mode)
      await db.collection('aiusages').insertOne({
        user: new mongoose.Types.ObjectId(userId),
        feature: 'lesson_plan',
        creditsUsed: 1,
        metadata: {
          lessonPlanId: result.insertedId.toString(),
          subject,
          audience
        },
        createdAt: new Date()
      });
      
      // Update user's AI credits (decrease by 1)
      await db.collection('users').updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $inc: { 'subscription.aiCreditsRemaining': -1 } }
      );
    }
    
    // Calculate storage usage for response
    const newCount = userLessonPlansCount + 1;
    const percentUsed = storageLimit === Infinity ? 0 : Math.round((newCount / storageLimit) * 100);
    
    return NextResponse.json({ 
      success: true,
      message: 'Lesson plan saved successfully',
      lessonPlanId: result.insertedId.toString(),
      storageInfo: {
        used: newCount,
        limit: storageLimit,
        percentUsed: percentUsed,
        remaining: storageLimit === Infinity ? Infinity : storageLimit - newCount
      }
    });
    
  } catch (error) {
    console.error('Error saving lesson plan:', error);
    return NextResponse.json(
      { error: 'Failed to save lesson plan. Please try again.' },
      { status: 500 }
    );
  }
} 