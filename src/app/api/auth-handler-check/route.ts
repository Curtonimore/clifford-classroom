import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { authOptions } from '@/lib/auth';
import { authDirectOptions } from '@/lib/auth-direct';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Define MongoDB connection test result type
type MongoDBTestResult = {
  status: "connected" | "error";
  error: string | null;
};

// Function to check MongoDB connection without relying on the client
async function testMongoDBConnection(): Promise<MongoDBTestResult> {
  // Check if the environment variable is set
  if (!process.env.MONGODB_URI) {
    return {
      status: "error",
      error: "MONGODB_URI environment variable is not set",
    };
  }
  
  let testClient: MongoClient | null = null;
  
  try {
    // Create a new client directly for testing
    testClient = new MongoClient(process.env.MONGODB_URI);
    
    // Try to connect
    await testClient.connect();
    
    // Run a simple command to verify the connection
    await testClient.db().command({ ping: 1 });
    
    return {
      status: "connected",
      error: null,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    // Close the test client if it was created
    if (testClient) {
      try {
        await testClient.close();
      } catch (closeError) {
        console.error("Error closing test MongoDB client:", closeError);
      }
    }
  }
}

export async function GET() {
  try {
    // Check mongodb connection status using the singleton client
    let mongoStatus = "unknown";
    let mongoError: string | null = null;
    let directTestResult: MongoDBTestResult | null = null;
    
    try {
      const client = await clientPromise;
      if (!client) {
        mongoStatus = "null_client";
        
        // If the singleton client is null, try a direct connection test
        console.log("MongoDB client is null, attempting direct connection test");
        directTestResult = await testMongoDBConnection();
      } else {
        // Attempt to ping the database
        await client.db().command({ ping: 1 });
        mongoStatus = "connected";
      }
    } catch (error) {
      mongoStatus = "error";
      mongoError = error instanceof Error ? error.message : String(error);
      
      // If the regular connection fails, try a direct test
      if (!directTestResult) {
        directTestResult = await testMongoDBConnection();
      }
    }
    
    // Check auth configs
    const standardAuthConfig = {
      providersCount: authOptions.providers?.length || 0,
      hasGoogleProvider: authOptions.providers?.some(p => p.id === 'google') || false,
      adapterType: authOptions.adapter ? 'MongoDBAdapter' : 'none',
      sessionStrategy: authOptions.session?.strategy || 'default',
      debug: !!authOptions.debug,
    };
    
    const directAuthConfig = {
      providersCount: authDirectOptions.providers?.length || 0,
      hasGoogleProvider: authDirectOptions.providers?.some(p => p.id === 'google') || false,
      adapterType: 'none', // Direct auth doesn't use an adapter
      sessionStrategy: authDirectOptions.session?.strategy || 'default',
      debug: !!authDirectOptions.debug,
    };
    
    // Check environment variables
    const envVars = {
      nextauthUrl: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL.substring(0, 8)}...` : undefined,
      nextauthSecret: process.env.NEXTAUTH_SECRET ? 'set but hidden' : undefined,
      googleClientId: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` : undefined,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'set but hidden' : undefined,
      mongodbUri: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 15)}...` : undefined,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || undefined,
    };
    
    // Return the combined results
    return NextResponse.json({
      status: "success",
      mongodb: {
        status: mongoStatus,
        error: mongoError,
        directTest: directTestResult,
      },
      auth: {
        standard: standardAuthConfig,
        direct: directAuthConfig,
      },
      environment: envVars,
      timestamp: new Date().toISOString(),
      clientVersion: "2.0" // Track version for debugging
    });
  } catch (error) {
    console.error("Auth handler check error:", error);
    
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      clientVersion: "2.0" // Track version for debugging
    }, { status: 500 });
  }
} 