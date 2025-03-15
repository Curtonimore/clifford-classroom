import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  console.log("NextAuth test GET method called");
  
  return NextResponse.json({
    method: "GET",
    timestamp: new Date().toISOString(),
    message: "NextAuth test GET method working correctly",
    headers: Object.fromEntries([...request.headers.entries()]),
    url: request.url
  });
}

export async function POST(request: NextRequest) {
  console.log("NextAuth test POST method called");
  
  return NextResponse.json({
    method: "POST",
    timestamp: new Date().toISOString(),
    message: "NextAuth test POST method working correctly",
    headers: Object.fromEntries([...request.headers.entries()]),
    url: request.url
  });
} 