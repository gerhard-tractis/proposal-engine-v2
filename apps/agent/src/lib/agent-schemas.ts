/**
 * Zod schemas for validating agent outputs at runtime
 * Ensures LLM responses match expected structure
 */

import { z } from 'zod';

/**
 * Agent 2A Output Schema
 * Validates parsed proposal content and completeness report
 */
export const Agent2AOutputSchema = z.object({
  content: z.object({
    executiveSummary: z.string(),
    needs: z.array(z.string()),
    solution: z.string(),
    businessCase: z.any().optional(), // Complex nested structure, validated elsewhere
    techStack: z.any().optional(),
    features: z.array(z.any()),
    roadmap: z.array(z.any()),
    pricing: z.any(),
  }),
  completeness: z.object({
    executiveSummary: z.enum(['complete', 'weak', 'missing']),
    needs: z.enum(['complete', 'weak', 'missing']),
    solution: z.enum(['complete', 'weak', 'missing']),
    features: z.enum(['complete', 'weak', 'missing']),
    roadmap: z.enum(['complete', 'weak', 'missing']),
    pricing: z.enum(['complete', 'weak', 'missing']),
  }),
  overall: z.enum(['complete', 'incomplete']),
  missingOrWeak: z.array(z.object({
    section: z.string(),
    status: z.enum(['weak', 'missing']),
    reason: z.string(),
  })).optional(),
});

export type Agent2AOutput = z.infer<typeof Agent2AOutputSchema>;

/**
 * Agent 2B Output Schema
 * Validates enrichment conversation responses
 */
export const Agent2BEnrichedContentSchema = z.object({
  executiveSummary: z.string(),
  needs: z.array(z.string()),
  solution: z.string(),
  businessCase: z.any().optional(),
  techStack: z.any().optional(),
  features: z.array(z.any()),
  roadmap: z.array(z.any()),
  pricing: z.any(),
});

/**
 * Agent 3 Output Schema
 * Validates final proposal with variant selections
 */
export const Agent3OutputSchema = z.object({
  proposal: z.object({
    executiveSummary: z.string(),
    executiveSummaryVariant: z.string(),
    needs: z.array(z.string()),
    needsVariant: z.string(),
    solution: z.string(),
    solutionVariant: z.string(),
    businessCase: z.any().optional(),
    techStack: z.any().optional(),
    features: z.array(z.any()),
    featuresVariant: z.string(),
    roadmap: z.array(z.any()),
    roadmapVariant: z.string(),
    pricing: z.any(),
    pricingVariant: z.string(),
    whyUs: z.string(),
    whyUsVariant: z.string(),
    contact: z.object({
      name: z.string(),
      role: z.string(),
      email: z.string().email(),
      phone: z.string(),
      website: z.string().url(),
      linkedin: z.string().url(),
      calendly: z.string().url().nullable(),
      cta: z.string(),
    }),
    contactVariant: z.string(),
  }),
  variantReasoning: z.record(z.string(), z.string()),
});

export type Agent3Output = z.infer<typeof Agent3OutputSchema>;

/**
 * Helper function to safely parse and validate JSON from LLM output
 */
export function extractAndValidateJSON<T>(
  responseText: string,
  schema: z.ZodSchema<T>,
  agentName: string
): T {
  // Extract JSON from markdown code blocks
  let jsonStr = responseText.trim();

  if (responseText.includes('```json')) {
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
  } else if (responseText.includes('```')) {
    const jsonMatch = responseText.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (error) {
    console.error(`[${agentName}] JSON parsing failed:`, error);
    console.error(`[${agentName}] Raw response (first 500 chars):`, responseText.substring(0, 500));
    throw new Error(`${agentName} returned invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`);
  }

  // Validate against schema
  try {
    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[${agentName}] Schema validation failed:`, error.errors);
      console.error(`[${agentName}] Parsed JSON:`, JSON.stringify(parsed, null, 2));
      throw new Error(`${agentName} returned invalid output structure: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}
