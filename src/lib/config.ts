/**
 * Application Configuration
 * 
 * This file centralizes all configuration settings and environment variables.
 * It helps with proper type checking and default values for configuration.
 */

// Determines if we're running in production
export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';

// Base URL for API calls - automatically uses the correct URL based on environment
export const BASE_URL = process.env.NEXTAUTH_URL || 
  (isProd ? 'https://clifford-classroom.vercel.app' : 'http://localhost:3000');

// Auth-related configuration
export const auth = {
  sessionSecret: process.env.NEXTAUTH_SECRET || 'development-secret-do-not-use-in-production',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  adminEmails: (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim()),
};

// MongoDB Configuration
export const mongodb = {
  uri: process.env.MONGODB_URI || '',
  dbName: 'clifford-classroom',
  // Connection pool settings - these match mongodb-client.ts
  connectionSettings: {
    maxPoolSize: 25,
    minPoolSize: 5,
    maxIdleTimeMS: 45000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  }
};

// API Timeouts (in milliseconds)
export const timeouts = {
  defaultApi: 15000,
  mongodbConnection: 10000,
  stripeApi: 30000,
  claudeAi: 45000, 
};

// Feature flags - enable/disable features globally
export const features = {
  useClaudeApi: process.env.USE_CLAUDE_API === 'true',
  subscriptions: isProd, // Enable subscriptions only in production by default
  analytics: isProd,     // Enable analytics only in production by default
  debugMode: process.env.DEBUG_MODE === 'true',
};

// API Keys for external services
export const apiKeys = {
  anthropic: process.env.ANTHROPIC_API_KEY || '',
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    priceBasic: process.env.STRIPE_PRICE_BASIC || '',
    pricePremium: process.env.STRIPE_PRICE_PREMIUM || '',
  },
};

// Constants for various app limits
export const limits = {
  // API Rate limits
  rateLimitRequests: 60,      // Number of requests allowed
  rateLimitWindow: 60 * 1000, // Time window in milliseconds (1 minute)
  
  // User storage limits based on subscription tier
  storage: {
    free: 25,
    basic: 100,
    premium: 500,
    admin: Infinity
  },
  
  // AI Credits per subscription tier
  aiCredits: {
    free: 5,
    basic: 30,
    premium: 150,
    admin: Infinity
  }
};

export default {
  isProd,
  isDev,
  isTest,
  BASE_URL,
  auth,
  mongodb,
  timeouts,
  features,
  apiKeys,
  limits
}; 