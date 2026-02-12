---
title: 'V2 Block Renderer - Component Registry + Block-Based Proposals'
slug: 'v2-block-renderer'
created: '2026-02-12'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['next@16.1.6', 'react@19', 'typescript@5.7.3', 'zod@3.23.8 (shared)', 'tailwindcss@3.4.17', 'vitest@4.0.18', '@supabase/supabase-js', 'lucide-react']
files_to_modify: ['packages/shared/src/types/proposal.ts', 'apps/web/src/app/proposals/[slug]/[token]/page.tsx', 'apps/web/src/app/proposals/[slug]/[token]/layout.tsx', 'apps/web/src/lib/proposal-helpers.ts', 'apps/web/src/app/admin/page.tsx', 'apps/web/src/components/proposal/block-renderer.tsx (new)', 'apps/web/src/components/proposal/blocks/ (new dir)', 'supabase/migrations/002_block_schema.sql (new)', 'supabase/seed.sql']
code_patterns: ['Section components accept specific typed props (content: string, needs: string[], features: Feature[])', 'Components wrapped in <section> with Tailwind spacing classes', 'Layout handles branding via generateBrandingCSSVars() CSS custom properties', 'ProposalErrorBoundary wraps each section for graceful failure', 'Variant mapper uses Record<VariantName, ComponentType> but 30/32 slots are TODO stubs', 'Custom proposals use dynamic import from components/proposal/custom/', 'Admin dashboard fetches via server action (apps/web/src/app/admin/actions.ts)']
test_patterns: ['vitest with @testing-library/react and jsdom', '28 existing tests (7 branding + 12 admin auth + 9 proposal-helpers)', 'Tests mock @supabase/supabase-js for DB calls']
---

# Tech-Spec: V2 Block Renderer - Component Registry + Block-Based Proposals

**Created:** 2026-02-12

## Overview

### Problem Statement

Proposals are locked into a rigid 8-section layout (`executiveSummary`, `needs`, `solution`, `features`, `roadmap`, `whyUs`, `pricing`, `contact`) with a variant mapper that selects from mostly-unbuilt component variants. Custom proposals like Imperial require entirely separate 553-line components that duplicate rendering logic. Adding new section types, reordering sections, or varying the number of sections requires code changes. The variant mapper has 32 slots but only 2 distinct components are actually built (base + detailed). This rigidity is the core architectural blocker identified in the V2 architecture plan.

### Solution

Replace the fixed 8-section `proposal` JSONB column with an ordered `blocks` JSONB array. Each block references a component from a `COMPONENT_REGISTRY` and carries its own data. The frontend becomes a simple `BlockRenderer` that iterates over blocks and renders the matching component. Imperial and Tractis demo proposals are decomposed into blocks using only the components needed to render them. The variant mapper, fixed section layout, and custom component routing are all removed.

### Scope

**In Scope:**
- New `Block` schema (Zod + TypeScript) replacing `ProposalData`
- `BlockRenderer` component + `COMPONENT_REGISTRY`
- Block components needed to render Imperial + Tractis demo (minimum viable set)
- DB migration: replace `proposal` JSONB with `blocks` JSONB array on proposals table
- Updated seed data converting both proposals to block format
- Updated proposal page to use BlockRenderer
- Removal of: variant-mapper.tsx, fixed 8-section rendering, custom component routing
- Shared schema updates (packages/shared)
- Updated proposal-helpers.ts mapping (all three functions + dev fallback removal)
- Layout generalization (remove Imperial-specific hardcoding)

**Out of Scope:**
- Framer Motion animations (follow-up — see Notes)
- Full component catalog from architecture doc (build on demand)
- Admin block editing/reordering UI (Phase 4)
- Agent pipeline changes to output blocks (Phase 3)
- New proposal creation flow
- Block drag-and-drop or visual editor

## Context for Development

### Codebase Patterns

1. **Section components** use simple typed props interfaces — `{ content: string }`, `{ needs: string[] }`, `{ features: Feature[] }`, etc. Each renders a `<section>` with Tailwind spacing. No variant awareness inside components.
2. **Layout** (`layout.tsx`) fetches the proposal, applies branding CSS vars via `generateBrandingCSSVars()`, and renders a sticky header with logo. Has separate paths for `customized` vs `standard` proposals. The customized path has Imperial-specific hardcoding.
3. **Variant mapper** (`variant-mapper.tsx`) maps variant enum strings to React components via `Record<VariantName, ComponentType>`. 32 total slots (8 sections x 4 variants), only `ExecutiveSummary` and `ExecutiveSummaryDetailed` are distinct components. All other 30 slots map to the base component.
4. **Custom proposal routing** (`page.tsx`) uses dynamic `import()` from `components/proposal/custom/` directory based on `proposal.customComponent` field.
5. **Branding** (`branding.ts`) generates CSS custom properties (`--brand-primary`, `--brand-accent`, `--background`, etc.) from client colors. `generateBrandingCSSVars(proposal)` and `getProposalBranding(proposal)` both accept the `Proposal` type but only read `proposal.client.colors` and `proposal.client.logo` — they do NOT read `proposal.type`, `proposal.customComponent`, or `proposal.proposal`, so the schema change is safe.
6. **Shared schema** (`packages/shared/src/types/proposal.ts`) defines `ProposalDataSchema` with 8 fixed fields + 8 variant fields + optional `businessCase`/`techStack`. `ProposalSchema` wraps it with `slug`, `token`, `type`, `customComponent`, `client`.
7. **DB schema** — `proposals` table has `proposal JSONB` column storing the 8-section data shape. `client JSONB` is separate.
8. **Admin dashboard** reads proposals via server action and displays `proposal.proposal.executiveSummary`, `proposal.proposal.features.length`, `proposal.proposal.roadmap.length`.
9. **Page content wrapper** — Current `page.tsx` wraps all 8 sections in `<div className="mx-auto max-w-5xl px-6 py-12 space-y-16">`. Imperial custom component uses its own `<div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-16 sm:space-y-24 md:space-y-32">`. This wrapper provides the container width, padding, and inter-block spacing.
10. **Double fetch** — Both `layout.tsx` and `page.tsx` call `getProposalBySlugAndToken()`. Since this uses Supabase client directly (not `fetch`), Next.js request deduplication does NOT apply. This results in 2 DB queries per page load. This is a pre-existing issue and is NOT addressed in this spec (acceptable for current scale).

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `packages/shared/src/types/proposal.ts` | Current ProposalSchema + all variant types — will be rewritten for blocks |
| `apps/web/src/lib/variant-mapper.tsx` | Variant→Component mapping — **DELETE** |
| `apps/web/src/app/proposals/[slug]/[token]/page.tsx` | Proposal page rendering — rewrite for BlockRenderer |
| `apps/web/src/app/proposals/[slug]/[token]/layout.tsx` | Layout with branding + header — generalize |
| `apps/web/src/components/proposal/executive-summary.tsx` | Props: `{ content: string }` — move to blocks/ |
| `apps/web/src/components/proposal/understanding-needs.tsx` | Props: `{ needs: string[] }` — move to blocks/ |
| `apps/web/src/components/proposal/solution.tsx` | Props: `{ content: string, businessCase?, techStack? }` — move to blocks/ |
| `apps/web/src/components/proposal/features-section.tsx` | Props: `{ features: Feature[] }` — move to blocks/ |
| `apps/web/src/components/proposal/roadmap.tsx` | Props: `{ items: RoadmapItem[] }` — move to blocks/ |
| `apps/web/src/components/proposal/why-us.tsx` | Props: `{ content: string }` — move to blocks/ |
| `apps/web/src/components/proposal/pricing-section.tsx` | Props: `{ pricing: PricingSection }` — move to blocks/ |
| `apps/web/src/components/proposal/contact-section.tsx` | Props: `{ contact: ContactInfo }` — move to blocks/ |
| `apps/web/src/components/proposal/proposal-error-boundary.tsx` | Error boundary — keep, use in BlockRenderer |
| `apps/web/src/components/proposal/variants/executive-summary-detailed.tsx` | Only built variant — unused in current proposals |
| `apps/web/src/components/proposal/custom/imperial-custom.tsx` | 553-line Imperial — decompose into blocks, then **DELETE** |
| `apps/web/src/data/proposals.ts` | Hardcoded data — **DELETE** |
| `apps/web/src/data/fixed-sections.ts` | TRACTIS_CONTACT, TRACTIS_WHY_US — keep for seed reference |
| `apps/web/src/lib/proposal-helpers.ts` | Maps DB rows to Proposal type — update ALL 3 functions + remove dev fallback import |
| `apps/web/src/lib/branding.ts` | CSS var generation — **KEEP unchanged** (verified: only reads `client.colors` and `client.logo`) |
| `apps/web/src/app/admin/page.tsx` | Admin dashboard — update for block-based data (both Dashboard and CreateProposal copy) |
| `supabase/migrations/001_initial_schema.sql` | Current schema with `proposal JSONB` |
| `supabase/seed.sql` | Current seed data |

### Technical Decisions

1. **Clean break, not backward-compatible** — Replace `proposal` column with `blocks` column. Only 2 proposals exist, no production traffic. No migration shim needed. Rollback: `supabase db reset` restores from 001 migration + old seed (revert seed.sql and remove 002 migration file).
2. **No animations in initial block components** — Imperial currently uses Framer Motion. Block components will render the same content/layout statically. Animations are a styling layer to add back per-component later.
3. **Minimum viable component set** — Only build block components needed for Imperial + Tractis demo. The registry pattern makes future additions trivial.
4. **Block data shape** — Each block carries `{ id: string, component: string, data: Record<string, unknown> }`. The `component` string maps to `COMPONENT_REGISTRY`. The `data` shape is component-specific. Block components must defensively extract data with null checks (not bare `as` casts).
5. **Reuse existing section components** — The 8 existing section components have clean props interfaces. They move into `blocks/` directory and get registered in the component registry.
6. **Imperial decomposition** — Imperial breaks into 6 blocks: `hero-gradient`, `problem-cards`, `solution-diagram`, `pricing-tiers`, `cta-banner`, `footer-branded`. Each is a new block component with Imperial's layout but without Framer Motion.
7. **Layout generalization** — Remove `if (proposal.type === 'customized')` branch. Add a `headerStyle` field to proposal metadata (stored in a new `metadata` JSONB column) so any proposal can configure its header appearance.
8. **`type` and `customComponent` fields removed** from ProposalSchema — no longer needed when everything is blocks. Remove from DB schema too.
9. **Content wrapper in page.tsx** — The `BlockRenderer` is rendered inside a wrapper `<div>` that provides `max-w-{maxWidth}`, padding, and `space-y-16` inter-block spacing. The `maxWidth` comes from `proposal.metadata.maxWidth`. Imperial blocks that need full-bleed (hero-gradient, cta-banner, footer-branded) break out of this container using negative margins or are rendered outside the wrapper.
10. **Block components are server components by default** — Since Framer Motion is stripped, no block component needs `'use client'`. All block components should be server components unless they require client-side interactivity (none currently do). If a future block needs interactivity, add `'use client'` to that specific block file.
11. **Imperial icons are emoji strings, not Lucide names** — The Imperial `solution-diagram` uses emoji strings (`'🚚'`, `'🛣️'`, `'📍'`, `'📊'`) for the TMS systems in the flow diagram. These are stored as-is in block data and rendered as text. The `icon` field in `problem-cards` and `solution-diagram` benefits uses Lucide icon name strings (`"Zap"`, `"Shield"`, `"Layers"`, `"TrendingUp"`). The component renders `<Zap />` etc via a small icon lookup. Emoji vs Lucide is distinguished by context: `diagram.left[].icon` = emoji string, `benefits[].icon` = Lucide name.

## Implementation Plan

### Tasks

#### Phase A: Schema & Types (Foundation)

- [x] Task 1: Rewrite shared Block + Proposal schema
  - File: `packages/shared/src/types/proposal.ts`
  - Action:
    1. Keep existing reusable schemas: `FeatureSchema`, `RoadmapItemSchema`, `PricingTierSchema`, `PricingSectionSchema`, `BusinessCaseSchema`, `TechStackSchema`, `ContactInfoSchema`, `ClientSchema`, and all their derived types. Keep `VALID_ICON_NAMES`.
    2. Add `Check`, `ArrowRight`, `ArrowDown` to `VALID_ICON_NAMES` array (used by Imperial block components).
    3. Add new `BlockSchema`:
       ```typescript
       export const BlockSchema = z.object({
         id: z.string().min(1),
         component: z.string().min(1), // maps to COMPONENT_REGISTRY key
         data: z.record(z.unknown()),  // component-specific data, validated at render time
       });
       ```
    4. Add `ProposalMetadataSchema`:
       ```typescript
       export const ProposalMetadataSchema = z.object({
         title: z.string().optional(),        // e.g. "Aureon Connect"
         subtitle: z.string().optional(),      // e.g. "Propuesta Confidencial"
         headerStyle: z.enum(['standard', 'dark', 'transparent']).optional().default('standard'),
         maxWidth: z.enum(['5xl', '7xl']).optional().default('5xl'),
       });
       ```
    5. Rewrite `ProposalSchema`:
       ```typescript
       export const ProposalSchema = z.object({
         slug: z.string().min(1).max(100).regex(/^[a-z0-9\-]+$/),
         token: z.string().length(10).regex(/^[A-Za-z0-9_-]+$/),
         client: ClientSchema,
         metadata: ProposalMetadataSchema.optional().default({}),
         blocks: z.array(BlockSchema).min(1),
       });
       ```
    6. Remove: `ProposalDataSchema`, all 8 variant const arrays, all 8 variant type exports, `ProposalTypes`, `ProposalType`, `ProposalData`. Remove `type`, `customComponent`, `proposal` fields.
    7. Add new type exports:
       ```typescript
       export type Block = z.infer<typeof BlockSchema>;
       export type ProposalMetadata = z.infer<typeof ProposalMetadataSchema>;
       ```
    8. Keep existing type exports that are still used: `Feature`, `RoadmapItem`, `PricingTier`, `PricingSection`, `BusinessCase`, `TechStack`, `ContactInfo`, `Client`, `Proposal`.
  - Notes: This is the foundational change. Everything downstream depends on it. The `Proposal` type shape changes from `{ slug, token, type?, customComponent?, client, proposal: ProposalData }` to `{ slug, token, client, metadata?, blocks: Block[] }`.

- [x] Task 2: DB migration — replace `proposal` with `blocks` and `metadata`
  - File: `supabase/migrations/002_block_schema.sql`
  - Action:
    1. `ALTER TABLE proposals DROP COLUMN IF EXISTS type;`
    2. `ALTER TABLE proposals DROP COLUMN IF EXISTS custom_component;`
    3. `ALTER TABLE proposals DROP COLUMN IF EXISTS proposal;`
    4. `ALTER TABLE proposals ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}';`
    5. `ALTER TABLE proposals ADD COLUMN blocks JSONB NOT NULL DEFAULT '[]';`
    6. Add a CHECK constraint: `ALTER TABLE proposals ADD CONSTRAINT blocks_not_empty CHECK (jsonb_array_length(blocks) > 0);`
  - Notes: Uses `DROP COLUMN IF EXISTS` for idempotent safety. This is a destructive migration. The seed.sql will repopulate data. `supabase db reset` will apply both 001 and 002 in sequence.

- [x] Task 3: Update seed data with block-based proposals
  - File: `supabase/seed.sql`
  - Action: Rewrite both INSERT statements to use `metadata` and `blocks` columns instead of `type`, `custom_component`, and `proposal`.
    1. **Imperial** — metadata: `{ "title": "Aureon Connect", "subtitle": "Propuesta Confidencial", "headerStyle": "dark", "maxWidth": "7xl" }`. Blocks array with 6 blocks:
       - `hero-gradient` (id: `imperial-hero`): `{ "title": "Aureon Connect", "subtitle": "Integrador Universal de Última Milla", "tagline": "Para Ecommerce y Operadores Logísticos", "stats": [{"value": "48h", "label": "Integración"}, {"value": "100%", "label": "Agnóstico"}, {"value": "0", "label": "Vendor Lock-in"}], "backgroundStyle": "gradient" }`
       - `problem-cards` (id: `imperial-problem`): `{ "sectionTitle": "El Problema", "sectionSubtitle": "Dependencia crítica de un solo proveedor TMS limita su red de transportes", "iconName": "Zap", "items": ["Dependes de un solo proveedor TMS...", ...all 6 needs strings from current data...] }`
       - `solution-diagram` (id: `imperial-solution`): `{ "sectionTitle": "La Solución", "sectionSubtitle": "Middleware agnóstico que traduce automáticamente entre cualquier TMS", "iconName": "Layers", "description": "...", "diagram": { "left": [{"name": "Beetrack", "color": "#FF6B35", "emoji": "🚚"}, {"name": "Driv.in", "color": "#4A90E2", "emoji": "🛣️"}, {"name": "Simpliroute", "color": "#00C48C", "emoji": "📍"}, {"name": "Excel", "color": "#217346", "emoji": "📊"}], "center": {"name": "Aureon Connect", "subtitle": "Traducción Automática"}, "right": {"title": "Vista Unificada", "subtitle": "Todos los transportes en un solo lugar"} }, "benefits": [{"iconName": "Zap", "title": "Eliminar Fricción...", "points": [...]}, {"iconName": "Shield", "title": "Reducir Riesgo...", "points": [...]}, {"iconName": "TrendingUp", "title": "Escalar Sin Límites...", "points": [...]}, {"iconName": "Layers", "title": "Visibilidad Unificada", "points": [...]}], "techStack": {...current techStack object...} }` — All benefit points copied verbatim from imperial-custom.tsx
       - `pricing-tiers` (id: `imperial-pricing`): `{ "sectionTitle": "Inversión", "sectionSubtitle": "Modelos flexibles para tu operación", "tiers": [...current 2 pricing tiers with all fields...], "customNote": "💬 Inversión personalizada..." }`
       - `cta-banner` (id: `imperial-cta`): `{ "title": "¿Listo para eliminar el vendor lock-in?", "description": "Agenda una reunión de 30 minutos. Te mostraremos cómo Aureon Connect integra tu red de transportes en 48 horas.", "ctaText": "Contáctanos hoy", "contact": { "email": "gerhard@tractis.ai", "phone": "+56990210364", "name": "Gerhard Neumann" }, "backgroundStyle": "gradient" }`
       - `footer-branded` (id: `imperial-footer`): `{ "poweredBy": { "name": "Tractis AI", "logo": "/logos/tractis-color.svg", "url": "https://tractis.ai" } }`
    2. **Tractis demo** — metadata: `{ "headerStyle": "standard", "maxWidth": "5xl" }`. Blocks array with 9 blocks:
       - `title-header` (id: `demo-title`): `{ "title": "Custom AI Solution", "subtitle": "Tailored to Your Business Needs" }`
       - `executive-summary` (id: `demo-exec-summary`): `{ "content": "...current executiveSummary string..." }`
       - `understanding-needs` (id: `demo-needs`): `{ "needs": [...current needs array...] }`
       - `solution` (id: `demo-solution`): `{ "content": "...", "businessCase": {...full current businessCase object...}, "techStack": {...full current techStack object...} }`
       - `features-section` (id: `demo-features`): `{ "features": [...current 6 features with title, description, icon...] }`
       - `roadmap` (id: `demo-roadmap`): `{ "items": [...current 5 roadmap items with phase, date, description, deliverables...] }`
       - `why-us` (id: `demo-why-us`): `{ "content": "...full TRACTIS_WHY_US markdown string..." }`
       - `pricing-section` (id: `demo-pricing`): `{ "pricing": {...full current pricing object with 2 tiers + customNote...} }`
       - `contact-section` (id: `demo-contact`): `{ "contact": { "name": "Gerhard Neumann", "role": "Founder & CEO", "email": "gerhard@tractis.ai", "phone": "+56 990210364", "website": "https://tractis.ai", "linkedin": "https://linkedin.com/in/gneumannv", "calendly": "https://calendly.com/gerhard-tractis/30min", "cta": "Schedule a call to discuss how we can transform your proposal process" } }`
  - Notes: All block `id` values are deterministic and human-readable. All Imperial content is in Spanish. All data is inlined — no references to external constants. The `cta-banner` contact data is explicitly inlined with email (`gerhard@tractis.ai`) and phone (`+56990210364`) since there is no longer a global `proposal.proposal.contact` to read from.

#### Phase B: Block Components & Registry

- [x] Task 4: Create block component directory and registry
  - File: `apps/web/src/components/proposal/blocks/index.ts` (new)
  - Action:
    1. Create `apps/web/src/components/proposal/blocks/` directory
    2. Create `index.ts` that exports `COMPONENT_REGISTRY`:
       ```typescript
       import type { ComponentType } from 'react';
       import type { Client } from '@repo/shared';

       // Block component props interface — universal for all blocks
       export interface BlockComponentProps {
         data: Record<string, unknown>;
         client: Client;
       }

       // Standard blocks (from existing section components)
       import { ExecutiveSummary } from './executive-summary';
       import { UnderstandingNeeds } from './understanding-needs';
       import { Solution } from './solution';
       import { FeaturesSection } from './features-section';
       import { Roadmap } from './roadmap';
       import { WhyUs } from './why-us';
       import { PricingSection } from './pricing-section';
       import { ContactSection } from './contact-section';
       // Imperial-specific blocks
       import { HeroGradient } from './hero-gradient';
       import { ProblemCards } from './problem-cards';
       import { SolutionDiagram } from './solution-diagram';
       import { PricingTiers } from './pricing-tiers';
       import { CtaBanner } from './cta-banner';
       import { FooterBranded } from './footer-branded';
       // Utility blocks
       import { TitleHeader } from './title-header';

       export const COMPONENT_REGISTRY: Record<string, ComponentType<BlockComponentProps>> = {
         'executive-summary': ExecutiveSummary,
         'understanding-needs': UnderstandingNeeds,
         'solution': Solution,
         'features-section': FeaturesSection,
         'roadmap': Roadmap,
         'why-us': WhyUs,
         'pricing-section': PricingSection,
         'contact-section': ContactSection,
         'hero-gradient': HeroGradient,
         'problem-cards': ProblemCards,
         'solution-diagram': SolutionDiagram,
         'pricing-tiers': PricingTiers,
         'cta-banner': CtaBanner,
         'footer-branded': FooterBranded,
         'title-header': TitleHeader,
       };
       ```
  - Notes: All block components receive `{ data, client }` as `BlockComponentProps`. The shared interface is exported so block components can import it. All block components are server components (no `'use client'`).

- [x] Task 5: Move and adapt existing section components to blocks/
  - Files: `apps/web/src/components/proposal/blocks/executive-summary.tsx` (new), `understanding-needs.tsx` (new), `solution.tsx` (new), `features-section.tsx` (new), `roadmap.tsx` (new), `why-us.tsx` (new), `pricing-section.tsx` (new), `contact-section.tsx` (new)
  - Action: For each of the 8 existing section components:
    1. Copy to `blocks/` directory
    2. Import `BlockComponentProps` from `./index` (or define inline to avoid circular import — see notes)
    3. Change props to `BlockComponentProps`
    4. Extract the specific typed data from `data` prop **with defensive null checks**:
       ```typescript
       import type { Client } from '@repo/shared';

       interface BlockComponentProps {
         data: Record<string, unknown>;
         client: Client;
       }

       export function ExecutiveSummary({ data }: BlockComponentProps) {
         const content = (data.content as string) || '';
         if (!content) return null;
         // ... rest of existing component unchanged
       }
       ```
    5. Keep the rendering logic identical — these components should produce the exact same visual output.
    6. All components are server components — do NOT add `'use client'`
  - Notes: The `client` prop is available but the existing standard section components don't use it (they use CSS vars from layout). Pass it through anyway for future use. To avoid circular imports, each block file should define or import `BlockComponentProps` independently rather than importing from `./index`.

- [x] Task 6: Create Imperial-specific block components
  - Files: `apps/web/src/components/proposal/blocks/hero-gradient.tsx` (new), `problem-cards.tsx` (new), `solution-diagram.tsx` (new), `pricing-tiers.tsx` (new), `cta-banner.tsx` (new), `footer-branded.tsx` (new)
  - Action: Decompose `imperial-custom.tsx` into 6 separate block components. Each component:
    1. Receives `{ data, client }` as `BlockComponentProps`
    2. Extracts typed data from `data` prop **with defensive null checks** (e.g. `const title = (data.title as string) || ''`)
    3. Renders the same HTML/CSS layout as the corresponding section in `imperial-custom.tsx`
    4. Uses `client.colors.primary` and `client.colors.accent` for dynamic styling (same as current)
    5. **Strips all Framer Motion** — replace `<motion.div>` with `<div>`, remove `initial`, `animate`, `whileInView`, `whileHover`, `transition`, `viewport` props. Remove `import { motion } from 'framer-motion'`.
    6. Keeps all Tailwind classes, responsive breakpoints, and inline styles
    7. Keeps Lucide icon imports as needed (`Zap`, `Shield`, `Layers`, `TrendingUp`, `Check`, `ArrowRight`, `ArrowDown`)
    8. Imports `Image` from `next/image` where needed (hero-gradient logo badge, solution-diagram tech badge, footer-branded logo)
    9. All components are server components — do NOT add `'use client'`

    Decomposition mapping from `imperial-custom.tsx`:
    - **hero-gradient.tsx** ← hero section (gradient background, title, subtitle, tagline, stats bar, Tractis badge with `next/image`)
    - **problem-cards.tsx** ← problem section (section title with Lucide icon via `iconName`, grid of numbered cards from `items` array)
    - **solution-diagram.tsx** ← solution section (section title, visual flow diagram with TMS systems using **emoji strings** from `diagram.left[].emoji`, Aureon Connect center, unified view right, followed by benefits list with Lucide icons via `benefits[].iconName`, tech badge with `next/image`)
    - **pricing-tiers.tsx** ← pricing section (section title, 2-column grid of pricing tier cards with recommended badge, `Check` icon for features)
    - **cta-banner.tsx** ← CTA section (gradient background, title, description, `ctaText`, mailto link using `contact.email` and `contact.name`, WhatsApp link using `contact.phone`, decorative blur elements)
    - **footer-branded.tsx** ← footer section (simple "Powered by" footer with `next/image` for logo, current year via `new Date().getFullYear()`)
  - Notes: These are NOT generic components — they're purpose-built for the Imperial visual style. The `solution-diagram` is the most complex component. Emoji strings in `diagram.left[].emoji` are rendered as text (not Lucide icons). Lucide icons in `benefits[].iconName` are rendered via a simple lookup map within the component.

- [x] Task 7: Create TitleHeader block component
  - File: `apps/web/src/components/proposal/blocks/title-header.tsx` (new)
  - Action: Create a simple block component:
    ```tsx
    import type { Client } from '@repo/shared';

    interface BlockComponentProps {
      data: Record<string, unknown>;
      client: Client;
    }

    export function TitleHeader({ data }: BlockComponentProps) {
      const title = (data.title as string) || '';
      const subtitle = data.subtitle as string | undefined;
      if (!title) return null;
      return (
        <div className="text-center space-y-4 py-8 border-b-2" style={{ borderColor: 'var(--brand-primary)' }}>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--brand-primary)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-muted-foreground">{subtitle}</p>
          )}
        </div>
      );
    }
    ```
  - Notes: Simple utility block. Data shape: `{ title: string, subtitle?: string }`. Returns null if title is missing.

- [x] Task 8: Create BlockRenderer component
  - File: `apps/web/src/components/proposal/block-renderer.tsx` (new)
  - Action: Create the core rendering component:
    ```tsx
    import { COMPONENT_REGISTRY } from './blocks';
    import { ProposalErrorBoundary } from './proposal-error-boundary';
    import type { Block, Client } from '@repo/shared';

    interface BlockRendererProps {
      blocks: Block[];
      client: Client;
    }

    export function BlockRenderer({ blocks, client }: BlockRendererProps) {
      return (
        <>
          {blocks.map((block) => {
            const Component = COMPONENT_REGISTRY[block.component];
            if (!Component) {
              if (process.env.NODE_ENV !== 'production') {
                console.warn(`Unknown block component: "${block.component}" (block id: ${block.id})`);
              }
              return null;
            }
            return (
              <ProposalErrorBoundary key={block.id}>
                <Component data={block.data} client={client} />
              </ProposalErrorBoundary>
            );
          })}
        </>
      );
    }
    ```
  - Notes: Each block is wrapped in ProposalErrorBoundary so one failing block doesn't crash the entire proposal. Unknown components are silently skipped (dev warning only). The BlockRenderer itself renders a bare fragment — the content wrapper with spacing is provided by page.tsx (see Task 9).

#### Phase C: Page, Layout, and Helpers Update

- [x] Task 9: Rewrite proposal page.tsx for BlockRenderer
  - File: `apps/web/src/app/proposals/[slug]/[token]/page.tsx`
  - Action:
    1. Remove all variant mapper imports
    2. Remove custom component dynamic import logic
    3. Remove all variant component selection
    4. Remove the fixed 8-section rendering
    5. Import `BlockRenderer` from `@/components/proposal/block-renderer`
    6. **Wrap BlockRenderer in a content container** that provides spacing and max-width:
       ```tsx
       const maxWidth = proposal.metadata?.maxWidth === '7xl' ? 'max-w-7xl' : 'max-w-5xl';

       return (
         <div className={`mx-auto ${maxWidth} px-4 sm:px-6 py-12 sm:py-16 md:py-20 space-y-16`}
              style={{ backgroundColor: 'var(--background)' }}>
           <BlockRenderer blocks={proposal.blocks} client={proposal.client} />
         </div>
       );
       ```
       **IMPORTANT:** Imperial blocks that need full-bleed rendering (hero-gradient, cta-banner, footer-branded) must NOT be inside this constrained wrapper. Split the rendering: full-bleed blocks render outside the wrapper, standard blocks render inside. One approach:
       ```tsx
       const FULL_BLEED_BLOCKS = new Set(['hero-gradient', 'cta-banner', 'footer-branded']);

       return (
         <>
           {proposal.blocks.map((block) => {
             if (FULL_BLEED_BLOCKS.has(block.component)) {
               return (
                 <ProposalErrorBoundary key={block.id}>
                   <BlockFromRegistry block={block} client={proposal.client} />
                 </ProposalErrorBoundary>
               );
             }
             return null;
           })}
           {/* Non-full-bleed blocks get the container wrapper */}
           {/* ... or use a smarter approach: let BlockRenderer handle it */}
         </>
       );
       ```
       **Simpler approach (recommended):** Add the content wrapper inside the layout instead of the page, OR let each block component handle its own max-width (Imperial blocks already use `max-w-7xl` internally). The cleanest solution: **do NOT add a wrapping container in page.tsx**. Instead, each standard block component already wraps its content in `<section>` with appropriate spacing. Add `py-8` or similar margin to each standard block component during Task 5 adaptation. The `space-y-16` gap is handled by the layout wrapper (see Task 10).
    7. Update `generateMetadata`:
       - Remove the `proposal.type === 'customized' && proposal.slug === 'imperial'` special case
       - Use `proposal.metadata?.title` if available for the page title, otherwise fall back to `Proposal for ${proposal.client.name} | Tractis`
       - Use a block-derived description: find the first `executive-summary` block and use its `data.content` as description (truncated to 160 chars). If none, use generic description.
  - Notes: The page becomes dramatically simpler — fetch proposal, render blocks. All rendering decisions are data-driven via the blocks array. The key challenge is handling both full-bleed blocks (Imperial hero/CTA/footer) and contained blocks (standard sections) in the same renderer. See Task 10 for the layout wrapper approach.

- [x] Task 10: Generalize layout.tsx (remove Imperial-specific code)
  - File: `apps/web/src/app/proposals/[slug]/[token]/layout.tsx`
  - Action:
    1. Remove the `if (proposal.type === 'customized')` branch
    2. Use `proposal.metadata?.headerStyle` to determine header appearance:
       - `'standard'` (default): current standard header — white/card background, brand-primary border
       - `'dark'`: dark translucent header — using `client.colors.accent` + `80` alpha (e.g. `${client.colors.accent}80`) instead of hardcoded `#0c3a63`
       - `'transparent'`: no header background (future use)
    3. Use `proposal.metadata?.title` and `proposal.metadata?.subtitle` in the header right side, replacing the hardcoded "Aureon Connect" / "Propuesta Confidencial" text. Fall back to "Custom Proposal" / `client.name` if not set.
    4. Use `proposal.metadata?.maxWidth` to set container max-width on the children wrapper
    5. **Add `space-y-16` to the children wrapper** to provide inter-block spacing:
       ```tsx
       const maxWidth = proposal.metadata?.maxWidth === '7xl' ? 'max-w-7xl' : 'max-w-5xl';
       return (
         <div style={{ ...brandingStyles, backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              className="min-h-screen proposal-branded">
           <header>...</header>
           <main className={`mx-auto ${maxWidth} space-y-16`}>
             {children}
           </main>
         </div>
       );
       ```
       Note: If Imperial full-bleed blocks need to escape this wrapper, the layout should NOT constrain them. Alternative: layout provides the `space-y-16` wrapper but blocks that need full-bleed use CSS to break out (e.g., negative margins + full width). The implementation should test both approaches and pick what works visually.
    6. Remove reference to `proposal.type` and `proposal.slug === 'imperial'`
  - Notes: The layout becomes fully data-driven. Any proposal can have a dark header by setting `headerStyle: 'dark'` in its metadata. No proposal-specific hardcoding.

- [x] Task 11: Update proposal-helpers.ts — ALL three functions + remove fallback
  - File: `apps/web/src/lib/proposal-helpers.ts`
  - Action:
    1. **Remove** `import { proposals } from '@/data/proposals'` at the top of the file.
    2. Update `mapRowToProposal` to map the new DB columns:
       ```typescript
       function mapRowToProposal(row: {
         slug: string;
         token: string;
         client: unknown;
         metadata: unknown;
         blocks: unknown;
       }): Proposal {
         return {
           slug: row.slug,
           token: row.token,
           client: row.client as Proposal['client'],
           metadata: (row.metadata || {}) as Proposal['metadata'],
           blocks: row.blocks as Proposal['blocks'],
         };
       }
       ```
    3. Remove references to `row.type`, `row.custom_component`, `row.proposal`.
    4. Update `getProposalBySlugAndToken` — remove the dev fallback `catch` block that uses `proposals.find()`. Replace with:
       ```typescript
       catch (error) {
         console.error('Supabase query failed:', (error as Error).message);
         return null;
       }
       ```
    5. Update `validateToken` — remove the dev fallback `catch` block that uses `proposals.some()`. Replace with:
       ```typescript
       catch (error) {
         console.error('Supabase query failed:', (error as Error).message);
         return false;
       }
       ```
    6. Update `getAllProposals` — remove the dev fallback `catch` block that uses `return proposals`. Replace with:
       ```typescript
       catch (error) {
         console.error('Supabase query failed:', (error as Error).message);
         return [];
       }
       ```
  - Notes: ALL three functions (`getProposalBySlugAndToken`, `validateToken`, `getAllProposals`) reference the deleted `proposals.ts` in their dev fallback catch blocks. All three must be updated. After this change, devs MUST have Supabase running locally — no fallback.

- [x] Task 12: Update admin dashboard for block-based proposals
  - File: `apps/web/src/app/admin/page.tsx`
  - Action:
    1. Import `Block` type from `@repo/shared`
    2. Add a helper function:
       ```typescript
       function getBlockData(blocks: Block[], component: string): Record<string, unknown> | null {
         const block = blocks.find(b => b.component === component);
         return block?.data ?? null;
       }
       ```
    3. Update `ProposalDashboard` card rendering:
       - Remove the type badge (`proposal.type` no longer exists)
       - Replace `proposal.proposal.executiveSummary` with:
         ```typescript
         const execSummary = getBlockData(proposal.blocks, 'executive-summary');
         const summaryText = (execSummary?.content as string) || 'No summary available';
         ```
       - Replace features/roadmap counts in footer with block count: `{proposal.blocks.length} blocks`
       - Remove color swatch display that reads `proposal.client.colors` (this still works — `client` is unchanged)
    4. Update `CreateProposal` form copy text:
       - Change "generate the 8-section proposal structure" to "generate the proposal" (or similar)
       - Change "Agent 2: Parse uploaded document and generate 8-section proposal" to "Agent 2: Parse uploaded document and generate proposal content"
       - These are UI copy changes only — the CreateProposal form is still a stub (TODO).
  - Notes: The admin dashboard is a thin layer. The detailed block management UI is Phase 4. The `CreateProposal` stale copy text is cosmetic but should be updated to avoid confusion.

#### Phase D: Cleanup & Tests

- [x] Task 13: Delete old files
  - Files to delete:
    - `apps/web/src/lib/variant-mapper.tsx` — replaced by COMPONENT_REGISTRY
    - `apps/web/src/components/proposal/custom/imperial-custom.tsx` — decomposed into block components
    - `apps/web/src/components/proposal/custom/` directory (if empty after deletion)
    - `apps/web/src/components/proposal/variants/executive-summary-detailed.tsx` — unused in current proposals
    - `apps/web/src/components/proposal/variants/` directory (if empty after deletion)
    - `apps/web/src/data/proposals.ts` — data lives in Supabase
  - Action: Delete each file. Run `pnpm --filter=@repo/web type-check` to verify no remaining imports reference them.
  - Notes: `fixed-sections.ts` is NOT deleted — still useful as a data reference. `VARIANT_SYSTEM.md` can optionally be deleted but is low priority.

- [x] Task 14: Remove old section component files
  - Files to delete (after block versions are verified working):
    - `apps/web/src/components/proposal/executive-summary.tsx`
    - `apps/web/src/components/proposal/understanding-needs.tsx`
    - `apps/web/src/components/proposal/solution.tsx`
    - `apps/web/src/components/proposal/features-section.tsx`
    - `apps/web/src/components/proposal/roadmap.tsx`
    - `apps/web/src/components/proposal/why-us.tsx`
    - `apps/web/src/components/proposal/pricing-section.tsx`
    - `apps/web/src/components/proposal/contact-section.tsx`
  - Action: Delete each file. These have been replaced by their `blocks/` counterparts.
  - Notes: `proposal-error-boundary.tsx` and `logo-with-fallback.tsx` stay — they're still used by BlockRenderer and layout.

- [x] Task 15: Update tests
  - File: `apps/web/src/lib/__tests__/proposal-helpers.test.ts`
  - Action:
    1. Update ALL mock proposal data to use the new schema shape (`blocks` array instead of `proposal` object, no `type`/`customComponent`)
    2. Update mock DB row data returned by Supabase mocks (replace `proposal` JSONB with `metadata` + `blocks` JSONB)
    3. Update `mapRowToProposal` expectations (no more `type`, `customComponent`, `proposal` fields — expect `metadata`, `blocks`)
    4. Ensure all 9 proposal-helpers tests pass with the new data shape
    5. Remove the import/mock of `@/data/proposals` since the dev fallback is removed
  - File: `apps/web/src/app/admin/admin.test.tsx`
  - Action:
    1. Update mock proposal data to use blocks schema — the admin test mocks the proposals that flow through the server action. The mock data shape must match the new `Proposal` type (`blocks` array, no `proposal` field).
    2. The admin tests primarily test login/logout/session flows — these should be unaffected by the data shape change. But any mock that constructs a `Proposal` object must use the new shape.
    3. Verify all 12 admin tests still pass.
  - Notes: branding.test.ts has pre-existing type errors unrelated to this work — do not fix.

- [x] Task 16: Add BlockRenderer unit test
  - File: `apps/web/src/components/proposal/__tests__/block-renderer.test.tsx` (new)
  - Action: Create basic tests for BlockRenderer:
    1. Test that known block components render (mock a simple block, verify component renders)
    2. Test that unknown block components are silently skipped (pass a block with `component: 'nonexistent'`, verify no crash, verify remaining blocks render)
    3. Test that empty blocks array renders nothing
    4. Test that ProposalErrorBoundary catches block render errors
  - Notes: This covers AC 5 with automated tests instead of just manual smoke testing.

- [x] Task 17: Type check and smoke test
  - Action:
    1. Run `pnpm --filter=@repo/web type-check` — must pass (excluding pre-existing branding.test.ts errors)
    2. Run `pnpm --filter=agent type-check` — must pass clean
    3. Run `pnpm --filter=@repo/web test:run` — all tests must pass
    4. Run `npx supabase db reset` — migration + seed must succeed
    5. Start dev server on port 3002
    6. Smoke test:
       - `GET /proposals/imperial/Zh3zaPJV4U` → 200, renders Imperial with hero, problem cards, solution diagram, pricing, CTA, footer (no animations)
       - `GET /proposals/tractis-demo/xK8pQ2mN7v` → 200, renders Tractis demo with all 9 blocks
       - `GET /proposals/imperial/wrong` → 404
       - `GET /admin` → login, then dashboard shows both proposals with block counts
    7. Visual comparison: Imperial should look structurally identical to current (same colors, layout, content) minus the Framer Motion animations. Tractis demo should look identical to current.

### Acceptance Criteria

- [ ] AC 1: Given the shared package is rebuilt, when I inspect `Proposal` type, then it has `slug`, `token`, `client`, `metadata?`, and `blocks: Block[]` — with no `type`, `customComponent`, or `proposal` fields.
- [ ] AC 2: Given `supabase db reset` is run, when I query `SELECT slug, jsonb_array_length(blocks) FROM proposals`, then Imperial has 6 blocks and Tractis demo has 9 blocks.
- [ ] AC 3: Given a valid Imperial URL, when I load it in the browser, then I see: hero with gradient + stats, problem cards, solution diagram with flow visualization, pricing tiers, CTA banner, footer — all with Imperial branding colors (#f72e3c, #0c3a63) and Spanish content. No Framer Motion animations.
- [ ] AC 4: Given a valid Tractis demo URL, when I load it in the browser, then I see all 9 sections rendered identically to the current standard proposal (title header, executive summary, needs, solution with business case, features grid, roadmap timeline, why us, pricing tiers, contact).
- [ ] AC 5: Given an unknown block component name in a proposal's blocks array, when the page renders, then the unknown block is silently skipped and remaining blocks render normally. (Verified by unit test in Task 16.)
- [ ] AC 6: Given the admin dashboard, when I view the proposals list, then both proposals display with correct client names, summary text from blocks, and block counts.
- [ ] AC 7: Given `variant-mapper.tsx` is deleted, when I run `pnpm --filter=@repo/web type-check`, then there are zero new TypeScript errors referencing it or any deleted file.
- [ ] AC 8: Given the layout.tsx, when Imperial loads, then the header uses dark style (translucent with client accent color), shows "Aureon Connect" / "Propuesta Confidencial" from metadata, and uses max-w-7xl container.
- [ ] AC 9: Given the layout.tsx, when Tractis demo loads, then the header uses standard style (card background with brand-primary border), shows "Custom Proposal" / "Tractis AI", and uses max-w-5xl container.
- [ ] AC 10: Given all tests are run, when I execute `pnpm --filter=@repo/web test:run`, then all tests pass (existing + updated + new BlockRenderer tests).
- [ ] AC 11: Given the standard proposal (Tractis demo), when rendered, then inter-block spacing is visually consistent (equivalent to current `space-y-16`) — no blocks stacking with zero gap.

## Additional Context

### Dependencies

- Phase 1 (V2 Database Foundation) must be complete — ✅ Done (commit 64637c5)
- No new npm packages needed (Framer Motion removal means one less dependency in block components)

### Testing Strategy

**Unit tests (updated):**
- `proposal-helpers.test.ts` — update mock data to block schema, remove fallback mocks, verify mapping works
- `admin.test.tsx` — update mock data, verify dashboard renders with block-based proposals

**Unit tests (new):**
- `block-renderer.test.tsx` — test known blocks render, unknown blocks skipped, error boundary works

**Manual smoke tests:**
- Visual comparison of Imperial proposal before/after (same layout, no animations)
- Visual comparison of Tractis demo before/after (identical rendering)
- Invalid URL returns 404
- Admin dashboard lists both proposals correctly
- Inter-block spacing is visually correct

**Type checking:**
- `pnpm --filter=@repo/web type-check` passes
- `pnpm --filter=agent type-check` passes
- No orphaned imports to deleted files

### Notes

- **FOLLOW-UP: Framer Motion animations** — The Imperial proposal currently uses extensive Framer Motion animations (fade-in, stagger, whileHover, whileInView). These are stripped in the block decomposition. A follow-up task should add an animation layer that individual block components can opt into. This could be a wrapper component (`<AnimatedBlock>`) or per-component animation configs stored in block data.
- **FOLLOW-UP: Full component catalog** — The architecture doc defines a larger catalog (hero-image, hero-simple, solution-structured, stats-bar, etc.). Build incrementally as new proposals need them. The registry pattern means adding a new block type is: create component file + add one line to registry.
- **BREAKING: Agent pipeline** — After this migration, the agent pipeline (apps/agent) outputs the OLD 8-section format via `agent-schemas.ts`. If anyone runs the agent and tries to save output to the DB, it will fail because the `proposal` column no longer exists. **Phase 3 MUST be completed before the agent pipeline is usable again.** Until then, agent-generated proposals cannot be saved. This is acceptable because the agent pipeline was not yet connected to the save flow — proposals were only created via seed data. Add a console warning or early return in the orchestrator if it attempts to save in the old format.
- **Imperial content is Spanish** — All Imperial block data is in Spanish. Block components must not assume English content.
- **`proposals.ts` dev fallback removed** — After this work, devs MUST run `npx supabase start` for local development. The hardcoded fallback is gone. This is the expected workflow.
- **`fixed-sections.ts` kept** — Still useful as a data reference for seed scripts and future agent output. Not imported by any runtime code after this migration.
- **Rollback plan** — If the migration succeeds but new code has bugs: revert the code changes, delete `002_block_schema.sql`, restore old `seed.sql` from git, run `supabase db reset`. Only 2 proposals exist and all data is in seed.sql, so no data loss is possible.
- **HIGH RISK: Visual regression on Imperial** — The Imperial decomposition is the riskiest task. The visual flow diagram (TMS systems → Aureon Connect → unified view) is complex with emoji icons, colored borders, and responsive layouts. Manual visual comparison is critical before committing.
- **Enrichment sessions** — Existing enrichment sessions in DB store partial proposal data in the old format. These are transient (30min TTL) and are NOT migrated. Any active sessions at migration time become stale — acceptable since this is local dev only.
