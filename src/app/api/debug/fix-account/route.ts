import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log("Fix Account API: Request received");
    
    // Get parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const name = searchParams.get('name') || email?.split('@')[0] || 'User';
    const role = (searchParams.get('role') || 'user') as 'user' | 'premium' | 'admin';
    
    // Require email parameter
    if (!email) {
      return NextResponse.json({
        error: "Missing email parameter. Use ?email=user@example.com"
      }, { status: 400 });
    }
    
    // Get the session for security check
    const session = await getAuthSession();
    const isAdmin = !!session?.user && session.user.role === 'admin';
    console.log("Fix Account API: Session retrieved", { 
      authenticated: !!session?.user, 
      userRole: session?.user?.role || 'none',
      isAdmin
    });
    
    // Only allow admins to access this endpoint
    if (!isAdmin) {
      console.log("Fix Account API: Access denied - Not an admin");
      return NextResponse.json({ 
        error: "Access denied. Admin privileges required." 
      }, { status: 403 });
    }
    
    // Connect to MongoDB
    console.log("Fix Account API: Connecting to MongoDB");
    const client = await clientPromise;
    
    if (!client) {
      console.error("Fix Account API: Failed to connect to MongoDB");
      return NextResponse.json({ 
        error: "Failed to connect to MongoDB" 
      }, { status: 500 });
    }
    
    const db = client.db();
    console.log("Fix Account API: Connected to database");
    
    // Check if users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      console.log("Fix Account API: Users collection doesn't exist, creating it");
      await db.createCollection('users');
    }
    
    // Search for the user in the database
    const existingUser = await db.collection('users').findOne({ email: email });
    
    // Prepare the user object
    const userTier = role === 'admin' || role === 'premium' ? 'premium' : 'free';
    const userObject = {
      name: name,
      email: email,
      image: existingUser?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      role: role,
      emailVerified: new Date(),
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
      subscription: {
        tier: userTier,
        aiCreditsRemaining: role === 'admin' ? 999 : (role === 'premium' ? 50 : 5),
        features: [
          'basic_features',
          ...(role === 'premium' || role === 'admin' ? ['unlimited_lesson_plans', 'ai_generation'] : []),
          ...(role === 'admin' ? ['admin_features'] : [])
        ],
        expiresAt: null
      }
    };
    
    let result;
    
    if (existingUser) {
      // Update existing user
      console.log(`Fix Account API: Updating existing user: ${email}`);
      result = await db.collection('users').updateOne(
        { email: email },
        { $set: userObject }
      );
      
      return NextResponse.json({
        success: true,
        action: 'updated',
        user: {
          ...userObject,
          _id: existingUser._id
        }
      });
    } else {
      // Create new user
      console.log(`Fix Account API: Creating new user: ${email}`);
      result = await db.collection('users').insertOne(userObject);
      
      return NextResponse.json({
        success: true,
        action: 'created',
        user: {
          ...userObject,
          _id: result.insertedId
        }
      });
    }
  } catch (error) {
    console.error("Fix Account API: Error:", error);
    return NextResponse.json({ 
      error: "Failed to fix account",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 