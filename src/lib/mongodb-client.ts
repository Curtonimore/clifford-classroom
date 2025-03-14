import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;

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
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

// Create a new MongoClient with error handling
const createClient = () => {
  console.log('Creating new MongoDB client connection');
  try {
    const client = new MongoClient(uri, options);
    return client;
  } catch (error) {
    console.error('Error creating MongoDB client:', error);
    throw error;
  }
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = createClient();
    globalWithMongo._mongoClientPromise = client.connect()
      .catch((error) => {
        console.error('Failed to connect to MongoDB in development:', error);
        throw error;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise as Promise<MongoClient>;
} else {
  // In production mode, it's best to not use a global variable.
  client = createClient();
  
  // Add error handling to the connection promise
  clientPromise = client.connect()
    .catch((error) => {
      console.error('Failed to connect to MongoDB in production:', error);
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
if (process.env.NODE_ENV === 'production' && client) {
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