import NextAuth from "next-auth";
import { authDirectOptions } from "@/lib/auth-direct";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Export a well-defined NextAuth handler for GET and POST methods
const handler = NextAuth(authDirectOptions);

export const GET = handler;
export const POST = handler; 