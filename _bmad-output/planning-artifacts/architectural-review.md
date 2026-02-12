# Architectural Review: Tractis Commercial Engine V2

**Date:** 2026-02-10
**Reviewer:** Winston (Architect Agent)
**Status:** Complete — Exhaustive Codebase Review

---

## Executive Summary

The Tractis Commercial Engine V2 is an AI-powered proposal generation platform deployed as a monorepo (Turborepo + pnpm). The frontend (Next.js 16, Vercel) renders dynamic proposals with client branding, while the backend (Express + LangChain, Railway) runs a 3-agent AI pipeline to parse, enrich, and design proposals.

The architecture is fundamentally sound. The monorepo structure, shared type system, AI pipeline decomposition, and variant-based component architecture are all well-considered decisions. However, there are critical gaps around **schema drift between apps**, **lack of persistent storage**, and **missing backend security** that must be addressed before scaling.

---

## What's Working Well

### 1. Monorepo Structure
- Turborepo + pnpm workspaces with clean separation: `apps/web`, `apps/agent`, `packages/shared`
- `@repo/shared` as single source of truth for Zod schemas
- Types derived via `z.infer<>` — runtime validation and compile-time types stay in sync
- `workspace:*` protocol enables hot-reload during development

### 2. Three-Agent AI Pipeline
- **Agent 2A (Groq/Llama 3.3-70b):** Fast, free document parsing into 8 proposal sections
- **Agent 2B (Claude Sonnet 4.5):** Interactive enrichment for missing/weak sections
- **Agent 3 (Claude Sonnet 4.5):** Variant selection and proposal finalization
- Good cost/quality tradeoff — Groq for mechanical work, Claude for nuanced work
- Enrichment is interactive (user-guided) rather than auto-filled

### 3. Variant System Architecture
- 8 sections x 4 variants each = 32 possible UI combinations
- Schema-driven with variant mapper for dynamic component selection
- Extensible design — adding new variants follows a clear 4-step process
- Only 1 of 31 non-default variants is built, but the architecture is ready

### 4. Security Posture (Frontend)
- Security headers (X-Frame-Options, X-Content-Type-Options, Permissions-Policy)
- Token-based proposal access with middleware validation
- Rate limiting (10 req/min per IP) in edge middleware
- Icon name whitelisting (prevents prototype pollution)
- Zod runtime validation on all proposal data
- CORS restricted to `https://tractis.ai`
- SEO prevention (`X-Robots-Tag: noindex, nofollow`)

### 5. Frontend Component Architecture
- Server components for data fetching, client components for interactivity
- Error boundaries around each proposal section for resilience
- Dynamic imports for custom proposal components
- Framer Motion animations for engagement
- shadcn/ui + Tailwind CSS for consistent styling
- Dynamic CSS variable injection for per-client branding

---

## Architectural Risks

### RISK-1: Schema Drift Between Frontend and Backend (CRITICAL)

**Problem:** The agent backend has `@repo/shared` installed but **imports nothing from it**. Instead, `apps/agent/src/lib/agent-schemas.ts` defines separate Zod schemas for agent outputs. This creates two sources of truth.

**Impact:**
- Agent can produce proposals that don't match what the frontend expects
- Schema drift is inevitable as either app evolves independently
- Bugs from mismatched data shapes will be hard to trace

**Root Cause:** Zod version mismatch:
- `packages/shared`: Zod **3.23.8**
- `apps/agent`: Zod **4.3.6**
- Zod 4 has breaking API changes, making cross-package imports incompatible

**Files Affected:**
- `packages/shared/src/types/proposal.ts` (Zod 3 schemas)
- `apps/agent/src/lib/agent-schemas.ts` (Zod 4 schemas — duplicate)
- `apps/agent/package.json` (Zod 4 dependency)

---

### RISK-2: No Persistent Storage Anywhere (HIGH)

**Problem:** All data is either hardcoded or in-memory:
- Proposals: Hardcoded in `apps/web/src/data/proposals.ts`
- Enrichment sessions: In-memory `Map` in orchestrator
- Token validation: In-memory `Map` in middleware

**Impact:**
- Server restart = all active enrichment sessions lost
- Adding a new proposal requires code change + redeploy
- No proposal history, analytics, or audit trail
- Horizontal scaling impossible (sessions are per-instance)
- No recovery from Railway container restarts

**Files Affected:**
- `apps/web/src/data/proposals.ts` (hardcoded proposal data)
- `apps/web/src/middleware.ts` (hardcoded token map)
- `apps/agent/src/services/proposal-orchestrator.ts` (in-memory sessions)

---

### RISK-3: No Backend Authentication (HIGH)

**Problem:** The Express backend has no authentication:
- CORS allows **all origins** (`cors()` with no config)
- No API keys, JWT, or bearer tokens
- No rate limiting on any endpoint
- Anyone discovering the Railway URL can call all endpoints

**Impact:**
- Anthropic API credits can be burned by unauthorized callers
- No way to attribute usage or enforce quotas
- Potential for abuse of file upload and web scraping endpoints

**Files Affected:**
- `apps/agent/src/server.ts` (CORS and middleware setup)

---

### RISK-4: Synchronous Request Processing (MEDIUM)

**Problem:** The full Agent 2A → 2B → 3 pipeline runs within a single HTTP request/response cycle. No async job processing.

**Impact:**
- Long documents may timeout (Express default + LLM latency)
- No retry mechanism for transient LLM API failures
- Client must hold connection open for potentially minutes
- No progress feedback during generation

**Files Affected:**
- `apps/agent/src/routes/generate-proposal.ts`
- `apps/agent/src/services/proposal-orchestrator.ts`

---

### RISK-5: Duplicated Fixed Sections (MEDIUM)

**Problem:** `fixed-sections.ts` exists in both apps with identical Tractis contact and "Why Us" content:
- `apps/web/src/data/fixed-sections.ts`
- `apps/agent/src/lib/fixed-sections.ts`

**Impact:** Update one, forget the other — content drift between what the agent generates and what the frontend displays as defaults.

---

### RISK-6: Hardcoded Secrets in Source Code (MEDIUM)

**Problem:**
- Admin password `tractis2024` hardcoded in `apps/web/src/app/admin/page.tsx`
- Proposal tokens hardcoded in `apps/web/src/middleware.ts`

**Impact:** Anyone with repo access has admin credentials and all valid proposal tokens.

---

## Gaps & Missing Infrastructure

| Gap | Category | Impact |
|-----|----------|--------|
| No CI/CD pipeline | DevOps | Builds/tests don't run automatically on PR |
| No database | Infrastructure | Can't store proposals, sessions, or analytics |
| No rate limiting on backend | Security | API abuse is trivially easy |
| No error monitoring | Observability | No Sentry, no structured logging |
| No API documentation | Developer Experience | No OpenAPI/Swagger spec for agent endpoints |
| 31 of 32 variants unbuilt | Feature Completeness | Variant system is ready but functionally empty |
| No end-to-end tests | Quality | 19 unit tests exist, no integration or E2E |
| Empty `packages/config/typescript` | Code Hygiene | Dead stub package cluttering workspace |
| Unused `apps/agent/src/lib/agent.ts` | Code Hygiene | 190-line file with tool definitions not used by 3-agent pipeline |
| No CSRF protection | Security | Admin form has no CSRF token |

---

## Priority Remediation Plan

### P0 — Fix Now (Schema Drift Will Bite You)

#### P0-1: Align Zod Versions Across Monorepo
- **Decision:** Migrate `packages/shared` to Zod 4 (or pin agent to Zod 3)
- **Recommendation:** Migrate to Zod 4 across the board — it's the future
- **Scope:** Update `packages/shared/package.json`, migrate schema syntax if needed
- **Effort:** Small — Zod 3→4 migration is mostly mechanical

#### P0-2: Make Agent Import from `@repo/shared`
- Import `ProposalSchema`, `ProposalDataSchema`, and related types into agent services
- Agent 3 output should validate against the same schema the frontend uses
- **Files:** `apps/agent/src/services/agent-3-designer.ts`, `apps/agent/src/lib/agent-schemas.ts`

#### P0-3: Delete Duplicate Schemas and Fixed Sections
- Remove `apps/agent/src/lib/agent-schemas.ts` (replace with `@repo/shared` imports)
- Move `fixed-sections.ts` to `packages/shared` and import from both apps
- **Files:** Both `fixed-sections.ts` files, `agent-schemas.ts`

---

### P1 — Fix Before Scaling

#### P1-1: Add Backend Authentication
- Add API key middleware to all `/api/*` routes
- Store API key in environment variable
- Frontend sends key via `Authorization` header
- **Scope:** New middleware file + env var configuration

#### P1-2: Add Persistent Storage
- **Proposals:** Vercel KV, Supabase, or Postgres for proposal data
- **Sessions:** Redis (Upstash) for enrichment session state
- **Tokens:** Vercel Edge Config for token validation
- **Priority:** Redis for sessions first (fixes scaling), then database for proposals

#### P1-3: Add CI Pipeline
- GitHub Actions workflow: build → type-check → test on every PR
- Turbo remote caching for faster CI runs
- Block merge on failure
- **Scope:** Single `.github/workflows/ci.yml` file

---

### P2 — Fix Before Adding More Proposals

#### P2-1: Move Proposal Data to Database
- Extract hardcoded proposals from `proposals.ts` to persistent storage
- Admin dashboard should create proposals via API → database
- Enables adding proposals without code changes or redeployments

#### P2-2: Move Secrets to Environment Variables
- Admin password → `ADMIN_PASSWORD` env var
- Proposal tokens → database or Vercel Edge Config
- **Files:** `apps/web/src/app/admin/page.tsx`, `apps/web/src/middleware.ts`

#### P2-3: Add Async Job Processing
- Use Bull + Redis for proposal generation jobs
- Return job ID immediately, poll for status
- Add webhook/callback option for completion notification
- Enables progress tracking and retry on failure

---

### P3 — Quality of Life

#### P3-1: Add Structured Logging & Error Monitoring
- Sentry for error tracking (both apps)
- Pino or Winston for structured JSON logging
- Request ID correlation across services

#### P3-2: Clean Up Dead Code
- Remove `apps/agent/src/lib/agent.ts` (unused LangChain tool definitions)
- Remove `packages/config/typescript/` (empty stub)
- Remove `apps/agent/src/routes/create-proposal.ts` (placeholder endpoint)

#### P3-3: Build Remaining Component Variants
- 31 variants still TODO across 8 sections
- Prioritize by proposal pipeline needs (which variants does Agent 3 actually select?)
- Consider building variants on-demand as new proposals require them

#### P3-4: Add End-to-End Tests
- Playwright or Cypress for frontend E2E
- API integration tests for the agent pipeline
- Contract tests between frontend and backend using shared schemas

#### P3-5: Add API Documentation
- OpenAPI/Swagger spec for all agent endpoints
- Auto-generate from route definitions if possible
- Include in README or serve via Swagger UI

---

## Current System Statistics

| Metric | Value |
|--------|-------|
| Total Apps | 2 (web, agent) |
| Shared Packages | 1 (+ 1 empty stub) |
| Live Proposals | 2 (Imperial custom + Tractis demo standard) |
| Component Variants Built | 1 of 32 |
| Test Suites | 2 (Branding + Admin Auth) |
| Tests Passing | 19 |
| Agent System Prompts | 3 (totaling ~1,400 lines) |
| LLMs Used | 2 (Groq Llama 3.3-70b, Claude Sonnet 4.5) |
| Frontend Deploy | Vercel (https://proposal.tractis.ai) |
| Backend Deploy | Railway (https://repoagent-production-420c.up.railway.app) |

---

## Architecture Diagram (Text)

```
                    ┌─────────────────────┐
                    │   Vercel (Edge)      │
                    │   Middleware:         │
                    │   - Rate Limiting     │
                    │   - Token Validation  │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   Next.js 16 App      │
                    │   (apps/web)          │
                    │                       │
                    │  /admin               │
                    │  /proposals/[slug]/   │
                    │    [token]            │
                    │                       │
                    │  Components:          │
                    │  - 8 section types    │
                    │  - 32 variant slots   │
                    │  - Custom components  │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   Express API         │
                    │   (apps/agent)        │
                    │                       │
                    │  POST /extract-design │
                    │  POST /extract-text   │
                    │  POST /generate-      │
                    │       proposal        │
                    │  POST /enrich-        │
                    │       proposal        │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
     │  Agent 2A     │ │  Agent 2B    │ │  Agent 3     │
     │  Parser       │ │  Enrichment  │ │  Designer    │
     │               │ │              │ │              │
     │  Groq Llama   │ │  Claude      │ │  Claude      │
     │  3.3-70b      │ │  Sonnet 4.5  │ │  Sonnet 4.5  │
     │               │ │              │ │              │
     │  Parse doc →  │ │  Fill gaps   │ │  Select      │
     │  8 sections   │ │  via Q&A     │ │  variants    │
     └───────────────┘ └──────────────┘ └──────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │   @repo/shared       │
                    │   (packages/shared)  │
                    │                      │
                    │   Zod Schemas        │
                    │   TypeScript Types   │
                    │   Variant Enums      │
                    │   Icon Whitelist     │
                    └──────────────────────┘
```

---

## File Reference

### Root Configuration
- `package.json` — Workspace root, scripts, dependencies
- `turbo.json` — Build pipeline configuration
- `pnpm-workspace.yaml` — Workspace structure
- `tsconfig.json` — Root TypeScript config

### Frontend (apps/web)
- `src/app/admin/page.tsx` — Admin dashboard (hardcoded password)
- `src/app/proposals/[slug]/[token]/page.tsx` — Proposal renderer
- `src/middleware.ts` — Token validation + rate limiting
- `src/data/proposals.ts` — Hardcoded proposal data
- `src/data/fixed-sections.ts` — Fixed Tractis content (DUPLICATE)
- `src/lib/variant-mapper.tsx` — Dynamic component selection
- `src/lib/branding.ts` — CSS variable generation
- `src/components/proposal/custom/imperial-custom.tsx` — Custom proposal

### Backend (apps/agent)
- `src/server.ts` — Express setup + routes
- `src/routes/generate-proposal.ts` — Main API endpoint
- `src/services/proposal-orchestrator.ts` — 3-agent workflow
- `src/services/agent-2a-parser.ts` — Groq parsing agent
- `src/services/agent-2b-enrichment.ts` — Claude enrichment agent
- `src/services/agent-3-designer.ts` — Claude variant selection
- `src/lib/agent-schemas.ts` — Duplicate Zod schemas (SHOULD USE SHARED)
- `src/lib/fixed-sections.ts` — Fixed Tractis content (DUPLICATE)
- `prompts/agent-2a-parser.md` — Parser system prompt (413 lines)
- `prompts/agent-2b-enrichment.md` — Enrichment system prompt (408 lines)
- `prompts/agent-3-designer.md` — Designer system prompt (582 lines)

### Shared (packages/shared)
- `src/types/proposal.ts` — All Zod schemas + TypeScript types (168 lines)
- `src/index.ts` — Package exports
