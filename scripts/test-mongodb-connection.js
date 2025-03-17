// MongoDB Connection Test Script
// Run this with: node scripts/test-mongodb-connection.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' }); // Load environment variables from .env.local

async function testConnection() {
  console.log("Testing MongoDB connection...");
  console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
  
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }
  
  // Log first 15 chars of URI for debugging (not showing full credentials)
  console.log("MONGODB_URI starts with:", process.env.MONGODB_URI.substring(0, 15) + "...");
  
  const options = {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000
  };
  
  const client = new MongoClient(process.env.MONGODB_URI, options);
  
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    console.log("Successfully connected to MongoDB");
    
    // Basic DB operations
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Test users collection
    try {
      const usersCollection = db.collection('users');
      const count = await usersCollection.countDocuments();
      console.log(`Found ${count} documents in users collection`);
      
      if (count > 0) {
        const sample = await usersCollection.findOne({});
        console.log("Sample user (sanitized):", {
          _id: sample._id,
          // Only log non-sensitive fields
          name: sample.name || "no name field",
          email: sample.email ? "email exists" : "no email field",
          created: sample.createdAt || "no createdAt field"
        });
      }
    } catch (userErr) {
      console.error("Error accessing users collection:", userErr.message);
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error("This usually indicates network connectivity issues, firewall restrictions, or incorrect connection string");
    }
    
    if (error.name === 'MongoParseError') {
      console.error("This indicates a malformed connection string");
    }
    
    if (error.name === 'MongoNetworkError') {
      console.error("This indicates network connectivity issues");
    }
    
    process.exit(1);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

testConnection().catch(console.error); 