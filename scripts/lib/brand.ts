import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface DembrandtResult {
  colors: string[];
  favicon: string | null;
  raw: string;
}

/**
 * Scrape brand colors and favicon from a URL using Dembrandt CLI
 * and simple HTML fetch for favicon extraction.
 */
export async function scrapeBrand(url: string): Promise<DembrandtResult> {
  let raw = '';
  let colors: string[] = [];

  // Run Dembrandt via npx using the version installed in apps/agent
  try {
    const agentDir = resolve(__dirname, '../../apps/agent');
    raw = execSync(`npx --prefix "${agentDir}" dembrandt "${url}"`, {
      timeout: 60_000,
      maxBuffer: 10 * 1024 * 1024,
      encoding: 'utf-8',
      cwd: agentDir,
    });

    // Extract hex colors from output
    const matches = raw.match(/#([0-9a-fA-F]{6})/g);
    if (matches) {
      colors = [...new Set(matches)];
    }
  } catch (err) {
    console.warn('Dembrandt failed, continuing with empty colors:', (err as Error).message);
  }

  // Extract favicon via simple HTTP fetch + regex (no Puppeteer)
  let favicon: string | null = null;
  try {
    const res = await fetch(url);
    const html = await res.text();
    const match = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i);
    if (match?.[1]) {
      favicon = match[1];
      // Resolve relative URLs
      if (favicon.startsWith('/')) {
        const origin = new URL(url).origin;
        favicon = `${origin}${favicon}`;
      } else if (!favicon.startsWith('http')) {
        const base = url.endsWith('/') ? url : `${url}/`;
        favicon = `${base}${favicon}`;
      }
    }
  } catch (err) {
    console.warn('Favicon extraction failed:', (err as Error).message);
  }

  return { colors, favicon, raw };
}
