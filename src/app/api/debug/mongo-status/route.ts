export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';

interface DatabaseInfo {
  name: string;
  stats: {
    collections: number;
    views: number;
    objects: number;
    avgObjSize: number;
    dataSize: number;
    storageSize: number;
    indexes: number;
    indexSize: number;
  };
}

interface CollectionsInfo {
  count: number;
  names: string[];
  hasUsers: boolean;
  userCount: number;
}

export async function GET() {
  try {
    console.log("Debug API: MongoDB connection check requested");
    
    // Get session to check authentication
    const session = await getAuthSession();
    
    // Only allow admin users to check MongoDB status
    if (!session?.user || session.user.role !== 'admin') {
      console.warn("Debug API: Unauthorized access attempt to MongoDB status", {
        authenticated: !!session?.user,
        userEmail: session?.user?.email,
        userRole: session?.user?.role
      });
      
      return NextResponse.json(
        { error: 'Admin access required for debug information' },
        { status: 403 }
      );
    }
    
    // Check environment variables related to MongoDB
    const mongodbUri = process.env.MONGODB_URI;
    const hasMongoConfig = !!mongodbUri;
    
    // Get Vercel environment information when available
    const vercelEnv = process.env.VERCEL_ENV || null;
    const nodeEnv = process.env.NODE_ENV || null;
    
    // Try to establish a MongoDB connection
    console.log("Debug API: Testing MongoDB connection");
    let connected = false;
    let error: string | null = null;
    let databaseInfo: DatabaseInfo | null = null;
    let collectionsInfo: CollectionsInfo | null = null;
    
    try {
      // Test the MongoDB connection
      const client = await clientPromise;
      
      if (client) {
        const db = client.db();
        
        // Get database stats
        const stats = await db.stats();
        
        // Get collections list (first 10)
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name).slice(0, 10);
        
        // Check specifically for users collection
        const hasUsersCollection = collections.some(col => col.name === 'users');
        
        // Get count of users if users collection exists
        let userCount = 0;
        if (hasUsersCollection) {
          userCount = await db.collection('users').countDocuments();
        }
        
        // Store database info
        databaseInfo = {
          name: db.databaseName,
          stats: {
            collections: stats.collections,
            views: stats.views,
            objects: stats.objects,
            avgObjSize: stats.avgObjSize,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize,
            indexes: stats.indexes,
            indexSize: stats.indexSize,
          }
        };
        
        // Store collections info
        collectionsInfo = {
          count: collections.length,
          names: collectionNames,
          hasUsers: hasUsersCollection,
          userCount: userCount
        };
        
        connected = true;
        console.log("Debug API: MongoDB connection successful", {
          database: db.databaseName,
          collections: collections.length,
          hasUsersCollection,
          userCount
        });
      } else {
        error = "MongoDB client is null";
        console.error("Debug API: MongoDB client is null");
      }
    } catch (mongoError) {
      error = mongoError instanceof Error ? mongoError.message : String(mongoError);
      console.error("Debug API: MongoDB connection error:", error);
    }
    
    // Return MongoDB connection status
    return NextResponse.json({
      connected,
      error,
      hasMongoConfig,
      mongodbUriExists: !!mongodbUri,
      // Only include censored URI prefix for security reasons
      mongodbUriPrefix: mongodbUri ? `${mongodbUri.split('@')[0].substring(0, 10)}...` : null,
      databaseInfo,
      collectionsInfo,
      vercelEnv,
      nodeEnv,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Debug API: Unexpected error:", error);
    
    return NextResponse.json(
      { 
        connected: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 