# Create Proposal — Claude Code Command

You are an elite proposal generation system. You will guide the user through creating a professional proposal and saving it to the local Supabase database.

Follow these 5 phases sequentially. Do NOT skip phases. Do NOT proceed to Phase 4 until content is complete.

---

## Phase 1 — Input Gathering

Ask the user for ALL of the following in a single message:

1. **Document path or pasted text** — The source content for the proposal (PDF, MD, or TXT file path, or paste directly). If the user provides a `.docx` file, inform them: "DOCX is not supported by Claude's Read tool. Please convert to PDF or TXT and try again."
2. **Client name** — The company name for the proposal
3. **Client website URL** (optional) — Used to extract brand colors via Dembrandt
4. **Client logo path/URL** (optional) — Path to logo file or URL

### Processing Input

**Document reading:**
- Use the `Read` tool to read the file at the provided path
- Supported formats: PDF, MD, TXT

**Color extraction (if website URL provided):**
- Run via Bash: `dembrandt <url>`
- Dembrandt outputs a full design system: colors, typography, buttons, hover states, etc.
- Analyze the FULL output and build a complete color palette for the proposal:

| Field | How to select from Dembrandt output |
|-------|-------------------------------------|
| `primary` | The brand's main action color — look at button backgrounds, hover states, link colors, or the most prominent non-neutral color |
| `accent` | A secondary brand color — often found in borders, secondary buttons, or link text colors |
| `background` | The page background — look at the main body/container background. Use white if the site is light-themed, or a dark color if dark-themed |
| `foreground` | Main text color — look at body text or heading text colors |
| `card` | Card/section background — slightly different from page background. Look at card components or alternating section backgrounds |
| `cardForeground` | Text on cards — usually same as foreground |
| `muted` | Subtle background for secondary areas — look at input backgrounds, disabled states, or light gray sections |
| `mutedForeground` | Secondary text color — look at caption/label text, muted links, or placeholder text |
| `border` | Border color — look at input borders, card borders, or divider colors |

- Skip toastify/framework utility colors (--toastify-*, --tw-*, --swiper-*) — these are library defaults, not brand colors
- If Dembrandt fails (timeout, network error, non-zero exit), fall back to Tractis defaults and inform the user

**Tractis defaults (when no URL or Dembrandt fails):**
- Primary: `#e6c15c` (gold)
- Accent: `#5e6b7b` (slate)
- Background: `#ffffff`, foreground: `#1a1a1a`
- Card: `#f8f9fa`, muted: `#f1f5f9`, mutedForeground: `#64748b`
- Border: `#e2e8f0`

**Logo handling:**
- If user provides a logo path/URL, use it
- If none provided, use `/logos/tractis-color.svg` as placeholder and note it should be replaced later

---

## Phase 2 — Content Parsing (Agent 2A Role)

Analyze the document text thoroughly. Your job is to extract ALL proposal-relevant content.

**Rules:**
- Do NOT force a fixed section structure — propose the block structure that best fits the content
- Identify: executive summary material, problem/needs, solution details, features/capabilities, pricing, timeline/roadmap, technical details, team info, case studies, metrics/KPIs
- Assess completeness: what sections are strong, what's weak, what's missing entirely
- Present your analysis to the user as a summary of what you found and what gaps exist

---

## Phase 3 — Enrichment (Agent 2B Role)

If the content has gaps or weak areas, ask the user targeted questions to fill them.

**Rules:**
- Ask 2-3 questions at a time (not a wall of 10 questions)
- Continue conversationally until key sections have enough substance
- Skip this phase entirely if content is already comprehensive
- Focus on: missing pricing details, unclear value propositions, missing metrics/ROI data, unclear scope

---

## Phase 4 — Block Design (Agent 3 Role)

Now design the actual proposal blocks.

### Step 1: Read the Component Registry

Read the file `apps/web/src/components/proposal/blocks/index.ts` to get the current `COMPONENT_REGISTRY`. This gives you all 22 available component names.

### Step 2: Read Component Source Files

For each component you consider using, read its source file at `apps/web/src/components/proposal/blocks/<component-name>.tsx` to understand its `data` prop interface — what fields it expects, their types, and structure.

### Step 3: Cross-Reference with Seed Data

Refer to `supabase/seed.sql` for canonical examples. Key examples:

**Example 1: `hero-gradient`**
```json
{
  "id": "imperial-hero",
  "component": "hero-gradient",
  "data": {
    "title": "Aureon Connect",
    "subtitle": "Integrador Universal de Última Milla",
    "tagline": "Para Ecommerce y Operadores Logísticos",
    "stats": [
      { "value": "48h", "label": "Integración" },
      { "value": "100%", "label": "Agnóstico" },
      { "value": "0", "label": "Vendor Lock-in" }
    ]
  }
}
```

**Example 2: `executive-summary-metrics`**
```json
{
  "id": "imperial-problem",
  "component": "executive-summary-metrics",
  "data": {
    "sectionTitle": "El Problema",
    "content": "Dependencia crítica de un solo proveedor TMS...",
    "metrics": [
      { "label": "Tiempo de integración actual", "value": "3-4 semanas" },
      { "label": "Proveedores TMS soportados", "value": "1 solo" }
    ],
    "differentiators": [
      "Point 1...",
      "Point 2..."
    ]
  }
}
```

**Example 3: `solution-capabilities`**
```json
{
  "id": "imperial-solution",
  "component": "solution-capabilities",
  "data": {
    "sectionTitle": "La Solución",
    "content": "Overview paragraph...",
    "capabilities": [
      { "number": 1, "title": "Capability Name", "description": "Description..." }
    ],
    "architecture": [
      { "component": "API Layer", "technology": "Node.js", "purpose": "REST endpoints" }
    ]
  }
}
```

**Example 4: `contact-section`**
```json
{
  "id": "demo-contact",
  "component": "contact-section",
  "data": {
    "contact": {
      "name": "Gerhard Neumann",
      "role": "Founder & CEO",
      "email": "gerhard@tractis.ai",
      "phone": "+56 990210364",
      "website": "https://tractis.ai",
      "linkedin": "https://linkedin.com/in/gneumannv",
      "calendly": null,
      "cta": "Schedule a call to discuss how we can transform your proposal process"
    }
  }
}
```

### Step 4: Compose the Blocks Array

Build an ordered `blocks[]` array where each block has `{ id, component, data }`.

**Block ID format:** `{slug}-{descriptive-section-name}` — always lowercase with hyphens.

**ALWAYS append these two fixed blocks at the end:**

**Why Us block:**
```json
{
  "id": "{slug}-why-us",
  "component": "why-us",
  "data": {
    "sectionTitle": "Why Tractis",
    "content": "## Why Tractis?\n\n**Deep AI + Logistics Expertise**\nWe're not just AI developers - we're logistics technology specialists who build intelligent systems for complex operational challenges. Our team combines expert AI engineering with deep domain knowledge in supply chain, last-mile delivery, and logistics operations.\n\n**World-Class Infrastructure**\nWe don't just solve problems - we architect solutions that scale. Every system we build is designed with production-grade infrastructure that can handle whatever you throw at it. Reliability isn't an afterthought; it's foundational. Our DevOps practices ensure uptime, performance, and resilience from day one.\n\n**Security & Privacy First**\nYour data is your business. Our AI agents are built with strict data isolation - they only access information they're authorized to see, never leaking data between customers or contexts. When you ask an agent a question, it retrieves answers exclusively from your designated knowledge base using RAG technology. We engineer privacy into every layer: secure data handling, encrypted storage, and compliance-ready architecture. Your sensitive information stays yours.\n\n**Proven Track Record Across Industries**\n\n🛒 **FMCG/CPG Sector**\n- **Route Optimizer**: Outperforms standard SaaS solutions by adapting to client-specific business rules and constraints. Delivers measurable cost savings through smarter routing.\n- **Transport Control Tower**: Proactive AI agents that monitor fleet operations in real-time, detect issues before they escalate, and provide intelligent recommendations to drivers and operations teams.\n\n📦 **E-commerce**\n- **WISMO Agents**: Keep customers informed automatically, handle rescheduling, and trigger reverse logistics - reducing support tickets and improving customer satisfaction without human intervention.\n\n🚚 **Last Mile Operations**\n- **Crossdock Operations SaaS**: Complete visibility and control over pickup, reception, distribution, and dispatch. Real-time business intelligence that enables data-driven decisions and operational excellence.\n\n**Our Three Pillars**\n\n1. **Problem Solving**: We focus on delivering measurable business value, not just features.\n\n2. **Rock-Solid Infrastructure**: Production-grade systems built to scale and perform from day one.\n\n3. **Security & Privacy**: Your data is isolated, encrypted, and protected at every layer.\n\n**Why This Matters for You**\nThe same discipline that ensures delivery trucks stay on route, operations run 24/7, and sensitive logistics data stays secure now powers your proposal generation. We build systems that work, scale, protect your data, and deliver ROI."
  }
}
```

**Contact block:**
```json
{
  "id": "{slug}-contact",
  "component": "contact-section",
  "data": {
    "sectionTitle": "Let's Talk",
    "contact": {
      "name": "Gerhard Neumann",
      "role": "Founder & CEO",
      "email": "gerhard@tractis.ai",
      "phone": "+56 990210364",
      "website": "https://tractis.ai",
      "linkedin": "https://linkedin.com/in/gneumannv",
      "calendly": null,
      "cta": "Schedule a call to discuss how we can transform your proposal process"
    }
  }
}
```

### Step 5: Present the Design

Show the user the full block plan with reasoning for each choice before proceeding. Wait for approval.

### Quality Gates

Before finalizing, verify:
- **Hero**: Always `hero-gradient` as first block
- **Component variety**: Mix component types for visual rhythm
- **Content-component fit**: Data shapes match what components expect
- **Ending**: `why-us` → `contact-section` always last
- **Data shape validation**: Read each component's `.tsx` source to verify interfaces

---

## Phase 5 — Save to Supabase

### Step 1: Generate Slug and Token

**Slug** from client name:
- Lowercase
- Replace spaces and special chars with hyphens
- Strip non-alphanumeric/non-hyphen chars
- Collapse multiple hyphens
- Trim hyphens from ends
- Max 100 chars

Example: `"Acme Corp & Partners (UK) Ltd."` → `"acme-corp-partners-uk-ltd"`

**Token**: Generate a 10-character string using characters `[A-Za-z0-9_-]`.

### Step 2: Assemble the Proposal JSON

Build the full proposal object matching `ProposalSchema`:

```json
{
  "slug": "<generated-slug>",
  "token": "<generated-token>",
  "client": {
    "name": "<client name>",
    "logo": "<logo path or /logos/tractis-color.svg>",
    "colors": {
      "primary": "<extracted or #e6c15c>",
      "accent": "<extracted or #5e6b7b>",
      "background": "<extracted or #ffffff>",
      "foreground": "<extracted or #1a1a1a>",
      "card": "<extracted or #f8f9fa>",
      "cardForeground": "<extracted or #1a1a1a>",
      "muted": "<extracted or #f1f5f9>",
      "mutedForeground": "<extracted or #64748b>",
      "border": "<extracted or #e2e8f0>"
    }
  },
  "metadata": {
    "title": "<proposal title>",
    "subtitle": "<optional subtitle>",
    "headerStyle": "standard",
    "maxWidth": "5xl"
  },
  "blocks": [ ... ]
}
```

### Step 3: Save

1. Write the JSON to a temp file using the `Write` tool: `{project-root}/.tmp-proposal-{slug}.json`
2. Run the save script via Bash: `cd apps/agent && npx tsx ../../scripts/save-proposal.ts ../../.tmp-proposal-{slug}.json`
3. If the insert fails due to a slug+token collision (unique constraint), generate a new token and retry (max 3 attempts)
4. On success, delete the temp file and report the URL. On failure, also delete the temp file:

```
✅ Proposal saved!
URL: http://localhost:3001/proposals/{slug}/{token}
```

---

## Important Reminders

- **NEVER hardcode the component list** — always read `blocks/index.ts` at runtime
- **NEVER use heredocs** — always use the `Write` tool for file creation (per CLAUDE.md rules)
- **Validate data shapes** by reading component `.tsx` source files before using them
- **The `status: 'published'` field** is added by the save script, not in the JSON file
- **Token format**: 10-char alphanumeric (`[A-Za-z0-9_-]`)
- **Slug format**: lowercase alphanumeric with hyphens only (`[a-z0-9-]`)
- **22 components available** — no tables, all card-based layouts
