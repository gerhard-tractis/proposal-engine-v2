import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { injectSignedUrls } from '@/lib/proposal-helpers';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// In-memory rate limiter for password attempts (resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string, slug: string): boolean {
  const key = `${ip}:${slug}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string, slug: string): void {
  const key = `${ip}:${slug}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count++;
  }
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/** Create an HMAC-signed auth token for the cookie */
function signToken(slug: string, password: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(`${slug}:${password}`)
    .digest('hex')
    .slice(0, 32);
}

function cookieName(slug: string): string {
  return `proposal_auth_${slug}`;
}

function buildPasswordPage(error?: string): string {
  const errorHtml = error
    ? `<p style="color:#ef4444;margin-top:12px;font-size:14px;">${error}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Enter Access Code</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f172a;color:#e2e8f0}
.card{background:#1e293b;border-radius:16px;padding:48px 40px;max-width:400px;width:90%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,.4)}
h1{font-size:22px;font-weight:600;margin-bottom:8px}
.sub{font-size:14px;color:#94a3b8;margin-bottom:32px}
input[type="text"]{width:200px;font-size:28px;letter-spacing:12px;text-align:center;padding:12px 16px;border:2px solid #334155;border-radius:10px;background:#0f172a;color:#e2e8f0;outline:none;transition:border-color .2s}
input[type="text"]:focus{border-color:#3b82f6}
button{margin-top:24px;padding:12px 40px;font-size:16px;font-weight:600;color:#fff;background:#3b82f6;border:none;border-radius:10px;cursor:pointer;transition:background .2s}
button:hover{background:#2563eb}
.lock{font-size:40px;margin-bottom:16px}
.tractis{margin-top:32px;font-size:12px;color:#475569}
</style>
</head>
<body>
<div class="card">
<div class="lock">&#128274;</div>
<h1>Protected Proposal</h1>
<p class="sub">Enter the 6-digit access code to view this proposal.</p>
<form method="POST">
<input type="text" name="password" maxlength="6" pattern="[0-9]{6}" inputmode="numeric" autocomplete="off" autofocus required placeholder="------">
${errorHtml}
<br><button type="submit">View Proposal</button>
</form>
<p class="tractis">Powered by Tractis</p>
</div>
</body>
</html>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; token: string }> }
) {
  const { slug, token } = await params;
  const supabase = getSupabaseAdmin();

  // Query for the proposal (only active statuses)
  const { data, error } = await supabase
    .from('proposals')
    .select('html_path, expires_at, asset_manifest, status, password')
    .eq('slug', slug)
    .eq('token', token)
    .in('status', ['published', 'sent', 'viewed', 'draft'])
    .single();

  if (error || !data) {
    return new Response('Not Found', { status: 404 });
  }

  // Old React proposal — rewrite to legacy route
  if (!data.html_path) {
    return NextResponse.rewrite(
      new URL(`/proposals/${slug}/${token}/legacy`, request.url)
    );
  }

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return new Response('Proposal expired', { status: 410 });
  }

  // Password gate: if password is set, check for valid auth cookie
  if (data.password) {
    const cookie = request.cookies.get(cookieName(slug));
    const expectedToken = signToken(slug, data.password);

    if (!cookie || cookie.value !== expectedToken) {
      return new Response(buildPasswordPage(), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  }

  // Increment view count (fire-and-forget)
  supabase.rpc('increment_view', { proposal_slug: slug }).then(({ error: rpcError }) => {
    if (rpcError) console.error('increment_view failed:', rpcError.message);
  });

  // Fetch HTML from Storage
  const { data: fileData, error: storageError } = await supabase.storage
    .from('proposals')
    .download(data.html_path);

  if (storageError || !fileData) {
    console.error('Failed to fetch HTML from Storage:', storageError);
    return new Response('Internal Server Error', { status: 500 });
  }

  let html = await fileData.text();

  // Inject signed URLs for asset placeholders
  html = await injectSignedUrls(html, slug, data.asset_manifest ?? {});

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'private, no-store',
      'Content-Security-Policy':
        "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src * data:; font-src *; connect-src 'none'",
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; token: string }> }
) {
  const { slug, token } = await params;
  const ip = getClientIp(request);

  // Rate limit check
  if (isRateLimited(ip, slug)) {
    return new Response(
      buildPasswordPage('Too many attempts. Please try again later.'),
      { status: 429, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('proposals')
    .select('password')
    .eq('slug', slug)
    .eq('token', token)
    .in('status', ['published', 'sent', 'viewed', 'draft'])
    .single();

  if (error || !data || !data.password) {
    return new Response('Not Found', { status: 404 });
  }

  // Parse form body
  const formData = await request.formData();
  const submitted = formData.get('password')?.toString()?.trim() || '';

  recordAttempt(ip, slug);

  if (submitted !== data.password) {
    return new Response(
      buildPasswordPage('Incorrect code. Please try again.'),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  // Password correct — set auth cookie and redirect to GET
  const authToken = signToken(slug, data.password);
  const url = new URL(request.url);

  const response = NextResponse.redirect(url, 303);
  response.cookies.set(cookieName(slug), authToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: url.protocol === 'https:',
    maxAge: 24 * 60 * 60, // 24 hours
    path: `/proposals/${slug}`,
  });

  return response;
}
