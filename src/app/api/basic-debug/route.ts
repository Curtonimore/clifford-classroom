import { NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  return new NextResponse("Basic debug endpoint is working", {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 