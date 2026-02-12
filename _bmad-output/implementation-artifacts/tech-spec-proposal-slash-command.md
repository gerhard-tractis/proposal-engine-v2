---
title: 'Claude Code Slash Command for Proposal Generation'
slug: 'proposal-slash-command'
created: '2026-02-12'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['TypeScript', 'Next.js 16', 'Supabase (local Docker)', 'Dembrandt CLI', 'Puppeteer', 'Zod', 'pnpm monorepo']
files_to_modify: ['.claude/commands/create-proposal.md', 'apps/agent/prompts/create-proposal-command.md', 'scripts/save-proposal.ts']
code_patterns: ['Slash command = YAML frontmatter + markdown instructions', 'Block-based proposals: { slug, token, client, metadata, blocks[] }', 'Each block: { id, component, data }', 'Component names map to COMPONENT_REGISTRY in blocks/index.ts', 'Supabase admin client bypasses RLS for inserts', 'Zod validation on all proposal data']
test_patterns: ['No test framework currently in project', 'Manual testing via localhost:3000/proposals/[slug]/[token]']
---

# Tech-Spec: Claude Code Slash Command for Proposal Generation

**Created:** 2026-02-12

## Overview

### Problem Statement

The proposal engine currently requires cloud deployments (Vercel for frontend, Railway for backend) and HTTP calls to external LLM APIs (Groq, Anthropic) to generate proposals. This costs money on every run. Meanwhile, Claude Code is already the most capable LLM available locally, and Supabase runs locally via Docker. There's no reason the full engine can't run at zero cloud cost.

Additionally, the `create-proposal` route (Agent 3 output → Supabase) was never implemented, and Agent 3 still uses the old variant-based schema instead of the new block-based architecture.

### Solution

Add a Claude Code slash command (`/create-proposal`) as a second entry point alongside the existing web UI. Claude Code itself executes each agent role directly — flexible content parsing (Agent 2A), conversational enrichment (Agent 2B), and block component selection from the component library (Agent 3). The result is saved to the local Supabase instance. The existing HTTP/LangChain pipeline remains untouched.

This gives two paths to the same destination:
- **Web UI path:** Browser → Next.js → Express API → Groq/Anthropic → Supabase (cloud costs)
- **Local path:** Claude Code slash command → Claude as all agents → local Supabase (zero cost)

### Scope

**In Scope:**
- `/create-proposal` slash command for Claude Code
- Claude executes Agent 2A role: flexible content parsing (no fixed 8-section constraint — structure based on available info)
- Claude executes Agent 2B role: conversational enrichment when content is incomplete
- Claude executes Agent 3 role: select from registered block components, output blocks array with data
- Optional design extraction via Dembrandt, fallback to Tractis default color palette (gold `#e6c15c`, slate `#5e6b7b`)
- Save final proposal to local Supabase `proposals` table
- Document input: file path (PDF, MD, TXT) or pasted text
- Full local stack: Next.js + local Supabase Docker — zero cloud costs

**Out of Scope:**
- Modifying the existing HTTP/LangChain pipeline
- Admin dashboard / drag-and-drop block editing
- New block components beyond what's currently registered
- Cloud deployment changes
- DOCX support (Claude's Read tool cannot parse binary DOCX files; users should convert to PDF or TXT first)

## Context for Development

### Codebase Patterns

- **Slash commands** live in `.claude/commands/` as markdown files with YAML frontmatter (`name`, `description`). They reference external instruction files via `{project-root}` paths.
- **Proposals** are stored in Supabase as `{ slug, token, client, metadata, blocks[] }` where each block is `{ id, component, data }`. The Supabase `proposals` table also has a `status` column (not in the Zod schema) that must be set to `'published'` on insert.
- **Component registry** lives at `apps/web/src/components/proposal/blocks/index.ts`. The prompt MUST NOT hardcode a component count — instead, it should instruct Claude to read `blocks/index.ts` at runtime to get the current registry. This ensures the catalog stays in sync as components are added or removed.
- **Token generation**: 10-char alphanumeric string. The table has a `UNIQUE INDEX` on `(slug, token)` — if a collision occurs, the insert will fail and Claude should regenerate the token and retry.
- **Slug generation**: From client name → lowercase, replace spaces/special chars with hyphens, strip non-alphanumeric/non-hyphen chars, collapse multiple hyphens, trim hyphens from ends, max 100 chars. Example: `"Acme Corp & Partners (UK) Ltd."` → `"acme-corp-partners-uk-ltd"`.
- **Block ID format**: `{slug}-{section-name}` pattern. Examples from seed data: `imperial-hero`, `imperial-problem`, `demo-exec-summary`, `demo-pricing`. Always lowercase with hyphens.
- **Supabase admin client** (`getSupabaseAdmin()`) bypasses RLS for server-side inserts.
- **Zod validation** via `ProposalSchema.safeParse()` on every read/write. Note: `BlockSchema` validates `data` as `z.record(z.unknown())` — Zod does NOT validate per-component data shapes. The prompt's component catalog is the ONLY safety net for correct data shapes. This is why the catalog must be accurate.
- **Tractis defaults**: primary `#e6c15c` (gold), accent `#5e6b7b` (slate), logo `/logos/tractis-color.svg` (verified in `apps/web/public/logos/`).
- **Client logo**: Required field. When generating for a non-Tractis client, the prompt must ask the user for a logo path/URL. If none available, use the Tractis logo `/logos/tractis-color.svg` as a placeholder and note it should be replaced.
- **Fixed sections**: "Why Us" (Tractis narrative) and "Contact" (Gerhard Neumann) are always appended. Content is inlined in the prompt (not loaded from `fixed-sections.ts`) to keep it self-contained.
- **CLAUDE.md ban on heredocs**: The project explicitly bans `cat << EOF` and similar heredoc patterns. The save script must accept a file path argument, NOT stdin piping. Claude writes the proposal JSON to a temp file using the `Write` tool, then passes the file path to the save script.
- **Windows environment**: This project runs on Windows 11. All Bash commands must use Windows-compatible syntax. Path separators in Bash on Windows (Git Bash/WSL) generally handle forward slashes fine, but be aware of potential issues.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `.claude/commands/bmad-agent-bmm-quick-flow-solo-dev.md` | Reference slash command pattern |
| `apps/web/src/components/proposal/blocks/index.ts` | Component registry — READ AT RUNTIME, don't hardcode |
| `packages/shared/src/types/proposal.ts` | Zod schemas: `ProposalSchema`, `BlockSchema`, `ClientSchema` |
| `apps/web/src/lib/proposal-helpers.ts` | `getProposalBySlugAndToken()` — fetch pattern to match |
| `apps/web/src/lib/supabase.ts` | `getSupabaseAdmin()` — Supabase client init pattern |
| `apps/web/src/lib/branding.ts` | Default branding logic + Tractis theme |
| `apps/web/src/data/tractis-theme.json` | Full Tractis design system |
| `apps/agent/src/lib/fixed-sections.ts` | Fixed "Why Us" + "Contact" content (inline in prompt) |
| `supabase/seed.sql` | Canonical examples of block data shapes |

### Technical Decisions

1. **No new npm dependencies** — `dotenv` (already in `apps/agent`), `@supabase/supabase-js` (already in `apps/agent` and `apps/web`), and `tsx` (already in `apps/agent`) are all available. The save script runs from the `apps/agent` directory to access these deps.
2. **Single prompt file + runtime registry read** — The slash command loads one prompt that contains agent role instructions, quality gates, and fixed section content. But instead of hardcoding the component catalog, the prompt instructs Claude to read `blocks/index.ts` and the individual component source files at runtime to understand available components and their data shapes. This prevents catalog staleness.
3. **Flexible parsing** — Agent 2A no longer outputs a fixed 8-section schema. It analyzes the document and proposes whatever block structure best fits the content.
4. **Interactive enrichment** — Agent 2B role is conversational. Claude asks the user questions directly in the chat, no session management needed (the conversation IS the session).
5. **Save via file path, not stdin** — Claude writes the proposal JSON to a temp file using the `Write` tool (compliant with CLAUDE.md), then the save script reads from that file path. This avoids heredoc/stdin issues entirely. Command: `npx tsx scripts/save-proposal.ts <path-to-json-file>`.
6. **Save script in `apps/agent/`** — The script lives at `scripts/save-proposal.ts` (repo root) but runs from `apps/agent/` context to access its `node_modules` (dotenv, supabase, tsx). Env vars loaded from `apps/agent/.env` which has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Implementation Plan

### Tasks

- [x] Task 1: Create the slash command entry point
  - File: `.claude/commands/create-proposal.md`
  - Action: Create a new slash command file with YAML frontmatter (`name: 'create-proposal'`, `description: 'Generate a complete proposal from a document and save to Supabase'`). The body instructs Claude to read and follow the master prompt at `{project-root}/apps/agent/prompts/create-proposal-command.md`.
  - Notes: Follow the existing pattern from `bmad-agent-bmm-quick-flow-solo-dev.md`. No `disable-model-invocation` needed.

- [x] Task 2: Create the master prompt for `/create-proposal`
  - File: `apps/agent/prompts/create-proposal-command.md`
  - Action: Create a comprehensive prompt that guides Claude through the full pipeline. Must include:
    - **Phase 1 — Input Gathering**:
      - Ask user for: (a) document path or pasted text, (b) client name, (c) optional client website URL, (d) optional client logo path/URL.
      - Read the document using the `Read` tool. Supported formats: PDF, MD, TXT. If user provides DOCX, instruct them to convert to PDF or TXT first.
      - If website URL provided, run `dembrandt <url>` via Bash to extract colors. Parse hex colors from stdout using regex `/#([0-9a-fA-F]{6})/g`. If Dembrandt fails (timeout, network error, any non-zero exit), fall back to Tractis defaults and inform the user.
      - If no URL, use Tractis defaults: primary `#e6c15c`, accent `#5e6b7b`.
      - If no logo provided, use `/logos/tractis-color.svg` as placeholder.
    - **Phase 2 — Content Parsing (Agent 2A role)**:
      - Analyze the document text. Extract all proposal-relevant content.
      - Do NOT force a fixed 8-section structure — propose the block structure that best fits the content.
      - Assess completeness: what's strong, what's weak, what's missing.
    - **Phase 3 — Enrichment (Agent 2B role)**:
      - If content has gaps, ask the user targeted questions (2-3 at a time).
      - Continue conversationally until all key sections have enough substance.
      - Skip this phase if content is already complete.
    - **Phase 4 — Block Design (Agent 3 role)**:
      - Read `apps/web/src/components/proposal/blocks/index.ts` to get the current `COMPONENT_REGISTRY`.
      - For each component Claude considers using, read its source file to understand its `data` prop interface.
      - Cross-reference with `supabase/seed.sql` for canonical data shape examples.
      - Compose an ordered `blocks[]` array where each block has `{ id, component, data }`.
      - Block ID format: `{slug}-{descriptive-section-name}` (lowercase, hyphens).
      - Always append fixed "Why Us" and "Contact" blocks at the end (content inlined in prompt — see below).
      - Provide reasoning for each block choice.
    - **Phase 5 — Save to Supabase**:
      - Generate slug from client name using the sanitization algorithm (lowercase, replace non-alphanumeric with hyphens, collapse, trim, max 100 chars).
      - Generate token: 10-char random alphanumeric string (use `Math.random().toString(36)` or similar in the save script, or Claude can generate one).
      - Assemble full proposal JSON matching `ProposalSchema`.
      - Write the JSON to a temp file using the `Write` tool: `{project-root}/.tmp-proposal.json`.
      - Run save script: `cd apps/agent && npx tsx ../../scripts/save-proposal.ts ../../.tmp-proposal.json`
      - If insert fails due to slug+token collision, generate a new token and retry (max 3 attempts).
      - On success, delete the temp file and report the proposal URL: `http://localhost:3000/proposals/{slug}/{token}`.
    - **Fixed Section Content** — inline in prompt:
      - **Why Us block**: `{ id: "{slug}-why-us", component: "why-us", data: { sectionTitle: "Why Tractis", content: "<full TRACTIS_WHY_US markdown from fixed-sections.ts>" } }`
      - **Contact block**: `{ id: "{slug}-contact", component: "contact-section", data: { sectionTitle: "Let's Talk", contact: { name: "Gerhard Neumann", role: "Founder & CEO", email: "gerhard@tractis.ai", phone: "+56 990210364", website: "https://tractis.ai", linkedin: "https://linkedin.com/in/gneumannv", calendly: null, cta: "Schedule a call to discuss how we can transform your proposal process" } } }`
    - **Quality Gates**:
      - Component variety: don't use the same component type for multiple sections when alternatives exist
      - Content-component fit: data-heavy content → metrics/table components; narrative → text components
      - Visual coherence: mix of full-width and contained components
      - Audience alignment: technical vs executive tone
      - Data shape validation: before finalizing, verify each block's `data` matches what the component source file expects
  - Notes: This is the core deliverable. The prompt MUST instruct Claude to read the component registry and source files at runtime rather than relying on a hardcoded catalog. This prevents staleness. The prompt should include 2-3 canonical examples from seed.sql to show the expected output format.

- [x] Task 3: Create the Supabase save script
  - File: `scripts/save-proposal.ts`
  - Action: Create a TypeScript script that:
    1. Accepts a file path as CLI argument (`process.argv[2]`)
    2. Reads the JSON file from that path
    3. Validates `slug`, `token`, `client`, `metadata`, `blocks` against `ProposalSchema` from `@repo/shared`
    4. Loads env vars from `apps/agent/.env` using `dotenv` (path: `../../apps/agent/.env` relative to script, or use absolute path resolution)
    5. Creates a Supabase client with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
    6. Inserts into `proposals` table: `{ slug, token, status: 'published', client, metadata, blocks, published_at: new Date().toISOString() }`
    7. On success: outputs `✅ Proposal saved! URL: http://localhost:3000/proposals/{slug}/{token}` and exits 0
    8. On Zod validation failure: outputs the Zod error details and exits 1
    9. On Supabase insert failure (including unique constraint violation): outputs the error message and exits 1
  - Notes: Uses `@supabase/supabase-js` and `dotenv` (both already installed in `apps/agent`). `tsx` is also in `apps/agent` devDeps. Run command: `cd apps/agent && npx tsx ../../scripts/save-proposal.ts <path>`. The script must resolve the `@repo/shared` import — since it runs from `apps/agent` context, the pnpm workspace resolution should handle this. If not, use a relative import to `packages/shared/src/types/proposal.ts`.

- [x] Task 4: Document canonical block examples in the prompt
  - File: (inline in `apps/agent/prompts/create-proposal-command.md` — part of Task 2)
  - Action: Instead of documenting all 42 components statically, include 2-3 canonical examples from seed.sql that show the expected block format:
    - `hero-split` example (from Imperial)
    - `executive-summary-metrics` example (from Imperial)
    - `contact-section` example (from Tractis demo)
  - Then instruct Claude to read the component registry and source files at runtime for any component it wants to use.
  - Notes: This approach solves the catalog staleness problem (F1) and the context window concern (F11). Instead of 3000+ lines of static catalog, we have ~50 lines of examples + runtime file reading instructions.

### Acceptance Criteria

- [ ] AC 1: Given a user types `/create-proposal` in Claude Code, when the command loads, then Claude asks for a document path, client name, optional website URL, and optional logo.
- [ ] AC 2: Given a user provides a file path to a PDF/MD/TXT document, when Claude reads it, then the content is extracted and analyzed without HTTP calls to external LLMs.
- [ ] AC 3: Given a user provides a website URL, when Claude runs `dembrandt <url>`, then the extracted colors are used for the proposal's `client.colors`. Given Dembrandt fails or no URL is provided, then Tractis defaults are used (primary: `#e6c15c`, accent: `#5e6b7b`).
- [ ] AC 4: Given the document content has missing or weak sections, when Claude detects gaps, then it asks the user targeted enrichment questions conversationally before proceeding to block design.
- [ ] AC 5: Given complete content (either from document or after enrichment), when Claude designs the proposal, then it reads the component registry at runtime, selects appropriate components, reads their source files to verify data shapes, and outputs a valid `blocks[]` array where every `component` name exists in `COMPONENT_REGISTRY`.
- [ ] AC 6: Given a complete proposal JSON written to a temp file, when the save script runs with the file path argument, then it validates against `ProposalSchema`, inserts into the local Supabase `proposals` table with `status: 'published'`, and returns the slug + token.
- [ ] AC 7: Given a saved proposal, when a user visits `http://localhost:3000/proposals/{slug}/{token}`, then the proposal renders correctly using the `BlockRenderer` with all blocks visible and properly styled.
- [ ] AC 8: Given the existing HTTP/LangChain pipeline, when the slash command is added, then no existing files in the pipeline are modified or broken.
- [ ] AC 9: Given a user provides a DOCX file, when Claude detects the format, then it informs the user that DOCX is not supported and asks them to provide PDF or TXT instead.
- [ ] AC 10: Given a slug+token collision on insert, when the save script returns an error, then Claude generates a new token and retries (up to 3 attempts).

## Additional Context

### Dependencies

- **Local Supabase must be running** (`npx supabase start` or Docker) — the save script connects to it.
- **Dev server should be running** (`pnpm dev`) to verify rendered proposals at localhost:3000.
- **Dembrandt CLI** must be installed (`apps/agent` has it as a dependency).
- **No new npm dependencies required** — `dotenv` (^16.4.7), `@supabase/supabase-js` (^2.95.3), and `tsx` (^4.19.2) are all already in `apps/agent`.
- **Env vars required** in `apps/agent/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

### Testing Strategy

- **Manual end-to-end test**: Run `/create-proposal` with a real document, verify proposal saves, visit localhost URL, confirm all blocks render.
- **Seed data regression**: Existing Imperial (`/proposals/imperial/Zh3zaPJV4U`) and Tractis demo (`/proposals/tractis-demo/xK8pQ2mN7v`) proposals must still render correctly (no shared files modified).
- **Fallback test**: Run without a website URL — verify Tractis default branding is applied.
- **DOCX rejection test**: Provide a .docx file path — verify Claude asks user to convert instead of failing silently.
- **Dembrandt failure test**: Provide an invalid/unreachable URL — verify fallback to Tractis defaults with user notification.
- **Collision test**: Manually insert a proposal with the same slug, run the command — verify retry with new token.

### Notes

- **High-risk item**: Per-component data shape accuracy. `BlockSchema` uses `z.record(z.unknown())` so Zod cannot catch wrong data shapes. The prompt instructs Claude to read component source files at runtime, which is the only safety net. If Claude misreads a component's interface, the block may not render.
- **Known limitation**: Claude's `Read` tool can read PDF files but quality varies for complex PDFs with tables/images. For best results, use clean text-based documents.
- **Future consideration**: Once this works, extend with `/edit-proposal` (modify existing), `/preview-proposal` (open browser), and `/list-proposals` (query Supabase).
- **Agent 3 in HTTP pipeline is outdated** — still uses old variant-based schema. Out of scope here but should be updated separately.

## Resolved Findings from Adversarial Review

| Finding | Resolution |
|---------|------------|
| F1: Component count confusion / catalog staleness | Prompt reads registry at runtime instead of hardcoding. No count referenced. |
| F2: Save script path inconsistent | Clarified: script at `scripts/save-proposal.ts`, runs via `cd apps/agent && npx tsx ../../scripts/save-proposal.ts <path>`. |
| F3: dotenv hand-waved | Verified: `dotenv@^16.4.7` is already in `apps/agent` dependencies. No new install needed. |
| F4: No per-component data validation | Acknowledged as inherent limitation. Mitigated by prompt instructing Claude to read component source files at runtime. |
| F5: stdin piping conflicts with CLAUDE.md | Changed to file-path approach: Claude uses `Write` tool for temp JSON file, script reads from file path. |
| F6: DOCX not supported by Read tool | Removed DOCX from supported formats. Added AC9 for graceful rejection. |
| F10: client.logo required but no source | Prompt now asks user for logo. Falls back to `/logos/tractis-color.svg` placeholder. |
| F11: Catalog could blow context window | Replaced static catalog with runtime file reading + 3 canonical examples. |
| F14: status field not in ProposalSchema | Documented: `status` is a Supabase column outside the Zod schema. Save script adds it directly to the insert payload. |

## Review Notes
- Adversarial review completed (35 raw findings, 32 dismissed as noise)
- Findings: 3 real, 3 fixed, 0 skipped
- Resolution approach: auto-fix
- F1 (race condition): Tmp file now uses slug in filename for uniqueness
- F2 (cleanup): Prompt now instructs cleanup on both success and failure
- F11 (token docs): Fixed to match actual schema regex `[A-Za-z0-9_-]`
