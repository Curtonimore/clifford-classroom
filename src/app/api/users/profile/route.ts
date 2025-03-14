import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log("User Profile API: Request received");
    
    // Get the current user's session
    const session = await getAuthSession();
    
    if (!session?.user) {
      console.log("User Profile API: Unauthorized - No session user");
      return NextResponse.json({ 
        error: "Unauthorized. Please sign in to view your profile." 
      }, { status: 401 });
    }
    
    console.log("User Profile API: Authorized user", { email: session.user.email });
    
    // Connect to MongoDB
    console.log("User Profile API: Connecting to MongoDB");
    const client = await clientPromise;
    
    if (!client) {
      console.error("User Profile API: Failed to connect to MongoDB");
      return NextResponse.json({ 
        error: "Database connection failed" 
      }, { status: 500 });
    }
    
    const db = client.db();
    console.log("User Profile API: Connected to database");
    
    // Check if users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      console.log("User Profile API: Users collection doesn't exist");
      
      // Return minimal profile since there's no user collection yet
      return NextResponse.json({
        success: true,
        user: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: session.user.role
        }
      });
    }
    
    // Find user in database
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (!user) {
      console.log("User Profile API: User not found in database, returning session data");
      
      // Return minimal profile from session data
      return NextResponse.json({
        success: true,
        user: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: session.user.role
        }
      });
    }
    
    console.log("User Profile API: User found in database");
    
    // Return user profile data
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name || session.user.name,
        email: user.email,
        image: user.image || session.user.image,
        role: user.role || session.user.role,
        bio: user.bio || '',
        school: user.school || '',
        position: user.position || '',
        gradeLevel: user.gradeLevel || '',
        subjects: user.subjects || [],
        preferences: user.preferences || {
          theme: 'light',
          notifications: true
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("User Profile API: Error:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve user profile",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 