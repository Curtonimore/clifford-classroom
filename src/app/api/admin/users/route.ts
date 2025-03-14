export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';
import { Document } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log("Admin Users API: Request received");
    
    // Get the current session
    const session = await getAuthSession();
    console.log("Admin Users API: Session retrieved", { 
      authenticated: !!session?.user,
      userEmail: session?.user?.email,
      userRole: session?.user?.role
    });
    
    // Check if user is authenticated and an admin
    if (!session?.user) {
      console.error("Admin Users API: Unauthorized - No session user");
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    if (session.user.role !== 'admin') {
      console.error("Admin Users API: Forbidden - Not admin role", { 
        userRole: session.user.role 
      });
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }
    
    // Connect to MongoDB
    console.log("Admin Users API: Connecting to MongoDB");
    const client = await clientPromise;
    
    // Create an empty users array as fallback
    let users: Document[] = [];
    
    // Only try to get users if we have a client
    if (client) {
      const db = client.db();
      console.log("Admin Users API: Connected to database");
      
      try {
        // Check if the users collection exists
        const collections = await db.listCollections({ name: 'users' }).toArray();
        if (collections.length === 0) {
          console.warn("Admin Users API: Users collection doesn't exist");
          return NextResponse.json({ users: [] });
        }
        
        // Fetch all users with explicit projection to avoid large objects
        users = await db.collection('users').find({})
          .project({
            name: 1,
            email: 1,
            image: 1,
            role: 1,
            subscription: 1,
            createdAt: 1
          })
          .limit(100) // Limit to 100 users for safety
          .toArray();
        
        console.log(`Admin Users API: Found ${users.length} users`);
      } catch (dbError) {
        console.error("Admin Users API: Database error", dbError);
        return NextResponse.json({ 
          users: [],
          error: 'Database error' 
        });
      }
    } else {
      console.warn("Admin Users API: MongoDB client is null");
    }
    
    // Return the users
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Admin Users API: Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users. Please try again.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 