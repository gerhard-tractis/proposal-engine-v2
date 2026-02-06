import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Agent 1: Brand Extraction Tool
 * Extracts design system (colors, fonts, spacing) from any website using Dembrandt
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request. Expected: { url: "https://example.com" }' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`[Agent 1] Extracting design system from: ${url}`);

    // Run Dembrandt extraction
    const { stdout, stderr } = await execAsync(`dembrandt ${url}`, {
      timeout: 60000, // 60 second timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    // Parse Dembrandt output
    const designSystem = parseDembrandtOutput(stdout);

    console.log(`[Agent 1] Successfully extracted design from ${url}`);

    return NextResponse.json({
      success: true,
      url,
      designSystem,
      extractedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[Agent 1] Extraction failed:', error);

    return NextResponse.json(
      {
        error: 'Design extraction failed',
        message: error.message,
        details: error.stderr || error.stdout,
      },
      { status: 500 }
    );
  }
}

/**
 * Parse Dembrandt CLI output and extract structured data
 */
function parseDembrandtOutput(output: string) {
  // Dembrandt outputs structured text - parse key sections
  const result: any = {
    colors: [],
    typography: {},
    spacing: [],
    shadows: [],
    buttons: [],
    raw: output,
  };

  try {
    // Extract colors (look for hex codes)
    const colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
    const colors = output.match(colorRegex);
    if (colors) {
      result.colors = [...new Set(colors)]; // Remove duplicates
    }

    // Extract RGB colors
    const rgbRegex = /rgb\([^)]+\)/g;
    const rgbColors = output.match(rgbRegex);
    if (rgbColors) {
      result.rgbColors = [...new Set(rgbColors)];
    }

    // Extract font families
    const fontRegex = /(?:Manrope|Inter|Roboto|Arial|Helvetica|ui-monospace|system-ui|sans-serif|serif|monospace)/g;
    const fonts = output.match(fontRegex);
    if (fonts) {
      result.typography.fonts = [...new Set(fonts)];
    }

    // Extract spacing values (look for px values)
    const spacingRegex = /(\d+)px/g;
    const spacing = [...output.matchAll(spacingRegex)].map(m => m[1]);
    if (spacing.length > 0) {
      result.spacing = [...new Set(spacing)].sort((a, b) => Number(a) - Number(b));
    }

    // Extract primary gold color (Tractis specific)
    const goldColors = result.colors.filter((c: string) =>
      c.toLowerCase().match(/[cd]f[ab][0-9a-f]3[0-9]/)
    );
    if (goldColors.length > 0) {
      result.primaryGold = goldColors[0];
    }

  } catch (parseError) {
    console.error('[Agent 1] Parse error:', parseError);
  }

  return result;
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    service: 'Agent 1: Brand Extraction Tool',
    status: 'online',
    description: 'Extracts design system from websites using Dembrandt',
    usage: {
      method: 'POST',
      endpoint: '/api/extract-design',
      body: {
        url: 'https://example.com'
      },
      response: {
        success: true,
        url: 'https://example.com',
        designSystem: {
          colors: ['#dfb030', '#5e6b7b'],
          typography: { fonts: ['Inter', 'Manrope'] },
          spacing: ['8', '16', '24'],
          shadows: [],
        },
        extractedAt: '2026-02-06T...'
      }
    }
  });
}
