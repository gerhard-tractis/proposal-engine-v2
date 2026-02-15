import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// Fallback tokens from env — safety net if Supabase is unavailable
// Format: "slug1:token1,slug2:token2"
const FALLBACK_TOKENS = new Map<string, string>(
  (process.env.FALLBACK_PROPOSAL_TOKENS || '')
    .split(',')
    .filter(Boolean)
    .map((pair) => {
      const [slug, token] = pair.split(':');
      return [slug, token] as [string, string];
    })
);

async function validateToken(slug: string, token: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('proposals')
      .select('slug')
      .eq('slug', slug)
      .eq('token', token)
      .in('status', ['published', 'sent', 'viewed', 'draft'])
      .single();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Supabase token validation failed, using fallback:', error);
    return FALLBACK_TOKENS.get(slug) === token;
  }
}

// Basic rate limiter (in-memory, per-worker)
// Production: Use Vercel Edge Config, Upstash Redis, or @vercel/rate-limit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    // Reset or create new limit: 10 requests per minute
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }

  if (limit.count >= 10) {
    return true; // Rate limited
  }

  limit.count++;
  return false;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Handle all /proposals/* paths
  if (path.startsWith('/proposals')) {
    try {
      // Rate limiting check
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      if (isRateLimited(ip)) {
        console.warn('Rate limit exceeded:', { ip, path, timestamp: new Date().toISOString() });
        return new NextResponse('Too Many Requests', { status: 429 });
      }

      // Normalize path (remove trailing slashes)
      const normalizedPath = path.replace(/\/+$/, '');
      const pathParts = normalizedPath.split('/').filter(Boolean);

      // Expected: ['proposals', slug, token] or ['proposals', slug, token, 'legacy']
      // Return 404 for ANY deviation to prevent info leakage
      if (pathParts.length !== 3 && !(pathParts.length === 4 && pathParts[3] === 'legacy')) {
        return NextResponse.rewrite(new URL('/404', request.url));
      }

      const slug = pathParts[1];
      const token = pathParts[2];

      // Validate slug/token format before querying
      const validFormat = /^[a-zA-Z0-9_-]{1,100}$/;
      if (!validFormat.test(slug) || !validFormat.test(token)) {
        return NextResponse.rewrite(new URL('/404', request.url));
      }

      // Validate token
      if (!(await validateToken(slug, token))) {
        // Log failed authentication attempt for security monitoring
        console.warn('Failed proposal access attempt:', {
          slug,
          tokenPrefix: token.substring(0, 3) + '***',
          timestamp: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        });
        return NextResponse.rewrite(new URL('/404', request.url));
      }

      // Valid proposal - add SEO prevention header and proceed
      const response = NextResponse.next();
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    } catch (error) {
      // Log error but return identical 404 (don't leak error details)
      console.error('Middleware error:', { path, error });
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/proposals/:path*', // Matches /proposals/anything
};
