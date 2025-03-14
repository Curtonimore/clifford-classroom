import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';

export const dynamic = 'force-dynamic';

// IMPORTANT: DELETE THIS FILE AFTER USING IT ONCE
// This is a temporary route to promote a user to admin
// It should only be accessible from your local environment

const SECRET_KEY = 'make-me-admin-now'; // A simple protection measure

export async function POST(request: NextRequest) {
  console.log('Admin make-admin API: Request received');
  
  try {
    // Get the current session
    const session = await getAuthSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      console.error('Admin make-admin API: Unauthorized - No session user');
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    
    console.log('Admin make-admin API: User authenticated', { 
      email: session.user.email,
      id: session.user.id
    });
    
    // Get the request body
    const body = await request.json().catch(() => ({}));
    const { force = false } = body;
    
    // Check if this is an allowed admin email
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase());
    const isAllowedAdmin = adminEmails.includes(session.user.email.toLowerCase());
    
    console.log('Admin make-admin API: Admin check', {
      configuredAdmins: adminEmails,
      userEmail: session.user.email.toLowerCase(),
      isAllowedAdmin
    });
    
    // Only allow admin creation if user is in the ADMIN_EMAILS list or if force is true and we're in development
    if (!isAllowedAdmin && !(force && process.env.NODE_ENV === 'development')) {
      console.error('Admin make-admin API: Forbidden - Email not in ADMIN_EMAILS');
      return NextResponse.json(
        { error: 'Forbidden. Your email is not authorized for admin access.' },
        { status: 403 }
      );
    }
    
    // Connect to MongoDB
    console.log('Admin make-admin API: Connecting to MongoDB');
    const client = await clientPromise;
    
    if (!client) {
      console.error('Admin make-admin API: MongoDB client is null');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const db = client.db();
    
    // Make sure the users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      console.log('Admin make-admin API: Creating users collection');
      await db.createCollection('users');
    }
    
    // Find the user by their email
    const existingUser = await db.collection('users').findOne({ email: session.user.email });
    
    if (existingUser) {
      // Update the existing user to be an admin
      console.log('Admin make-admin API: Updating existing user to admin role');
      await db.collection('users').updateOne(
        { email: session.user.email },
        { 
          $set: { 
            role: 'admin',
            subscription: {
              tier: 'premium',
              features: [
                'unlimited_lesson_plans',
                'advanced_customization',
                'admin_dashboard',
                'export_all_formats',
                'priority_support'
              ],
              aiCreditsRemaining: 999,
              expiresAt: null
            }
          } 
        }
      );
    } else {
      // Create a new user with admin role
      console.log('Admin make-admin API: Creating new admin user');
      await db.collection('users').insertOne({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        emailVerified: new Date(),
        role: 'admin',
        subscription: {
          tier: 'premium',
          features: [
            'unlimited_lesson_plans',
            'advanced_customization',
            'admin_dashboard',
            'export_all_formats',
            'priority_support'
          ],
          aiCreditsRemaining: 999,
          expiresAt: null
        },
        createdAt: new Date()
      });
    }
    
    console.log('Admin make-admin API: Admin role assigned successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Admin role assigned successfully. Please sign out and sign back in to see the changes.'
    });
  } catch (error) {
    console.error('Admin make-admin API: Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to assign admin role',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 