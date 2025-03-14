import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';

export const dynamic = 'force-dynamic';

// GET - Get all lesson plans for the current user
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
    
    // Get user info from MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Find user by email to get the user ID
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get lesson plans for this user
    const lessonPlans = await db.collection('lessonplans')
      .find({ user: user._id })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ lessonPlans });
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Save a new lesson plan
export async function POST(request: NextRequest) {
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
    
    // Get request body
    const { title, subject, audience, time, topic, objectives, content } = await request.json();
    
    // Basic validation
    if (!title || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, subject, and content are required' },
        { status: 400 }
      );
    }
    
    // Get user from MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Find user by email
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prepare lesson plan document
    const lessonPlan = {
      title,
      subject,
      audience,
      time,
      topic,
      objectives,
      content,
      user: user._id,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to MongoDB
    const result = await db.collection('lessonplans').insertOne(lessonPlan);
    
    // Return the saved lesson plan with its ID
    return NextResponse.json({
      lessonPlan: {
        ...lessonPlan,
        _id: result.insertedId
      },
      message: 'Lesson plan saved successfully'
    });
  } catch (error) {
    console.error('Error saving lesson plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 