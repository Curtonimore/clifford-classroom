const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Get MongoDB URI from environment
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable not set');
  console.error('Make sure you have a .env.local file with your MONGODB_URI');
  process.exit(1);
}

async function forceSessionUpdate() {
  console.log('Forcing session update for all users to reflect admin role...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Get all sessions
    const sessions = await db.collection('sessions').find({}).toArray();
    
    if (!sessions || sessions.length === 0) {
      console.log('No sessions found in the database.');
      return;
    }
    
    console.log(`Found ${sessions.length} sessions.`);
    
    let updatedCount = 0;
    
    // Update each session to include admin role
    for (const session of sessions) {
      try {
        // Parse session data
        const sessionData = JSON.parse(session.session);
        
        // Check if this session has user data
        if (sessionData && sessionData.user) {
          // Update the user role to admin
          sessionData.user.role = 'admin';
          
          // Save the updated session
          await db.collection('sessions').updateOne(
            { _id: session._id },
            { $set: { session: JSON.stringify(sessionData) } }
          );
          
          updatedCount++;
          console.log(`Updated session for user: ${sessionData.user.email || 'Unknown'}`);
        }
      } catch (error) {
        console.error(`Error updating session ${session._id}:`, error);
      }
    }
    
    console.log(`✅ Updated ${updatedCount} of ${sessions.length} sessions.`);
    
    if (updatedCount > 0) {
      console.log('Please refresh your browser to see the changes.');
    } else {
      console.log('No sessions were updated. Try signing in again or use the admin setup page.');
    }
    
  } catch (error) {
    console.error('Error updating sessions:', error);
  } finally {
    await client.close();
  }
}

forceSessionUpdate().catch(console.error); 