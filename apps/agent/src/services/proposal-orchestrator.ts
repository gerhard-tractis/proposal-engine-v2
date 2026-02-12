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
import { getSupabaseClient } from '../lib/supabase.js';

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

// Session type for mapping DB rows
interface EnrichmentSession {
  partialProposal: any;
  missingOrWeak: any[];
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  createdAt: number;
  lastAccessedAt: number;
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `enrich_${Date.now()}_${crypto.randomUUID().replace(/-/g, '').slice(0, 9)}`;
}

/**
 * Get session with automatic expiry check via expires_at column
 */
async function getSession(sessionId: string): Promise<EnrichmentSession | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('enrichment_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    return null;
  }

  // Update last_accessed_at and extend expires_at (sliding window)
  await supabase
    .from('enrichment_sessions')
    .update({
      last_accessed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    })
    .eq('id', sessionId);

  return {
    partialProposal: data.partial_proposal,
    missingOrWeak: data.missing_or_weak,
    conversationHistory: data.conversation_history,
    createdAt: new Date(data.created_at).getTime(),
    lastAccessedAt: new Date(data.last_accessed_at).getTime(),
  };
}

/**
 * Create new session in Supabase
 */
async function createSession(
  sessionId: string,
  partialProposal: any,
  missingOrWeak: any[],
  initialMessage: string
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('enrichment_sessions').insert({
    id: sessionId,
    partial_proposal: partialProposal,
    missing_or_weak: missingOrWeak,
    conversation_history: [{ role: 'assistant', content: initialMessage }],
    status: 'active',
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  });

  if (error) {
    console.error('[Session] Failed to create session:', error.message);
    throw error;
  }
  console.log(`[Session] Created: ${sessionId}`);
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

    // Create session in Supabase
    const sessionId = generateSessionId();
    await createSession(
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

  const session = await getSession(sessionId);
  if (!session) {
    throw new Error(
      `Enrichment session not found or expired. Sessions expire after 30 minutes of inactivity. Please start a new proposal generation.`
    );
  }

  // Continue conversation with Agent 2B
  const enrichmentResult = await continueEnrichment(
    session.partialProposal,
    session.missingOrWeak,
    session.conversationHistory,
    userMessage
  );

  // Build new messages to append
  const newMessages = [
    { role: 'user' as const, content: userMessage },
    { role: 'assistant' as const, content: enrichmentResult.message },
  ];

  const supabase = getSupabaseClient();

  // Check if enrichment is complete
  if (enrichmentResult.isComplete && enrichmentResult.enrichedContent) {
    console.log('Enrichment complete - proceeding to Agent 3');

    // Mark session as completed, append history atomically via RPC
    const updatedHistory = [...session.conversationHistory, ...newMessages];
    await supabase
      .from('enrichment_sessions')
      .update({ status: 'completed', conversation_history: updatedHistory })
      .eq('id', sessionId);

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

    // Append to conversation history atomically
    const updatedHistory = [...session.conversationHistory, ...newMessages];
    await supabase
      .from('enrichment_sessions')
      .update({ conversation_history: updatedHistory })
      .eq('id', sessionId);

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
export async function getEnrichmentSessionInfo(sessionId: string) {
  return getSession(sessionId);
}

/**
 * Get session statistics
 */
export async function getSessionStats() {
  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from('enrichment_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString());

  return {
    activeSessions: error ? 0 : (count ?? 0),
    sessionTTL: 30, // in minutes
  };
}

/**
 * Clear all sessions
 */
export async function clearAllSessions() {
  const supabase = getSupabaseClient();
  await supabase
    .from('enrichment_sessions')
    .update({ status: 'completed' })
    .eq('status', 'active');
}
