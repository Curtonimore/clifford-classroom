import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb-client";
import { DefaultUser, Session } from "next-auth";

// Simple role definition
export type Role = "user" | "premium" | "admin";

// Define admin email check function
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(email => email.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

// NextAuth configuration - keeping it as simple as possible
export const authOptions: NextAuthOptions = {
  // Basic MongoDB adapter with no special handling
  adapter: MongoDBAdapter(clientPromise),
  
  // Simple provider setup
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  
  // Standard session settings
  session: {
    strategy: "jwt",
  },
  
  // Only keep absolutely necessary callbacks
  callbacks: {
    // Handle JWT to include role
    async jwt({ token, user }) {
      try {
        if (user) {
          // Set role when user first signs in
          token.role = isAdminEmail(user.email) ? "admin" : "user";
        }
      } catch (error) {
        console.error("JWT callback error:", error);
      }
      return token;
    },
    
    // Add role to session
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.role = token.role as Role;
        }
      } catch (error) {
        console.error("Session callback error:", error);
      }
      return session;
    },
  },
  
  // Simple secret - properly use environment variable
  secret: process.env.NEXTAUTH_SECRET,
  
  // Enable debug mode in development
  debug: true, // Always enable debug mode to help diagnose issues
  
  // Set the URLs for NextAuth
  pages: {
    signIn: "/auth-link",
    signOut: "/auth-link",
    error: "/auth-link", // Redirect to our auth-link page on error
  },
  
  // Add event handlers for debugging
  events: {
    async signIn(message) {
      console.log("Sign in event:", message);
    },
    async signOut(message) {
      console.log("Sign out event:", message);
    },
    async createUser(message) {
      console.log("Create user event:", message);
    },
    async linkAccount(message) {
      console.log("Link account event:", message);
    },
    async session(message) {
      console.log("Session event:", message);
    },
  },
};

// Type definitions for TypeScript
declare module "next-auth" {
  interface User {
    role?: Role;
  }
  
  interface Session {
    user: {
      id?: string;
      role?: Role;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}

// Helper function to get the session
export async function getAuthSession() {
  const { getServerSession } = await import("next-auth/next");
  return getServerSession(authOptions);
}

// Simple helper to check user roles
export function hasRole(session: Session | null, role: Role): boolean {
  if (!session?.user?.role) return false;
  
  if (role === "admin") {
    return session.user.role === "admin";
  }
  
  if (role === "premium") {
    return session.user.role === "admin" || session.user.role === "premium";
  }
  
  return true; // Everyone is at least a basic user
} 