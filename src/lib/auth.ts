import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";
import { DefaultUser, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb-client";

// Define user roles and permissions
export type Role = "user" | "premium" | "admin";

export interface UserWithRole extends DefaultUser {
  role: Role;
  id: string;
}

// Fix the ExtendedSession interface to correctly extend Session
export interface ExtendedSession extends Omit<Session, 'user'> {
  user: UserWithRole;
}

// Function to check if an email is in the admin list
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(email => email.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
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
  },
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