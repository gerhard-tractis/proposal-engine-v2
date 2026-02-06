import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateToken } from '@/lib/proposal-helpers';

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

export function middleware(request: NextRequest) {
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

      // Expected: ['proposals', slug, token]
      // Return 404 for ANY deviation to prevent info leakage
      if (pathParts.length !== 3) {
        return NextResponse.rewrite(new URL('/404', request.url));
      }

      const slug = pathParts[1];
      const token = pathParts[2];

      // validateToken imports proposals.ts at module level (cached in memory)
      // On Vercel Edge: cache persists across requests in same worker
      // On redeployment: new workers get fresh cache
      // In dev mode: HMR updates the cache automatically
      if (!validateToken(slug, token)) {
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
