/**
 * Next.js API Route - Proxies all /api/* requests to the backend
 * This allows the frontend and backend to be deployed together on Vercel
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  return handleRequest(request, params, 'GET');
}

export async function POST(request, { params }) {
  return handleRequest(request, params, 'POST');
}

export async function PUT(request, { params }) {
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(request, { params }) {
  return handleRequest(request, params, 'DELETE');
}

async function handleRequest(request, params, method) {
  try {
    const { path } = params;
    const pathString = Array.isArray(path) ? path.join('/') : path;
    
    // Get the backend URL from environment variable
    // If BACKEND_URL is set, use it (for external backend like Render)
    // Otherwise, try to use the Vercel serverless function
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    
    let url;
    if (backendUrl) {
      // External backend (e.g., Render)
      url = `${backendUrl}/api/${pathString}${request.nextUrl.search}`;
    } else {
      // For Vercel serverless functions, we'd need to call them differently
      // For now, return an error suggesting to set BACKEND_URL
      return new Response(
        JSON.stringify({ 
          error: 'Backend not configured',
          message: 'Please set BACKEND_URL or NEXT_PUBLIC_API_URL environment variable'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Get request body if it exists
    let body = null;
    if (method === 'POST' || method === 'PUT') {
      try {
        body = await request.text();
      } catch (e) {
        // No body
      }
    }
    
    // Forward headers (excluding host)
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    });
    
    // Make request to backend
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    
    // Get response data
    const data = await response.text();
    
    // Return response with same status and headers
    return new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

