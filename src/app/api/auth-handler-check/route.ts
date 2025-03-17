import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { authOptions } from '@/lib/auth';
import { authDirectOptions } from '@/lib/auth-direct';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // Check mongodb connection status
    let mongoStatus = "unknown";
    let mongoError: string | null = null;
    
    try {
      const client = await clientPromise;
      if (!client) {
        mongoStatus = "null_client";
      } else {
        // Attempt to ping the database
        await client.db().command({ ping: 1 });
        mongoStatus = "connected";
      }
    } catch (error) {
      mongoStatus = "error";
      mongoError = error instanceof Error ? error.message : String(error);
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
    };
    
    // Return the combined results
    return NextResponse.json({
      status: "success",
      mongodb: {
        status: mongoStatus,
        error: mongoError,
      },
      auth: {
        standard: standardAuthConfig,
        direct: directAuthConfig,
      },
      environment: envVars,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Auth handler check error:", error);
    
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 