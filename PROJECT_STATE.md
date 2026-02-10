# Project State - Commercial Engine V2

**Last Updated:** February 10, 2026
**Status:** ✅ Production Ready & Deployed
**Version:** 1.0.0

---

## 🎯 Current State

### Production URLs
- **Web App:** https://proposal.tractis.ai
- **Agent API:** https://repoagent-production-420c.up.railway.app
- **Imperial Proposal (Live):** https://proposal.tractis.ai/proposals/imperial/Zh3zaPJV4U
- **Tractis Demo Proposal:** https://proposal.tractis.ai/proposals/tractis-demo/xK8pQ2mN7v

### Latest Deployment
- **Date:** February 10, 2026
- **Commit:** `c40e601` - Make Imperial proposal fully responsive for mobile devices
- **Result:** ✅ Successful (first try, no issues)
- **Build Time:** 5.1s compile

---

## 📦 What's Built & Working

### ✅ Proposal System (100% Complete)
1. **Two Proposal Types:**
   - **Standard (8-section)** - Variant-based component system
     - Example: tractis-demo proposal
     - Uses `TRACTIS_WHY_US` and `TRACTIS_CONTACT` from fixed-sections
     - Fully typed with Zod validation

   - **Custom** - Fully customized components
     - Example: Imperial (Aureon Connect)
     - Custom component: `imperial-custom.tsx`
     - **FULLY RESPONSIVE** for mobile/tablet/desktop ⭐

2. **Dynamic Branding System:**
   - CSS variables for client-specific theming
   - `generateBrandingCSSVars()` function in `branding.ts`
   - Applies `--brand-primary`, `--brand-accent`, etc.
   - **FIXED:** Client colors now properly applied (was hardcoded)

3. **Token-Protected Routes:**
   - Each proposal has unique token (nanoid 10 chars)
   - URLs: `/proposals/[slug]/[token]`
   - Validates token before rendering

4. **Responsive Design (Imperial):**
   - **Mobile-First:** Optimized for 375px+ screens
   - **Breakpoints:** Tailwind default (sm: 640px, md: 768px, lg: 1024px)
   - **Adaptive Components:**
     - Hero stats: 1 col mobile → 3 cols desktop
     - Sticky header: Logo max 45% width on mobile
     - Solution diagram arrows: Down (↓) mobile, Right (→) desktop
     - Transport systems: 2x2 grid mobile, 1x4 desktop
   - **Clean Mobile UX:** Removed redundant Imperial logo from hero
   - **See:** `RESPONSIVE_DESIGN.md` for complete details

### ✅ Admin Dashboard (100% Complete)
1. **Password Protection:**
   - Password: `tractis2024` (hardcoded, TODO: move to env)
   - Session storage for persistence
   - Login/logout flow

2. **Features:**
   - View all proposals
   - Copy proposal URLs
   - Type badges (Standard 📋 vs Custom ✨)
   - Color swatches for each client
   - Link to view proposal

3. **Location:** `/admin`

### ✅ Agent System (Backend - 80% Complete)
1. **What Works:**
   - Input validation (size limits, format checks)
   - JSON schema validation (Zod for all agent outputs)
   - Session management with TTL (30 min expiry)
   - Completion detection (robust pattern matching)
   - Cleanup worker (removes expired sessions every 5 min)

2. **What's In Progress:**
   - Full workflow integration (agents 1-3 orchestration)
   - Production testing
   - Redis migration (currently in-memory sessions)

3. **Endpoints:**
   - `POST /api/generate-proposal` - Start proposal generation
   - `GET /api/session-stats` - Monitor sessions
   - `GET /health` - Health check

---

## 🗂️ Project Structure

### Key Directories
```
apps/
├── web/                          # Next.js frontend (Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── proposals/[slug]/[token]/
│   │   │   │   ├── page.tsx          # Main proposal page
│   │   │   │   └── layout.tsx        # RESPONSIVE sticky header
│   │   │   └── admin/
│   │   │       └── page.tsx          # Admin dashboard
│   │   ├── components/proposal/
│   │   │   ├── custom/
│   │   │   │   └── imperial-custom.tsx  # RESPONSIVE Imperial component
│   │   │   └── variants/             # Standard proposal variants
│   │   ├── data/
│   │   │   ├── proposals.ts          # ⚠️ CRITICAL: Proposal data storage
│   │   │   └── fixed-sections.ts     # TRACTIS_WHY_US, TRACTIS_CONTACT
│   │   └── lib/
│   │       ├── branding.ts           # Dynamic branding (FIXED)
│   │       └── proposal-helpers.ts   # Zod validation
│   └── public/logos/                 # Client logos
│
├── agent/                        # Express + LangChain (Railway)
│   └── src/
│       ├── routes/
│       │   └── generate-proposal.ts  # API endpoints
│       ├── services/
│       │   ├── proposal-orchestrator.ts  # Session management
│       │   ├── agent-2a-parser.ts
│       │   ├── agent-2b-enrichment.ts
│       │   └── agent-3-designer.ts
│       └── lib/
│           └── agent-schemas.ts      # Zod validation schemas
│
└── packages/shared/              # Shared types
    └── src/types/proposal.ts     # ⚠️ CRITICAL: Type definitions
```

---

## 🚨 CRITICAL FILES (Never Modify Without Understanding)

### proposals.ts
**Location:** `apps/web/src/data/proposals.ts`
**Purpose:** Central storage for all proposal data

**GOLDEN RULE (from VERCEL_DEBUG.md):**
> **NEVER modify the tractis-demo (standard 8-section) proposal when debugging Imperial or Vercel issues.**

**Why?**
- tractis-demo is the **reference implementation** with ALL features
- Has complete businessCase, techStack, contact info, variants
- If Vercel fails: Debug Imperial ONLY, or fix schema, NEVER tractis-demo

**Current Proposals:**
1. **imperial** (slug: 'imperial', token: 'Zh3zaPJV4U')
   - Type: 'customized'
   - customComponent: 'imperial-custom'
   - Colors: primary #f72e3c (red), accent #0c3a63 (navy blue)

2. **tractis-demo** (slug: 'tractis-demo', token: 'xK8pQ2mN7v')
   - Type: 'standard'
   - Full 8-section structure
   - **DO NOT MODIFY**

### proposal.ts (Types)
**Location:** `packages/shared/src/types/proposal.ts`
**Purpose:** Zod schemas and TypeScript types for all proposals

**What's Defined:**
- `Proposal` type and schema
- `ProposalContent` with all sections
- Variant types for each section
- Client branding schema
- VALID_ICON_NAMES whitelist

**When to Modify:**
- Adding new proposal fields
- Adding new variant types
- Adding new icon names

---

## 📚 Documentation Files

### Must-Read Files
1. **RESPONSIVE_DESIGN.md** ⭐ - Complete responsive implementation guide
   - All changes made
   - Breakpoints used
   - Design decisions explained
   - Maintenance guidelines

2. **VERCEL_DEBUG.md** ⚠️ - Deployment troubleshooting
   - GOLDEN RULE: Never modify tractis-demo when debugging
   - Pre-flight checklist
   - Common errors and fixes

3. **VARIANT_SYSTEM.md** - Component variant architecture
   - How variants work
   - Available variants per section
   - How to add new variants

4. **CLAUDE.md** - Claude Code instructions
   - File operation rules (ALWAYS use Write tool)
   - Permission philosophy
   - Development workflow
   - Deployment info

5. **TEST_COVERAGE.md** - Test coverage status
   - Current: 19 tests (branding + admin auth)
   - Pre-existing errors in branding.test.ts (not critical)

6. **CRITICAL_FIXES_APPLIED.md** - All fixes applied
   - Agent implementation fixes
   - Branding system fix
   - Admin authentication
   - Responsive design implementation

### Reference Files
- **README.md** - Main project documentation (updated with current state)
- **DOCUMENTATION.md** - General documentation
- **SESSION_SUMMARY.txt** - Session summaries (if exists)

---

## 🛠️ Tech Stack

### Frontend (apps/web)
- **Framework:** Next.js 16 (App Router)
- **React:** 19
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **UI Components:** shadcn/ui
- **Validation:** Zod
- **Type Safety:** TypeScript (strict mode)
- **Icons:** lucide-react

### Backend (apps/agent)
- **Framework:** Express.js
- **AI/LLM:** LangChain + Groq (llama-3.3-70b-versatile)
- **Design Extraction:** Dembrandt CLI + Puppeteer
- **File Parsing:** pdf-parse, mammoth, multer
- **Validation:** Zod
- **Type Safety:** TypeScript

### Infrastructure
- **Monorepo:** Turborepo + pnpm workspaces
- **Frontend Deploy:** Vercel
- **Backend Deploy:** Railway
- **Version Control:** Git + GitHub

---

## 🔄 Development Workflow

### Starting Development
```bash
pnpm install          # Install dependencies
pnpm dev              # Run both apps
pnpm web:dev          # Web only
pnpm agent:dev        # Agent only
```

### Before Committing
```bash
pnpm type-check       # Check TypeScript
pnpm build            # Production build test
pnpm test:web         # Run tests (19 passing)
```

### Deployment
- **Push to GitHub** → Automatic Vercel deployment (web)
- **Railway** → Connected to GitHub (agent)

---

## ⚠️ Known Issues & TODOs

### High Priority
- [ ] Move admin password to environment variable
- [ ] Add Redis for session storage (currently in-memory)
- [ ] Add rate limiting to agent API
- [ ] Fix pre-existing test errors in branding.test.ts

### Medium Priority
- [ ] Apply responsive design to tractis-demo (standard proposal)
- [ ] Add comprehensive error handling
- [ ] Replace magic constants with config file
- [ ] Add unit tests for agents

### Low Priority
- [ ] Add retry logic for transient API failures
- [ ] Add cost tracking per request
- [ ] Add monitoring/observability

---

## 🎯 Next Steps (When Context Resumes)

### If Working on Responsive Design:
1. Read `RESPONSIVE_DESIGN.md` for all details
2. **Imperial is DONE** - fully responsive ✅
3. Next: Apply same patterns to tractis-demo (standard proposal)
4. Use same breakpoint pattern: `p-6 sm:p-8 md:p-12`

### If Working on Agent System:
1. Read `CRITICAL_FIXES_APPLIED.md` for what's been fixed
2. Focus on orchestration integration
3. Test full workflow (upload → parse → enrich → design)
4. Migrate sessions to Redis before production

### If Debugging Vercel:
1. **READ VERCEL_DEBUG.md FIRST** ⚠️
2. **GOLDEN RULE:** Never modify tractis-demo when debugging Imperial
3. Check build logs for specific error
4. Fix Imperial data OR schema, never tractis-demo

### If Adding New Proposal:
1. Add data to `proposals.ts`
2. Use tractis-demo as reference for standard structure
3. OR create custom component in `components/proposal/custom/`
4. Generate token with `nanoid(10)`
5. Test with `/proposals/[slug]/[token]`

---

## 📞 Contact & Ownership

**Project Lead:** Gerhard Neumann
**Email:** gerhard@tractis.ai
**Company:** Tractis AI

**Current Client:** Imperial (Aureon Connect proposal)
**Status:** Delivered & Live ✅

---

## 🚀 Quick Reference Commands

```bash
# Development
pnpm dev                    # Start both apps
pnpm web:dev                # Web only (localhost:3000)
pnpm agent:dev              # Agent only (localhost:3001)

# Testing
pnpm type-check             # TypeScript check
pnpm build                  # Production build
pnpm test:web               # Run web tests

# Git
git status                  # Check changes
git add <files>             # Stage files
git commit -m "message"     # Commit
git push origin master      # Deploy

# Useful Checks
find . -name "*.md"         # Find all docs
git diff                    # See changes
git log -1 --stat           # Last commit details
```

---

**This document provides a complete snapshot of the project state. Use it to quickly restore context after compaction or session breaks.**
