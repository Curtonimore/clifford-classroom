import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { getAuthSession } from '@/lib/auth';
import { Document, WithId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log("Find User API: Request received");
    
    // Get the email parameter from the URL
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const createIfMissing = searchParams.get('create') === 'true';
    
    // Require email parameter
    if (!email) {
      return NextResponse.json({
        error: "Missing email parameter. Use ?email=user@example.com"
      }, { status: 400 });
    }
    
    console.log(`Find User API: Searching for user with email: ${email}`);
    
    // Get the session for security check
    const session = await getAuthSession();
    const isAdmin = !!session?.user && session.user.role === 'admin';
    console.log("Find User API: Session retrieved", { 
      authenticated: !!session?.user, 
      userRole: session?.user?.role || 'none',
      isAdmin
    });
    
    // Connect to MongoDB
    console.log("Find User API: Connecting to MongoDB");
    const client = await clientPromise;
    
    if (!client) {
      console.error("Find User API: Failed to connect to MongoDB");
      return NextResponse.json({ 
        error: "Failed to connect to MongoDB" 
      }, { status: 500 });
    }
    
    const db = client.db();
    console.log("Find User API: Connected to database");
    
    // Check if users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      console.log("Find User API: Users collection doesn't exist");
      
      if (createIfMissing && isAdmin) {
        console.log("Find User API: Creating users collection");
        await db.createCollection('users');
      } else {
        return NextResponse.json({
          found: false,
          error: "Users collection doesn't exist"
        });
      }
    }
    
    // Check if account collection exists (NextAuth stores connections here)
    const accountCollections = await db.listCollections({ name: 'accounts' }).toArray();
    const hasAccountsCollection = accountCollections.length > 0;
    
    // Search for the user in the database
    const user = await db.collection('users').findOne({ email: email });
    
    // If we have accounts collection, also check for related account
    let account: WithId<Document> | null = null;
    if (hasAccountsCollection && user) {
      account = await db.collection('accounts').findOne({ userId: user._id });
    }
    
    if (user) {
      console.log(`Find User API: User found: ${user.name || 'unnamed'}`);
      
      // Sanitize the user object for the response
      const sanitizedUser = {
        _id: user._id,
        name: user.name || null,
        email: user.email,
        image: user.image || null,
        role: user.role || 'user',
        hasAccount: !!account,
        createdAt: user.createdAt || null
      };
      
      return NextResponse.json({
        found: true,
        user: sanitizedUser
      });
    } else {
      console.log(`Find User API: User not found with email: ${email}`);
      
      // If admin requested creation and user doesn't exist
      if (createIfMissing && isAdmin) {
        console.log(`Find User API: Creating new user with email: ${email}`);
        
        // Create a new user
        const newUser = {
          name: email.split('@')[0], // Use part before @ as name
          email: email,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`,
          role: 'user',
          createdAt: new Date(),
          subscription: {
            tier: 'free',
            aiCreditsRemaining: 5,
            features: ['basic_features'],
            expiresAt: null
          }
        };
        
        const result = await db.collection('users').insertOne(newUser);
        console.log(`Find User API: User created with ID: ${result.insertedId}`);
        
        return NextResponse.json({
          found: false,
          created: true,
          user: {
            _id: result.insertedId,
            ...newUser
          }
        });
      }
      
      return NextResponse.json({
        found: false,
        created: false
      });
    }
  } catch (error) {
    console.error("Find User API: Error:", error);
    return NextResponse.json({ 
      error: "Failed to search for user",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 