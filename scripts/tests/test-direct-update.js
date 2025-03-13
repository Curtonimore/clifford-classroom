require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

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
    
    // Current subscription state
    console.log('Current subscription:', user.subscription || 'None');
    
    // Update subscription directly
    const subscriptionData = {
      tier: 'premium',
      aiCreditsRemaining: 100,
      features: ['unlimited_lesson_plans', 'advanced_customization', 'export_all_formats'],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    };
    
    console.log('Updating subscription to:', subscriptionData);
    
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { $set: { subscription: subscriptionData } }
    );
    
    console.log('Update result:', result);
    
    // Verify the update
    const updatedUser = await db.collection('users').findOne({ _id: userId });
    console.log('Updated subscription:', updatedUser.subscription);
    
    if (updatedUser.subscription.tier === subscriptionData.tier) {
      console.log('✅ Direct subscription update works!');
    } else {
      console.log('❌ Direct subscription update failed');
    }
    
    await client.close();
  } catch (err) {
    console.error('Error updating subscription directly:', err);
  }
}

test(); 