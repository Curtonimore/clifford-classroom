import { MongoClient, ServerApiVersion } from 'mongodb';
import path from 'path';
import * as dotenv from 'dotenv';

// Support multiple environments loading
const loadEnvFiles = () => {
  try {
    // First try .env.local for development
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    dotenv.config({ path: envLocalPath });
    
    // Then try .env.production for production
    const envProdPath = path.resolve(process.cwd(), '.env.production');
    dotenv.config({ path: envProdPath });
    
    // Then try simply .env as a fallback
    const envPath = path.resolve(process.cwd(), '.env');
    dotenv.config({ path: envPath });
    
    console.log('MongoDB Client: Loaded environment variables');
  } catch (error) {
    console.log('MongoDB Client: Error loading environment files', error);
  }
};

// Load environment variables
loadEnvFiles();

// Ensure MongoDB URI is defined and log status (securely)
const logAndCheckURI = () => {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB Client: ERROR - MONGODB_URI is not defined in environment variables');
    console.error('MongoDB Client: NODE_ENV =', process.env.NODE_ENV);
    console.error('MongoDB Client: VERCEL_ENV =', process.env.VERCEL_ENV || 'not set');
    return false;
  }
  
  // Log parts of the URI safely without revealing credentials
  const uri = process.env.MONGODB_URI;
  const uriStart = uri.startsWith('mongodb+srv://') ? 'mongodb+srv://' : 'mongodb://';
  // Only log that the URI exists and its protocol, not any part that might contain credentials
  console.log(`MongoDB Client: URI exists with protocol: ${uriStart}`);
  
  // Basic validation
  if (!uri.startsWith('mongodb+srv://') && !uri.startsWith('mongodb://')) {
    console.error('MongoDB Client: ERROR - MONGODB_URI has invalid format');
    return false;
  }
  
  return true;
};

// Check if URI is valid
const isValidURI = logAndCheckURI();

// Connection options - optimized for serverless environments
const options = {
  maxPoolSize: 10,              // Limit maximum connections
  minPoolSize: 3,               // Keep minimum connections ready
  connectTimeoutMS: 15000,      // Time out connection attempts after 15 seconds
  socketTimeoutMS: 45000,       // Time out operations after 45 seconds
  serverSelectionTimeoutMS: 15000, // Time out server selection after 15 seconds
  retryWrites: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,              // Less strict for better compatibility
    deprecationErrors: false    // Don't fail on deprecation warnings
  }
};

// Global variables
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

/**
 * Creates a new MongoDB client and ensures it's connected
 */
async function createConnectedClient(): Promise<MongoClient> {
  console.log('Creating new MongoDB client connection');
  
  // Only use the URI from environment, no hardcoded fallbacks with dummy credentials
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  
  // Create the client with the environment URI only
  const newClient = new MongoClient(process.env.MONGODB_URI, options);
  
  try {
    // Connect and return the connected client
    await newClient.connect();
    console.log('MongoDB client connected successfully');
    return newClient;
  } catch (error) {
    console.error('Failed to connect MongoDB client:', error);
    throw error;
  }
}

// Initialize client promise - different handling for production vs development
if (process.env.NODE_ENV === 'production') {
  // In production, we create a more straightforward promise with error handling
  console.log('MongoDB Client: Running in production mode');
  
  clientPromise = (async () => {
    try {
      // Check if MONGODB_URI is available before attempting to connect
      if (!process.env.MONGODB_URI) {
        console.error('MongoDB Client: MONGODB_URI is missing in production environment');
        return null as unknown as MongoClient;
      }
      
      // Create and connect client
      client = await createConnectedClient();
      
      // Add event listeners for connection issues
      client.on('serverHeartbeatFailed', (event) => {
        console.error('MongoDB server heartbeat failed:', event);
      });
      
      return client;
    } catch (error) {
      console.error('Critical MongoDB connection error in production:', error);
      // In production, we'll return a null client rather than rejecting the promise
      // This avoids crashing the server but allows the application to handle the null case
      return null as unknown as MongoClient;
    }
  })();
} else {
  // In development, we use a more standard approach
  console.log('MongoDB Client: Running in development mode');
  
  try {
    // Check if MONGODB_URI is available
    if (!process.env.MONGODB_URI) {
      console.error('MongoDB Client: MONGODB_URI is missing in development environment');
      clientPromise = Promise.reject(new Error('MONGODB_URI environment variable is not defined'));
    } else {
      // Create the client instance and wrap its connection in a promise
      client = new MongoClient(process.env.MONGODB_URI, options);
      
      clientPromise = client.connect()
        .catch(error => {
          console.error('Failed to connect to MongoDB in development:', error);
          // Try reconnecting once
          if (process.env.MONGODB_URI) {
            client = new MongoClient(process.env.MONGODB_URI, options);
            return client.connect();
          } else {
            throw new Error('MONGODB_URI environment variable is not defined');
          }
        });
    }
  } catch (error) {
    console.error('Critical MongoDB client initialization error in development:', error);
    clientPromise = Promise.reject(error);
  }
}

// Add connection verification that runs immediately
(async () => {
  try {
    const connectedClient = await clientPromise;
    if (!connectedClient) {
      console.error('MongoDB Client: Initial connection verification failed - client is null');
    } else {
      // Verify connection by sending a ping
      await connectedClient.db().command({ ping: 1 });
      console.log('MongoDB Client: Initial connection verified with ping');
    }
  } catch (error) {
    console.error('MongoDB Client: Initial connection verification failed', error);
  }
})();

export default clientPromise; 