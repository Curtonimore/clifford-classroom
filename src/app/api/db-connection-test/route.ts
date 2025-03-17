import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { Document, WithId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const client = await clientPromise;
    
    if (!client) {
      console.error("MongoDB client is null");
      return NextResponse.json({
        status: "error",
        message: "MongoDB client is null",
        time: new Date().toISOString()
      }, { status: 500 });
    }
    
    // Try to connect and get basic DB info
    const dbAdmin = client.db().admin();
    const serverInfo = await dbAdmin.serverInfo();
    
    // List all collections in the database
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    // Try to get a document from the users collection
    let userCount = 0;
    let sampleUser: WithId<Document> | null = null;
    
    try {
      const usersCollection = db.collection('users');
      userCount = await usersCollection.countDocuments();
      
      if (userCount > 0) {
        sampleUser = await usersCollection.findOne(
          {}, 
          { projection: { _id: 1, name: 1, email: 1, createdAt: 1 } }
        );
      }
    } catch (error) {
      console.error("Error querying users collection:", error);
    }
    
    return NextResponse.json({
      status: "success",
      connection: "ok",
      mongoVersion: serverInfo.version,
      collections: collections.map(col => col.name),
      userCount,
      sampleUser,
      environment: process.env.NODE_ENV,
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error("MongoDB connection test error:", error);
    
    // Create a sanitized error object
    const errorObj = {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "Unknown",
      stack: process.env.NODE_ENV === "development" && error instanceof Error 
        ? error.stack 
        : "Stack trace not available in production"
    };
    
    return NextResponse.json({
      status: "error",
      connection: "failed",
      error: errorObj,
      environment: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI 
        ? `${process.env.MONGODB_URI.substring(0, 15)}...` 
        : "Not configured",
      time: new Date().toISOString()
    }, { status: 500 });
  }
} 