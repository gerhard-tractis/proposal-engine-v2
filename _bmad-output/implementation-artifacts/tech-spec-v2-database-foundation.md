---
title: 'V2 Database Foundation - Supabase Local Docker + Proposal Storage'
slug: 'v2-database-foundation'
created: '2026-02-12'
status: 'complete'
stepsCompleted: [1, 2, 3, 4, 5, 6]
completedDate: '2026-02-12'
commit: '64637c5'
tech_stack: ['next@16.1.6', 'react@19', 'express@4.21.2', 'typescript@5.7.3', 'zod@3.23.8 (shared)', 'zod@4.3.6 (agent)', 'tailwindcss@3.4.17', 'vitest@4.0.18', 'pnpm workspaces', 'turborepo', '@supabase/supabase-js (new)', '@supabase/ssr (new)', 'supabase CLI (new)']
files_to_modify: ['apps/web/src/lib/proposal-helpers.ts', 'apps/web/src/middleware.ts', 'apps/web/src/data/proposals.ts', 'apps/web/src/app/proposals/[slug]/[token]/page.tsx', 'apps/web/src/app/admin/page.tsx', 'apps/web/package.json', 'apps/web/.env.example', 'apps/web/src/lib/supabase.ts (new)', 'apps/web/src/app/admin/actions.ts (new)', 'apps/agent/src/services/proposal-orchestrator.ts', 'apps/agent/package.json', 'apps/agent/.env.example', 'apps/agent/src/lib/supabase.ts (new)', 'supabase/config.toml (new)', 'supabase/migrations/001_initial_schema.sql (new)', 'supabase/seed.sql (new)']
code_patterns: ['Server components with async params (Next.js 16)', 'Zod runtime validation via safeParse on all proposal reads', 'proposals array imported from @/data/proposals in proposal-helpers.ts', 'Middleware uses hardcoded Map<slug,token> for token validation', 'Edge Runtime middleware (NextResponse, NextRequest)', 'Orchestrator uses in-memory Map with 30min TTL for enrichment sessions', 'ES Modules with .js extensions in agent imports', 'pnpm workspace:* protocol for shared package', 'Admin page is use client - imports proposals directly from @/data/proposals, bypassing proposal-helpers.ts']
test_patterns: ['vitest configured in apps/web with @testing-library/react and jsdom', 'No test infrastructure in apps/agent', '19 existing tests (branding + admin auth)']
---

# Tech-Spec: V2 Database Foundation - Supabase Local Docker + Proposal Storage

**Created:** 2026-02-12

## Overview

### Problem Statement

All proposal data is hardcoded in source files (`apps/web/src/data/proposals.ts`), enrichment sessions are stored in an in-memory `Map` (lost on server restart), and proposal tokens are hardcoded in middleware (`apps/web/src/middleware.ts`). Every new proposal requires a code change and Vercel redeploy. There is no persistent storage anywhere in the system. This is RISK-2 from the architectural review and the foundational blocker for the V2 block-based architecture.

### Solution

Set up Supabase locally via Docker, create the proposals and enrichment_sessions database schema, seed existing proposals (Imperial + Tractis demo) into the database in their current data shape, update the frontend to read proposal data from Supabase instead of the hardcoded file, and update middleware to validate tokens from the database.

### Scope

**In Scope:**
- Supabase local Docker setup with configuration
- Database schema: proposals table, enrichment_sessions table, RLS policies, triggers
- Seed script for Imperial + Tractis demo proposals (current data shape)
- Frontend reads proposals from Supabase instead of hardcoded `proposals.ts`
- Admin dashboard reads proposals from Supabase via server action
- Middleware validates tokens from Supabase instead of in-memory Map
- `@supabase/supabase-js` and `@supabase/ssr` added to frontend
- `@supabase/supabase-js` added to agent backend
- Environment variable configuration for Supabase connection

**Out of Scope:**
- Block-based rendering / component registry (Phase 2)
- Agent pipeline changes (Phase 3)
- Admin dashboard overhaul (Phase 4)
- Backend API authentication (separate spec)
- Hosted Supabase deployment (future promotion)
- Block decomposition of existing proposals (Phase 2)

## Context for Development

### Codebase Patterns

- **Module System:** Frontend uses standard Next.js imports (`@/` aliases). Agent uses ES Modules with `"type": "module"` and `.js` extensions in imports.
- **Proposal Data Flow (Public):** `proposals.ts` (hardcoded array) → `proposal-helpers.ts` (`getProposalBySlugAndToken` finds by slug+token, validates with Zod `safeParse`) → `page.tsx` (server component renders proposal).
- **Proposal Data Flow (Admin):** `proposals.ts` is imported DIRECTLY in `apps/web/src/app/admin/page.tsx` (line 11), bypassing `proposal-helpers.ts` entirely. The admin page is a `'use client'` component, so it cannot call async server-side functions directly. This must be addressed — the admin page needs a server action or API route to fetch proposals from Supabase.
- **Middleware Token Validation:** `middleware.ts` uses a hardcoded `Map<string, string>` (`VALID_TOKENS`) mapping slug→token. Runs in Vercel Edge Runtime (limited API surface — no Node.js built-ins). Token validation is separate from proposal data fetching.
- **Proposal Page:** Server component using `await params` (Next.js 16 async params pattern). Calls `getProposalBySlugAndToken(slug, token)` synchronously — **must add `await` when this function becomes async**. Checks `proposal.type` — if `'customized'`, dynamically imports a custom component; if `'standard'`, uses the variant mapper for 8 fixed sections.
- **Orchestrator Sessions:** In-memory `Map<string, EnrichmentSession>` with 30min TTL and periodic cleanup via `setInterval`. Session includes `partialProposal`, `missingOrWeak`, `conversationHistory`, timestamps.
- **Shared Package:** `@repo/shared` exports Zod schemas (Zod 3) and derived TypeScript types. Agent has `@repo/shared` as dependency but uses its own Zod 4 schemas (schema drift — out of scope for this phase, but note that both apps now share Postgres as a data contract, increasing the risk of Zod 3 vs 4 validation mismatches).
- **Testing:** Frontend has vitest + @testing-library/react + jsdom. 19 tests passing. Agent has no test infrastructure.
- **Environment Variables:** Frontend uses `.env.example` with `AGENT_API_URL` and `NEXT_PUBLIC_APP_URL`. Agent uses dotenv `config()` at startup with `GROQ_API_KEY`, `PORT`, `NEXT_PUBLIC_APP_URL`.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `apps/web/src/data/proposals.ts` | Hardcoded proposal array (2 proposals: Imperial custom + Tractis demo standard). Contains full proposal data with client branding, all 8 sections, variants, contact info. **Kept as fallback only — primary reads move to Supabase.** |
| `apps/web/src/lib/proposal-helpers.ts` | Gateway for proposal data. `getProposalBySlugAndToken(slug, token)` finds proposal in array and validates with Zod. `getAllProposals()` for admin. `validateToken()` for middleware. **Primary file to modify — all functions become async.** |
| `apps/web/src/middleware.ts` | Edge Runtime middleware. Hardcoded `VALID_TOKENS` Map for slug→token validation. Rate limiting (10 req/min). Returns 404 on invalid tokens. **Must be updated for Supabase token validation (Edge-compatible).** |
| `apps/web/src/app/proposals/[slug]/[token]/page.tsx` | Proposal page server component. Calls `getProposalBySlugAndToken()` synchronously on lines 24 and 55. **Must add `await` to both call sites when function becomes async.** |
| `apps/web/src/app/admin/page.tsx` | Admin dashboard. `'use client'` component. Directly imports `proposals` from `@/data/proposals` (line 11), bypassing `proposal-helpers.ts`. **Must be refactored to fetch proposals via a server action instead of direct import.** |
| `apps/web/src/data/fixed-sections.ts` | `TRACTIS_CONTACT`, `TRACTIS_WHY_US`, `FIXED_SECTION_VARIANTS`. Used by Tractis demo proposal. **No changes in Phase 1 — stays as import for seed script.** |
| `apps/web/src/lib/variant-mapper.tsx` | Maps variant strings to React components. 32 slots, 1 built. **No changes in Phase 1.** |
| `packages/shared/src/types/proposal.ts` | Zod 3 schemas: `ProposalSchema`, `ProposalDataSchema`, `ClientSchema`, etc. All TypeScript types derived via `z.infer<>`. **No changes in Phase 1 — proposal shape stays the same.** |
| `apps/agent/src/services/proposal-orchestrator.ts` | In-memory `enrichmentSessions` Map with TTL. Session CRUD functions. **Will be updated to use Supabase for session persistence.** |
| `apps/web/package.json` | Frontend dependencies. Needs `@supabase/supabase-js` and `@supabase/ssr` added. |
| `apps/agent/package.json` | Backend dependencies. Needs `@supabase/supabase-js` added. |
| `apps/web/.env.example` | Frontend env template. Needs Supabase URL + keys. |
| `apps/agent/.env.example` | Backend env template. Needs Supabase URL + service key. |

### Technical Decisions

1. **Supabase Local via Docker:** Development-first approach. Run `npx supabase init` + `npx supabase start` to spin up a full local Supabase stack (Postgres, Auth, Storage, Studio). Studio available at `localhost:54323`. API at `localhost:54321`. No cloud dependency during development.

2. **Store Proposals in Current Shape:** The `proposals` table stores the full `Proposal` object as-is (slug, token, type, customComponent, client as JSONB, proposal as JSONB). This avoids any frontend rendering changes in Phase 1. The block decomposition happens in Phase 2.

3. **Supabase Client via `@supabase/ssr` for Next.js:** Use `@supabase/ssr` (the recommended package for Next.js App Router) for server components and middleware. This provides `createServerClient` for server-side use and proper cookie/header handling. For the Edge middleware, use `createServerClient` with the request/response headers. For simple server component reads, use `createClient` from `@supabase/supabase-js` with the service role key (no auth state needed). The agent backend uses `createClient` from `@supabase/supabase-js` directly (no SSR needed).

4. **RLS Policy — Anon-Only for Published Proposals:** The anon role can only SELECT published proposals. **Do NOT create a catch-all `USING (true)` policy** — this would allow anon to read all proposals regardless of status. Service role bypasses RLS by default in Supabase, so no explicit service role policy is needed. Enrichment sessions have NO anon policies — only accessible via service role.

5. **Seed Script with Accurate Timestamps:** The SQL seed file (`supabase/seed.sql`) inserts the existing two proposals with explicit `published_at` timestamps set to `'2025-01-15'` (approximate original publish dates) rather than `now()`, to preserve data fidelity.

6. **Admin Page via Server Action:** The admin page (`'use client'`) cannot call async Supabase functions directly. Create a Next.js Server Action in `apps/web/src/app/admin/actions.ts` that exports `getProposals()`. This server action calls `getAllProposals()` from `proposal-helpers.ts` (which queries Supabase). The admin page calls the server action on mount via `useEffect` + `startTransition`.

7. **page.tsx Must Add `await`:** Making `proposal-helpers.ts` functions async is a breaking change for `page.tsx`. Both `generateMetadata` (line 24) and `ProposalPage` (line 55) call `getProposalBySlugAndToken()` — both must add `await`. These functions are already `async`, so this is a one-word change per call site.

8. **Enrichment Sessions in Supabase:** Replace the in-memory `Map` in `proposal-orchestrator.ts` with Supabase table operations. Session CRUD maps directly to Supabase queries. The 30-min TTL becomes a Postgres `expires_at` column. The existing `generateSessionId()` function is retained — IDs are still generated client-side and passed to Supabase on insert. Remove the `setInterval` cleanup timer — expired sessions are filtered out by the `expires_at` column in queries.

9. **Fallback Strategy (Development Only):** `proposal-helpers.ts` will attempt Supabase first and fall back to the hardcoded array if Supabase is unavailable. The fallback is **development-only**: if `NODE_ENV === 'production'` and Supabase fails, the functions return `null` / empty array (no silent stale data). In development, fallback logs a `console.warn` with the Supabase error. The middleware fallback uses a hardcoded token map as safety net in all environments, but logs errors prominently.

10. **Slug Column — NOT Unique by Itself:** Remove the column-level `UNIQUE` constraint from `slug`. The composite unique index `(slug, token)` is the correct constraint — it allows the same slug to theoretically have multiple tokens in the future (e.g., different access levels). The slug alone is not guaranteed unique.

## Implementation Plan

### Tasks

- [ ] Task 1: Initialize Supabase local project
  - File: `supabase/config.toml` (new, auto-generated)
  - Action: Run `npx supabase init` at the project root. This creates the `supabase/` directory with `config.toml`. Edit `config.toml` to set `project_id = "commercial-engine-v2"` and ensure the API port is `54321` and Studio port is `54323` (defaults).
  - Notes: Requires Docker Desktop running. The `supabase/` directory will contain migrations, seed files, and config. Add `supabase/.temp/` to `.gitignore` (local runtime state). The `supabase/` directory itself should be committed.

- [ ] Task 2: Create database migration for proposals table
  - File: `supabase/migrations/001_initial_schema.sql` (new)
  - Action: Create the initial migration SQL file with the following schema:
    ```sql
    -- Proposals table
    CREATE TABLE proposals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT NOT NULL,
      token TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      type TEXT NOT NULL DEFAULT 'standard',
      custom_component TEXT,
      client JSONB NOT NULL,
      proposal JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      published_at TIMESTAMPTZ
    );

    -- Composite unique index for slug+token lookups (primary access pattern)
    -- Slug is NOT unique by itself — allows multiple tokens per slug in future
    CREATE UNIQUE INDEX idx_proposals_slug_token ON proposals(slug, token);

    -- Index for slug-only lookups (admin dashboard, listing)
    CREATE INDEX idx_proposals_slug ON proposals(slug);

    -- Enrichment sessions table (replaces in-memory Map)
    CREATE TABLE enrichment_sessions (
      id TEXT PRIMARY KEY,
      proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
      partial_proposal JSONB NOT NULL DEFAULT '{}',
      missing_or_weak JSONB NOT NULL DEFAULT '[]',
      conversation_history JSONB NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT now(),
      last_accessed_at TIMESTAMPTZ DEFAULT now(),
      expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '30 minutes'
    );

    -- Auto-update updated_at trigger
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER proposals_updated_at
      BEFORE UPDATE ON proposals
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();

    -- Row Level Security
    ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
    ALTER TABLE enrichment_sessions ENABLE ROW LEVEL SECURITY;

    -- Anon can ONLY read published proposals (for frontend + middleware)
    CREATE POLICY "Anon can read published proposals"
      ON proposals FOR SELECT
      TO anon
      USING (status = 'published');

    -- No anon policies on enrichment_sessions — only service role can access
    -- Service role bypasses RLS by default in Supabase, so no explicit policy needed
    ```
  - Notes: The `client` and `proposal` columns store the full JSON objects matching the current `Proposal` TypeScript type. `slug` is NOT column-level unique — only the composite `(slug, token)` index enforces uniqueness, allowing future multi-token scenarios. `published_at` has no default — set explicitly in seed data. All RLS policies use explicit `TO anon` role qualifier to prevent unintended access. Service role bypasses RLS entirely by default — no catch-all `USING (true)` policy needed (that would be a security hole). Enrichment sessions have zero anon policies — completely inaccessible without service role.

- [ ] Task 3: Create seed data for existing proposals
  - File: `supabase/seed.sql` (new)
  - Action: Create a SQL seed file that inserts the two existing proposals (Imperial and Tractis demo) into the proposals table. The data must exactly match the current hardcoded objects in `apps/web/src/data/proposals.ts`, including all nested objects. The `TRACTIS_WHY_US` and `TRACTIS_CONTACT` values from `fixed-sections.ts` must be inlined into the Tractis demo proposal's `proposal` JSON (since the DB won't have access to those TypeScript constants).
    - Imperial proposal: `slug='imperial'`, `token='Zh3zaPJV4U'`, `type='customized'`, `custom_component='imperial-custom'`, full `client` and `proposal` JSONB, `published_at='2025-01-15T00:00:00Z'`
    - Tractis demo: `slug='tractis-demo'`, `token='xK8pQ2mN7v'`, `type='standard'`, `custom_component=NULL`, full `client` and `proposal` JSONB (with `TRACTIS_WHY_US` and `TRACTIS_CONTACT` inlined), `published_at='2025-01-15T00:00:00Z'`
  - Notes: Use `INSERT INTO proposals (slug, token, status, type, custom_component, client, proposal, published_at) VALUES (...)` with properly escaped JSON strings. Set `status='published'` and explicit `published_at` for both. Test by running `supabase db reset` which applies migrations + seed. Verify in Studio at `localhost:54323`.

- [ ] Task 4: Install Supabase packages in both apps
  - File: `apps/web/package.json`, `apps/agent/package.json`
  - Action: Run `pnpm --filter=@repo/web add @supabase/supabase-js @supabase/ssr` and `pnpm --filter=@repo/agent add @supabase/supabase-js`
  - Notes: `@supabase/supabase-js` v2 ships with TypeScript types. `@supabase/ssr` is the recommended package for Next.js App Router — provides `createServerClient` for server components and Edge middleware. No separate `@types` packages needed.

- [ ] Task 5: Create Supabase client for the frontend
  - File: `apps/web/src/lib/supabase.ts` (new)
  - Action: Create a Supabase client module that exports three functions:
    1. `getSupabaseClient()` — Returns a Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` via `createClient` from `@supabase/supabase-js`. Used by Edge middleware for token validation (anon role, respects RLS — can only read published proposals). Creates a lightweight client per call (Edge-compatible, no cookie state needed).
    2. `getSupabaseAdmin()` — Returns a Supabase client using `process.env.SUPABASE_URL` (falls back to `process.env.NEXT_PUBLIC_SUPABASE_URL`) and `process.env.SUPABASE_SERVICE_ROLE_KEY` via `createClient` from `@supabase/supabase-js`. Used by server components, server actions, and admin operations (service role, bypasses RLS). **Must only be used server-side — never expose service key to client.**
    3. `getSupabaseServerClient(cookieStore)` — Uses `createServerClient` from `@supabase/ssr` for use in server components that need cookie-based auth in the future. For now, this is a placeholder that most reads won't use (service role reads don't need cookies).
  - Notes: The anon client uses `NEXT_PUBLIC_` prefixed env vars (accessible in Edge Runtime). The admin client uses non-prefixed env vars (server-only). For the current use case (simple data reads), `getSupabaseAdmin()` is the primary function for server components and `getSupabaseClient()` for Edge middleware.

- [ ] Task 6: Create Supabase client for the agent backend
  - File: `apps/agent/src/lib/supabase.ts` (new)
  - Action: Create a Supabase client module that exports a `getSupabaseClient()` function. Uses `process.env.SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY`. Returns a Supabase client with service role access (full CRUD on all tables). Import `createClient` from `@supabase/supabase-js`. Create a module-level singleton (agent is a long-running Express server, not serverless — a singleton is appropriate and avoids per-request overhead).
  - Notes: Agent always uses service role — it needs to create/read/update/delete proposals and enrichment sessions. Use ES Module import style with `.js` extension in any internal imports.

- [ ] Task 7: Update `proposal-helpers.ts` to read from Supabase
  - File: `apps/web/src/lib/proposal-helpers.ts`
  - Action: Rewrite the three functions to query Supabase instead of the hardcoded array:
    1. `getProposalBySlugAndToken(slug, token)` → **make `async`**:
       - Import `getSupabaseAdmin` from `./supabase`
       - Query: `supabase.from('proposals').select('*').eq('slug', slug).eq('token', token).eq('status', 'published').single()`
       - If no data returned, return `null`
       - Map the DB row to the `Proposal` type: `{ slug: row.slug, token: row.token, type: row.type, customComponent: row.custom_component, client: row.client, proposal: row.proposal }`
       - Run Zod `ProposalSchema.safeParse()` on the mapped object (preserves existing validation)
       - Return validated data or `null` on failure
       - **Fallback:** If Supabase query throws — in development (`NODE_ENV !== 'production'`), log `console.warn('Supabase unavailable, using fallback:', error.message)` and fall back to the hardcoded array. In production, log `console.error('Supabase query failed:', error.message)` and return `null` (do NOT serve stale hardcoded data in production).
    2. `getAllProposals()` → **make `async`**:
       - Query: `supabase.from('proposals').select('*').order('created_at', { ascending: false })`
       - Map rows to `Proposal[]`
       - Same fallback strategy as above (dev: hardcoded array, prod: empty array)
    3. `validateToken(slug, token)` → **make `async`**:
       - Query: `supabase.from('proposals').select('slug').eq('slug', slug).eq('token', token).eq('status', 'published').single()`
       - Return `true` if data exists, `false` otherwise
       - Same fallback strategy
    - Keep the hardcoded `proposals` import at the top for fallback use. Add a comment: `// Fallback data — used when Supabase is unavailable in development`
  - Notes: All three functions become async. This is a breaking change for callers — see Tasks 8a and 8b.

- [ ] Task 8a: Update `page.tsx` to await async proposal-helpers (Fixes F2)
  - File: `apps/web/src/app/proposals/[slug]/[token]/page.tsx`
  - Action: Add `await` to both calls to `getProposalBySlugAndToken`:
    1. Line 24 in `generateMetadata`: change `const proposal = getProposalBySlugAndToken(slug, token)` to `const proposal = await getProposalBySlugAndToken(slug, token)`
    2. Line 55 in `ProposalPage`: change `const proposal = getProposalBySlugAndToken(slug, token)` to `const proposal = await getProposalBySlugAndToken(slug, token)`
  - Notes: Both `generateMetadata` and `ProposalPage` are already `async` functions, so adding `await` is the only change needed. Without `await`, the returned Promise object is truthy, so the `if (!proposal)` check would never trigger — proposals would render as broken instead of showing 404. This is a critical fix.

- [ ] Task 8b: Update admin page to fetch proposals from Supabase via server action (Fixes F1)
  - Files: `apps/web/src/app/admin/actions.ts` (new), `apps/web/src/app/admin/page.tsx`
  - Action:
    1. Create `apps/web/src/app/admin/actions.ts`:
       ```typescript
       'use server';

       import { getAllProposals } from '@/lib/proposal-helpers';
       import type { Proposal } from '@repo/shared';

       export async function getProposals(): Promise<Proposal[]> {
         return getAllProposals();
       }
       ```
    2. Update `apps/web/src/app/admin/page.tsx`:
       - Remove: `import { proposals } from '@/data/proposals';` (line 11)
       - Add: `import { getProposals } from './actions';`
       - Add: `import type { Proposal } from '@repo/shared';`
       - In the `ProposalDashboard` component, add state and fetch:
         ```typescript
         const [proposals, setProposals] = useState<Proposal[]>([]);
         const [loading, setLoading] = useState(true);

         useEffect(() => {
           getProposals().then(data => {
             setProposals(data);
             setLoading(false);
           });
         }, []);
         ```
       - Add a loading state in the render: if `loading`, show a spinner or "Loading proposals..."
       - The `ProposalDashboard` function currently accesses `proposals` directly — with this change it uses the state variable instead (same name, same shape)
  - Notes: Server Actions can be called from `'use client'` components — they run server-side and return serializable data. The `Proposal` type is serializable (plain objects, strings, arrays). The `proposals` variable name stays the same in the component, so all the existing JSX that references `proposals.map(...)` etc. works without changes. The `ProposalDashboard` component must receive proposals as props from the parent or manage its own state — restructure as needed.

- [ ] Task 9: Update middleware for Supabase token validation
  - File: `apps/web/src/middleware.ts`
  - Action: Replace the hardcoded `VALID_TOKENS` Map with a Supabase query:
    1. Import `getSupabaseClient` from `@/lib/supabase` — **verify this import works from middleware.** The middleware is at `src/middleware.ts` and the supabase client is at `src/lib/supabase.ts`. In Next.js, middleware can use relative imports (`./lib/supabase`) or path aliases — test with the project's `tsconfig.json` `paths` configuration. If `@/` alias doesn't resolve in Edge Runtime, use relative path `./lib/supabase`.
    2. Replace the `validateToken(slug, token)` function body:
       - Create Supabase client: `const supabase = getSupabaseClient()`
       - Query: `const { data, error } = await supabase.from('proposals').select('slug').eq('slug', slug).eq('token', token).eq('status', 'published').single()`
       - If error, fall back to hardcoded tokens (see step 6)
       - Return `!!data`
    3. Make the `validateToken` function `async` and `await` it in the middleware handler
    4. The middleware function is already exported as a regular function — make it `async` (Edge Runtime supports async middleware)
    5. Keep the rate limiting logic unchanged
    6. **Fallback:** Keep a `FALLBACK_TOKENS` Map with the current hardcoded tokens as a safety net. If the Supabase query fails (network error, Docker down), log `console.error('Supabase token validation failed, using fallback:', error)` and check against the fallback map. This prevents a Supabase outage from blocking all proposal access.
  - Notes: The `getSupabaseClient()` uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` which are available in Edge Runtime. The anon client + RLS means only published proposals are visible.

- [ ] Task 10: Update orchestrator to use Supabase for enrichment sessions
  - File: `apps/agent/src/services/proposal-orchestrator.ts`
  - Action: Replace the in-memory `enrichmentSessions` Map and all session functions with Supabase queries:
    1. Import `getSupabaseClient` from `../lib/supabase.js`
    2. Remove: `const enrichmentSessions = new Map<...>()`, the `cleanupTimer`, `cleanupExpiredSessions()`, `stopSessionCleanup()`
    3. **Retain** `generateSessionId()` — IDs are still generated client-side and passed to Supabase
    4. Rewrite `createSession(sessionId, partialProposal, missingOrWeak, initialMessage)` → **make `async`**:
       - Insert into `enrichment_sessions` table: `{ id: sessionId, partial_proposal: partialProposal, missing_or_weak: missingOrWeak, conversation_history: [{ role: 'assistant', content: initialMessage }], status: 'active', expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() }`
    5. Rewrite `getSession(sessionId)` → **make `async`**:
       - Query: `supabase.from('enrichment_sessions').select('*').eq('id', sessionId).eq('status', 'active').gt('expires_at', new Date().toISOString()).single()`
       - If found, update `last_accessed_at`: `supabase.from('enrichment_sessions').update({ last_accessed_at: new Date().toISOString() }).eq('id', sessionId)`
       - Map DB row to `EnrichmentSession` type (rename snake_case columns to camelCase)
       - Return `null` if not found or expired
    6. Update session conversation history:
       - After enrichment continues, update the row: `supabase.from('enrichment_sessions').update({ conversation_history: updatedHistory }).eq('id', sessionId)`
    7. Delete session on completion:
       - `supabase.from('enrichment_sessions').update({ status: 'completed' }).eq('id', sessionId)`
    8. Rewrite `getSessionStats()` → **make `async`**:
       - Query: `supabase.from('enrichment_sessions').select('id', { count: 'exact' }).eq('status', 'active').gt('expires_at', new Date().toISOString())`
       - Return `{ activeSessions: count, sessionTTL: 30 }`
    9. Remove `clearAllSessions()` or rewrite as: `supabase.from('enrichment_sessions').update({ status: 'completed' }).eq('status', 'active')`
    10. Remove `stopSessionCleanup()` export (no more interval timer)
  - Notes: All session functions become `async`. The callers in `generateProposal()` and `continueEnrichmentSession()` are already `async` so just add `await`. The `EnrichmentSession` interface stays the same shape — just fetched from DB instead of Map. Expired session cleanup happens naturally via the `expires_at` filter — no periodic cleanup needed. For true cleanup of old rows, a Supabase cron or manual purge can be added later.

- [ ] Task 11: Update environment variable templates
  - File: `apps/web/.env.example`
  - Action: Add the following variables (keep existing ones):
    ```
    # Supabase
    # Run `npx supabase status` to get local keys, or set production values from Supabase dashboard
    NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<run npx supabase status to get this>
    SUPABASE_SERVICE_ROLE_KEY=<run npx supabase status to get this>
    ```
  - Notes: Use placeholder comments instead of actual JWT strings to prevent accidental copy to production. Developers run `npx supabase status` after `npx supabase start` to get the actual local keys.

- [ ] Task 12: Update agent environment variable template
  - File: `apps/agent/.env.example`
  - Action: Add the following variables (keep existing ones):
    ```
    # Supabase
    # Run `npx supabase status` to get local keys, or set production values from Supabase dashboard
    SUPABASE_URL=http://localhost:54321
    SUPABASE_SERVICE_ROLE_KEY=<run npx supabase status to get this>
    ```
  - Notes: Agent only needs the service role key (no anon access needed).

- [ ] Task 13: Create `.env.local` files for development
  - Files: `apps/web/.env.local` (new), `apps/agent/.env` (update)
  - Action: After running `npx supabase start`, copy the actual local keys from `npx supabase status` output into the env files. These files are gitignored and won't be committed.
  - Notes: Ensure `.env.local` is in `.gitignore` (Next.js gitignores this by default). Ensure `apps/agent/.env` is also gitignored.

- [ ] Task 14: Update `.gitignore` for Supabase
  - File: `.gitignore` (root)
  - Action: Add the following entries if not already present:
    ```
    # Supabase local
    supabase/.temp/
    supabase/.env
    ```
  - Notes: The `supabase/` directory (migrations, config, seed) should be committed. Only the `.temp/` runtime directory and any local env files should be ignored.

- [ ] Task 15: Update existing tests for async proposal-helpers (Fixes F6)
  - File: Any test files that import or mock `proposal-helpers.ts`
  - Action: Search for all test files that reference `proposal-helpers`:
    1. Run `grep -r "proposal-helpers" apps/web/src --include="*.test.*" --include="*.spec.*"` to find affected tests
    2. For each affected test:
       - If the test imports functions directly, update calls to use `await`
       - If the test mocks the module, update mock return values to return `Promise`s
       - Wrap test bodies in `async` if not already
    3. Run `pnpm --filter=@repo/web test:run` to verify all 19 tests still pass
  - Notes: If no tests reference `proposal-helpers`, this task is a no-op — but must be verified. The branding and admin auth tests likely don't import it, but check to be sure.

- [ ] Task 16: Verify TypeScript compilation
  - Files: All new and modified files
  - Action: Run `pnpm --filter=@repo/web type-check` and `pnpm --filter=@repo/agent type-check` to verify no TypeScript errors.
  - Notes: Pay special attention to: (1) `page.tsx` — the `await` additions, (2) `admin/page.tsx` — the server action import and state changes, (3) `middleware.ts` — the import path resolution, (4) `proposal-orchestrator.ts` — all the async changes.

- [ ] Task 17: Start Supabase and verify seed data
  - Action: Run `npx supabase start` to spin up the local Docker stack. Then run `npx supabase db reset` to apply migrations and seed data. Open Studio at `http://localhost:54323` and verify:
    1. `proposals` table exists with 2 rows (Imperial + Tractis demo)
    2. `enrichment_sessions` table exists (empty)
    3. RLS policies are active — verify by running SQL in Studio: `SET ROLE anon; SELECT * FROM proposals;` should return only published rows. `SELECT * FROM enrichment_sessions;` should return 0 rows.
    4. Both proposals have `status='published'` and `published_at='2025-01-15'`
  - Notes: First run will pull Docker images (~2-3 min). Subsequent starts are fast. Use `npx supabase stop` to shut down.

- [ ] Task 18: End-to-end smoke test
  - Action: With Supabase running locally, start the frontend dev server (`pnpm --filter=@repo/web dev`). Test:
    1. `http://localhost:3000/proposals/tractis-demo/xK8pQ2mN7v` — should render the Tractis demo proposal identically to current production
    2. `http://localhost:3000/proposals/imperial/Zh3zaPJV4U` — should render the Imperial custom proposal identically
    3. `http://localhost:3000/proposals/tractis-demo/wrong-token` — should show 404
    4. `http://localhost:3000/proposals/nonexistent/anything` — should show 404
    5. `http://localhost:3000/admin` — after login, should show both proposals loaded from Supabase (verify by checking Network tab for server action call)
    6. Stop Supabase (`npx supabase stop`), refresh proposal page — in dev mode, should fall back to hardcoded data with console warning
  - Notes: Compare visually with the current production deployment to ensure no regressions.

- [ ] Task 19: Write unit tests for Supabase integration (Fixes F9)
  - File: `apps/web/src/lib/__tests__/proposal-helpers.test.ts` (new)
  - Action: Add unit tests for the updated `proposal-helpers.ts`:
    1. Mock `@supabase/supabase-js` `createClient` to return a mock Supabase client
    2. Test `getProposalBySlugAndToken`:
       - Happy path: mock returns valid row → returns validated Proposal
       - Not found: mock returns null → returns null
       - Invalid data: mock returns row that fails Zod validation → returns null
       - Supabase error (dev mode): falls back to hardcoded data, logs warning
       - Supabase error (prod mode): returns null, logs error
    3. Test `getAllProposals`:
       - Happy path: mock returns rows → returns Proposal[]
       - Empty: mock returns [] → returns []
       - Supabase error: fallback behavior per environment
    4. Test `validateToken`:
       - Valid token: returns true
       - Invalid token: returns false
       - Supabase error: fallback behavior
  - Notes: Use vitest (already configured in apps/web). Mock the Supabase client at the module level with `vi.mock()`. Set `process.env.NODE_ENV` per test to verify fallback behavior differences.

### Acceptance Criteria

- [ ] AC 1: Given Docker Desktop is running and `npx supabase start` has been executed, when `npx supabase db reset` is run, then the migrations apply successfully and the `proposals` table contains 2 rows (Imperial and Tractis demo) with `status='published'` and explicit `published_at` timestamps.

- [ ] AC 2: Given Supabase is running locally, when navigating to `http://localhost:3000/proposals/tractis-demo/xK8pQ2mN7v`, then the Tractis demo proposal renders identically to the current hardcoded version (same content, same layout, same styling).

- [ ] AC 3: Given Supabase is running locally, when navigating to `http://localhost:3000/proposals/imperial/Zh3zaPJV4U`, then the Imperial custom proposal renders identically to the current hardcoded version.

- [ ] AC 4: Given Supabase is running locally, when navigating to `http://localhost:3000/proposals/tractis-demo/wrong-token`, then the middleware returns a 404 page (token validation via Supabase rejects the invalid token).

- [ ] AC 5: Given Supabase is running locally, when navigating to `http://localhost:3000/proposals/nonexistent/anything`, then the middleware returns a 404 page (no matching slug in Supabase).

- [ ] AC 6: Given Supabase is NOT running (Docker stopped) and `NODE_ENV=development`, when navigating to `http://localhost:3000/proposals/tractis-demo/xK8pQ2mN7v`, then the proposal renders using the hardcoded fallback data, and a `console.warn` is logged with the Supabase error.

- [ ] AC 7: Given `NODE_ENV=production` and Supabase is unreachable, when `getProposalBySlugAndToken` is called, then it returns `null` (no silent fallback to stale data) and `console.error` is logged.

- [ ] AC 8: Given Supabase is running locally, when the agent backend starts (`pnpm --filter=@repo/agent dev`) and creates an enrichment session via `generateProposal()`, then the session is stored in the `enrichment_sessions` table (verifiable in Supabase Studio).

- [ ] AC 9: Given an enrichment session exists in Supabase, when `continueEnrichmentSession(sessionId, message)` is called, then the `conversation_history` JSONB column is updated with the new messages and `last_accessed_at` is refreshed.

- [ ] AC 10: Given an enrichment session was created more than 30 minutes ago and not accessed, when `getSession(sessionId)` is called, then it returns `null` (session expired based on `expires_at` column).

- [ ] AC 11: Given `pnpm --filter=@repo/web type-check` is run, when TypeScript compilation is attempted, then it completes with zero errors.

- [ ] AC 12: Given `pnpm --filter=@repo/agent type-check` is run, when TypeScript compilation is attempted, then it completes with zero errors.

- [ ] AC 13: Given the existing frontend tests plus new proposal-helpers tests, when `pnpm --filter=@repo/web test:run` is executed, then all tests pass (no regressions).

- [ ] AC 14: Given Supabase Studio is accessible at `http://localhost:54323`, when the proposals table is viewed, then both proposals show correct `client` and `proposal` JSONB data matching the original hardcoded values.

- [ ] AC 15: Given the Supabase anon key is used to query proposals via SQL (`SET ROLE anon; SELECT * FROM proposals;`), then only rows with `status='published'` are returned. Querying `enrichment_sessions` as anon returns zero rows.

- [ ] AC 16: Given the admin page is loaded at `http://localhost:3000/admin` after login, when the proposals list renders, then it shows proposals fetched from Supabase (not hardcoded data), verifiable via Network tab showing the server action call.

- [ ] AC 17: Given `page.tsx` calls `getProposalBySlugAndToken` with `await`, when the function returns `null` (invalid slug/token), then `notFound()` is called and a 404 page is displayed (the Promise-is-truthy bug is fixed).

## Additional Context

### Dependencies

- **Supabase CLI** (`npx supabase`) — Manages local Docker stack, migrations, and seed. No global install needed — runs via npx.
- **Docker Desktop** — Required for Supabase local. Must be running before `npx supabase start`. Available for Windows, macOS, Linux.
- **`@supabase/supabase-js`** (npm) — Official Supabase client library. v2.x. Edge Runtime compatible. Ships with TypeScript types.
- **`@supabase/ssr`** (npm) — Supabase helpers for Next.js App Router. Provides `createServerClient` for server components with proper cookie handling. Recommended by Supabase for Next.js projects.
- **No other external service dependencies** — Everything runs locally in Docker. No cloud accounts, no API keys from external services.

### Testing Strategy

**Automated Tests (within scope):**

1. New unit tests for `proposal-helpers.ts` (Task 19): test Supabase integration, fallback behavior, Zod validation
2. Run existing frontend test suite: `pnpm --filter=@repo/web test:run` — ensures no regressions from async changes
3. Update any existing tests that mock or call `proposal-helpers` functions (Task 15)

**Manual Testing (required for deployment):**

1. Start Supabase: `npx supabase start`
2. Reset DB with seed: `npx supabase db reset`
3. Open Studio: `http://localhost:54323` — verify 2 proposals exist with correct data
4. Verify RLS: run `SET ROLE anon; SELECT * FROM proposals;` in Studio SQL editor — only published rows
5. Verify RLS: run `SET ROLE anon; SELECT * FROM enrichment_sessions;` — zero rows
6. Start frontend: `pnpm --filter=@repo/web dev`
7. Visit Tractis demo proposal — renders correctly
8. Visit Imperial proposal — renders correctly
9. Visit with wrong token — 404
10. Visit admin page — proposals load from Supabase (check Network tab)
11. Stop Supabase (`npx supabase stop`), refresh proposal page — fallback in dev, error in prod
12. Start agent: `pnpm --filter=@repo/agent dev` — no startup errors
13. Type-check both apps — zero errors
14. Run all tests — all pass

**Future Testing (out of scope for this spec):**

- E2E tests with Playwright hitting the full stack
- Load testing middleware Supabase queries for latency
- Integration tests for enrichment session lifecycle

### Notes

- **Addresses:** RISK-2 (No Persistent Storage Anywhere) from the architectural review. Also partially addresses the "No database" gap from the infrastructure gaps table.
- **Foundational for V2:** This is Phase 1 of the 4-phase V2 migration. Phase 2 (Block Renderer) depends on proposals being in the database. Phase 3 (Agent Pipeline) depends on enrichment sessions being in Supabase. Phase 4 (Admin Dashboard) depends on all of the above.
- **No Breaking Changes to Production:** The fallback strategy means the current Vercel deployment continues working in development without Supabase. In production, Supabase must be configured — there is no silent fallback to stale data (this is intentional to prevent data divergence).
- **Proposal Data Fidelity:** The two seeded proposals contain the exact same data as the hardcoded versions, with accurate `published_at` timestamps. No content transformations, no field renames, no schema changes. The frontend renders the same output pixel-for-pixel.
- **Edge Runtime Constraint:** The middleware runs in Vercel Edge Runtime which has a limited API surface. `@supabase/supabase-js` v2 is compatible because it uses `fetch` internally. However, be aware that Edge Runtime has a 25ms CPU time limit per invocation on Vercel's free tier. A simple Supabase query should be well within this limit, but monitor if issues arise.
- **Zod Version Drift Risk:** Both apps now share Postgres as a data contract. If the agent (Zod 4) writes data that passes its schemas but fails the frontend's (Zod 3) `safeParse`, proposals will appear as `null` in the frontend. This risk is pre-existing (acknowledged in architectural review as RISK-1) and will be resolved in Phase 3 when Zod versions are aligned. For Phase 1, both apps only read/write the same proposal shape that already works, so the risk is low.
- **Migration to Hosted Supabase:** When ready to go live, create a Supabase cloud project, push migrations via `npx supabase db push`, run seed, update env vars in Vercel/Railway to point to the cloud instance. The code changes are zero — just env var swap.

### Adversarial Review Fixes Applied

| Finding | Fix |
|---------|-----|
| F1: Admin bypasses proposal-helpers | Added Task 8b: server action + admin page refactor |
| F2: page.tsx needs `await` | Added Task 8a: explicit `await` at both call sites |
| F3: Middleware import path | Task 9 now includes explicit path verification guidance |
| F4: Conflicting unique constraints | Removed column-level `UNIQUE` from slug (Technical Decision #10) |
| F5: RLS security hole | Removed catch-all policies, added `TO anon` qualifier (Technical Decision #4) |
| F6: No task to update tests | Added Task 15: find and update affected tests |
| F7: Should use @supabase/ssr | Added `@supabase/ssr` to Task 4, updated Task 5 with `createServerClient` |
| F8: Enrichment sessions exposed | Fixed by F5 fix — no anon policies on enrichment_sessions |
| F9: No new automated tests | Added Task 19: unit tests for proposal-helpers |
| F10: Silent fallback danger | Technical Decision #9: prod returns null, dev-only fallback |
| F11: generateSessionId not addressed | Task 10 step 3 explicitly retains the function |
| F12: Zod drift via shared DB | Added Notes section acknowledging risk + mitigation |
| F13: Real JWTs in .env.example | Tasks 11-12 now use placeholder comments |
| F14: published_at loses dates | Task 3 + Technical Decision #5: explicit timestamps in seed |
