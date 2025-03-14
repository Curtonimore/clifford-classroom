import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Define types for our results
type UserResult = {
  email: string;
  action: string;
  success: boolean;
  role: string;
  insertedId?: string;
};

export async function GET(request: NextRequest) {
  try {
    console.log("Create Test User API: Request received");
    
    // Get the session for security check
    const session = await getAuthSession();
    console.log("Create Test User API: Session retrieved", { 
      authenticated: !!session?.user, 
      userRole: session?.user?.role || 'none' 
    });
    
    // Only allow admins to create test users
    if (!session?.user || session.user.role !== 'admin') {
      console.log("Create Test User API: Unauthorized - Admin role required");
      return NextResponse.json({ 
        error: "Unauthorized. Admin access required to create test users."
      }, { status: 401 });
    }
    
    // Connect to MongoDB
    console.log("Create Test User API: Connecting to MongoDB");
    const client = await clientPromise;
    
    if (!client) {
      console.error("Create Test User API: Failed to connect to MongoDB");
      return NextResponse.json({ 
        error: "Failed to connect to MongoDB" 
      }, { status: 500 });
    }
    
    const db = client.db();
    console.log("Create Test User API: Connected to database");
    
    // Check if users collection exists, create it if not
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      console.log("Create Test User API: Users collection doesn't exist, creating it");
      await db.createCollection('users');
    }
    
    // Create test users - we'll create 3 with different roles
    const testUsers = [
      {
        name: "Test User",
        email: "test.user@example.com",
        image: "https://ui-avatars.com/api/?name=Test+User&background=random",
        role: "user",
        createdAt: new Date(),
        subscription: {
          tier: "free",
          aiCreditsRemaining: 5,
          features: ["basic_features"],
          expiresAt: null
        }
      },
      {
        name: "Test Premium",
        email: "test.premium@example.com",
        image: "https://ui-avatars.com/api/?name=Test+Premium&background=random",
        role: "premium",
        createdAt: new Date(),
        subscription: {
          tier: "premium",
          aiCreditsRemaining: 50,
          features: ["basic_features", "unlimited_lesson_plans", "ai_generation"],
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      },
      {
        name: "Test Admin",
        email: "test.admin@example.com",
        image: "https://ui-avatars.com/api/?name=Test+Admin&background=random",
        role: "admin",
        createdAt: new Date(),
        subscription: {
          tier: "premium",
          aiCreditsRemaining: 999,
          features: ["basic_features", "unlimited_lesson_plans", "ai_generation", "admin_features"],
          expiresAt: null
        }
      }
    ];
    
    // Insert or update each test user
    const results: UserResult[] = [];
    
    for (const user of testUsers) {
      // Check if this user already exists
      const existingUser = await db.collection('users').findOne({ email: user.email });
      
      if (existingUser) {
        // Update the existing user
        const updateResult = await db.collection('users').updateOne(
          { email: user.email },
          { $set: { ...user, _id: existingUser._id } }
        );
        
        results.push({
          email: user.email,
          action: "updated",
          success: updateResult.acknowledged,
          role: user.role
        });
      } else {
        // Insert new user
        const insertResult = await db.collection('users').insertOne(user);
        
        results.push({
          email: user.email,
          action: "created",
          success: insertResult.acknowledged,
          insertedId: insertResult.insertedId.toString(),
          role: user.role
        });
      }
    }
    
    console.log("Create Test User API: Test users created or updated", results);
    
    // Return the results
    return NextResponse.json({
      message: "Test users created or updated successfully",
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Create Test User API: Error creating test users:", error);
    return NextResponse.json({ 
      error: "Failed to create test users",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 