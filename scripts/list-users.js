const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Get MongoDB URI from environment
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable not set');
  console.error('Make sure you have a .env.local file with your MONGODB_URI');
  process.exit(1);
}

async function listUsers() {
  console.log('Listing all users in the database...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    
    if (!users || users.length === 0) {
      console.log('No users found in the database.');
      return;
    }
    
    console.log(`Found ${users.length} users:`);
    
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`Name: ${user.name || 'Not set'}`);
      console.log(`Email: ${user.email || 'Not set'}`);
      console.log(`Role: ${user.role || 'standard'}`);
      console.log(`ID: ${user._id}`);
    });
    
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await client.close();
  }
}

listUsers(); 