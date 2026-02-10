/**
 * API Route: Generate Proposal
 *
 * POST /api/generate-proposal - Start proposal generation
 * POST /api/enrich-proposal - Continue enrichment conversation
 */

import { Router, type Request, type Response } from 'express';
import { generateProposal, continueEnrichmentSession, getSessionStats } from '../services/proposal-orchestrator.js';

const router = Router();

/**
 * POST /api/generate-proposal
 *
 * Start proposal generation from uploaded documents
 *
 * Body:
 * {
 *   "documentText": "Raw text extracted from uploaded files"
 * }
 *
 * Response:
 * - If complete: { status: "complete", proposal: {...}, variantReasoning: {...} }
 * - If needs enrichment: { status: "needs_enrichment", enrichmentMessage: "...", sessionId: "..." }
 */
router.post('/generate-proposal', async (req: Request, res: Response) => {
  try {
    const { documentText } = req.body;

    // Validation: Type check
    if (!documentText || typeof documentText !== 'string') {
      return res.status(400).json({
        error: 'documentText is required and must be a string',
      });
    }

    // Validation: Length constraints
    const MAX_DOCUMENT_LENGTH = 100_000; // ~25k tokens for Llama 3.3
    const MIN_DOCUMENT_LENGTH = 50;

    if (documentText.length > MAX_DOCUMENT_LENGTH) {
      return res.status(400).json({
        error: `Document exceeds maximum length of ${MAX_DOCUMENT_LENGTH} characters`,
        details: `Received ${documentText.length} characters. Please provide a shorter document.`,
      });
    }

    if (documentText.length < MIN_DOCUMENT_LENGTH) {
      return res.status(400).json({
        error: 'Document is too short to generate a proposal',
        details: `Minimum ${MIN_DOCUMENT_LENGTH} characters required. Received ${documentText.length} characters.`,
      });
    }

    console.log(`[API] Starting proposal generation (${documentText.length} chars)`);

    const result = await generateProposal({ documentText });

    console.log(`[API] Generation result: ${result.status}`);

    return res.json(result);
  } catch (error) {
    console.error('[API] Error generating proposal:', error);
    return res.status(500).json({
      error: 'Failed to generate proposal',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * POST /api/enrich-proposal
 *
 * Continue enrichment conversation
 *
 * Body:
 * {
 *   "sessionId": "enrich_...",
 *   "message": "User's response to agent's questions"
 * }
 *
 * Response:
 * - If continuing: { status: "needs_enrichment", enrichmentMessage: "...", sessionId: "..." }
 * - If complete: { status: "complete", proposal: {...}, variantReasoning: {...} }
 */
router.post('/enrich-proposal', async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;

    // Validation: Session ID
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({
        error: 'sessionId is required and must be a string',
      });
    }

    if (!sessionId.startsWith('enrich_')) {
      return res.status(400).json({
        error: 'Invalid session ID format',
      });
    }

    // Validation: Message
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'message is required and must be a string',
      });
    }

    const MAX_MESSAGE_LENGTH = 10_000;
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
        details: `Received ${message.length} characters.`,
      });
    }

    if (message.trim().length < 1) {
      return res.status(400).json({
        error: 'Message cannot be empty',
      });
    }

    console.log(`[API] Continuing enrichment session: ${sessionId}`);

    const result = await continueEnrichmentSession(sessionId, message);

    console.log(`[API] Enrichment result: ${result.status}`);

    return res.json(result);
  } catch (error) {
    console.error('[API] Error enriching proposal:', error);

    // Check if error is due to session not found/expired
    if (error instanceof Error && error.message.includes('session not found or expired')) {
      return res.status(404).json({
        error: 'Session not found or expired',
        details: error.message,
      });
    }

    return res.status(500).json({
      error: 'Failed to enrich proposal',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * GET /api/session-stats
 *
 * Get session statistics for monitoring
 *
 * Response:
 * {
 *   "activeSessions": 5,
 *   "sessionTTL": 30
 * }
 */
router.get('/session-stats', (req: Request, res: Response) => {
  try {
    const stats = getSessionStats();
    return res.json(stats);
  } catch (error) {
    console.error('[API] Error getting session stats:', error);
    return res.status(500).json({
      error: 'Failed to get session stats',
    });
  }
});

export default router;
