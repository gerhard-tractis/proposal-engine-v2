/**
 * Agent 2B: Proposal Enrichment Agent
 *
 * Uses Anthropic Sonnet for interactive conversation
 * to gather missing information and enrich proposal sections.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Agent2BEnrichedContentSchema, extractAndValidateJSON } from '../lib/agent-schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load system prompt
const PROMPT_PATH = path.join(__dirname, '../../prompts/agent-2b-enrichment.md');
let SYSTEM_PROMPT: string;

async function loadPrompt() {
  if (!SYSTEM_PROMPT) {
    SYSTEM_PROMPT = await fs.readFile(PROMPT_PATH, 'utf-8');
  }
  return SYSTEM_PROMPT;
}

export interface Agent2BInput {
  partialProposal: any; // From Agent 2A
  missingOrWeak: Array<{
    section: string;
    status: 'weak' | 'missing';
    reason: string;
  }>;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface Agent2BOutput {
  message: string; // Agent's response to user
  isComplete: boolean; // Whether enrichment is done
  enrichedContent?: any; // Final enriched proposal (if complete)
}

/**
 * Robust completion detection for Agent 2B
 * Uses multiple methods to determine if enrichment is complete
 */
function detectCompletionAndExtractContent(responseText: string): {
  isComplete: boolean;
  enrichedContent?: any;
} {
  // Method 1: Check for completion phrases (case-insensitive, flexible)
  const completionPatterns = [
    /all\s+sections\s+(are\s+)?(now\s+)?complete/i,
    /enrichment\s+(is\s+)?(now\s+)?complete/i,
    /ready\s+(to\s+)?(pass|proceed)\s+to\s+(the\s+)?designer/i,
    /passing\s+(this\s+)?to\s+(the\s+)?designer\s+agent/i,
  ];

  const hasCompletionPhrase = completionPatterns.some(pattern => pattern.test(responseText));

  // Method 2: Check for JSON with completion markers
  const hasCompletionJSON =
    responseText.includes('"status": "complete"') ||
    responseText.includes('"readyForDesigner": true') ||
    responseText.includes('"isComplete": true');

  // Method 3: Check for enriched content JSON block
  const hasJSONBlock = responseText.includes('```json') &&
                       (responseText.includes('executiveSummary') ||
                        responseText.includes('needs'));

  // Consider complete if we have strong evidence
  const isComplete = (hasCompletionPhrase && hasJSONBlock) ||
                     (hasCompletionJSON && hasJSONBlock);

  let enrichedContent;
  if (isComplete) {
    try {
      // Extract and validate enriched content
      enrichedContent = extractAndValidateJSON(
        responseText,
        Agent2BEnrichedContentSchema,
        'Agent 2B'
      );
      console.log('[Agent 2B] Enrichment complete - validated enriched content');
    } catch (error) {
      console.warn('[Agent 2B] Completion detected but content validation failed:', error);
      // If validation fails, treat as not complete (need to continue conversation)
      return { isComplete: false };
    }
  }

  return { isComplete, enrichedContent };
}

/**
 * Agent 2B: Interactive conversation to enrich missing sections
 */
export async function agent2B_enrichment(input: Agent2BInput): Promise<Agent2BOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not found in environment variables');
  }

  // Load system prompt
  const systemPrompt = await loadPrompt();

  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey,
  });

  console.log('[Agent 2B] Starting enrichment conversation...');
  console.log(`[Agent 2B] Conversation history: ${input.conversationHistory.length} turns`);
  console.log(`[Agent 2B] Missing/weak sections: ${input.missingOrWeak.length}`);

  try {
    // Build context message for first turn
    let contextMessage = '';
    if (input.conversationHistory.length === 0) {
      // First turn - provide context
      contextMessage = `
Context:
- Partial proposal data: ${JSON.stringify(input.partialProposal, null, 2)}
- Missing/weak sections: ${JSON.stringify(input.missingOrWeak, null, 2)}

Please start the enrichment conversation by showing the user what's complete and what needs improvement.
`;
    }

    // Build messages array
    const messages: Anthropic.MessageParam[] = [
      ...input.conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Add context for first turn
    if (contextMessage) {
      messages.push({
        role: 'user',
        content: contextMessage,
      });
    }

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    console.log('[Agent 2B] Received response from Sonnet');

    // Check if enrichment is complete using multiple detection methods
    const { isComplete, enrichedContent } = detectCompletionAndExtractContent(responseText);

    return {
      message: responseText,
      isComplete,
      enrichedContent,
    };
  } catch (error) {
    console.error('[Agent 2B] Error during enrichment:', error);
    throw new Error(`Agent 2B enrichment failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Helper: Start a new enrichment session
 */
export async function startEnrichment(partialProposal: any, missingOrWeak: any[]) {
  return agent2B_enrichment({
    partialProposal,
    missingOrWeak,
    conversationHistory: [],
  });
}

/**
 * Helper: Continue enrichment conversation
 */
export async function continueEnrichment(
  partialProposal: any,
  missingOrWeak: any[],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
) {
  return agent2B_enrichment({
    partialProposal,
    missingOrWeak,
    conversationHistory: [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
  });
}
