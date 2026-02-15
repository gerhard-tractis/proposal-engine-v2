# Tractis Proposal Engine - Turborepo Monorepo

Professional monorepo architecture for the Tractis AI proposal generation platform.

## 🎯 Current Status

**Production URLs:**
- **Web App:** https://proposal.tractis.ai
- **Agent API:** https://repoagent-production-420c.up.railway.app
- **Imperial Proposal (Live):** https://proposal.tractis.ai/proposals/imperial/Zh3zaPJV4U

**Latest Updates:**
- ✅ **Responsive Design Complete** (Feb 10, 2026) - Imperial proposal fully optimized for mobile/tablet/desktop
- ✅ **Admin Dashboard** - Password-protected proposal management
- ✅ **Custom Proposals** - Imperial (Aureon Connect) with custom component
- ✅ **Standard Proposals** - 8-section structure with variant system

**Key Documentation:**
- `RESPONSIVE_DESIGN.md` - Complete responsive design implementation guide
- `VERCEL_DEBUG.md` - Deployment troubleshooting (CRITICAL: never modify tractis-demo when debugging)
- `VARIANT_SYSTEM.md` - Component variant architecture
- `TEST_COVERAGE.md` - Test coverage status

## 📁 Project Structure

```
tractis-proposal-engine-monorepo/
├── apps/
│   ├── web/              # Next.js frontend (deploy to Vercel)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── proposals/[slug]/[token]/  # Dynamic proposal routes
│   │   │   │   └── admin/                     # Admin dashboard (password-protected)
│   │   │   ├── components/
│   │   │   │   └── proposal/
│   │   │   │       ├── custom/                # Custom proposal components
│   │   │   │       │   └── imperial-custom.tsx  # RESPONSIVE: Imperial Aureon Connect
│   │   │   │       └── variants/              # Standard proposal variants
│   │   │   ├── data/
│   │   │   │   └── proposals.ts               # Proposal data storage
│   │   │   └── lib/
│   │   │       └── branding.ts                # Dynamic branding system
│   └── agent/            # Express backend + LangChain agent (deploy to Railway)
├── packages/
│   └── shared/           # Shared types and utilities
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── turbo.json            # Turborepo build pipeline
└── package.json          # Workspace root
```

## ✨ Features

### Proposal System
- **Dynamic Branding** - CSS variables for client-specific theming
- **Token-Protected Routes** - Secure proposal access via unique tokens
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **Two Proposal Types:**
  - **Standard (8-section)** - Variant-based components for consistent structure
  - **Custom** - Fully customized components (e.g., Imperial Aureon Connect)

### Admin Dashboard
- **Password Protection** - Session-based authentication
- **Proposal Management** - View, manage, and copy proposal URLs
- **Visual Indicators** - Badges to distinguish Standard vs Custom proposals
- **Type Checking** - All proposals validated with Zod at runtime

### Responsive Features (Imperial Proposal)
- **Mobile-First Design** - Optimized for 375px+ screens
- **Adaptive Components:**
  - Hero section with responsive stats grid (1 col → 3 cols)
  - Sticky header with logo constraint (max 45% width on mobile)
  - Solution diagram arrows (down on mobile, right on desktop)
  - 2x2 grid for transport systems on mobile
  - Responsive typography and spacing throughout
- **Clean Mobile UX** - Removed redundant branding, simplified CTA
- **Touch-Friendly** - Proper spacing and button sizes for mobile

### AI Agent (In Progress)
- **Design Extraction** - Scrape brand colors, fonts, and logos from websites
- **Text Extraction** - Parse PDF, DOCX, Markdown, and TXT files
- **Proposal Generation** - LangChain + Groq LLM for content generation

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

# Run web app only (runs on port 3001)
pnpm web:dev

# Run agent API only
pnpm agent:dev
```

**Development Server Ports:**
- **Web App:** http://localhost:3001 (configured in package.json)
- **Agent API:** http://localhost:3002 (or as configured in .env)

### Environment Variables

**`apps/web/.env`** (copy from `.env.example`)
```env
AGENT_API_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**`apps/agent/.env`** (copy from `.env.example`)
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3002
NEXT_PUBLIC_APP_URL=http://localhost:3001
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

**Agent API** (http://localhost:3002)

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
2. Web app: http://localhost:3001
3. Agent API: http://localhost:3002/health
4. Test design extraction:
   ```bash
   curl -X POST http://localhost:3002/api/extract-design \
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
