// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  // Force this to be treated as an API endpoint, not a page
  return new Response(JSON.stringify({
    status: "success",
    message: "API endpoint is working correctly",
    timestamp: new Date().toISOString(),
    type: "API response"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Prevent caching
      'Cache-Control': 'no-store, max-age=0',
      // Prevent this from being rendered as HTML
      'X-Content-Type-Options': 'nosniff'
    },
  });
} 