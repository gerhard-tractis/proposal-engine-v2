/**
 * Agent 3: Proposal Designer Agent
 *
 * Uses Anthropic Sonnet to analyze content and select
 * optimal component variants for each section.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { TRACTIS_WHY_US, TRACTIS_CONTACT, FIXED_SECTION_VARIANTS } from '../lib/fixed-sections.js';
import { Agent3OutputSchema, extractAndValidateJSON, type Agent3Output } from '../lib/agent-schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load system prompt
const PROMPT_PATH = path.join(__dirname, '../../prompts/agent-3-designer.md');
let SYSTEM_PROMPT: string;

async function loadPrompt() {
  if (!SYSTEM_PROMPT) {
    SYSTEM_PROMPT = await fs.readFile(PROMPT_PATH, 'utf-8');
  }
  return SYSTEM_PROMPT;
}

export interface Agent3Input {
  enrichedContent: {
    executiveSummary: string;
    needs: string[];
    solution: string;
    businessCase?: any;
    techStack?: any;
    features: any[];
    roadmap: any[];
    pricing: any;
  };
}

// Agent3Output is now imported from agent-schemas.ts

/**
 * Agent 3: Analyze content and select optimal variants
 */
export async function agent3_designer(input: Agent3Input): Promise<Agent3Output> {
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

  console.log('[Agent 3] Starting variant selection...');

  try {
    // Prepare content for analysis
    const contentForAnalysis = JSON.stringify(input.enrichedContent, null, 2);

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Please analyze this enriched proposal content and select the optimal component variant for each section:\n\n${contentForAnalysis}\n\nReturn the complete proposal with variant selections and reasoning.`,
        },
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    console.log('[Agent 3] Received response from Sonnet');

    // Parse and validate JSON response
    const result = extractAndValidateJSON(responseText, Agent3OutputSchema, 'Agent 3');

    // Inject fixed sections (Why Us and Contact)
    result.proposal.whyUs = TRACTIS_WHY_US;
    result.proposal.whyUsVariant = FIXED_SECTION_VARIANTS.whyUs;
    result.proposal.contact = TRACTIS_CONTACT;
    result.proposal.contactVariant = FIXED_SECTION_VARIANTS.contact;

    console.log('[Agent 3] Variant selection complete');
    console.log('[Agent 3] Selected variants:', {
      executiveSummary: result.proposal.executiveSummaryVariant,
      needs: result.proposal.needsVariant,
      solution: result.proposal.solutionVariant,
      features: result.proposal.featuresVariant,
      roadmap: result.proposal.roadmapVariant,
      pricing: result.proposal.pricingVariant,
    });

    return result;
  } catch (error) {
    console.error('[Agent 3] Error during variant selection:', error);
    throw new Error(`Agent 3 design failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
