import { ProposalSchema, type Proposal } from '@repo/shared';
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
export async function validateToken(slug: string, token: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('proposals')
      .select('slug')
      .eq('slug', slug)
      .eq('token', token)
      .eq('status', 'published')
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
    return (data || [])
      .map(mapRowToProposal)
      .filter((p) => ProposalSchema.safeParse(p).success);
  } catch (error) {
    console.error('Supabase query failed:', (error as Error).message);
    return [];
  }
}
