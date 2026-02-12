# Architecture V2: Block-Based Proposal System

**Date:** 2026-02-10
**Author:** Winston (Architect Agent)
**Status:** Approved Direction — Ready for Implementation Planning
**Supersedes:** Current rigid 8-section variant architecture

---

## Why This Change

The current architecture forces every proposal into a fixed 8-section structure with a variant mapper. This causes:

1. **Costly Vercel redeployments** — proposals are hardcoded in source, every new proposal = redeploy
2. **Artificial rigidity** — proposals that don't need a roadmap still need one
3. **Unnecessary complexity** — variant mapper, 32 variant slots, rigid schemas
4. **Schema coupling** — changes ripple across shared → agent → web

The new architecture stores proposals in Supabase as ordered arrays of content blocks. The frontend reads from the DB and renders whatever blocks exist — 3 or 15, doesn't matter.

---

## Core Concept: Block-Based Proposals

A proposal is no longer a fixed shape. It's an ordered list of blocks, where each block references a component from the library and carries its own data.

```
┌─────────────────────────────────────────┐
│  Proposal (DB Row)                      │
│                                         │
│  slug: "imperial"                       │
│  client: { name, logo, colors }         │
│  blocks: [                              │
│    { component: "hero-gradient",    ... }│
│    { component: "problem-list",     ... }│
│    { component: "solution-diagram", ... }│
│    { component: "stats-bar",        ... }│
│    { component: "pricing-tiers",    ... }│
│    { component: "cta-dual",         ... }│
│  ]                                      │
└─────────────────────────────────────────┘
```

The frontend is a simple block renderer:

```tsx
function ProposalPage({ proposal }) {
  return (
    <ProposalLayout client={proposal.client}>
      {proposal.blocks.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </ProposalLayout>
  )
}

function BlockRenderer({ block }) {
  const Component = COMPONENT_REGISTRY[block.component]
  if (!Component) return null
  return <Component data={block.data} client={block.client} />
}
```

---

## Component Library

The Designer Agent selects from a catalog of concrete React components. Each component is purpose-built for a type of content and has a defined data contract.

### Component Catalog (Initial Set)

Build these based on what already exists + what the Imperial custom proposal uses:

#### Hero / Header Components
| Component Name | Best For | Data Shape |
|---------------|----------|------------|
| `hero-gradient` | Bold opening with client branding | `{ title, subtitle, backgroundStyle }` |
| `hero-simple` | Clean, minimal header | `{ title, subtitle }` |
| `hero-image` | Visual-first proposals | `{ title, subtitle, imageUrl }` |

#### Content / Narrative Components
| Component Name | Best For | Data Shape |
|---------------|----------|------------|
| `executive-summary-brief` | Short paragraph overview | `{ content: string }` |
| `executive-summary-cards` | Structured key points | `{ cards: { title, content, icon }[] }` |
| `problem-list` | Numbered pain points | `{ title, items: { number, text }[] }` |
| `solution-narrative` | Story-driven explanation | `{ content: string, highlights?: string[] }` |
| `solution-diagram` | Visual flow (A → B → C) | `{ steps: { label, description }[], result: string }` |

#### Features Components
| Component Name | Best For | Data Shape |
|---------------|----------|------------|
| `features-grid` | 4-8 features with icons | `{ features: { title, description, icon }[] }` |
| `features-showcase` | 2-3 hero features | `{ features: { title, description, icon, detail }[] }` |
| `features-list` | Long feature lists | `{ features: { title, description }[] }` |

#### Data / Metrics Components
| Component Name | Best For | Data Shape |
|---------------|----------|------------|
| `stats-bar` | 3-4 key metrics in a row | `{ stats: { label, value }[] }` |
| `business-case` | ROI / cost savings | `{ costSaving?, additionalIncome?, roi?, metrics? }` |
| `tech-stack` | Technology categories | `{ categories: { name, technologies: string[] }[] }` |

#### Timeline / Roadmap Components
| Component Name | Best For | Data Shape |
|---------------|----------|------------|
| `timeline-vertical` | Sequential phases | `{ phases: { title, date, description, deliverables? }[] }` |
| `timeline-horizontal` | Compact milestone view | `{ milestones: { label, date }[] }` |
| `roadmap-phases` | Grouped deliverables | `{ phases: { name, items: string[] }[] }` |

#### Pricing Components
| Component Name | Best For | Data Shape |
|---------------|----------|------------|
| `pricing-tiers` | 2-3 plan comparison | `{ tiers: { name, price, period?, features, recommended? }[] }` |
| `pricing-table` | Detailed feature comparison | `{ headers: string[], rows: { feature, values }[] }` |
| `pricing-simple` | Single price or custom | `{ description: string, price?: string, cta?: string }` |
| `pricing-dual` | Setup + recurring split | `{ options: { title, price, period, features }[] }` |

#### CTA / Contact Components
| Component Name | Best For | Data Shape |
|---------------|----------|------------|
| `cta-dual` | Email + WhatsApp/Call | `{ title, actions: { label, href, icon }[] }` |
| `cta-simple` | Single action button | `{ title, subtitle, buttonText, buttonHref }` |
| `contact-card` | Full contact details | `{ name, role, email, phone, website, linkedin, calendly? }` |

#### Utility Components
| Component Name | Best For | Data Shape |
|---------------|----------|------------|
| `section-divider` | Visual break | `{ style: 'line' | 'gradient' | 'wave' }` |
| `quote-block` | Client testimonial or highlight | `{ quote, author?, role? }` |
| `why-us` | Company differentiators | `{ content: string }` (markdown) |

### Adding New Components

When a new proposal needs a component that doesn't exist:
1. Build the React component in `components/proposal/blocks/`
2. Register it in `COMPONENT_REGISTRY`
3. Update the Designer Agent's prompt with the new component spec
4. No schema changes needed — blocks are flexible by design

---

## Database: Supabase

### Schema

```sql
-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',  -- draft, published, archived

  -- Client branding
  client_name TEXT NOT NULL,
  client_logo TEXT,
  client_favicon TEXT,
  client_color_primary TEXT NOT NULL DEFAULT '#e6c15c',
  client_color_accent TEXT NOT NULL DEFAULT '#5e6b7b',

  -- Proposal content (JSONB array of blocks)
  blocks JSONB NOT NULL DEFAULT '[]',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,

  -- Generation metadata
  source_document_text TEXT,        -- Original uploaded text
  agent_reasoning JSONB,            -- Designer agent's reasoning
  generation_status TEXT             -- pending, parsing, enriching, designing, complete, failed
);

-- Token uniqueness per proposal
CREATE UNIQUE INDEX idx_proposals_slug_token ON proposals(slug, token);

-- Enrichment sessions (replaces in-memory Map)
CREATE TABLE enrichment_sessions (
  id TEXT PRIMARY KEY,               -- enrich_{timestamp}_{random}
  proposal_id UUID REFERENCES proposals(id),
  conversation_history JSONB NOT NULL DEFAULT '[]',
  parsed_content JSONB,              -- Agent 2A output
  enriched_content JSONB,            -- Agent 2B output (built up over conversation)
  status TEXT NOT NULL DEFAULT 'active',  -- active, completed, expired
  created_at TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '30 minutes'
);

-- Auto-update updated_at
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

-- Public read access for published proposals (via token validation)
CREATE POLICY "Public can read published proposals"
  ON proposals FOR SELECT
  USING (status = 'published');

-- Service role has full access (backend API)
CREATE POLICY "Service role full access to proposals"
  ON proposals FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to sessions"
  ON enrichment_sessions FOR ALL
  USING (auth.role() = 'service_role');
```

### Access Patterns

| Operation | Who | How |
|-----------|-----|-----|
| Read published proposal | Public (via slug + token) | Supabase anon key + RLS |
| List all proposals | Admin dashboard | Supabase service key |
| Create proposal | Admin / Agent pipeline | Supabase service key |
| Update proposal | Admin / Agent pipeline | Supabase service key |
| Manage sessions | Agent backend | Supabase service key |

---

## Updated Agent Pipeline

The 3-agent pipeline stays, but Agent 3 (Designer) changes significantly:

### Agent 2A: Parser (Groq Llama) — Minimal Change
- Still parses uploaded documents into structured sections
- Output is now **flexible** — extract whatever sections exist, don't force 8
- Returns an array of content chunks with labels, not a fixed schema

### Agent 2B: Enrichment (Claude) — Minimal Change
- Still fills gaps interactively
- Sessions now persist in Supabase instead of in-memory Map
- Survives server restarts

### Agent 3: Designer (Claude) — Major Change
- **Input:** Enriched content + client branding + **component catalog**
- **Task:** Analyze content and compose an ordered array of blocks
- **Each block:** Pick a component name from the catalog + shape the data to match its contract
- **Output:** `blocks: ProposalBlock[]` ready to store in Supabase
- **System prompt** includes the full component catalog with data shapes and usage guidance

```
Designer Agent receives:
├── Enriched content (from Agent 2A/2B)
├── Client branding (name, colors, logo)
├── Component Catalog (name → data shape → best-for description)
│
Designer Agent outputs:
└── blocks: [
      { component: "hero-gradient", data: { ... } },
      { component: "problem-list", data: { ... } },
      { component: "features-grid", data: { ... } },
      { component: "pricing-dual", data: { ... } },
      { component: "cta-dual", data: { ... } }
    ]
```

---

## Updated Frontend Architecture

### Proposal Rendering (Simplified)

```
/proposals/[slug]/[token]
  │
  ├── Fetch proposal from Supabase (by slug + token, status = published)
  ├── Apply client branding CSS variables
  └── Render blocks:
        blocks.map(block => COMPONENT_REGISTRY[block.component](block.data))
```

No more:
- Variant mapper
- Fixed 8-section layout
- Hardcoded proposal data
- `proposals.ts` data file
- `fixed-sections.ts` (Tractis "Why Us" and contact become just blocks like any other)

### Admin Dashboard (Enhanced)

The admin dashboard becomes the full control center:

1. **Create Proposal**
   - Enter client name, website URL, upload document
   - Triggers agent pipeline → saves to Supabase as draft
   - Shows generation progress (parsing → enriching → designing)

2. **Enrichment Interface**
   - If Agent 2B needs input, show the conversation inline
   - User answers questions directly in admin
   - Sessions persisted in Supabase

3. **Review & Edit**
   - Preview the generated proposal
   - Reorder blocks (drag & drop)
   - Edit block data inline
   - Add/remove blocks manually
   - Change component selection for a block

4. **Publish**
   - Set status to published
   - Auto-generate token
   - Copy shareable URL
   - No Vercel redeploy needed

5. **Manage**
   - List all proposals (draft, published, archived)
   - Archive old proposals
   - Duplicate a proposal as a starting point

---

## Migration Path

### Phase 1: Database Foundation
1. Set up Supabase project
2. Create proposals + enrichment_sessions tables
3. Add `@supabase/supabase-js` to both apps
4. Migrate existing 2 proposals (Imperial + Tractis demo) to DB
5. Update frontend to read from Supabase instead of `proposals.ts`
6. Update middleware to validate tokens from Supabase
7. **Result:** No more redeployments for new proposals

### Phase 2: Block Renderer
1. Build `BlockRenderer` component
2. Build `COMPONENT_REGISTRY` with initial component set
3. Convert existing proposal components into block components
4. Convert Imperial custom proposal into blocks (hero-gradient, problem-list, etc.)
5. Convert Tractis demo into blocks
6. Remove old variant mapper, fixed 8-section layout, `proposals.ts`
7. **Result:** Block-based rendering live

### Phase 3: Agent Pipeline Update
1. Align Zod versions (Zod 4 across monorepo)
2. Update Agent 2A prompt for flexible section extraction
3. Move enrichment sessions to Supabase
4. Rewrite Agent 3 prompt with component catalog
5. Update Agent 3 output schema (blocks array)
6. Delete duplicate schemas and fixed-sections files
7. **Result:** Full pipeline generates block-based proposals

### Phase 4: Admin Dashboard
1. Add proposal creation flow (upload → generate → save to DB)
2. Add enrichment conversation UI
3. Add proposal preview
4. Add publish/archive controls
5. Move admin auth to Supabase Auth or environment variable
6. Add block reordering and inline editing
7. **Result:** Full admin control center, no code changes needed for new proposals

---

## What Gets Deleted

After migration is complete, these files/concepts are removed:

| File/Concept | Reason |
|-------------|--------|
| `apps/web/src/data/proposals.ts` | Proposals live in Supabase |
| `apps/web/src/data/fixed-sections.ts` | "Why Us" and Contact are just blocks |
| `apps/agent/src/lib/fixed-sections.ts` | Same — blocks, not fixed sections |
| `apps/web/src/lib/variant-mapper.tsx` | Replaced by COMPONENT_REGISTRY |
| `apps/agent/src/lib/agent-schemas.ts` | Replaced by shared schemas |
| Variant enums in shared package | No more variants — just component names |
| `VARIANT_SYSTEM.md` | Architecture doc for old system |
| Hardcoded token Map in middleware | Tokens validated from Supabase |
| In-memory session Map | Sessions in Supabase |
| `apps/web/src/components/proposal/custom/imperial-custom.tsx` | Decomposed into reusable blocks |

---

## Environment Variables (Updated)

### Frontend (apps/web)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...        # Public read access
SUPABASE_SERVICE_ROLE_KEY=eyJ...             # Admin dashboard operations
ADMIN_PASSWORD=<from-env-not-hardcoded>
```

### Backend (apps/agent)
```env
GROQ_API_KEY=gsk_...
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...             # Full DB access
PORT=3001
```

---

## Key Benefits Summary

| Before (V1) | After (V2) |
|-------------|------------|
| Redeploy Vercel for every new proposal | Add proposals from admin, zero redeployments |
| Fixed 8 sections, must fill all | Any number of sections, compose freely |
| 32 variant slots (31 unbuilt) | Component library, build what you need |
| Variant mapper + rigid schemas | Simple block renderer |
| Hardcoded tokens and proposals | Everything in Supabase |
| In-memory sessions (lost on restart) | Persistent sessions in Supabase |
| Imperial is a "special case" custom component | Imperial is just blocks like everything else |
| Schema changes ripple everywhere | Blocks are self-contained |
