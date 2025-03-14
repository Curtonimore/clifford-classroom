export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view your lesson plans.' },
        { status: 401 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get pagination parameters from URL
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Query for user's lesson plans, sorted by most recent first
    const lessonPlans = await db.collection('lessonplans')
      .find({ user: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const total = await db.collection('lessonplans')
      .countDocuments({ user: new mongoose.Types.ObjectId(userId) });
    
    return NextResponse.json({
      lessonPlans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson plans. Please try again.' },
      { status: 500 }
    );
  }
} 