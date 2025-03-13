require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function test() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db();
    
    // Get a user
    const user = await db.collection('users').findOne({});
    
    if (!user) {
      console.log('No users found to test with');
      await client.close();
      return;
    }
    
    const userId = user._id;
    console.log(`Testing with user: ${userId.toString()} (${user.name}, role: ${user.role})`);
    
    // Current credits
    const currentCredits = user.subscription?.aiCreditsRemaining || 0;
    console.log('Current credits:', currentCredits);
    
    // Add credits
    const creditsToAdd = 50;
    const newCredits = currentCredits + creditsToAdd;
    
    console.log(`Adding ${creditsToAdd} credits...`);
    
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { $set: { 'subscription.aiCreditsRemaining': newCredits } }
    );
    
    console.log('Update result:', result);
    
    // Verify the update
    const updatedUser = await db.collection('users').findOne({ _id: userId });
    console.log('New credits:', updatedUser.subscription.aiCreditsRemaining);
    
    if (updatedUser.subscription.aiCreditsRemaining === newCredits) {
      console.log('✅ Adding credits works!');
    } else {
      console.log('❌ Adding credits failed');
    }
    
    await client.close();
  } catch (err) {
    console.error('Error adding credits directly:', err);
  }
}

test(); 