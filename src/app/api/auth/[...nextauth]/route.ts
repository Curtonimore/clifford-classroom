import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Export the NextAuth handler for both GET and POST methods
const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler; 