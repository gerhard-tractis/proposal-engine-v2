import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import extractDesignRouter from './routes/extract-design.js';
import extractTextRouter from './routes/extract-text.js';
import createProposalRouter from './routes/create-proposal.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    service: 'Tractis Proposal Agent API',
    version: '1.0.0',
    status: 'online',
    endpoints: [
      'POST /api/extract-design',
      'POST /api/extract-text',
      'POST /api/create-proposal',
    ],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/extract-design', extractDesignRouter);
app.use('/api/extract-text', extractTextRouter);
app.use('/api/create-proposal', createProposalRouter);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tractis Agent API running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
