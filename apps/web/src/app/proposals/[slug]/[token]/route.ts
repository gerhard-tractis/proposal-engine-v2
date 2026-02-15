import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { injectSignedUrls } from '@/lib/proposal-helpers';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; token: string }> }
) {
  const { slug, token } = await params;
  const supabase = getSupabaseAdmin();

  // Query for the proposal (only active statuses)
  const { data, error } = await supabase
    .from('proposals')
    .select('html_path, expires_at, asset_manifest, status')
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
