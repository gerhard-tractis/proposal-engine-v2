import { Router, type Router as IRouter } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import puppeteer from 'puppeteer';

const router: IRouter = Router();
const execAsync = promisify(exec);

// Extract favicon from a URL using Puppeteer
async function extractFavicon(url: string): Promise<string | null> {
  let browser = null;
  try {
    console.log(`[extract-favicon] Launching browser for: ${url}`);

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Try to find favicon in HTML
    const faviconUrl = await page.evaluate((baseUrl) => {
      // Try multiple selectors for favicon
      const selectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]',
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const href = element.getAttribute('href');
          if (href) {
            // Convert relative URLs to absolute
            if (href.startsWith('http')) {
              return href;
            } else if (href.startsWith('//')) {
              return `https:${href}`;
            } else if (href.startsWith('/')) {
              return `${baseUrl}${href}`;
            } else {
              return `${baseUrl}/${href}`;
            }
          }
        }
      }

      // Fallback to /favicon.ico
      return `${baseUrl}/favicon.ico`;
    }, new URL(url).origin);

    console.log(`[extract-favicon] Found: ${faviconUrl}`);
    return faviconUrl;

  } catch (error: any) {
    console.error('[extract-favicon] Error:', error.message);
    // Return fallback
    const origin = new URL(url).origin;
    return `${origin}/favicon.ico`;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`[extract-design] Extracting from: ${url}`);

    // Run both extractions in parallel
    const [dembrandtResult, faviconUrl] = await Promise.all([
      execAsync(`dembrandt ${url}`, {
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024,
      }).catch((err) => ({ stdout: '', stderr: err.message })),
      extractFavicon(url),
    ]);

    // Parse colors from dembrandt output
    const colorRegex = /#([0-9a-fA-F]{6})/g;
    const colors = [...new Set(dembrandtResult.stdout.match(colorRegex) || [])];

    res.json({
      success: true,
      url,
      designSystem: {
        colors,
        favicon: faviconUrl,
        raw: dembrandtResult.stdout.substring(0, 1000), // First 1000 chars
      },
      extractedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[extract-design] Error:', error);
    res.status(500).json({
      error: 'Design extraction failed',
      message: error.message,
    });
  }
});

export default router;
