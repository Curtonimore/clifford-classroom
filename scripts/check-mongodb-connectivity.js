const { MongoClient } = require('mongodb');
const dns = require('dns');
require('dotenv').config({ path: '.env.local' });

// Get MongoDB URI from environment
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable not set');
  console.error('Make sure you have a .env.local file with your MONGODB_URI');
  process.exit(1);
}

// Parse MongoDB connection string
const getHostname = (connectionString) => {
  const regex = /mongodb\+srv:\/\/[^:]+:[^@]+@([^\/]+)/;
  const match = connectionString.match(regex);
  return match ? match[1] : null;
};

async function checkDnsResolution(hostname) {
  return new Promise((resolve) => {
    dns.resolveSrv(`_mongodb._tcp.${hostname}`, (err, addresses) => {
      if (err) {
        console.log(`❌ DNS SRV resolution failed for _mongodb._tcp.${hostname}`);
        console.log(`Error: ${err.code} - ${err.message}`);
        console.log('This indicates a potential network or DNS issue.');
        resolve(false);
      } else {
        console.log(`✅ DNS SRV resolution successful for _mongodb._tcp.${hostname}`);
        console.log(`Found ${addresses.length} server addresses`);
        resolve(true);
      }
    });
  });
}

async function pingMongoDB() {
  console.log('Attempting to connect to MongoDB...');
  
  const hostname = getHostname(uri);
  
  if (!hostname) {
    console.error('❌ Failed to parse hostname from MongoDB URI');
    return;
  }
  
  console.log(`Testing connectivity to: ${hostname}`);
  
  // First check DNS resolution
  console.log('\n🔍 Checking DNS resolution...');
  const dnsResolved = await checkDnsResolution(hostname);
  
  if (!dnsResolved) {
    console.log('\n🔧 Troubleshooting recommendations:');
    console.log('1. Check your internet connection');
    console.log('2. Make sure you\'re not behind a restrictive firewall or VPN');
    console.log('3. Try using a different DNS server (like 1.1.1.1 or 8.8.8.8)');
    console.log('4. If on public WiFi, try a different network');
    console.log('5. Add 0.0.0.0/0 to your MongoDB Atlas IP whitelist for testing');
  }
  
  // Try MongoDB connection
  console.log('\n🔍 Attempting MongoDB connection...');
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
  });
  
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    // If DNS failed but connection worked, something unusual is happening
    if (!dnsResolved) {
      console.log("⚠️ Unusual: DNS resolution failed but MongoDB connection worked.");
      console.log("This may indicate intermittent network issues.");
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(`Error: ${error.name} - ${error.message}`);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication issue detected:');
      console.log('1. Double-check username and password in your connection string');
      console.log('2. Ensure the MongoDB user has proper permissions');
    } else if (error.message.includes('timed out')) {
      console.log('\n🔧 Connection timeout issue detected:');
      console.log('1. Make sure your IP address is whitelisted in MongoDB Atlas');
      console.log('2. Current IP: Checking...');
      
      // Try to get the current public IP
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log(`   Your public IP appears to be: ${data.ip}`);
        console.log('   Add this IP to MongoDB Atlas Network Access whitelist');
      } catch (e) {
        console.log('   Could not determine your public IP automatically');
        console.log('   Visit https://whatismyipaddress.com/ to find your public IP');
      }
      
      console.log('3. Try adding 0.0.0.0/0 (allow from anywhere) temporarily for testing');
    }
    
    return false;
  } finally {
    await client.close();
  }
}

pingMongoDB().catch(console.error); 