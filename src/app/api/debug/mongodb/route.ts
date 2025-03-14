export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';

export async function GET() {
  try {
    console.log("DEBUG: MongoDB connection check started");
    
    // Check if MONGODB_URI exists
    const hasUri = !!process.env.MONGODB_URI;
    console.log("DEBUG: MONGODB_URI exists:", hasUri);
    
    // Check URI format (without revealing actual credentials)
    let uriFormat = 'Missing';
    if (hasUri && process.env.MONGODB_URI) {
      const uri = process.env.MONGODB_URI;
      if (uri.startsWith('mongodb+srv://')) {
        uriFormat = 'Valid mongodb+srv://';
      } else if (uri.startsWith('mongodb://')) {
        uriFormat = 'Valid mongodb://';
      } else {
        uriFormat = 'Invalid format';
      }
    }
    console.log("DEBUG: MongoDB URI format:", uriFormat);
    
    // Attempt to connect
    console.log("DEBUG: Attempting to connect to MongoDB...");
    let client;
    try {
      client = await clientPromise;
      console.log("DEBUG: MongoDB client created successfully");
    
      // Test the connection by listing databases
      if (client) {
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();
        
        console.log("DEBUG: Successfully connected to MongoDB");
        console.log(`DEBUG: Found ${dbs.databases.length} databases`);
        
        // Check for users collection in our database
        const db = client.db();
        const collections = await db.listCollections().toArray();
        console.log(`DEBUG: Found ${collections.length} collections`);
        
        const hasUsersCollection = collections.some(c => c.name === 'users');
        console.log(`DEBUG: Users collection exists: ${hasUsersCollection}`);
        
        if (hasUsersCollection) {
          // Count users
          const userCount = await db.collection('users').countDocuments();
          console.log(`DEBUG: User count: ${userCount}`);
        }
        
        // Return success with minimal info
        return NextResponse.json({
          status: "connected",
          databaseCount: dbs.databases.length,
          collectionCount: collections.length,
          hasUsersCollection,
          uri: hasUri ? "URI exists and has valid format" : "URI missing"
        });
      } else {
        console.error("DEBUG: Client is null despite no thrown error");
        return NextResponse.json({
          status: "error",
          error: "MongoDB client is null",
          uri: hasUri ? "URI exists but connection failed" : "URI missing"
        }, { status: 500 });
      }
    } catch (error) {
      console.error("DEBUG: MongoDB connection error:", error);
      return NextResponse.json({
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        uri: hasUri ? "URI exists but connection failed" : "URI missing"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("DEBUG: Unexpected error:", error);
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 