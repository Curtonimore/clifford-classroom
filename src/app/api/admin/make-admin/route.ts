import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';

export const dynamic = 'force-dynamic';

// IMPORTANT: DELETE THIS FILE AFTER USING IT ONCE
// This is a temporary route to promote a user to admin
// It should only be accessible from your local environment

const SECRET_KEY = 'make-me-admin-now'; // A simple protection measure

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, secretKey } = body;
    
    // Basic validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Validate secret key for basic protection
    if (secretKey !== SECRET_KEY) {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Find the user first
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Update the user's role to admin
    const result = await db.collection('users').updateOne(
      { email },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount === 0) {
      if (user.role === 'admin') {
        return NextResponse.json({ message: 'User is already an admin' });
      } else {
        return NextResponse.json({ 
          message: 'Update operation completed, but role was not changed',
          user: { email: user.email, role: user.role }
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User has been promoted to admin',
      user: { email, role: 'admin' }
    });
  } catch (error: any) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { error: 'Failed to update user role', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 