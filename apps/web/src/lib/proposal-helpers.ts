import { proposals } from '@/data/proposals';
import { ProposalSchema, type Proposal } from '@repo/shared';

/**
 * Get proposal by slug and token with Zod validation
 * Returns null if not found or validation fails
 */
export function getProposalBySlugAndToken(
  slug: string,
  token: string
): Proposal | null {
  try {
    const proposal = proposals.find((p) => p.slug === slug && p.token === token);
    if (!proposal) return null;

    // Runtime validation with Zod
    const result = ProposalSchema.safeParse(proposal);
    if (!result.success) {
      // Log validation errors for debugging (structure only, no sensitive data)
      console.error('Proposal validation failed:', {
        slug,
        error: result.error.message,
        timestamp: new Date().toISOString(),
      });
      // In production, these logs go to Vercel logs (viewable in dashboard)
      return null;
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }
}

/**
 * Validate if a slug+token combination exists
 * Used by middleware for token validation
 *
 * NOTE: Timing attack mitigation is handled by rate limiting in middleware.
 * For a static array, perfect constant-time comparison is not feasible.
 * Rate limiting (10 req/min) prevents timing-based enumeration attacks.
 */
export function validateToken(slug: string, token: string): boolean {
  return proposals.some((p) => p.slug === slug && p.token === token);
}

/**
 * Get all proposals (for internal use)
 */
export function getAllProposals(): Proposal[] {
  return proposals;
}
