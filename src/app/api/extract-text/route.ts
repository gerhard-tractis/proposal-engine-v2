import { NextRequest, NextResponse } from 'next/server';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

/**
 * Tool 2: Text Extraction from Files
 * Extracts plain text from PDF, DOCX, Markdown, TXT files
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Expected: form-data with "file" field' },
        { status: 400 }
      );
    }

    console.log(`[Tool 2] Extracting text from: ${file.name} (${file.type})`);

    // Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text based on file type
    let text = '';
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
      case 'pdf':
        text = await extractFromPDF(buffer);
        break;

      case 'docx':
        text = await extractFromDOCX(buffer);
        break;

      case 'md':
      case 'markdown':
      case 'txt':
        text = buffer.toString('utf-8');
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported file type: ${fileExtension}. Supported: pdf, docx, md, txt` },
          { status: 400 }
        );
    }

    // Clean up text
    text = cleanText(text);

    console.log(`[Tool 2] Extracted ${text.length} characters from ${file.name}`);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: fileExtension,
      text,
      length: text.length,
      extractedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[Tool 2] Text extraction failed:', error);

    return NextResponse.json(
      {
        error: 'Text extraction failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Extract text from PDF
 */
async function extractFromPDF(buffer: Buffer): Promise<string> {
  const pdf = (pdfParse as any).default || pdfParse;
  const data = await pdf(buffer);
  return data.text;
}

/**
 * Extract text from DOCX
 */
async function extractFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/**
 * Clean up extracted text
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    service: 'Tool 2: Text Extraction',
    status: 'online',
    description: 'Extracts plain text from PDF, DOCX, Markdown, TXT files',
    usage: {
      method: 'POST',
      endpoint: '/api/extract-text',
      contentType: 'multipart/form-data',
      body: {
        file: 'File object (PDF/DOCX/MD/TXT)'
      },
      response: {
        success: true,
        fileName: 'proposal.pdf',
        fileType: 'pdf',
        text: 'Extracted text content...',
        length: 5000,
        extractedAt: '2026-02-06T...'
      }
    },
    supportedFormats: ['pdf', 'docx', 'md', 'markdown', 'txt']
  });
}
