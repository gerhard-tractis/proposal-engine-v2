import { ProposalSchema, type Proposal, type AssetManifest } from '@repo/shared';
import { getSupabaseAdmin } from './supabase';

/**
 * Map a database row to the Proposal type
 */
function mapRowToProposal(row: {
  slug: string;
  token: string;
  client: unknown;
  metadata: unknown;
  blocks: unknown;
}): Proposal {
  return {
    slug: row.slug,
    token: row.token,
    client: row.client as Proposal['client'],
    metadata: (row.metadata || {}) as Proposal['metadata'],
    blocks: row.blocks as Proposal['blocks'],
  };
}

/**
 * Get proposal by slug and token with Zod validation
 * Returns null if not found or validation fails
 */
export async function getProposalBySlugAndToken(
  slug: string,
  token: string
): Promise<Proposal | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('slug', slug)
      .eq('token', token)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    if (!data) return null;

    const mapped = mapRowToProposal(data);
    const result = ProposalSchema.safeParse(mapped);
    if (!result.success) {
      console.error('Proposal validation failed:', {
        slug,
        error: result.error.message,
        timestamp: new Date().toISOString(),
      });
      return null;
    }
    return result.data;
  } catch (error) {
    console.error('Supabase query failed:', (error as Error).message);
    return null;
  }
}

/**
 * Validate if a slug+token combination exists
 * Used by middleware for token validation
 */
export async function validateToken(
  slug: string,
  token: string,
  statuses: string[] = ['published']
): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('proposals')
      .select('slug')
      .eq('slug', slug)
      .eq('token', token)
      .in('status', statuses)
      .single();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Supabase query failed:', (error as Error).message);
    return false;
  }
}

/**
 * Get all proposals (for admin dashboard)
 */
export async function getAllProposals(): Promise<Proposal[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapRowToProposal);
  } catch (error) {
    console.error('Supabase query failed:', (error as Error).message);
    return [];
  }
}

/**
 * Replace asset placeholders in HTML with signed Storage URLs
 */
export async function injectSignedUrls(
  html: string,
  slug: string,
  assetManifest: Record<string, string | undefined>
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const manifest = assetManifest as Partial<AssetManifest>;

  const replacements: [string, string | undefined][] = [
    ['{{logo:client}}', manifest.clientLogo],
    ['{{logo:tractis}}', manifest.tractisLogo],
    ['{{favicon:client}}', manifest.clientFavicon],
  ];

  for (const [placeholder, storagePath] of replacements) {
    if (!html.includes(placeholder)) continue;

    if (!storagePath) {
      html = html.replaceAll(placeholder, '');
      continue;
    }

    const { data } = await supabase.storage
      .from('proposal-assets')
      .createSignedUrl(storagePath, 3600);

    html = html.replaceAll(placeholder, data?.signedUrl || '');
  }

  return html;
}

/**
 * Get an HTML proposal by slug and token
 * Returns null if not found or not an HTML proposal
 */
export async function getHtmlProposal(
  slug: string,
  token: string
): Promise<{ html: string; expired: boolean; assetManifest: AssetManifest } | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('proposals')
      .select('html_path, expires_at, asset_manifest')
      .eq('slug', slug)
      .eq('token', token)
      .not('html_path', 'is', null)
      .single();

    if (error || !data) return null;

    const manifest: AssetManifest = data.asset_manifest && data.asset_manifest.clientLogo
      ? data.asset_manifest as AssetManifest
      : { clientLogo: '', tractisLogo: '' };

    // Check expiry
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { html: '', expired: true, assetManifest: manifest };
    }

    // Increment view
    await supabase.rpc('increment_view', { proposal_slug: slug });

    // Fetch HTML from Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('proposals')
      .download(data.html_path);

    if (storageError || !fileData) {
      console.error('Failed to fetch HTML from Storage:', storageError);
      return null;
    }

    const html = await fileData.text();
    return { html, expired: false, assetManifest: manifest };
  } catch (error) {
    console.error('getHtmlProposal failed:', (error as Error).message);
    return null;
  }
}
