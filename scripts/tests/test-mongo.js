require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function test() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db();
    const users = await db.collection('users').find().limit(1).toArray();
    console.log('User found:', !!users.length);
    
    if (users.length) {
      const user = users[0];
      console.log('User data structure:', JSON.stringify({
        id: user._id.toString(),
        name: user.name,
        email: user.email ? '***@***' : undefined,
        role: user.role,
        subscription: user.subscription
      }, null, 2));
    }
    
    await client.close();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

test(); 