const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Get MongoDB URI from environment
const uri = process.env.MONGODB_URI;

// User details
const userEmail = 'cliffordc@gmail.com';
const userName = 'Curtis Clifford';

if (!uri) {
  console.error('Error: MONGODB_URI environment variable not set');
  console.error('Make sure you have a .env.local file with your MONGODB_URI');
  process.exit(1);
}

async function createAdminUser() {
  console.log(`Creating admin user for ${userEmail}...`);
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: userEmail });
    
    if (existingUser) {
      console.log('User already exists. Updating role to admin...');
      
      const updateResult = await db.collection('users').updateOne(
        { email: userEmail },
        { $set: { role: 'admin' } }
      );
      
      if (updateResult.modifiedCount === 0) {
        if (existingUser.role === 'admin') {
          console.log('This user already has admin privileges.');
        } else {
          console.log('Update operation completed, but role was not changed.');
        }
      } else {
        console.log('✅ Successfully updated user to admin role!');
      }
    } else {
      // Create a new user with admin role
      const newUser = {
        name: userName,
        email: userEmail,
        emailVerified: new Date(),
        role: 'admin',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const insertResult = await db.collection('users').insertOne(newUser);
      
      if (insertResult.acknowledged) {
        console.log(`✅ Successfully created admin user with ID: ${insertResult.insertedId}`);
        console.log('You can now access the admin dashboard at /admin');
      } else {
        console.log('Failed to create user.');
      }
    }
    
    // Also create the corresponding account record for NextAuth.js
    const existingAccount = await db.collection('accounts').findOne({
      userId: existingUser ? existingUser._id : null,
      provider: 'google',
    });
    
    if (!existingAccount) {
      console.log('Creating NextAuth account record...');
      
      // If we just created a new user, get its ID
      let userId;
      if (!existingUser) {
        const newUser = await db.collection('users').findOne({ email: userEmail });
        userId = newUser._id;
      } else {
        userId = existingUser._id;
      }
      
      // Create a mockup account record
      const accountRecord = {
        userId: userId,
        type: 'oauth',
        provider: 'google',
        providerAccountId: `google-${Date.now()}`,
        access_token: 'mock-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        scope: 'openid email profile',
        id_token: 'mock-id-token',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const accountResult = await db.collection('accounts').insertOne(accountRecord);
      
      if (accountResult.acknowledged) {
        console.log(`✅ Successfully created account record: ${accountResult.insertedId}`);
      } else {
        console.log('Failed to create account record.');
      }
    } else {
      console.log('Account record already exists.');
    }
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

createAdminUser(); 