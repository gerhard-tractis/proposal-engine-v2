/**
 * Agent 2A: Proposal Content Parser
 *
 * Uses Groq Llama 3 (cheap model) to parse uploaded documents
 * and structure them into 6 proposal sections.
 */

import { ChatGroq } from '@langchain/groq';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Agent2AOutputSchema, extractAndValidateJSON, type Agent2AOutput } from '../lib/agent-schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load system prompt
const PROMPT_PATH = path.join(__dirname, '../../prompts/agent-2a-parser.md');
let SYSTEM_PROMPT: string;

async function loadPrompt() {
  if (!SYSTEM_PROMPT) {
    SYSTEM_PROMPT = await fs.readFile(PROMPT_PATH, 'utf-8');
  }
  return SYSTEM_PROMPT;
}

export interface Agent2AInput {
  documentText: string;
}

// Agent2AOutput is now imported from agent-schemas.ts

/**
 * Agent 2A: Parse documents and structure into proposal sections
 */
export async function agent2A_parser(input: Agent2AInput): Promise<Agent2AOutput> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not found in environment variables');
  }

  // Load system prompt
  const systemPrompt = await loadPrompt();

  // Initialize Groq client
  const groq = new ChatGroq({
    apiKey,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1, // Low temperature for consistent parsing
    maxTokens: 8000,
  });

  console.log('[Agent 2A] Starting document parsing...');
  console.log(`[Agent 2A] Document length: ${input.documentText.length} characters`);

  try {
    // Call Groq API with system prompt + document text
    const response = await groq.invoke([
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Please parse the following document and structure it into proposal sections:\n\n${input.documentText}`,
      },
    ]);

    console.log('[Agent 2A] Received response from Groq');

    // Parse and validate JSON response
    const content = response.content as string;
    const result = extractAndValidateJSON(content, Agent2AOutputSchema, 'Agent 2A');

    console.log('[Agent 2A] Parsing complete');
    console.log(`[Agent 2A] Overall status: ${result.overall}`);
    console.log(`[Agent 2A] Sections needing enrichment: ${result.missingOrWeak?.length || 0}`);

    return result;
  } catch (error) {
    console.error('[Agent 2A] Error during parsing:', error);
    throw new Error(`Agent 2A parsing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
