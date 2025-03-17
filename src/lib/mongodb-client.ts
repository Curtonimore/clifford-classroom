import { MongoClient, ServerApiVersion } from 'mongodb';
import path from 'path';
import * as dotenv from 'dotenv';

// Try to load environment variables from .env.local explicitly
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  dotenv.config({ path: envPath });
  console.log('MongoDB Client: Loaded config from .env.local');
} catch (error) {
  console.log('MongoDB Client: Error loading .env.local', error);
}

// Default test URI - only used during build if no env var exists
const defaultUri = 'mongodb+srv://testuser:testpassword@testcluster.mongodb.net/test';

// Use a default URI if MONGODB_URI is not defined
// This allows builds to complete even without the actual connection string
const uri = process.env.MONGODB_URI || defaultUri;

// Debug: log the URI beginning (never log the full URI with credentials)
console.log(`MongoDB Client: URI exists: ${!!process.env.MONGODB_URI}, starts with: ${process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'Not set'}`);

// If we're in the build process and not actually connecting
const isBuildProcess = process.env.VERCEL_ENV === 'production' && process.env.VERCEL_GIT_COMMIT_SHA;

// Silent mode for build process
const logConnectionInfo = !isBuildProcess;

// Optimized connection options for serverless environments
const options = {
  maxPoolSize: 25,              // Increased for better concurrency
  minPoolSize: 5,               // More minimum connections to reduce cold starts
  maxIdleTimeMS: 45000,         // Close idle connections after 45 seconds
  connectTimeoutMS: 10000,      // Time out connection attempts after 10 seconds
  socketTimeoutMS: 45000,       // Time out operations after 45 seconds
  waitQueueTimeoutMS: 10000,    // Time out waiting for connection after 10 seconds
  serverSelectionTimeoutMS: 10000, // Time out server selection after 10 seconds
  heartbeatFrequencyMS: 30000,  // Check server status more often
  retryWrites: true,
  // Updated server API settings to be less strict and avoid version mismatch errors
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false, // Changed from true to false
    deprecationErrors: false, // Changed from true to false
  }
};

// Create a new MongoClient with error handling
const createClient = () => {
  if (logConnectionInfo) {
    console.log('Creating new MongoDB client connection');
  }
  
  try {
    // Double-check that we have a URI before creating client
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not set in environment variables. This will likely cause authentication failures.');
    }
    
    const client = new MongoClient(uri, options);
    return client;
  } catch (error) {
    if (logConnectionInfo) {
      console.error('Error creating MongoDB client:', error);
    }
    throw error;
  }
};

let client;
let clientPromise: Promise<MongoClient>;

// Special handling for Vercel build process
if (isBuildProcess) {
  // During build, create a mock client that doesn't actually connect
  console.log('Build process detected, using mock MongoDB client');
  client = null;
  clientPromise = Promise.resolve(null as unknown as MongoClient);
} else {
  // For both development and production, create a real client
  client = createClient();
  
  // Add error handling to the connection promise
  clientPromise = client.connect()
    .catch((error) => {
      console.error('Failed to connect to MongoDB:', error);
      // Attempt to reconnect once
      console.log('Attempting to reconnect to MongoDB...');
      client = createClient();
      return client.connect();
    })
    .catch((error) => {
      console.error('MongoDB reconnection failed:', error);
      throw error;
    });
}

// Add event listeners for connection issues (only in production)
if (client && !isBuildProcess) {
  client.on('connectionPoolCreated', (event) => {
    console.log('MongoDB connection pool created');
  });
  
  client.on('connectionPoolClosed', (event) => {
    console.log('MongoDB connection pool closed');
  });

  client.on('serverHeartbeatFailed', (event) => {
    console.error('MongoDB server heartbeat failed:', event);
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 