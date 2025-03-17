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

// Ensure MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  console.error('MongoDB Client: ERROR - MONGODB_URI is not defined in environment variables');
  // Do not exit process, as this would break builds
}

// Use the environment variable or fallback to a default only for build time
const uri = process.env.MONGODB_URI || 'mongodb+srv://testuser:testpassword@testcluster.mongodb.net/test';

// Debug: log the URI beginning (never log the full URI with credentials)
console.log(`MongoDB Client: URI exists: ${!!process.env.MONGODB_URI}, starts with: ${process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'Not set'}`);

// Check if we're in a build/test process
const isBuildProcess = process.env.NODE_ENV === 'production' && 
                       (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') && 
                       process.env.VERCEL_GIT_COMMIT_SHA;

// Connection options for MongoDB
const options = {
  maxPoolSize: 25,              
  minPoolSize: 5,               
  maxIdleTimeMS: 45000,         
  connectTimeoutMS: 10000,      
  socketTimeoutMS: 45000,       
  waitQueueTimeoutMS: 10000,    
  serverSelectionTimeoutMS: 10000,
  retryWrites: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: false,
  }
};

// Global MongoDB Client variable
let clientPromise: Promise<MongoClient>;

// Create a new MongoClient with error handling
const createClient = () => {
  console.log('Creating new MongoDB client connection');
  
  try {
    // Ensure we have a valid URI before creating client
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }
    
    const client = new MongoClient(uri, options);
    return client;
  } catch (error) {
    console.error('Error creating MongoDB client:', error);
    throw error;
  }
};

// Special handling for build process
if (isBuildProcess) {
  // During build, do not attempt to connect
  console.log('Build process detected, using mock MongoDB client');
  clientPromise = Promise.resolve(null as unknown as MongoClient);
} else {
  try {
    // Create a MongoDB client instance
    const client = createClient();
    
    // Attach event listeners for better monitoring
    client.on('connectionPoolCreated', () => {
      console.log('MongoDB connection pool created');
    });
    
    client.on('connectionPoolClosed', () => {
      console.log('MongoDB connection pool closed');
    });
    
    client.on('serverHeartbeatFailed', (event) => {
      console.error('MongoDB server heartbeat failed:', event);
    });
    
    // Create a promise that connects and handles errors
    clientPromise = client.connect()
      .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        // Attempt to reconnect once
        console.log('Attempting to reconnect to MongoDB...');
        const newClient = createClient();
        return newClient.connect();
      })
      .catch((error) => {
        console.error('MongoDB reconnection failed:', error);
        throw error;
      });
    
    // Verify the connection works by immediately awaiting it (wrapped in a self-executing async function)
    (async () => {
      try {
        const connectedClient = await clientPromise;
        console.log('MongoDB initial connection verified successfully');
      } catch (error) {
        console.error('MongoDB initial connection verification failed:', error);
      }
    })();
  } catch (error) {
    console.error('Critical MongoDB client initialization error:', error);
    // Create a rejected promise to ensure errors are properly propagated
    clientPromise = Promise.reject(error);
  }
}

// Export the client promise
export default clientPromise; 