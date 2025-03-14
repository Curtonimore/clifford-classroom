import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Define types for collection stats
interface CollectionStat {
  name: string;
  count: number;
  sample: Record<string, any> | null;
}

export async function GET(request: NextRequest) {
  try {
    console.log("Database Info API: Request received");
    
    // Get the session for security check
    const session = await getAuthSession();
    const isAdmin = !!session?.user && session.user.role === 'admin';
    console.log("Database Info API: Session retrieved", { 
      authenticated: !!session?.user, 
      userRole: session?.user?.role || 'none',
      isAdmin
    });
    
    // Only allow admins to access this endpoint
    if (!isAdmin) {
      console.log("Database Info API: Access denied - Not an admin");
      return NextResponse.json({ 
        error: "Access denied. Admin privileges required." 
      }, { status: 403 });
    }
    
    // Connect to MongoDB
    console.log("Database Info API: Connecting to MongoDB");
    const client = await clientPromise;
    
    if (!client) {
      console.error("Database Info API: Failed to connect to MongoDB");
      return NextResponse.json({ 
        error: "Failed to connect to MongoDB" 
      }, { status: 500 });
    }
    
    // Get database name from connection
    const adminDb = client.db().admin();
    const databaseInfo = await adminDb.listDatabases();
    const currentDbName = client.db().databaseName;
    
    console.log(`Database Info API: Connected to database "${currentDbName}"`);
    
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Get counts for important collections
    const collectionStats: CollectionStat[] = [];
    
    for (const colName of collectionNames) {
      const count = await db.collection(colName).countDocuments();
      let sampleDocument: Record<string, any> | null = null;
      
      if (count > 0) {
        // Get a sample document with sensitive data masked
        const rawSample = await db.collection(colName).findOne({});
        
        if (rawSample) {
          // Create a safe copy with password/tokens masked
          sampleDocument = JSON.parse(JSON.stringify(rawSample));
          
          // Mask sensitive fields if they exist
          if (sampleDocument && sampleDocument.password) sampleDocument.password = "********";
          if (sampleDocument && sampleDocument.accessToken) sampleDocument.accessToken = "********";
          if (sampleDocument && sampleDocument.refreshToken) sampleDocument.refreshToken = "********";
          if (sampleDocument && sampleDocument.secret) sampleDocument.secret = "********";
        }
      }
      
      collectionStats.push({
        name: colName,
        count,
        sample: sampleDocument
      });
    }
    
    // Look for collection configuration issues
    const usersCollection = collectionStats.find(c => c.name === 'users');
    const accountsCollection = collectionStats.find(c => c.name === 'accounts');
    const sessionsCollection = collectionStats.find(c => c.name === 'sessions');
    
    const userIssues: string[] = [];
    
    // Check if users collection exists but is empty
    if (!usersCollection) {
      userIssues.push("Users collection does not exist");
    } else if (usersCollection.count === 0) {
      userIssues.push("Users collection exists but is empty");
    }
    
    // Check if accounts collection exists but is empty
    if (!accountsCollection) {
      userIssues.push("Accounts collection does not exist - OAuth connections won't be saved");
    } else if (accountsCollection.count === 0) {
      userIssues.push("Accounts collection exists but is empty - no OAuth connections saved");
    }
    
    // Check if sessions collection exists
    if (!sessionsCollection) {
      userIssues.push("Sessions collection does not exist - sessions won't be saved to database");
    }
    
    // Check if we have the expected structure in the user document
    if (usersCollection && usersCollection.sample) {
      if (!usersCollection.sample.role) {
        userIssues.push("User documents don't have 'role' field - this may cause issues with role-based access");
      }
    }
    
    // Check MongoDB URI format from environment variable
    const mongodbUri = process.env.MONGODB_URI || '';
    const uriSanitized = mongodbUri.replace(/\/\/([^:]+):([^@]+)@/, '//[username]:[password]@');
    const hasDBName = mongodbUri.includes('/?') || /\/[^\/]+$/.test(mongodbUri);
    
    return NextResponse.json({
      connectionSuccess: true,
      databaseName: currentDbName,
      allDatabases: databaseInfo.databases.map(db => ({
        name: db.name,
        sizeOnDisk: db.sizeOnDisk,
        empty: db.empty
      })),
      collections: collectionNames,
      collectionStats,
      userIssues: userIssues.length > 0 ? userIssues : null,
      sessionInfo: {
        exists: !!session,
        user: session?.user ? {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: session.user.role
        } : null
      },
      mongodbConfig: {
        uri: uriSanitized,
        hasDBName,
        connectionString: mongodbUri ? "Present" : "Missing",
        format: mongodbUri.startsWith('mongodb') ? "Valid" : "Invalid"
      }
    });
  } catch (error) {
    console.error("Database Info API: Error:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve database information",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 