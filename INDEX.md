# Tractis Commercial Engine V2 — Document Index

**Last Updated:** February 15, 2026

All specs, guides, and documentation in this repo, in chronological order.

---

## Chronological Order

### 1. `README.md` — Project Overview
- **Created:** Feb 5, 2026
- **Purpose:** Monorepo structure, project overview, tech stack, deployment URLs
- **Status:** Active (needs update after refactor)

### 2. `CLAUDE.md` — Claude Code Instructions
- **Created:** Feb 9, 2026
- **Purpose:** Critical rules for Claude Code (file operations, permissions, dev workflow)
- **Status:** Active

### 3. `DOCUMENTATION.md` — Complete System Documentation
- **Created:** Feb 10, 2026
- **Purpose:** Full architecture docs — high-level flow, branding system, proposal structure, API endpoints
- **Status:** Active (describes V1 React-based rendering)

### 4. `VARIANT_SYSTEM.md` — Dynamic Component Variant Architecture
- **Created:** Feb 10, 2026
- **Purpose:** Hybrid approach (Option C) for AI-selected UI variants per proposal section
- **Status:** Superseded by block-based architecture (Feb 12 commit)

### 5. `TEST_COVERAGE.md` — Test Coverage Report
- **Created:** Feb 10, 2026
- **Purpose:** Tracks 19 passing tests — branding module, proposal validation, block components
- **Status:** Active

### 6. `VERCEL_DEBUG.md` — Vercel Deployment Debugging Guide
- **Created:** Feb 10, 2026
- **Purpose:** Deployment troubleshooting. Critical rule: never modify tractis-demo when debugging
- **Status:** Active

### 7. `RESPONSIVE_DESIGN.md` — Responsive Design Implementation
- **Created:** Feb 10, 2026
- **Purpose:** Imperial proposal responsive breakpoints and patterns (Tailwind CSS)
- **Status:** Active (Imperial-specific, may become obsolete after HTML refactor)

### 8. `PROJECT_STATE.md` — Current Project State
- **Created:** Feb 10, 2026
- **Purpose:** Production URLs, latest deployment info, what's built and working
- **Status:** Active (needs update after refactor)

---

## Agent Prompts

### 9. `apps/agent/prompts/agent-2a-parser.md` — Content Parser Agent
- **Created:** Feb 10, 2026
- **Purpose:** Agent 2A system prompt — extracts 6 sections from raw proposal text
- **Status:** Active (will be replaced by new 4-agent pipeline)

### 10. `apps/agent/prompts/agent-2b-enrichment.md` — Enrichment Agent
- **Created:** Feb 10, 2026
- **Purpose:** Agent 2B system prompt — interactive Q&A to fill content gaps
- **Status:** To be removed (decided Feb 15: enrichment no longer needed)

### 11. `apps/agent/prompts/agent-3-designer.md` — Block Design Director
- **Created:** Feb 10, 2026
- **Purpose:** Agent 3 system prompt — maps content to 22 React block components
- **Status:** Active (will be replaced by new Architect + HTML Builder agents)

### 12. `apps/agent/prompts/create-proposal-command.md` — Proposal Generation Command
- **Created:** Feb 12, 2026
- **Purpose:** `/create-proposal` slash command — 5-phase orchestration (input → parse → enrich → design → save)
- **Status:** Active (will be replaced by new `generate-proposal.ts` pipeline)

---

## Agent Docs

### 13. `apps/agent/docs/VARIANT_SELECTION_GUIDE.md` — AI Variant Selection Guide
- **Created:** Feb 10, 2026
- **Purpose:** Decision framework for AI agent choosing UI variants per section
- **Status:** Superseded by block-based architecture

---

### 14. `REFACTOR_SPEC.md` — Consolidated Refactor Specification
- **Created:** Feb 15, 2026
- **Purpose:** Approved spec for new architecture — self-contained HTML proposals, 4-agent pipeline (Brand Designer → Architect → HTML Builder → Polish), Supabase Storage, proxy serving. Includes all decisions made during review.
- **Status:** Approved for implementation
- **Key decisions:**
  - Drop Agent 2B (no enrichment needed)
  - Incremental migration (build alongside existing system)
  - Tailwind compiled locally before upload (no CDN dependency)

---

## External Reference (Not in Repo)

### `proposal-engine-refactor-spec.md` — Original Draft from Opus
- **Location:** `C:\Users\gneum\Downloads\proposal-engine-refactor-spec.md`
- **Purpose:** Original brainstorm document. Consolidated into `REFACTOR_SPEC.md` above.
