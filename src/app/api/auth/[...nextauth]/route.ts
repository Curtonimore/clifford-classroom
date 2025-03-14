import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Force server-side rendering for this route to prevent caching issues
export const dynamic = 'force-dynamic';

// This is crucial for Vercel deployments as it ensures the route is not statically optimized
export const fetchCache = 'force-no-store';

// Simple API route that uses the auth options
const handler = NextAuth(authOptions);

// Export the handler for GET and POST methods
export { handler as GET, handler as POST }; 