import { NextRequest, NextResponse } from 'next/server';
import { generateProposal } from '@/lib/agent';

/**
 * LangChain Agent Endpoint: Create Branded Proposal
 *
 * This endpoint orchestrates the entire proposal generation:
 * 1. Extracts brand design from customer website
 * 2. Parses proposal content from uploaded file
 * 3. Uses LangChain agent with Groq to structure into 8 sections
 * 4. Returns complete branded proposal
 */

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const customerUrl = formData.get('customerUrl') as string;
    const clientName = formData.get('clientName') as string;
    const file = formData.get('file') as File;

    // Validate inputs
    if (!customerUrl || !clientName || !file) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: {
            customerUrl: 'string (e.g., https://customer.com)',
            clientName: 'string (e.g., Acme Corp)',
            file: 'File (PDF, DOCX, MD, TXT)'
          }
        },
        { status: 400 }
      );
    }

    console.log(`[Agent] Creating proposal for ${clientName} (${customerUrl})`);

    // Step 1: Extract text from file
    console.log('[Agent] Step 1: Extracting text from file...');
    const textResponse = await extractTextFromFile(file);

    if (!textResponse.success) {
      return NextResponse.json(
        { error: 'File extraction failed', details: textResponse },
        { status: 500 }
      );
    }

    const proposalText = textResponse.text;
    console.log(`[Agent] Extracted ${proposalText.length} characters`);

    // Step 2: Run LangChain agent
    console.log('[Agent] Step 2: Running LangChain agent with Groq...');
    const result = await generateProposal({
      customerUrl,
      clientName,
      proposalText,
    });

    console.log('[Agent] Proposal generated successfully!');

    // Parse the agent output (should be JSON)
    let proposalData;
    try {
      proposalData = JSON.parse(result);
    } catch {
      // If agent returns non-JSON, wrap it
      proposalData = { raw: result };
    }

    return NextResponse.json({
      success: true,
      clientName,
      customerUrl,
      proposal: proposalData,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[Agent] Proposal generation failed:', error);

    return NextResponse.json(
      {
        error: 'Proposal generation failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Extract text from uploaded file using Tool 2
 */
async function extractTextFromFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/extract-text`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Text extraction failed: ${response.statusText}`);
  }

  return response.json();
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    service: 'LangChain Agent: Proposal Generator',
    status: 'online',
    description: 'Generates complete branded proposals using LangChain + Groq',
    llm: 'Groq (llama-3.3-70b-versatile)',
    tools: [
      'Tool 1: extract_design_system (from website URL)',
      'Tool 2: structure_proposal_content (8-section structuring)',
    ],
    usage: {
      method: 'POST',
      endpoint: '/api/create-proposal',
      contentType: 'multipart/form-data',
      body: {
        customerUrl: 'https://customer.com (string)',
        clientName: 'Acme Corp (string)',
        file: 'proposal.pdf (File: PDF/DOCX/MD/TXT)'
      },
      response: {
        success: true,
        clientName: 'Acme Corp',
        customerUrl: 'https://customer.com',
        proposal: {
          branding: {
            colors: ['#ff0000', '#0000ff'],
            fonts: ['Inter', 'Roboto']
          },
          proposal: {
            executiveSummary: '...',
            needs: ['...'],
            solution: '...',
            features: [{ title: '...', description: '...', icon: 'Zap' }],
            roadmap: [{ phase: '...', date: '...', description: '...' }],
            whyUs: ['...'],
            pricing: {},
            contact: {}
          }
        },
        generatedAt: '2026-02-06T...'
      }
    },
    requirements: {
      env: 'GROQ_API_KEY required',
      note: 'Free Groq API key from https://console.groq.com'
    }
  });
}
