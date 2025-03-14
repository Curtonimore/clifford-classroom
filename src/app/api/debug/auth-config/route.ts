import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';

// Define the types properly
type UserInfo = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

type SessionInfo = 
  | { exists: true; user: UserInfo }
  | { exists: false; error?: string };

type MongoDBConnection = 
  | { isConnected: true; collections: string[]; hasUsersCollection: boolean; userCount: number; sampleUser: UserInfo | null }
  | { isConnected: false; error: string };

type ConfigCheck = {
  google: {
    clientIdExists: boolean;
    clientSecretExists: boolean;
  };
  nextauth: {
    secretExists: boolean;
    urlExists: boolean;
    url: string | undefined;
  };
  mongodb: {
    uriExists: boolean;
    uriFormat: boolean | undefined;
    connection?: MongoDBConnection;
  };
  admin: {
    emailsExist: boolean;
    emails: string[] | undefined;
  };
  session?: SessionInfo;
};

export async function GET() {
  // Initialize the config check object with proper typing
  const configCheck: ConfigCheck = {
    google: {
      clientIdExists: !!process.env.GOOGLE_CLIENT_ID,
      clientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
    },
    nextauth: {
      secretExists: !!process.env.NEXTAUTH_SECRET,
      urlExists: !!process.env.NEXTAUTH_URL,
      url: process.env.NEXTAUTH_URL,
    },
    mongodb: {
      uriExists: !!process.env.MONGODB_URI,
      uriFormat: process.env.MONGODB_URI?.startsWith('mongodb+srv://') || process.env.MONGODB_URI?.startsWith('mongodb://'),
    },
    admin: {
      emailsExist: !!process.env.ADMIN_EMAILS,
      emails: process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()),
    }
  };
  
  // Get current session info
  try {
    const session = await getAuthSession();
    configCheck.session = session ? {
      exists: true,
      user: {
        email: session.user?.email,
        role: session.user?.role,
      }
    } : { exists: false };
  } catch (error) {
    configCheck.session = { 
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
  
  // Test MongoDB connection
  try {
    const client = await clientPromise;
    const isConnected = !!client;
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    const hasUsersCollection = collectionNames.includes('users');
    
    let userCount = 0;
    let sampleUser: UserInfo | null = null;
    
    if (hasUsersCollection) {
      userCount = await db.collection('users').countDocuments();
      if (userCount > 0) {
        const user = await db.collection('users').findOne({});
        if (user) {
          // Sanitize sensitive information
          sampleUser = {
            id: user._id?.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }
    }
    
    configCheck.mongodb.connection = {
      isConnected: true,
      collections: collectionNames,
      hasUsersCollection,
      userCount,
      sampleUser
    };
  } catch (error) {
    configCheck.mongodb.connection = { 
      isConnected: false, 
      error: error instanceof Error ? error.message : "Unknown MongoDB connection error" 
    };
  }
  
  return NextResponse.json(configCheck);
} 