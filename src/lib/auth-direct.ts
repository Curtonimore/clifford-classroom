import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// NextAuth configuration without MongoDB adapter
export const authDirectOptions: NextAuthOptions = {
  // Use JWT strategy without adapter for simpler auth flow
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Simple provider setup
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  
  // Only keep absolutely necessary callbacks
  callbacks: {
    // Handle JWT to include role
    async jwt({ token, user }) {
      try {
        if (user) {
          // Since we don't have DB access in this simplified version,
          // we'll just use hardcoded admin emails for testing
          const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(email => 
            email.trim().toLowerCase()) || [];
          
          token.role = adminEmails.includes(String(user.email).toLowerCase()) 
            ? "admin" 
            : "user";
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
          session.user.role = token.role as "user" | "premium" | "admin";
          // Add the user's email to the token for identification
          if (token.email) {
            session.user.email = token.email;
          }
        }
      } catch (error) {
        console.error("Session callback error:", error);
      }
      return session;
    },
  },
  
  // Simple secret - properly use environment variable
  secret: process.env.NEXTAUTH_SECRET,
  
  // Enable debug mode
  debug: true,
  
  // Set the URLs for NextAuth
  pages: {
    signIn: "/auth-link",
    signOut: "/auth-link",
    error: "/auth-link", // Redirect to our auth-link page on error
  },
  
  // Add event handlers for debugging
  events: {
    async signIn(message) {
      console.log("Direct Auth - Sign in event:", message);
    },
    async signOut(message) {
      console.log("Direct Auth - Sign out event:", message);
    },
    async session(message) {
      console.log("Direct Auth - Session event:", message);
    },
  },
}; 