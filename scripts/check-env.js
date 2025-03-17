#!/usr/bin/env node

// Test environment variable loading
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('===========================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI first 15 chars:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) : 'Not set');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('VERCEL_URL:', process.env.VERCEL_URL);
console.log('VERCEL_GIT_COMMIT_SHA:', process.env.VERCEL_GIT_COMMIT_SHA);

// Check if we're in what the app thinks is the build process
const isBuildProcess = process.env.VERCEL_ENV === 'production' && process.env.VERCEL_GIT_COMMIT_SHA;
console.log('Is build process (based on app logic):', isBuildProcess);

// Check dotenv loading
console.log('\nChecking dotenv configurations:');
console.log('===========================');

try {
  // Try to load from different files to see which one works
  const dotenv = require('dotenv');
  
  // Check .env.local
  try {
    const envLocal = dotenv.config({ path: '.env.local' });
    console.log('.env.local loaded:', envLocal.parsed ? 'Yes' : 'No');
    if (envLocal.parsed) {
      console.log('  MONGODB_URI exists in .env.local:', !!envLocal.parsed.MONGODB_URI);
    }
  } catch (error) {
    console.log('.env.local error:', error.message);
  }
  
  // Check .env
  try {
    const env = dotenv.config({ path: '.env' });
    console.log('.env loaded:', env.parsed ? 'Yes' : 'No');
    if (env.parsed) {
      console.log('  MONGODB_URI exists in .env:', !!env.parsed.MONGODB_URI);
    }
  } catch (error) {
    console.log('.env error:', error.message);
  }
} catch (error) {
  console.log('Error loading dotenv:', error.message);
}

// Print complete file paths for context
console.log('\nFile paths:');
console.log('===========================');
const path = require('path');
console.log('Current directory:', process.cwd());
console.log('.env.local path:', path.resolve(process.cwd(), '.env.local'));
console.log('.env path:', path.resolve(process.cwd(), '.env')); 