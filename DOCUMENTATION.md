# Tractis Commercial Engine V2 - Complete Documentation

**Last Updated:** February 5, 2026
**Status:** Variant System Implemented, AI Agent Pending

---

## 📚 Quick Reference

**Live Deployments:**
- Frontend: https://proposal.tractis.ai
- Backend: https://repoagent-production-420c.up.railway.app

**Local Development:**
- Frontend: http://localhost:3001
- Backend: http://localhost:3002
- Admin Panel: http://localhost:3001/admin
- Test Proposal: http://localhost:3001/proposals/tractis-demo/xK8pQ2mN7v

**Key Documentation Files:**
- `DOCUMENTATION.md` (this file) - Complete system documentation
- `VARIANT_SYSTEM.md` - Dynamic component variant architecture
- `apps/web/src/components/proposal/variants/README.md` - Developer guide for creating variants
- `apps/agent/docs/VARIANT_SELECTION_GUIDE.md` - AI agent decision logic

---

## 🏗️ System Architecture

### High-Level Flow

```
User (Admin Panel)
    ↓
    Upload Documents + Website URL
    ↓
Backend API (Express + LangChain)
    ↓
    [1] Web Scraping (Puppeteer + Dembrandt)
    [2] Document Parsing (pdf-parse, mammoth)
    [3] AI Proposal Generation (LangChain + Groq) ← TODO
    [4] Variant Selection (AI logic) ← TODO
    ↓
Proposal Storage (In-Memory → Future: PostgreSQL)
    ↓
Branded Proposal Page (Next.js SSR)
    ↓
Share with Client (Unique URL)
```

### Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v3 |
| Backend | Express.js, TypeScript (ESM) |
| AI/LLM | LangChain, Groq (TODO) |
| Web Scraping | Puppeteer, Dembrandt CLI |
| UI Library | Radix UI, shadcn/ui, Framer Motion |
| Validation | Zod (runtime + types) |
| Monorepo | Turborepo, pnpm workspaces |
| Deployment | Vercel (frontend), Railway (backend) |

---

## ✅ Completed Features (Current Session)

### 1. Web Scraping & Design Extraction ✅

**Functionality:**
- Extracts color palette from websites using Dembrandt CLI
- Extracts favicon using Puppeteer
- Runs both in parallel for performance

**API Endpoint:**
```bash
POST https://repoagent-production-420c.up.railway.app/api/extract-design

Request:
{
  "url": "https://www.easy.cl"
}

Response:
{
  "success": true,
  "designSystem": {
    "colors": ["#1a73e8", "#34a853", ...],
    "favicon": "https://www.easy.cl/favicon.ico"
  },
  "extractedAt": "2026-02-05T..."
}
```

**Implementation:**
- File: `apps/agent/src/routes/extract-design.ts`
- Uses Puppeteer to scrape HTML and extract favicon URLs
- Uses Dembrandt CLI to analyze CSS and extract colors
- Tested successfully with https://www.easy.cl

### 2. Branded Proposal Pages ✅

**Features:**
- Dynamic routes: `/proposals/[slug]/[token]`
- Client logo displayed in header (with Tractis fallback)
- Client favicon in browser tab (with Tractis fallback)
- Client colors applied via CSS variables throughout page
- 8 proposal sections with professional UI
- Mobile responsive design
- Dark mode themed
- Framer Motion animations
- Error boundaries for resilience
- SEO: noindex, nofollow (proposals are private)

**Implementation:**
- Layout: `apps/web/src/app/proposals/[slug]/[token]/layout.tsx`
- Page: `apps/web/src/app/proposals/[slug]/[token]/page.tsx`
- Logo Fallback: `apps/web/src/components/proposal/logo-with-fallback.tsx`
- Branding Logic: `apps/web/src/lib/branding.ts`

**8 Proposal Sections:**
1. Executive Summary
2. Understanding Needs
3. Solution
4. Features
5. Roadmap
6. Why Us
7. Pricing
8. Contact

### 3. Admin Panel UI ✅

**Features:**
- Form at `/admin` for proposal creation
- Custom dark mode Input component
- Custom FileUpload component (drag & drop with preview)
- Form validation
- Dark mode styled throughout

**Implementation:**
- Page: `apps/web/src/app/admin/page.tsx`
- Input Component: `apps/web/src/components/ui/input.tsx`
- FileUpload Component: `apps/web/src/components/ui/file-upload.tsx`

**TODO:**
- Connect to backend API
- Add loading states
- Handle errors
- Redirect to generated proposal

### 4. Dynamic Component Variant System ✅

**Purpose:**
Allow AI agent to choose different UI presentations for each section based on proposal content (length, structure, complexity, industry).

**Architecture:**
- **Schema** (`packages/shared/src/types/proposal.ts`): Defines 32 variant options (8 sections × 4 variants each)
- **Variant Mapper** (`apps/web/src/lib/variant-mapper.tsx`): Maps variant names to React components
- **Dynamic Selection** (proposal page): Selects component based on variant field in proposal data

**Variant Options:**

| Section | brief/default | variant 2 | variant 3 | variant 4 | Built |
|---------|--------------|-----------|-----------|-----------|-------|
| Executive Summary | brief | **detailed** | visual | timeline | ✅ detailed |
| Understanding Needs | list | grid | cards | timeline | 🚧 |
| Solution | narrative | structured | visual | comparison | 🚧 |
| Features | grid | list | showcase | tabbed | 🚧 |
| Roadmap | timeline | phases | gantt | milestones | 🚧 |
| Why Us | list | grid | testimonial | stats | 🚧 |
| Pricing | tiers | table | custom | simple | 🚧 |
| Contact | standard | card | inline | footer | 🚧 |

**Example Variant:**
- `ExecutiveSummaryDetailed` (`apps/web/src/components/proposal/variants/executive-summary-detailed.tsx`)
- Splits content into visual cards
- Adds icons for hierarchy
- Best for 200+ word summaries

**AI Selection Logic:**
See `apps/agent/docs/VARIANT_SELECTION_GUIDE.md` for complete decision trees.

Example:
```
IF executiveSummary.length >= 200 words AND has multiple paragraphs:
    → Use "detailed" variant
ELSE:
    → Use "brief" variant (default)
```

### 5. Deployment ✅

**Frontend (Vercel):**
- URL: https://proposal.tractis.ai
- Build Command: `cd ../.. && pnpm install && pnpm --filter=@repo/web build`
- Root Directory: `apps/web`
- Framework: Next.js
- Auto-deploys from GitHub

**Backend (Railway):**
- URL: https://repoagent-production-420c.up.railway.app
- Start Command: `pnpm start`
- Binds to `0.0.0.0` (required for Railway)
- PORT auto-assigned by Railway (do NOT hardcode)
- Auto-deploys from GitHub

**Deployment Challenges Solved:**
1. **Vercel dependency pruning** → Hoisted build dependencies to root
2. **Railway 502 errors** → Changed from localhost to 0.0.0.0 binding
3. **Railway container restarts** → Removed hardcoded PORT env var
4. **Tailwind CSS not working** → Removed custom PostCSS config
5. **TypeScript build errors** → Fixed type casting and DOM types

### 6. Type Safety ✅

**Zod Schemas:**
- File: `packages/shared/src/types/proposal.ts`
- Single source of truth for types
- Runtime validation + TypeScript types derived from schemas
- Validates:
  - Icon names (whitelist to prevent runtime errors)
  - Color formats (hex, rgb, hsl, oklch)
  - URLs (logo, favicon, calendly)
  - Variant names (enum validation)

**Example:**
```typescript
import { ProposalSchema } from '@repo/shared';

const result = ProposalSchema.safeParse(proposalData);
if (!result.success) {
  console.error('Validation failed:', result.error);
}
```

---

## 🚧 Pending Implementation

### 1. AI Proposal Generation Agent (High Priority)

**Goal:** Build LangChain agent that generates proposals from uploaded documents.

**Tasks:**
- [ ] Set up Groq API integration
- [ ] Implement document parsing (PDF, Word, text)
- [ ] Design prompt template for proposal generation
- [ ] Implement variant selection logic (use decision guide)
- [ ] Create `POST /api/generate-proposal` endpoint
- [ ] Test with sample documents

**File:** `apps/agent/src/routes/generate-proposal.ts` (TODO)

### 2. Connect Admin Form to Backend (Medium Priority)

**Tasks:**
- [ ] Submit form to `/api/generate-proposal`
- [ ] Handle file upload (multipart/form-data)
- [ ] Show loading state during generation
- [ ] Display errors if generation fails
- [ ] Redirect to generated proposal on success

**File:** `apps/web/src/app/admin/page.tsx` (update)

### 3. Build Additional Variants (As Needed)

**Strategy:** Build incrementally based on usage patterns

**Priority 1 (Commonly Selected):**
- [ ] UnderstandingNeedsGrid (for 6+ needs)
- [ ] FeaturesSectionShowcase (for 1-3 hero features)
- [ ] WhyUsStats (for metrics-driven proposals)

**Priority 2 (Industry-Specific):**
- [ ] SolutionStructured (for multi-component solutions)
- [ ] RoadmapPhases (for grouped deliverables)

**Priority 3 (Advanced):**
- [ ] ExecutiveSummaryVisual (for graphic-heavy proposals)
- [ ] RoadmapGantt (for parallel workstreams)

### 4. Database Integration (Medium Priority)

**Goal:** Replace in-memory storage with PostgreSQL

**Tasks:**
- [ ] Set up PostgreSQL database
- [ ] Design schema (proposals table)
- [ ] Implement CRUD operations
- [ ] Migrate test data
- [ ] Update proposal helpers to query database

### 5. Production Features (Low Priority)

- [ ] Analytics (track proposal views)
- [ ] PDF export functionality
- [ ] Email notifications when proposal is viewed
- [ ] Custom domains for white-label
- [ ] Access logs and security

---

## 📂 Project Structure

```
Commercial-Engine-V2/
├── apps/
│   ├── web/                              # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── admin/page.tsx        # ✅ Admin form
│   │   │   │   ├── proposals/[slug]/[token]/
│   │   │   │   │   ├── layout.tsx        # ✅ Branded layout
│   │   │   │   │   └── page.tsx          # ✅ Dynamic proposal
│   │   │   │   ├── globals.css           # ✅ Tailwind + vars
│   │   │   │   └── layout.tsx            # ✅ Root layout
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── button.tsx        # ✅ shadcn
│   │   │   │   │   ├── input.tsx         # ✅ Dark mode
│   │   │   │   │   └── file-upload.tsx   # ✅ Custom
│   │   │   │   └── proposal/
│   │   │   │       ├── executive-summary.tsx         # ✅
│   │   │   │       ├── understanding-needs.tsx       # ✅
│   │   │   │       ├── solution.tsx                  # ✅
│   │   │   │       ├── features-section.tsx          # ✅
│   │   │   │       ├── roadmap.tsx                   # ✅
│   │   │   │       ├── why-us.tsx                    # ✅
│   │   │   │       ├── pricing-section.tsx           # ✅
│   │   │   │       ├── contact-section.tsx           # ✅
│   │   │   │       ├── logo-with-fallback.tsx        # ✅
│   │   │   │       ├── proposal-error-boundary.tsx   # ✅
│   │   │   │       └── variants/
│   │   │   │           ├── README.md                 # ✅ Dev guide
│   │   │   │           └── executive-summary-detailed.tsx  # ✅
│   │   │   ├── lib/
│   │   │   │   ├── utils.ts              # ✅ cn() utility
│   │   │   │   ├── branding.ts           # ✅ CSS vars
│   │   │   │   ├── proposal-helpers.ts   # ✅ Get proposal
│   │   │   │   └── variant-mapper.tsx    # ✅ Dynamic components
│   │   │   └── data/
│   │   │       └── proposals.ts          # ✅ Test data
│   │   ├── public/
│   │   │   ├── logos/
│   │   │   │   ├── tractis-white.svg     # ✅ Fallback
│   │   │   │   └── tractis-color.svg     # ✅ Branded
│   │   │   ├── favicon.png               # ✅ Tractis favicon
│   │   │   └── robots.txt                # ✅ SEO
│   │   ├── tailwind.config.ts            # ✅ Tailwind v3
│   │   ├── next.config.ts                # ✅ Config
│   │   └── package.json
│   │
│   └── agent/                            # Express.js Backend
│       ├── src/
│       │   ├── server.ts                 # ✅ Main server
│       │   ├── routes/
│       │   │   ├── health.ts             # ✅ Health check
│       │   │   ├── extract-design.ts     # ✅ Web scraping
│       │   │   └── generate-proposal.ts  # 🚧 TODO: AI agent
│       │   └── utils/
│       │       └── document-parser.ts    # 🚧 TODO: PDF/Word
│       ├── docs/
│       │   └── VARIANT_SELECTION_GUIDE.md  # ✅ AI decision guide
│       └── package.json
│
├── packages/
│   └── shared/                           # Shared Types
│       ├── src/
│       │   ├── types/
│       │   │   └── proposal.ts           # ✅ Zod schemas
│       │   └── index.ts                  # ✅ Exports
│       └── package.json
│
├── DOCUMENTATION.md                      # ✅ This file
├── VARIANT_SYSTEM.md                     # ✅ Variant architecture
├── turbo.json                            # ✅ Turborepo config
├── pnpm-workspace.yaml                   # ✅ pnpm workspaces
└── package.json                          # ✅ Root dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Git

### Installation

```bash
# Clone repository
git clone <repo-url>
cd Commercial-Engine-V2

# Install all dependencies
pnpm install

# Start both frontend and backend
pnpm dev
```

This starts:
- **Frontend:** http://localhost:3001
- **Backend:** http://localhost:3001

### Access Points

| Page | URL |
|------|-----|
| Homepage | http://localhost:3001 |
| Admin Panel | http://localhost:3001/admin |
| Test Proposal | http://localhost:3001/proposals/tractis-demo/xK8pQ2mN7v |
| API Health | http://localhost:3002/health |
| API Design Extraction | http://localhost:3002/api/extract-design |

---

## 🛠️ Development Workflow

### Run Specific Apps

```bash
# Frontend only
pnpm --filter=@repo/web dev

# Backend only
pnpm --filter=@repo/agent dev
```

### Type Checking

```bash
# Check all packages
pnpm type-check

# Check specific package
pnpm --filter=@repo/web type-check
pnpm --filter=@repo/agent type-check
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter=@repo/web build
pnpm --filter=@repo/agent build
```

---

## 🌐 API Endpoints

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-05T12:34:56.789Z",
  "environment": "production"
}
```

### Extract Design

```
POST /api/extract-design
Content-Type: application/json
```

**Request:**
```json
{
  "url": "https://www.easy.cl"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://www.easy.cl",
  "designSystem": {
    "colors": ["#1a73e8", "#34a853", "#fbbc04"],
    "favicon": "https://www.easy.cl/favicon.ico",
    "raw": "Dembrandt CLI output..."
  },
  "extractedAt": "2026-02-05T12:34:56.789Z"
}
```

### Generate Proposal (TODO)

```
POST /api/generate-proposal
Content-Type: multipart/form-data
```

**Request:**
```
clientName: "Acme Corp"
websiteUrl: "https://acme.com"
documents: [file1.pdf, file2.docx]
```

**Response:** TBD when agent is built

---

## 🔧 Environment Variables

### Frontend (apps/web)

No environment variables required for current implementation.

### Backend (apps/agent)

**Development:**
```bash
NODE_ENV=development
```

**Production (Railway):**
```bash
NODE_ENV=production
# PORT is auto-assigned by Railway - DO NOT SET MANUALLY
```

**Future (when AI agent is built):**
```bash
GROQ_API_KEY=gsk_...
DATABASE_URL=postgresql://...
```

---

## 🎨 Variant System Details

See `VARIANT_SYSTEM.md` for comprehensive documentation.

### Quick Overview

**Purpose:** AI agent chooses UI variants based on proposal content.

**Total Variants:** 32 (8 sections × 4 options)

**Currently Built:** 1 (ExecutiveSummaryDetailed)

**How It Works:**

1. AI agent analyzes proposal content (length, structure, complexity)
2. Agent selects appropriate variant for each section using decision trees
3. Variant field added to proposal JSON (e.g., `executiveSummaryVariant: "detailed"`)
4. Frontend dynamically renders selected component

**Example:**

```typescript
// AI analyzes: "This executive summary is 300 words with 3 paragraphs"
// AI selects: "detailed" variant

// In proposal JSON:
{
  "executiveSummary": "We're proposing...",
  "executiveSummaryVariant": "detailed"
}

// Frontend renders:
const Component = getExecutiveSummaryComponent("detailed");
// Result: ExecutiveSummaryDetailed component renders
```

---

## 🐛 Troubleshooting

### Vercel Build Fails with Missing Dependencies

**Symptoms:** Build logs show dependencies being removed (prefixed with `-`)

**Cause:** `pnpm --filter` prunes dependencies not directly referenced in filtered package

**Solution:** Hoist build dependencies to root `package.json`

```json
// root package.json
{
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "typescript": "^5.7.3"
  }
}
```

### Railway Returns 502 Bad Gateway

**Symptoms:** Health check fails, Railway proxy can't connect

**Cause:** Server binding to `localhost` instead of `0.0.0.0`

**Solution:** Bind to all network interfaces

```typescript
// apps/agent/src/server.ts
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port', PORT);
});
```

### Railway Container Keeps Restarting

**Symptoms:** Container starts then immediately gets SIGTERM

**Cause:** `PORT` environment variable hardcoded, conflicts with Railway's auto-assigned port

**Solution:** Remove PORT from Railway environment variables. Let Railway auto-assign.

```typescript
// Correct port handling:
const PORT = Number(process.env.PORT) || 3001;
```

### Tailwind Styles Not Applying

**Symptoms:** White backgrounds, no styling

**Cause:** Custom PostCSS config interfering with Next.js

**Solution:** Remove custom `postcss.config.js` - Next.js handles Tailwind automatically

### Logo or Favicon Not Loading

**Symptoms:** 404 errors or broken images

**Cause:** Invalid file path or file doesn't exist

**Solution:**
1. Check Zod validation errors in console
2. Verify files exist in `public/logos/`
3. Ensure paths start with `/` for local files
4. Use full URLs for external images

---

## 📝 Key Learnings from This Session

### 1. Tailwind v4 Issues in Monorepos

- Tailwind v4 has module resolution issues with Turbopack
- Solution: Use Tailwind v3 with traditional config
- Converted from `@import "tailwindcss"` to `@tailwind` directives
- Converted colors from `oklch()` to `hsl()` for v3 compatibility

### 2. pnpm Workspaces with Filtered Builds

- `pnpm --filter` aggressively prunes dependencies
- Hoist shared build dependencies to root
- Use `cd ../.. && pnpm install && pnpm --filter=@repo/web build` pattern

### 3. Railway Deployment Specifics

- Must bind to `0.0.0.0` not `localhost`
- Never hardcode PORT in environment variables
- Convert `process.env.PORT` to number explicitly

### 4. Next.js Image Component with External URLs

- Need to configure `remotePatterns` in `next.config.ts`
- Fallback images require client-side state management
- Use `onError` handler for graceful degradation

### 5. Variant Architecture Design

- Define all variants upfront in schema
- Build component variants incrementally
- Use helper functions for dynamic component selection
- Document decision logic for AI agent

---

## 📞 Support

**Project Lead:** Gerhard Neumann
**Email:** gerhard@tractis.ai

---

## 🗺️ Roadmap

### Phase 1: Foundation (✅ COMPLETE)
- [x] Monorepo setup
- [x] Frontend proposal display
- [x] Admin panel UI
- [x] Web scraping + design extraction
- [x] Variant system architecture
- [x] Deployment (Vercel + Railway)

### Phase 2: AI Agent (NEXT)
- [ ] LangChain integration
- [ ] Document parsing
- [ ] Proposal generation
- [ ] Variant selection logic
- [ ] Admin form backend integration

### Phase 3: Production Features
- [ ] Database integration
- [ ] Analytics
- [ ] PDF export
- [ ] Email notifications

### Phase 4: Advanced Features
- [ ] Multi-language support
- [ ] A/B testing for variants
- [ ] White-label branding
- [ ] Custom domains

---

**End of Documentation**
**Last Updated:** February 5, 2026
**Next Session:** Build LangChain Proposal Generation Agent
