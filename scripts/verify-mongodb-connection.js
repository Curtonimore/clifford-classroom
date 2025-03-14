#!/usr/bin/env node

// MongoDB Connection Verification Script
// Run with: node scripts/verify-mongodb-connection.js

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config(); // Try to load from .env first

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Header
console.log(`${colors.bright}${colors.blue}==================================${colors.reset}`);
console.log(`${colors.bright}${colors.blue} MongoDB Connection Verification ${colors.reset}`);
console.log(`${colors.bright}${colors.blue}==================================${colors.reset}\n`);

// Check for MongoDB URI
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error(`${colors.red}Error: MONGODB_URI environment variable is not set.${colors.reset}`);
  console.log(`${colors.yellow}Try one of the following:${colors.reset}`);
  console.log(`1. Create a .env file with MONGODB_URI`);
  console.log(`2. Run with: ${colors.bright}MONGODB_URI=your_connection_string node scripts/verify-mongodb-connection.js${colors.reset}`);
  process.exit(1);
}

// Validate URI format
console.log(`${colors.yellow}Validating connection string format...${colors.reset}`);
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  console.error(`${colors.red}Error: Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://${colors.reset}`);
  process.exit(1);
}

if (!uri.includes('@')) {
  console.error(`${colors.red}Warning: URI does not seem to contain credentials (no @ symbol found)${colors.reset}`);
}

console.log(`${colors.green}✓ URI format looks valid${colors.reset}`);

// Create MongoDB client
console.log(`\n${colors.yellow}Creating MongoDB client...${colors.reset}`);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Main verification function
async function verifyConnection() {
  try {
    console.log(`${colors.yellow}Attempting to connect to MongoDB...${colors.reset}`);
    
    // Connect to MongoDB
    await client.connect();
    console.log(`${colors.green}✓ Successfully connected to MongoDB server${colors.reset}`);
    
    // Send a ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log(`${colors.green}✓ Database ping successful${colors.reset}`);
    
    // List all databases
    console.log(`\n${colors.cyan}Listing available databases:${colors.reset}`);
    const dbList = await client.db().admin().listDatabases();
    
    if (dbList.databases.length === 0) {
      console.log(`${colors.yellow}No databases found${colors.reset}`);
    } else {
      dbList.databases.forEach(db => {
        console.log(`- ${colors.bright}${db.name}${colors.reset} (${formatSize(db.sizeOnDisk)})`);
      });
    }
    
    // Extract database name from URI
    console.log(`\n${colors.yellow}Checking application database...${colors.reset}`);
    let dbName = extractDbName(uri);
    console.log(`Database name from URI: ${dbName || 'None specified'}`);
    
    // If no database in URI, use a default
    if (!dbName) {
      dbName = 'clifford-classroom';
      console.log(`Using default database name: ${dbName}`);
    }
    
    // Check the application database
    const db = client.db(dbName);
    
    console.log(`\n${colors.cyan}Listing collections in ${dbName}:${colors.reset}`);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log(`${colors.yellow}No collections found in ${dbName}${colors.reset}`);
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`- ${colors.bright}${collection.name}${colors.reset}: ${count} documents`);
      }
    }
    
    // Check specifically for users collection
    const hasUsers = collections.some(c => c.name === 'users');
    if (hasUsers) {
      console.log(`\n${colors.green}✓ Users collection found${colors.reset}`);
      
      // Sample a user
      const userSample = await db.collection('users').findOne({});
      if (userSample) {
        console.log(`${colors.cyan}Sample user fields: ${colors.reset}${Object.keys(userSample).join(', ')}`);
        console.log(`${colors.cyan}Has admin users: ${colors.reset}${await hasAdminUsers(db) ? 'Yes' : 'No'}`);
      } else {
        console.log(`${colors.yellow}Users collection exists but is empty${colors.reset}`);
      }
    } else {
      console.log(`\n${colors.yellow}⚠ Users collection not found${colors.reset}`);
    }
    
    console.log(`\n${colors.green}${colors.bright}Connection verification completed successfully!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`\n${colors.red}Error verifying MongoDB connection:${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    if (error.code) {
      console.error(`${colors.red}Error code: ${error.code}${colors.reset}`);
    }
    return false;
  } finally {
    console.log(`\n${colors.yellow}Closing MongoDB connection...${colors.reset}`);
    await client.close();
    console.log(`${colors.green}Connection closed${colors.reset}`);
  }
}

// Helper function to check for admin users
async function hasAdminUsers(db) {
  try {
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    return adminCount > 0;
  } catch (error) {
    console.error(`Error checking for admin users: ${error.message}`);
    return false;
  }
}

// Helper function to extract database name from URI
function extractDbName(uri) {
  try {
    // Remove query parameters
    const uriWithoutParams = uri.split('?')[0];
    
    // Find the part after the last slash
    const parts = uriWithoutParams.split('/');
    if (parts.length > 3) {
      return parts[parts.length - 1];
    }
    return null;
  } catch (error) {
    console.error(`Error extracting database name: ${error.message}`);
    return null;
  }
}

// Helper function to format byte size
function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the verification
verifyConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
    process.exit(1);
  }); 