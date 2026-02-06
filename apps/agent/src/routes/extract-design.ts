import { Router, type Router as IRouter } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const router: IRouter = Router();
const execAsync = promisify(exec);

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`[extract-design] Extracting from: ${url}`);

    const { stdout } = await execAsync(`dembrandt ${url}`, {
      timeout: 60000,
      maxBuffer: 10 * 1024 * 1024,
    });

    // Parse colors from output
    const colorRegex = /#([0-9a-fA-F]{6})/g;
    const colors = [...new Set(stdout.match(colorRegex))];

    res.json({
      success: true,
      url,
      designSystem: {
        colors,
        raw: stdout.substring(0, 1000), // First 1000 chars
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
