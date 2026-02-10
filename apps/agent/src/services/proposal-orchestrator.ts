/**
 * Proposal Generation Orchestrator
 *
 * Coordinates the 3-agent workflow:
 * 1. Agent 2A: Parse documents
 * 2. Agent 2B: Enrich missing sections (if needed)
 * 3. Agent 3: Select variants and finalize
 */

import { agent2A_parser } from './agent-2a-parser.js';
import { startEnrichment, continueEnrichment } from './agent-2b-enrichment.js';
import { agent3_designer } from './agent-3-designer.js';
import type { Agent2AOutput } from '../lib/agent-schemas.js';

export interface ProposalGenerationInput {
  documentText: string;
}

export interface ProposalGenerationOutput {
  status: 'needs_enrichment' | 'complete';

  // If status === 'needs_enrichment'
  enrichmentMessage?: string;
  sessionId?: string;

  // If status === 'complete'
  proposal?: any;
  variantReasoning?: Record<string, string>;
}

// Session storage with TTL (use Redis in production for multi-instance deployments)
interface EnrichmentSession {
  partialProposal: any;
  missingOrWeak: any[];
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  createdAt: number;
  lastAccessedAt: number;
}

const enrichmentSessions = new Map<string, EnrichmentSession>();

// Session configuration
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Run cleanup every 5 minutes

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `enrich_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get session with automatic expiry check
 */
function getSession(sessionId: string): EnrichmentSession | null {
  const session = enrichmentSessions.get(sessionId);
  if (!session) {
    return null;
  }

  const now = Date.now();
  const age = now - session.lastAccessedAt;

  // Check if session has expired
  if (age > SESSION_TTL_MS) {
    console.log(`[Session] Expired session: ${sessionId} (age: ${Math.round(age / 1000)}s)`);
    enrichmentSessions.delete(sessionId);
    return null;
  }

  // Update last accessed time
  session.lastAccessedAt = now;
  return session;
}

/**
 * Create new session
 */
function createSession(
  sessionId: string,
  partialProposal: any,
  missingOrWeak: any[],
  initialMessage: string
): void {
  const now = Date.now();
  enrichmentSessions.set(sessionId, {
    partialProposal,
    missingOrWeak,
    conversationHistory: [
      { role: 'assistant', content: initialMessage },
    ],
    createdAt: now,
    lastAccessedAt: now,
  });
  console.log(`[Session] Created: ${sessionId}`);
}

/**
 * Periodic cleanup of expired sessions
 */
function cleanupExpiredSessions(): void {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [sessionId, session] of enrichmentSessions.entries()) {
    const age = now - session.lastAccessedAt;
    if (age > SESSION_TTL_MS) {
      enrichmentSessions.delete(sessionId);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`[Cleanup] Removed ${cleanedCount} expired session(s). Active sessions: ${enrichmentSessions.size}`);
  }
}

// Start periodic cleanup
const cleanupTimer = setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL_MS);

// Allow cleanup timer to be stopped (for graceful shutdown)
export function stopSessionCleanup(): void {
  clearInterval(cleanupTimer);
  console.log('[Session] Cleanup timer stopped');
}

/**
 * Start proposal generation workflow
 */
export async function generateProposal(input: ProposalGenerationInput): Promise<ProposalGenerationOutput> {
  console.log('=== Starting Proposal Generation Workflow ===');

  // Step 1: Parse documents with Agent 2A
  console.log('Step 1: Parsing documents with Agent 2A...');
  const parseResult: Agent2AOutput = await agent2A_parser({
    documentText: input.documentText,
  });

  // Step 2: Check if enrichment is needed
  if (parseResult.overall === 'complete') {
    console.log('Step 2: No enrichment needed - proceeding to Agent 3');

    // Skip to Agent 3 - content is complete
    const designResult = await agent3_designer({
      enrichedContent: parseResult.content,
    });

    console.log('=== Proposal Generation Complete ===');

    return {
      status: 'complete',
      proposal: designResult.proposal,
      variantReasoning: designResult.variantReasoning,
    };
  } else {
    console.log('Step 2: Enrichment needed - starting Agent 2B session');

    // Start enrichment session with Agent 2B
    const enrichmentResult = await startEnrichment(
      parseResult.content,
      parseResult.missingOrWeak || []
    );

    // Create session with TTL tracking
    const sessionId = generateSessionId();
    createSession(
      sessionId,
      parseResult.content,
      parseResult.missingOrWeak || [],
      enrichmentResult.message
    );

    console.log(`=== Enrichment Session Started: ${sessionId} ===`);

    return {
      status: 'needs_enrichment',
      enrichmentMessage: enrichmentResult.message,
      sessionId,
    };
  }
}

/**
 * Continue enrichment conversation
 */
export async function continueEnrichmentSession(
  sessionId: string,
  userMessage: string
): Promise<ProposalGenerationOutput> {
  console.log(`=== Continuing Enrichment Session: ${sessionId} ===`);

  const session = getSession(sessionId);
  if (!session) {
    throw new Error(
      `Enrichment session not found or expired. Sessions expire after ${SESSION_TTL_MS / 60000} minutes of inactivity. Please start a new proposal generation.`
    );
  }

  // Continue conversation with Agent 2B
  const enrichmentResult = await continueEnrichment(
    session.partialProposal,
    session.missingOrWeak,
    session.conversationHistory,
    userMessage
  );

  // Update conversation history
  session.conversationHistory.push(
    { role: 'user', content: userMessage },
    { role: 'assistant', content: enrichmentResult.message }
  );

  // Check if enrichment is complete
  if (enrichmentResult.isComplete && enrichmentResult.enrichedContent) {
    console.log('Enrichment complete - proceeding to Agent 3');

    // Clean up session
    enrichmentSessions.delete(sessionId);

    // Proceed to Agent 3
    const designResult = await agent3_designer({
      enrichedContent: enrichmentResult.enrichedContent,
    });

    console.log('=== Proposal Generation Complete ===');

    return {
      status: 'complete',
      proposal: designResult.proposal,
      variantReasoning: designResult.variantReasoning,
    };
  } else {
    console.log('Enrichment continuing...');

    return {
      status: 'needs_enrichment',
      enrichmentMessage: enrichmentResult.message,
      sessionId,
    };
  }
}

/**
 * Get enrichment session info (for debugging/monitoring)
 */
export function getEnrichmentSessionInfo(sessionId: string) {
  return getSession(sessionId);
}

/**
 * Get session statistics
 */
export function getSessionStats() {
  return {
    activeSessions: enrichmentSessions.size,
    sessionTTL: SESSION_TTL_MS / 1000 / 60, // in minutes
  };
}

/**
 * Clear all sessions (for testing/cleanup)
 */
export function clearAllSessions() {
  enrichmentSessions.clear();
}
