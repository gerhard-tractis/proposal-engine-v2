// Fallback data — used when Supabase is unavailable in development
import { proposals } from '@/data/proposals';
import { ProposalSchema, type Proposal } from '@repo/shared';
import { getSupabaseAdmin } from './supabase';

/**
 * Map a database row to the Proposal type
 */
function mapRowToProposal(row: {
  slug: string;
  token: string;
  type: string;
  custom_component: string | null;
  client: unknown;
  proposal: unknown;
}): Proposal {
  return {
    slug: row.slug,
    token: row.token,
    type: row.type as Proposal['type'],
    customComponent: row.custom_component ?? undefined,
    client: row.client as Proposal['client'],
    proposal: row.proposal as Proposal['proposal'],
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
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Supabase unavailable, using fallback:', (error as Error).message);
      const proposal = proposals.find((p) => p.slug === slug && p.token === token);
      if (!proposal) return null;
      const result = ProposalSchema.safeParse(proposal);
      return result.success ? result.data : null;
    }
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
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Supabase unavailable, using fallback:', (error as Error).message);
      return proposals.some((p) => p.slug === slug && p.token === token);
    }
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
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Supabase unavailable, using fallback:', (error as Error).message);
      return proposals;
    }
    console.error('Supabase query failed:', (error as Error).message);
    return [];
  }
}
