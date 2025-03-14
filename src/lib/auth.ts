import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";
import { DefaultUser, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb-client";
import { BASE_URL, auth } from './config';

// Define user roles and permissions
export type Role = "user" | "premium" | "admin";

export interface UserWithRole extends DefaultUser {
  role?: Role;
}

// For TypeScript type safety with next-auth
declare module "next-auth" {
  interface User {
    role?: Role;
  }
}

// Function to check if an email is in the admin list
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(email => email.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

// Function to get the base URL for NextAuth
function getBaseUrl() {
  // Check for explicit NEXTAUTH_URL first
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Then check for Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback for local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Final fallback - use the most recent deployment URL
  return 'https://clifford-classroom-d26ojavo4-curtis-cliffords-projects.vercel.app';
}

// Detect build environment
const isBuildProcess = process.env.VERCEL_ENV === 'production' && process.env.VERCEL_GIT_COMMIT_SHA;

// This function properly creates the MongoDB adapter using a singleton connection
function createMongoDBAdapter() {
  if (isBuildProcess) {
    // During build, return null adapter to prevent connection attempts
    console.log('Build process detected, skipping MongoDB adapter initialization');
    return undefined;
  }
  
  try {
    console.log('Creating MongoDB adapter for NextAuth');
    return MongoDBAdapter(clientPromise);
  } catch (error) {
    console.error('Error creating MongoDB adapter:', error);
    return undefined;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: createMongoDBAdapter(),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder-client-id-for-build',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder-client-secret-for-build',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: `${getBaseUrl()}/api/auth/callback/google`
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log("NextAuth: Initial sign in for user:", user.email);
        // Assign role based on email
        const role: Role = isAdminEmail(user.email) ? "admin" : "user";
        
        return {
          ...token,
          role,
          id: user.id || token.sub || "",
        };
      }
      
      // Ensure token already has the required properties
      if (!token.role) {
        token.role = "user";
      }
      if (!token.id) {
        token.id = token.sub || "";
      }
      
      // Return previous token if the user hasn't changed
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role;
        session.user.id = token.id as string;
      }
      
      return session;
    },

    // Make sure the callbackUrl is properly determined based on the environment
    async redirect({ url, baseUrl }) {
      const computedBaseUrl = getBaseUrl();
      console.log("NextAuth redirect:", { url, baseUrl, computedBaseUrl });
      
      // If URL starts with any valid base URL, it's safe to redirect
      if (url.startsWith(baseUrl) || url.startsWith(computedBaseUrl)) {
        return url;
      }
      
      // Allow redirecting to relative URLs
      if (url.startsWith("/")) {
        return `${computedBaseUrl}${url}`;
      }
      
      // Otherwise, redirect to the computed base URL
      return computedBaseUrl;
    },

    // Make sure new users are properly created in the database
    async signIn({ user, account, profile }) {
      console.log("NextAuth: Sign in attempt for:", user.email);
      
      try {
        // Try to connect to MongoDB and ensure the user exists
        const client = await clientPromise;
        const db = client.db();
        
        // Check if users collection exists
        const collections = await db.listCollections({ name: 'users' }).toArray();
        if (collections.length === 0) {
          console.log("NextAuth: Creating users collection");
          await db.createCollection('users');
        }
        
        // Check if user exists in the database
        const existingUser = await db.collection('users').findOne({ email: user.email });
        
        if (!existingUser && user.email) {
          console.log("NextAuth: Creating new user in database:", user.email);
          
          // Determine role based on admin emails
          const role: Role = isAdminEmail(user.email) ? "admin" : "user";
          
          // Create a new user record
          await db.collection('users').insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            role: role,
            emailVerified: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            subscription: {
              tier: role === 'admin' ? 'premium' : 'free',
              aiCreditsRemaining: role === 'admin' ? 999 : 5,
              features: ['basic_features'],
              expiresAt: null
            }
          });
          
          console.log("NextAuth: User created successfully:", user.email);
        } else if (existingUser) {
          console.log("NextAuth: User already exists in database:", user.email);
        }
      } catch (error) {
        console.error("NextAuth: Error during sign in callback:", error);
        // Don't fail the signin even if there was a database error
      }
      
      // Always allow sign in to proceed
      return true;
    }
  },
  // Ensure we have the correct URL regardless of environment
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-process',
  debug: process.env.NODE_ENV === 'development',
};

// Helper function to get the session on the server side
export async function getAuthSession() {
  return getServerSession(authOptions);
}

// Helper function to check if a user has a specific role
export function hasRole(session: Session | null, role: Role): boolean {
  if (!session?.user) return false;
  
  const userRole = (session.user as UserWithRole).role || "user";
  
  if (role === "admin") {
    return userRole === "admin";
  }
  
  if (role === "premium") {
    return userRole === "admin" || userRole === "premium";
  }
  
  return true; // Everyone is at least a basic user
}

// Add declarations for the session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      email: string;
      name?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    id: string;
  }
} 