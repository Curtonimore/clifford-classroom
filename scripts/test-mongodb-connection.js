// MongoDB Connection Test Script
// Run this with: node scripts/test-mongodb-connection.js

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: '.env.local' }); // Load environment variables from .env.local

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local file');
  process.exit(1);
}

// Connection URI from environment variables
const uri = process.env.MONGODB_URI;

// Create MongoDB client with recommended options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testConnection() {
  try {
    // Connect to the MongoDB server
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    // List all databases
    console.log('\nListing available databases:');
    const databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error(error);
    return false;
  } finally {
    // Close the connection
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 Your MongoDB connection is working correctly!');
      console.log('You can now use your application with MongoDB.');
    } else {
      console.log('\n❗ Connection test failed. Please check your connection string and network settings.');
      console.log('Make sure your IP address is whitelisted in MongoDB Atlas Network Access settings.');
    }
  })
  .catch(console.error)
  .finally(() => process.exit()); 