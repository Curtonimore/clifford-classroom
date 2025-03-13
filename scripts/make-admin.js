const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Get MongoDB URI from environment or prompt for it
const uri = process.env.MONGODB_URI;
// Get email from command line argument or prompt for it
const email = process.argv[2];

if (!uri) {
  console.error('Error: MONGODB_URI environment variable not set');
  console.error('Make sure you have a .env.local file with your MONGODB_URI');
  process.exit(1);
}

if (!email) {
  console.error('Error: Email argument missing');
  console.error('Usage: node scripts/make-admin.js your-email@example.com');
  process.exit(1);
}

async function makeAdmin() {
  console.log(`Attempting to make ${email} an admin...`);
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // First check if the user exists
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      console.error(`User not found with email: ${email}`);
      return;
    }
    
    console.log(`Found user: ${user.name || user.email}`);
    
    // Update the user's role to admin
    const result = await db.collection('users').updateOne(
      { email },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount === 0) {
      if (user.role === 'admin') {
        console.log('This user already has admin privileges.');
      } else {
        console.log('Update operation completed, but role was not changed.');
      }
    } else {
      console.log('✅ Successfully updated user to admin role!');
      console.log('You can now access the admin dashboard at /admin');
    }
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await client.close();
  }
}

makeAdmin(); 