// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response("Raw debug endpoint is working", {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 