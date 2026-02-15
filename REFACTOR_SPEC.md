# Proposal Engine Refactor — Consolidated Spec

**Date:** February 15, 2026
**Status:** Approved for implementation
**Approach:** Incremental (build alongside existing system, switch when proven)

---

## 1. What We Have Today

### Current Architecture
- **3-agent pipeline** run via `/create-proposal` slash command in Claude Code:
  - **Agent 2A (Parser):** Extracts 6 sections from raw proposal markdown
  - **Agent 2B (Enrichment):** Interactive Q&A to fill content gaps
  - **Agent 3 (Designer):** Maps content to 22 React block components, outputs JSON `blocks[]`
- **22 React block components** in `apps/web/src/components/proposal/blocks/` — cards-based, zero tables
- **Proposal data = JSON** stored in Supabase `proposals` table (slug, token, client, metadata, blocks)
- **Server-side rendering:** Next.js fetches JSON from Supabase, renders React components at request time
- **Route:** `/proposals/[slug]/[token]` → layout applies branding CSS vars → `BlockRenderer` maps blocks to components
- **Brand extraction:** Dembrandt CLI scrapes client website for colors, logos, favicon
- **Branding:** 9 color fields (primary, accent, background, foreground, card, cardForeground, muted, mutedForeground, border) applied as CSS variables
- **Save script:** `scripts/save-proposal.ts` validates JSON with Zod, inserts into Supabase
- **Deployment:** Frontend on Vercel (`proposal.tractis.ai`), every new component = redeploy

### Current Problems
1. **Redeploy per proposal** — any component change triggers Vercel build (costly)
2. **Limited visuals** — 22 generic block components, no shadcn/Magic UI/Aceternity UI patterns
3. **Poor color palette** — only 2 brand colors used, Dembrandt extracts UI noise (grays, state colors, third-party colors)
4. **Rigid structure** — all proposals follow similar block patterns despite different content

---

## 2. New Architecture

### Core Concept
The agent pipeline generates a **self-contained HTML file** per proposal (like a Claude artifact). No React rendering at runtime. The HTML lives in Supabase Storage and is served through a lightweight proxy that never needs redeploy.

### New 4-Agent Pipeline

```
Dembrandt scrape → Agent 1 (Brand Designer) → Agent 2 (Architect) → Agent 3 (HTML Builder) → Agent 4 (Polish) → Tailwind compile → Upload to Supabase Storage
```

#### Agent 1 — Brand Designer (Sonnet 4.5)
- **Input:** Raw Dembrandt JSON from client website
- **Output:** Complete design system JSON
- **Job:** Filter UI noise, identify 2-3 real brand colors (from logo/header/CTAs), generate full palette:
  - Backgrounds (base, surface, elevated) — not pure white/black, tinted with brand
  - Text colors (primary, secondary, muted) — with brand tint
  - Borders, gradients, shadows — all brand-tinted
  - Typography (heading + body font families)
  - Mood (corporate/tech/premium/industrial/friendly)
  - Theme (dark/light)
  - Logo metadata (URL, transparent bg, best-on dark/light)

#### Agent 2 — Proposal Architect (Sonnet 4.5)
- **Input:** Design system JSON + complete proposal markdown
- **Output:** Section architecture JSON (blueprint)
- **Job:** Define visual structure — sections, order, visual pattern per section, animations, color scheme per section, narrative flow. Each proposal gets a UNIQUE structure based on content:
  - Metrics → number tickers, bento grid
  - Timeline → tracing beam
  - Before/after → split section
  - Pricing → cards with highlight
  - Technical → sobrio, code blocks
  - Executive → more visual, less text

#### Agent 3 — HTML Builder (Sonnet 4.5)
- **Input:** Architecture JSON + Design system + proposal markdown
- **Output:** Complete self-contained HTML
- **Job:** Follow the architect's blueprint exactly. Generate HTML + Tailwind classes + CSS animations + vanilla JS (IntersectionObserver for scroll reveals). All proposal content must be present — no summaries, no omissions. Mobile responsive. Uses placeholders for assets: `{{logo:client}}`, `{{logo:tractis}}`, `{{favicon:client}}`

#### Agent 4 — Polish & QA (Sonnet 4.5)
- **Input:** HTML from Agent 3
- **Output:** Polished HTML
- **Job:** Make it premium — fix abrupt transitions, add micro-interactions, ensure consistent spacing/typography, verify gradients/shadows use brand tints, smooth scroll, responsive check. Does NOT change content or structure.

### Post-Agent Build Step: Tailwind Compilation
- Agents write Tailwind utility classes (what LLMs are best at)
- **Before upload**, run Tailwind CLI locally to compile used classes into a `<style>` block
- Strip the CDN `<script>` tag
- Result: fully self-contained HTML with no external JS dependency
- This gives agents full access to Tailwind's expressiveness (shadcn/Aceternity/Magic UI patterns) without CDN concerns in production

### Visual Library (What Agents Replicate in HTML)
Agents don't import React libraries — they replicate visual patterns in HTML+Tailwind+CSS:

**From shadcn/ui:** Cards (glass, bordered, elevated), Badge, Tabs, Tables, Accordion
**From Magic UI:** Animated gradients, marquee, number tickers, shimmer buttons, bento grids, blur fade
**From Aceternity UI:** Spotlight cards, background beams, floating navbar, typewriter text, infinite cards, lamp headers, wavy backgrounds, 3D hover cards, meteors, tracing beams
**Layout patterns:** Cinematic heroes, asymmetric bento grids, vertical timelines, pricing tables, split sections, parallax, sticky headers with backdrop-blur

### Cost
~$0.37 per proposal (4x Sonnet) vs ~$1.00 with single Opus pass

---

## 3. Infrastructure Changes

### Supabase — New Table Schema

```sql
create table proposals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  token text not null,
  client_name text not null,
  client_url text,
  status text default 'draft',  -- draft, sent, viewed, accepted, rejected
  view_count int default 0,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create function increment_view(proposal_slug text)
returns void as $$
  update proposals
  set view_count = view_count + 1,
      status = case when status = 'sent' then 'viewed' else status end
  where slug = proposal_slug;
$$ language sql;
```

### Supabase Storage — New Buckets (Private)
- **`proposals`** — HTML files (`{slug}.html`)
- **`proposal-assets`** — Client logos, favicons, other assets

### Serving Layer — Next.js Proxy

Route: `app/[slug]/[token]/route.ts` (API Route, GET handler)

Flow:
1. Validate token against DB
2. Check expiration
3. Track view (`increment_view` RPC)
4. Fetch HTML from Storage (`proposals/{slug}.html`)
5. Inject signed URLs — replace `{{logo:client}}`, `{{logo:tractis}}`, `{{favicon:client}}` with fresh 1-hour signed URLs from `proposal-assets` bucket
6. Serve HTML with `Content-Type: text/html; charset=utf-8`

### Generation Script

`scripts/generate-proposal.ts` — standalone pipeline:
1. Scrape brand with Dembrandt
2. Download + upload client logo to Supabase Storage
3. Agent 1: Brand → Design System
4. Agent 2: Design System + MD → Architecture
5. Agent 3: Architecture + Design System + MD → HTML
6. Agent 4: HTML → Polished HTML
7. Tailwind CLI compile (strip CDN, inline CSS)
8. Upload HTML to Storage
9. Insert record in DB
10. Print URL: `proposal.tractis.ai/{slug}/{token}`

---

## 4. Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Agent 2B (Enrichment) | **Removed** | Gerhard writes rich proposals himself, no need for interactive gap-filling |
| Migration strategy | **Incremental** | Build new pipeline alongside existing system, keep current rendering until new one is proven |
| Tailwind in production | **Local compilation** | Agents write Tailwind classes, CLI compiles to `<style>` block before upload — no CDN dependency, no FOUC |
| Model for agents | **Sonnet 4.5** | 4 specialized agents with reduced scope, better quality than single Opus pass, cheaper |

---

## 5. What Gets Created

- `scripts/generate-proposal.ts` — Full 4-agent pipeline
- `app/[slug]/[token]/route.ts` — HTML proxy route handler
- `injectSignedUrls()` utility function
- System prompts for 4 agents (in `apps/agent/prompts/`)
- `scrapeBrand()` function (Dembrandt integration)
- `uploadClientLogo()` function
- Supabase: `proposals` table (new schema), `proposals` bucket, `proposal-assets` bucket

## 6. What Gets Removed (After Migration)

- `apps/web/src/components/proposal/blocks/` — All 22 React block components
- `BlockRenderer` and component registry
- `apps/web/src/components/proposal/block-renderer.tsx`
- Current `apps/web/src/app/proposals/[slug]/[token]/page.tsx` (replaced by route.ts proxy)
- Current proposal layout with React rendering
- `apps/agent/prompts/agent-2a-parser.md`
- `apps/agent/prompts/agent-2b-enrichment.md`
- `apps/agent/prompts/agent-3-designer.md`
- `apps/agent/docs/VARIANT_SELECTION_GUIDE.md`
- JSON-based proposal storage in Supabase (blocks, client, metadata columns)

## 7. What Stays

- Admin tab (reads `proposals` table — just needs schema adaptation)
- Domain `proposal.tractis.ai` on Vercel
- Next.js project on Vercel (now a proxy, not a renderer)
- Supabase as backend
- Dembrandt for brand scraping
- `CLAUDE.md`, `README.md`, `PROJECT_STATE.md` (updated post-refactor)
