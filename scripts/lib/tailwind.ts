import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

/**
 * Compile Tailwind CSS for an HTML string using the Tailwind v3 CLI.
 * Returns self-contained HTML with inline <style> and no CDN script tags.
 * Cross-platform: uses temp files instead of /dev/null.
 */
export async function compileTailwind(htmlContent: string): Promise<string> {
  const id = randomBytes(4).toString('hex');
  const tmp = tmpdir();
  const htmlFile = join(tmp, `tw-input-${id}.html`);
  const cssInputFile = join(tmp, `tw-base-${id}.css`);
  const cssOutputFile = join(tmp, `tw-output-${id}.css`);

  try {
    // Write HTML to temp file for Tailwind content scanning
    writeFileSync(htmlFile, htmlContent, 'utf-8');

    // Write minimal Tailwind input CSS
    writeFileSync(cssInputFile, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n', 'utf-8');

    // Run Tailwind CLI v3
    execSync(
      `npx tailwindcss -i "${cssInputFile}" --content "${htmlFile}" --minify -o "${cssOutputFile}"`,
      { timeout: 60_000, stdio: 'pipe' }
    );

    const compiledCss = readFileSync(cssOutputFile, 'utf-8');

    // Remove Tailwind CDN script tags (permissive: any script tag referencing tailwind)
    let html = htmlContent.replace(/<script[^>]*(?:src\s*=\s*["'][^"']*tailwind[^"']*["']|tailwindcss)[^>]*>[\s\S]*?<\/script>/gi, '');

    // Inject compiled CSS before </head>
    const styleBlock = `<style>${compiledCss}</style>`;
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${styleBlock}\n</head>`);
    } else {
      // Fallback: prepend to HTML
      html = styleBlock + '\n' + html;
    }

    return html;
  } finally {
    // Cleanup temp files
    for (const f of [htmlFile, cssInputFile, cssOutputFile]) {
      try { unlinkSync(f); } catch { /* ignore */ }
    }
  }
}
