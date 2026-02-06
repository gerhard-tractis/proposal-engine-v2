import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

/**
 * LangChain Agent for Proposal Generation
 * Uses Groq (free) as the LLM provider
 * Tools: extract-design, extract-text
 */

// Initialize Groq LLM (lazy initialization to avoid build-time errors)
function getLLM() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile', // Free Groq model
    temperature: 0.2, // Lower for more consistent output
  });
}

/**
 * Tool 1: Extract Design System from Website
 */
const extractDesignTool = new DynamicStructuredTool({
  name: 'extract_design_system',
  description:
    'Extracts brand colors, fonts, spacing, and design system from any website URL. ' +
    'Use this when you need to get branding information from a customer website. ' +
    'Returns colors (hex codes), typography (fonts), spacing values, and shadows.',
  schema: z.object({
    url: z.string().describe('The website URL to extract design from (e.g., https://example.com)'),
  }),
  func: async (input: { url: string }) => {
    const { url } = input;
    // Call our existing API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/extract-design`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`Design extraction failed: ${response.statusText}`);
    }

    const data: any = await response.json();
    return JSON.stringify(data.designSystem);
  },
});

/**
 * Tool 2: Extract Text from File
 * Note: This tool receives the already-extracted text (not the file)
 * File extraction happens before agent invocation
 */
const structureProposalTool = new DynamicStructuredTool({
  name: 'structure_proposal_content',
  description:
    'Structures raw proposal text into 8 sections: ' +
    '1. Executive Summary (string), ' +
    '2. Understanding Needs (array of strings), ' +
    '3. Solution (string), ' +
    '4. Features (array of {title, description, icon}), ' +
    '5. Roadmap (array of {phase, date, description}), ' +
    '6. Why Us (array of strings), ' +
    '7. Pricing (object with tiers or customNote), ' +
    '8. Contact (object with name, email, phone, calendlyUrl, nextSteps). ' +
    'Return as valid JSON matching this structure.',
  schema: z.object({
    proposalText: z.string().describe('The raw proposal text content to structure'),
  }),
  func: async (input: { proposalText: string }) => {
    const { proposalText } = input;
    // Use the LLM to structure the content
    const llm = getLLM();
    const structuringPrompt = `You are a proposal structuring expert.
Given the following proposal content, structure it into exactly 8 sections in valid JSON format:

PROPOSAL CONTENT:
${proposalText}

Return a JSON object with these exact keys:
{
  "executiveSummary": "A concise 2-3 sentence summary",
  "needs": ["Need 1", "Need 2", "Need 3"],
  "solution": "Description of the proposed solution",
  "features": [
    {"title": "Feature name", "description": "Feature description", "icon": "Zap"}
  ],
  "roadmap": [
    {"phase": "Phase 1", "date": "Q1 2026", "description": "What gets done"}
  ],
  "whyUs": ["Reason 1", "Reason 2", "Reason 3"],
  "pricing": {
    "tiers": [
      {"name": "Standard", "price": "$5,000", "period": "month", "features": ["Feature 1"], "recommended": true}
    ]
  },
  "contact": {
    "name": "Gerhard Neumann",
    "email": "gerhard@tractis.ai",
    "phone": "+1 (555) 123-4567",
    "calendlyUrl": "https://calendly.com/tractis/demo",
    "nextSteps": ["Review proposal", "Schedule call", "Get started"]
  }
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.`;

    const response = await llm.invoke(structuringPrompt);
    return response.content.toString();
  },
});

/**
 * Simplified agent - just call tools directly
 * (LangChain agent setup is complex in newer versions)
 */
export async function createProposalAgent() {
  return {
    invoke: async ({ input }: { input: string }) => {
      // Parse the input to extract URL and text
      const urlMatch = input.match(/website is: (https?:\/\/[^\s]+)/);
      const customerUrl = urlMatch ? urlMatch[1] : '';

      // Extract proposal text
      const textMatch = input.match(/proposal content is: ([\s\S]+?)(?:\n\nSteps:|$)/);
      const proposalText = textMatch ? textMatch[1].trim() : '';

      if (!customerUrl || !proposalText) {
        throw new Error('Could not parse customer URL and proposal text from input');
      }

      // Step 1: Extract design
      console.log('[Agent] Calling extract_design_system...');
      const designResult = await extractDesignTool.func({ url: customerUrl });
      const branding = JSON.parse(designResult);

      // Step 2: Structure proposal
      console.log('[Agent] Calling structure_proposal_content...');
      const proposalResult = await structureProposalTool.func({ proposalText });
      const proposal = JSON.parse(proposalResult);

      // Combine results
      return {
        output: JSON.stringify({
          branding,
          proposal,
        }, null, 2),
      };
    },
  };
}

/**
 * Generate a complete proposal
 */
export interface GenerateProposalInput {
  customerUrl: string;
  proposalText: string;
  clientName: string;
}

export async function generateProposal(input: GenerateProposalInput) {
  const executor = await createProposalAgent();

  const result = await executor.invoke({
    input: `Create a branded proposal for ${input.clientName}.
Their website is: ${input.customerUrl}
The proposal content is: ${input.proposalText}

Steps:
1. Extract design system from ${input.customerUrl}
2. Structure the proposal content into 8 sections
3. Return the complete proposal with branding

Return as JSON with:
{
  "branding": { colors, fonts },
  "proposal": { 8 sections }
}`,
  });

  return result.output;
}
