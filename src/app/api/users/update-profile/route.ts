import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log("Update Profile API: Request received");
    
    // Get the current user session for authentication
    const session = await getAuthSession();
    
    if (!session?.user) {
      console.log("Update Profile API: Unauthorized - No session user");
      return NextResponse.json({ 
        error: "Unauthorized. Please sign in to update your profile." 
      }, { status: 401 });
    }
    
    // Get user input from request body
    const requestData = await request.json();
    console.log("Update Profile API: Request data received", { 
      userEmail: session.user.email,
      fieldsToUpdate: Object.keys(requestData)
    });
    
    // Safety validation - don't allow changing email directly
    // This prevents identity spoofing
    if (requestData.email && requestData.email !== session.user.email) {
      console.log("Update Profile API: Attempt to change email rejected");
      return NextResponse.json({ 
        error: "Email changes are not allowed through this endpoint for security reasons." 
      }, { status: 400 });
    }
    
    // Don't allow direct role changes unless user is an admin
    if (requestData.role && requestData.role !== session.user.role && session.user.role !== 'admin') {
      console.log("Update Profile API: Unauthorized role change attempt", {
        currentRole: session.user.role,
        attemptedRole: requestData.role
      });
      return NextResponse.json({ 
        error: "You don't have permission to change roles." 
      }, { status: 403 });
    }
    
    // Connect to MongoDB
    console.log("Update Profile API: Connecting to MongoDB");
    const client = await clientPromise;
    
    if (!client) {
      console.error("Update Profile API: Failed to connect to MongoDB");
      return NextResponse.json({ 
        error: "Database connection failed" 
      }, { status: 500 });
    }
    
    const db = client.db();
    console.log("Update Profile API: Connected to database");
    
    // Make sure users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      console.log("Update Profile API: Users collection doesn't exist, creating it");
      await db.createCollection('users');
    }
    
    // Find user by email
    const existingUser = await db.collection('users').findOne({ email: session.user.email });
    
    // Extract allowed fields to update
    const allowedFields = [
      'name', 
      'image',
      'bio',
      'school',
      'position',
      'gradeLevel',
      'subjects',
      'preferences',
      'settings'
    ];
    
    // For admins, allow additional fields
    if (session.user.role === 'admin') {
      allowedFields.push('role');
      allowedFields.push('subscription');
    }
    
    // Create update object with only allowed fields
    const updateData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (requestData[field] !== undefined) {
        updateData[field] = requestData[field];
      }
    }
    
    // Add metadata
    updateData.updatedAt = new Date();
    
    // If user doesn't exist, create a new user record
    if (!existingUser) {
      console.log("Update Profile API: User doesn't exist in database, creating new record");
      
      // Create basic user object from session + requested updates
      const newUserData = {
        name: session.user.name || requestData.name || '',
        email: session.user.email,
        image: session.user.image || requestData.image || '',
        role: session.user.role || 'user',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: {
          tier: 'free',
          aiCreditsRemaining: 5,
          features: ['basic_features'],
          expiresAt: null
        },
        ...updateData
      };
      
      const result = await db.collection('users').insertOne(newUserData);
      
      return NextResponse.json({
        success: true,
        action: 'created',
        user: {
          ...newUserData,
          _id: result.insertedId
        }
      });
    } else {
      // Update existing user
      console.log("Update Profile API: Updating existing user");
      
      const result = await db.collection('users').updateOne(
        { email: session.user.email },
        { $set: updateData }
      );
      
      // Get the updated user
      const updatedUser = await db.collection('users').findOne({ email: session.user.email });
      
      return NextResponse.json({
        success: true,
        action: 'updated',
        user: updatedUser
      });
    }
  } catch (error) {
    console.error("Update Profile API: Error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 