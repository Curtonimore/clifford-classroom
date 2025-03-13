require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');

async function test() {
  try {
    // First get a user ID
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    // Get any user, not just those with 'user' role
    const user = await db.collection('users').findOne({});
    
    if (!user) {
      console.log('No users found to test with');
      await client.close();
      return;
    }
    
    const userId = user._id.toString();
    console.log(`Testing with user: ${userId} (${user.name}, role: ${user.role})`);
    await client.close();
    
    // Create a test subscription update
    const subscriptionData = {
      tier: 'premium',
      aiCreditsRemaining: 100,
      features: ['unlimited_lesson_plans', 'advanced_customization', 'export_all_formats']
    };
    
    // Call the API endpoint 
    console.log('Sending test request to update subscription...');
    
    const response = await fetch('http://localhost:3000/api/admin/users/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        subscription: subscriptionData,
      }),
    });
    
    const responseData = await response.json();
    console.log('API Response:', responseData);
    
    if (response.ok) {
      console.log('✅ Subscription update API works!');
    } else {
      console.log('❌ Subscription update API failed');
    }
  } catch (err) {
    console.error('Error testing subscription update:', err);
  }
}

test(); 