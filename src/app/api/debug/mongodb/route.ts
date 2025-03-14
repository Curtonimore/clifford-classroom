import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { Document } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log("MongoDB Debug API: Attempting to connect to MongoDB");
    
    // Connection info
    const connectionInfo = {
      uri: process.env.MONGODB_URI ? 
        (process.env.MONGODB_URI.startsWith('mongodb+srv://') ? 'Valid format' : 'Invalid format') : 
        'Missing URI',
      uriExists: !!process.env.MONGODB_URI,
    };
    
    console.log("MongoDB Debug API: Connection info:", connectionInfo);
    
    // Try to connect to MongoDB
    let client;
    let collections: any[] = [];
    let connectionSuccess = false;
    let dbInfo: Record<string, any> = {};
    let errorMessage: string | null = null;
    
    try {
      client = await clientPromise;
      console.log("MongoDB Debug API: Client created successfully", !!client);
      
      if (client) {
        const db = client.db();
        connectionSuccess = true;
        
        // Get collections
        collections = await db.listCollections().toArray();
        console.log(`MongoDB Debug API: Found ${collections.length} collections`);
        
        // Check users collection specifically
        const usersCollection = collections.find(c => c.name === 'users');
        if (usersCollection) {
          const userCount = await db.collection('users').countDocuments();
          console.log(`MongoDB Debug API: Users collection exists with ${userCount} documents`);
          
          // Get a sample user (first one) with limited fields
          const sampleUser = await db.collection('users').findOne(
            {}, 
            { projection: { name: 1, email: 1, role: 1, _id: 0 } }
          ) as Document | null;
          
          dbInfo = {
            usersCollection: true,
            userCount,
            sampleUser: sampleUser ? { 
              name: sampleUser.name || 'unnamed',
              role: sampleUser.role || 'undefined',
              email: sampleUser.email ? `${String(sampleUser.email).substring(0, 3)}...` : 'undefined'
            } : null
          };
        } else {
          console.log("MongoDB Debug API: Users collection does not exist");
          dbInfo = { usersCollection: false };
        }
      }
    } catch (err) {
      console.error("MongoDB Debug API: Error connecting to MongoDB:", err);
      errorMessage = err instanceof Error ? err.message : String(err);
      connectionSuccess = false;
    }
    
    // Return debug info
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      connectionInfo,
      connectionSuccess,
      collections: collections.map(c => c.name),
      dbInfo,
      error: errorMessage,
      env: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
      }
    });
  } catch (error) {
    console.error("MongoDB Debug API: Unexpected error:", error);
    return NextResponse.json(
      { 
        error: 'Failed to check MongoDB connection',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 