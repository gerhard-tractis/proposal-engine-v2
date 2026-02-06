# Tractis Proposal Engine - Turborepo Monorepo

Professional monorepo architecture for the Tractis AI proposal generation platform.

## 📁 Project Structure

```
tractis-proposal-engine-monorepo/
├── apps/
│   ├── web/              # Next.js frontend (deploy to Vercel)
│   └── agent/            # Express backend + LangChain agent (deploy to Railway)
├── packages/
│   └── shared/           # Shared types and utilities
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── turbo.json            # Turborepo build pipeline
└── package.json          # Workspace root
```

## 🚀 Architecture

### Apps

**`apps/web`** - Next.js Frontend
- Proposal viewer UI
- Token-protected routes
- Tractis branding system
- Deploy to: **Vercel**

**`apps/agent`** - Express Backend API
- LangChain agent orchestration
- Design extraction (Dembrandt CLI)
- Text extraction (PDF, DOCX, Markdown, TXT)
- Proposal generation with Groq LLM
- Deploy to: **Railway** (for long-running processes, no timeouts)

### Packages

**`packages/shared`** - Shared Types
- Zod schemas for proposal validation
- TypeScript types shared across apps
- Single source of truth for data structures

## 🛠️ Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 16, React 19, Tailwind CSS, Framer Motion
- **Backend**: Express.js, TypeScript
- **AI/LLM**: LangChain, Groq API (llama-3.3-70b-versatile)
- **Design Extraction**: Dembrandt CLI
- **File Parsing**: pdf-parse, mammoth, multer
- **Type Safety**: TypeScript, Zod

## 📦 Installation

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install all dependencies
pnpm install
```

## 🔧 Development

```bash
# Run both apps concurrently
pnpm dev

# Run web app only
pnpm web:dev

# Run agent API only
pnpm agent:dev
```

### Environment Variables

**`apps/web/.env`** (copy from `.env.example`)
```env
AGENT_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**`apps/agent/.env`** (copy from `.env.example`)
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get your free Groq API key: https://console.groq.com

## 🏗️ Building

```bash
# Build all apps
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

## 🚢 Deployment

### Web App (Vercel)

1. Connect GitHub repo to Vercel
2. Set root directory: `apps/web`
3. Framework preset: Next.js
4. Build command: `cd ../.. && pnpm install && pnpm run build --filter=@repo/web`
5. Environment variables:
   - `AGENT_API_URL=https://your-agent-api.railway.app`

### Agent API (Railway)

1. Create new Railway project
2. Connect GitHub repo
3. Set root directory: `apps/agent`
4. Build command: `cd ../.. && pnpm install && pnpm run build --filter=@repo/agent`
5. Start command: `cd apps/agent && pnpm start`
6. Environment variables:
   - `GROQ_API_KEY=your_groq_api_key`
   - `PORT=3001` (Railway will override this)

## 📚 API Endpoints

**Agent API** (http://localhost:3001)

- `GET /health` - Health check
- `POST /api/extract-design` - Extract design system from URL
- `POST /api/extract-text` - Extract text from file (PDF, DOCX, MD, TXT)
- `POST /api/create-proposal` - Generate branded proposal with LangChain agent

## 🏛️ Why This Architecture?

### Monorepo Benefits
- ✅ Share types across frontend/backend (no duplication)
- ✅ Parallel builds with Turborepo caching
- ✅ Single `pnpm install` for all dependencies
- ✅ Atomic changes across multiple packages

### Separate Deployment Targets
- ✅ **Vercel** for Next.js: Optimized for serverless, instant deploys
- ✅ **Railway** for Express: No timeouts, long-running AI processes
- ✅ Independent scaling based on traffic patterns

### Professional Patterns
- TypeScript strict mode
- Zod runtime validation
- Shared workspace dependencies
- Explicit type annotations
- Clean separation of concerns

## 🧪 Testing Local Integration

1. Start both apps: `pnpm dev`
2. Web app: http://localhost:3000
3. Agent API: http://localhost:3001/health
4. Test design extraction:
   ```bash
   curl -X POST http://localhost:3001/api/extract-design \
     -H "Content-Type: application/json" \
     -d '{"url":"https://tractis.ai"}'
   ```

## 📖 Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [LangChain.js](https://js.langchain.com/)
- [Groq API](https://console.groq.com/docs)

## 🤝 Contributing

This is a professional-grade codebase. Follow these principles:
- Write type-safe code with explicit types
- Validate data at runtime with Zod
- Keep shared types in `packages/shared`
- Update both `.env.example` files when adding new variables
- Test builds before committing: `pnpm build`

---

Built with ❤️ by Tractis AI
