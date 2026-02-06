import { Router, type Router as IRouter } from 'express';
import multer from 'multer';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

    console.log(`[extract-text] Processing: ${file.originalname}`);

    let text = '';

    switch (fileExtension) {
      case 'pdf':
        const pdf = (pdfParse as any).default || pdfParse;
        const pdfData = await pdf(file.buffer);
        text = pdfData.text;
        break;

      case 'docx':
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        text = result.value;
        break;

      case 'md':
      case 'txt':
        text = file.buffer.toString('utf-8');
        break;

      default:
        return res.status(400).json({
          error: `Unsupported file type: ${fileExtension}`,
        });
    }

    res.json({
      success: true,
      fileName: file.originalname,
      fileType: fileExtension,
      text,
      length: text.length,
      extractedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[extract-text] Error:', error);
    res.status(500).json({
      error: 'Text extraction failed',
      message: error.message,
    });
  }
});

export default router;
