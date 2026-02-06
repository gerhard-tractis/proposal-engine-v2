import { Router, type Router as IRouter } from 'express';
import multer from 'multer';

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { customerUrl, clientName } = req.body;
    const file = req.file;

    if (!customerUrl || !clientName || !file) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['customerUrl', 'clientName', 'file'],
      });
    }

    console.log(`[create-proposal] Generating for: ${clientName}`);

    // TODO: Implement full LangChain agent logic
    // For now, return placeholder

    res.json({
      success: true,
      message: 'Proposal generation not yet implemented in Express backend',
      clientName,
      customerUrl,
      note: 'LangChain agent needs to be ported from Next.js API route',
    });
  } catch (error: any) {
    console.error('[create-proposal] Error:', error);
    res.status(500).json({
      error: 'Proposal generation failed',
      message: error.message,
    });
  }
});

export default router;
