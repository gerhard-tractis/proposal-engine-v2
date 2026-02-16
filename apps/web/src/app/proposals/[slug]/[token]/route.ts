import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { injectSignedUrls } from '@/lib/proposal-helpers';

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

const TRACTIS_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3162 875" fill="currentColor"><g transform="scale(8.11) translate(10,10)"><g transform="matrix(0.837,0,0,0.837,0,0)"><g stroke-width="1" fill-rule="evenodd"><g transform="translate(-4440,-1015)" fill-rule="nonzero"><g transform="translate(4440,1015)"><polygon points="0 41.77 30.82 57.54 30.82 93.69 51 104 51 67.85 51 45.08 0 19"/><polygon points="59 45.08 59 67.85 59 104 79.18 93.69 79.18 57.54 110 41.77 110 19"/><polygon points="105 11.96 85.67 0 54.02 14.45 22.33 0 3 11.96 54.02 38"/></g></g></g></g><g transform="matrix(2.095,0,0,2.095,110.74,-11.4)"><path d="M14.96 40l-6.2 0l0-21.72l-8.16 0l0-5.68l22.52 0l0 5.68l-8.16 0l0 21.72zM30.44 40l-5.6 0l0-20.52l5.56 0l0 2.8c1.36-1.88 3.4-3.08 5.96-3.08l0 5.6c-4.08 0-5.92 2.28-5.92 5.84l0 9.36zM47.44 24.32c-3.04 0-5.4 2.48-5.4 5.52c0 3.08 2.36 5.52 5.4 5.52c3.2 0 5.6-2.44 5.6-5.52c0-3.04-2.48-5.52-5.6-5.52zM52.96 40l0-1.52c-1.44 1.12-3.68 1.8-6 1.8c-5.6 0-10.36-4.52-10.36-10.44s4.76-10.56 10.36-10.56c2.32 0 4.56 0.72 6 1.84l0-1.64l5.56 0l0 20.52l-5.56 0zM76.48 32.48l4.32 2.76c-1.96 3.16-5.08 5.24-9.56 5.24c-6.36 0-10.84-4.72-10.84-10.68s4.48-10.72 10.84-10.72c4.52 0 7.68 2.16 9.6 5.36l-4.36 2.72c-1.04-1.72-2.52-3-5.04-3c-3.24 0-5.44 2.28-5.44 5.64s2.2 5.68 5.44 5.68c2.52 0 4-1.28 5.04-3zM90.68 19.48l5.04 0l0 4.96l-5.04 0l0 8.24c0 1.84 0.84 2.56 2.72 2.56l2.32 0l0 4.76l-2.72 0c-5.44 0-7.88-2.44-7.88-7.04l0-8.52l-2.96 0l0-4.96l2.96 0l0-5.28l5.56 0l0 5.28zM103.36 17.72l-5.56 0l0-5.12l5.56 0l0 5.12zM103.36 40l-5.56 0l0-20.52l5.56 0l0 20.52zM105.28 33.56l5.64 0c0 1.24 0.84 2.76 3.8 2.8c2.08 0 3.04-0.96 3.04-1.92c0-3.6-12.12 0.08-12.12-8.56c0-3.72 3.28-6.64 8.48-6.64s8.48 2.68 8.8 6.8l-5.56 0c-0.08-1.48-0.68-2.6-3.16-2.6c-1.6 0-2.92 0.52-2.92 1.8c0 3.68 12.4 0.44 12.4 8.24c0 4.88-4.08 6.92-9.24 6.92c-5.6 0-9.04-2.92-9.16-6.84z"/></g></g></svg>`;

function buildPasswordPage(error?: string): string {
  const errorHtml = error
    ? `<p style="color:#ef4444;margin-top:12px;font-size:14px;">${error}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="https://tractis.ai/favicon.png" type="image/png">
<title>Código de Acceso — Tractis</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--brand:#dfad30;--brand-dark:#c99a1e;--brand-glow:rgba(223,173,48,0.12);--bg:#191c1f;--surface:#21262c;--surface-border:rgba(223,173,48,0.15);--text:#f1f5f9;--text-muted:#7b8b9d}
*{margin:0;padding:0;box-sizing:border-box}
body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);overflow:hidden}
body::before{content:'';position:fixed;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(ellipse at 50% 30%,var(--brand-glow),transparent 60%);pointer-events:none}
.card{position:relative;background:var(--surface);border:1px solid var(--surface-border);border-radius:20px;padding:52px 44px 44px;max-width:420px;width:90%;text-align:center;box-shadow:0 0 80px rgba(223,173,48,0.06),0 25px 50px rgba(0,0,0,.5);backdrop-filter:blur(20px)}
.lock-icon{width:48px;height:48px;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:linear-gradient(135deg,var(--brand-glow),rgba(223,173,48,0.05));border:1px solid rgba(223,173,48,0.2)}
.lock-icon svg{width:22px;height:22px;color:var(--brand);stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
h1{font-family:'Manrope',system-ui,sans-serif;font-size:21px;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
.sub{font-size:14px;color:var(--text-muted);margin-bottom:32px;line-height:1.5}
.input-wrap{display:flex;justify-content:center;gap:8px;margin-bottom:8px}
.input-wrap input{width:44px;height:56px;font-size:22px;font-weight:600;text-align:center;border:1.5px solid rgba(100,116,139,0.25);border-radius:10px;background:rgba(255,255,255,0.03);color:var(--text);outline:none;transition:border-color .2s,box-shadow .2s;caret-color:var(--brand)}
.input-wrap input:focus{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-glow)}
.hidden-input{position:absolute;opacity:0;pointer-events:none}
button{margin-top:24px;width:100%;padding:14px;font-size:15px;font-weight:600;font-family:inherit;color:#21262c;background:var(--brand);border:none;border-radius:12px;cursor:pointer;transition:background .2s,transform .1s,box-shadow .2s;letter-spacing:-0.01em}
button:hover{background:var(--brand-dark);box-shadow:0 4px 20px rgba(223,173,48,0.3)}
button:active{transform:scale(0.98)}
.powered{margin-top:40px;display:flex;align-items:center;justify-content:center;gap:8px;opacity:0.4;transition:opacity .2s}
.powered:hover{opacity:0.6}
.powered span{font-size:11px;color:var(--text-muted);letter-spacing:0.03em;text-transform:uppercase;font-weight:500}
.powered .logo{width:72px;height:auto;color:var(--text-muted)}
</style>
</head>
<body>
<div class="card">
<div class="lock-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg></div>
<h1>Propuesta Protegida</h1>
<p class="sub">Ingresa el código de acceso de 6 dígitos para ver esta propuesta.</p>
<form method="POST">
<input type="text" name="password" class="hidden-input" maxlength="6" pattern="[0-9]{6}" inputmode="numeric" autocomplete="off" autofocus required id="realInput">
<div class="input-wrap" id="boxes"></div>
${errorHtml}
<button type="submit">Ver Propuesta</button>
</form>
</div>
<div class="powered">
<span>Powered by</span>
<div class="logo">${TRACTIS_LOGO_SVG}</div>
</div>
<script>
(function(){
  var input=document.getElementById('realInput');
  var wrap=document.getElementById('boxes');
  for(var i=0;i<6;i++){var d=document.createElement('input');d.type='text';d.readOnly=true;d.setAttribute('aria-hidden','true');d.tabIndex=-1;wrap.appendChild(d);}
  var boxes=wrap.querySelectorAll('input');
  function sync(){var v=input.value;for(var i=0;i<6;i++){boxes[i].value=v[i]||'';boxes[i].style.borderColor=i===v.length?'var(--brand)':v[i]?'rgba(223,173,48,0.4)':'';}}
  input.addEventListener('input',function(){input.value=input.value.replace(/[^0-9]/g,'').slice(0,6);sync();});
  input.addEventListener('focus',sync);
  input.addEventListener('blur',function(){for(var i=0;i<6;i++)boxes[i].style.borderColor='';});
  wrap.addEventListener('click',function(){input.focus();});
  sync();input.focus();
})();
</script>
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

  // Password gate: always show password page if password is set
  if (data.password) {
    return new Response(buildPasswordPage(), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
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
      buildPasswordPage('Demasiados intentos. Por favor, intenta más tarde.'),
      { status: 429, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('proposals')
    .select('html_path, expires_at, asset_manifest, status, password')
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
      buildPasswordPage('Código incorrecto. Intenta de nuevo.'),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  // Password correct — serve the proposal directly
  // Increment view count (fire-and-forget)
  supabase.rpc('increment_view', { proposal_slug: slug }).then(({ error: rpcError }) => {
    if (rpcError) console.error('increment_view failed:', rpcError.message);
  });

  const { data: fileData, error: storageError } = await supabase.storage
    .from('proposals')
    .download(data.html_path!);

  if (storageError || !fileData) {
    console.error('Failed to fetch HTML from Storage:', storageError);
    return new Response('Internal Server Error', { status: 500 });
  }

  let html = await fileData.text();
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
