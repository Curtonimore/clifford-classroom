export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';

export async function GET(request: NextRequest) {
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
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch all users
    const users = await db.collection('users').find({}).toArray();
    
    // Return the users
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users. Please try again.' },
      { status: 500 }
    );
  }
} 