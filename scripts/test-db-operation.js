// MongoDB Operations Test Script
// Run this with: node scripts/test-db-operation.js

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local file');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Get database name from the URI
const dbName = process.env.MONGODB_URI.split('/').pop().split('?')[0] || 'clifford-classroom';

async function testDatabaseOperations() {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB database: ${dbName}...`);
    await client.connect();
    console.log("✅ Connected successfully to MongoDB");
    
    // Get database and collection
    const db = client.db(dbName);
    const testCollection = db.collection('test_collection');
    
    // Clear any previous test data
    await testCollection.deleteMany({test: true});
    console.log("Cleared previous test data");
    
    // Insert a test document
    const testDoc = { 
      test: true, 
      message: "MongoDB connection test", 
      timestamp: new Date(), 
      randomValue: Math.floor(Math.random() * 1000)
    };
    
    console.log("\nInserting test document:");
    console.log(testDoc);
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`✅ Document inserted with _id: ${insertResult.insertedId}`);
    
    // Read the document back
    console.log("\nReading the inserted document:");
    const readResult = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log(readResult);
    
    // Update the document
    console.log("\nUpdating the document:");
    const updateResult = await testCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { updated: true, updateTimestamp: new Date() } }
    );
    console.log(`✅ Document updated: ${updateResult.modifiedCount} document modified`);
    
    // Read the updated document
    console.log("\nReading the updated document:");
    const updatedDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log(updatedDoc);
    
    // Delete the test document
    console.log("\nDeleting the test document:");
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log(`✅ Document deleted: ${deleteResult.deletedCount} document removed`);
    
    return true;
  } catch (error) {
    console.error('❌ Error during database operations:');
    console.error(error);
    return false;
  } finally {
    // Close the connection
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the test
testDatabaseOperations()
  .then(success => {
    if (success) {
      console.log('\n🎉 All database operations were successful!');
      console.log('Your MongoDB setup is working correctly.');
    } else {
      console.log('\n❗ Database operations test failed.');
    }
  })
  .catch(console.error)
  .finally(() => process.exit()); 