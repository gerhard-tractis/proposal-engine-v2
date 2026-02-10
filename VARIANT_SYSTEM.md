# Dynamic Component Variant System

## Overview

The proposal system now supports **dynamic component variants** - the AI agent can choose different UI components for each section based on the proposal content, complexity, and context.

## Architecture Implemented (Option C - Hybrid Approach)

✅ **Schema Enhanced** - Added variant fields to proposal schema
✅ **Variant Mapper** - Created dynamic component selection system
✅ **Page Updated** - Proposal page now uses variant mapper
✅ **Example Variant** - Built ExecutiveSummaryDetailed as demonstration
✅ **Documentation** - Created guides for developers and AI agent
✅ **Test Data** - Updated test proposal to use variants

## What Changed

### 1. Schema (`packages/shared/src/types/proposal.ts`)

Added variant enums and optional variant fields to ProposalDataSchema:

```typescript
export const ExecutiveSummaryVariants = ['brief', 'detailed', 'visual', 'timeline'] as const;
// ... 7 more section variant enums

export const ProposalDataSchema = z.object({
  executiveSummary: z.string().min(1),
  executiveSummaryVariant: z.enum(ExecutiveSummaryVariants).optional().default('brief'),
  // ... same pattern for all 8 sections
});
```

**8 Sections with Variants:**
1. Executive Summary (4 variants)
2. Understanding Needs (4 variants)
3. Solution (4 variants)
4. Features (4 variants)
5. Roadmap (4 variants)
6. Why Us (4 variants)
7. Pricing (4 variants)
8. Contact (4 variants)

### 2. Variant Mapper (`apps/web/src/lib/variant-mapper.tsx`)

Maps variant names to React components:

```typescript
export const executiveSummaryVariants: Record<ExecutiveSummaryVariant, ComponentType<any>> = {
  brief: ExecutiveSummary,
  detailed: ExecutiveSummaryDetailed, // ✅ New variant
  visual: ExecutiveSummary,           // TODO
  timeline: ExecutiveSummary,         // TODO
};

export function getExecutiveSummaryComponent(variant?: ExecutiveSummaryVariant) {
  return executiveSummaryVariants[variant || 'brief'];
}
```

### 3. Proposal Page (`apps/web/src/app/proposals/[slug]/[token]/page.tsx`)

Now dynamically selects components:

```typescript
const ExecutiveSummaryComponent = getExecutiveSummaryComponent(
  proposal.proposal.executiveSummaryVariant
);

<ExecutiveSummaryComponent content={proposal.proposal.executiveSummary} />
```

### 4. Example Variant Component

**ExecutiveSummaryDetailed** (`apps/web/src/components/proposal/variants/executive-summary-detailed.tsx`)

Features:
- Splits content by paragraphs
- Displays each paragraph in a visual card
- Adds icons for visual hierarchy
- Includes a key insight callout box
- Best for summaries with 200+ words

## How to Add New Variants

### Step 1: Create the Component

```bash
cd apps/web/src/components/proposal/variants
# Create: {section}-{variant}.tsx
```

### Step 2: Implement

```typescript
'use client';

import { motion } from 'framer-motion';

interface ExecutiveSummaryVisualProps {
  content: string;
}

export function ExecutiveSummaryVisual({ content }: ExecutiveSummaryVisualProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Your custom UI */}
    </motion.section>
  );
}
```

### Step 3: Register in Variant Mapper

```typescript
import { ExecutiveSummaryVisual } from '@/components/proposal/variants/executive-summary-visual';

export const executiveSummaryVariants = {
  brief: ExecutiveSummary,
  detailed: ExecutiveSummaryDetailed,
  visual: ExecutiveSummaryVisual, // ✅ Add here
  timeline: ExecutiveSummary,
};
```

### Step 4: Test

Update test proposal to use the new variant:

```typescript
{
  executiveSummary: "...",
  executiveSummaryVariant: 'visual', // Test the new variant
}
```

## AI Agent Integration (When Built)

The AI agent will analyze proposal content and select appropriate variants:

```json
{
  "executiveSummary": "[300 words, 3 paragraphs]",
  "executiveSummaryVariant": "detailed",  // AI chooses this
  "needs": ["Need 1", "Need 2", "Need 3"],
  "needsVariant": "list",                 // AI chooses this
  // ... rest of proposal
}
```

**Agent Decision Logic:**
- Length-based (brief vs detailed)
- Structure-based (narrative vs structured)
- Content-based (visual vs textual)
- Industry-based (formal vs casual)

See: `apps/agent/docs/VARIANT_SELECTION_GUIDE.md` for full decision trees.

## Current Status

### ✅ Completed
- [x] Schema with variant fields
- [x] Variant mapper system
- [x] Dynamic component selection in page
- [x] Example variant (ExecutiveSummaryDetailed)
- [x] Developer documentation
- [x] AI agent selection guide
- [x] Test data updated

### 🚧 In Progress
- [ ] Build remaining 31 variants (as needed)
- [ ] Integrate with LangChain agent
- [ ] Add variant preview in admin panel

### 📋 Next Steps

1. **Start Building Agent** - Now that variant infrastructure is in place, we can build the LangChain agent that will:
   - Parse uploaded documents
   - Extract proposal content
   - Analyze content characteristics
   - Select appropriate variants
   - Generate complete proposal JSON

2. **Build Variants Incrementally** - As proposals require different variants, we'll build them:
   - Priority 1: Variants the agent commonly selects
   - Priority 2: Variants for specific industries
   - Priority 3: Advanced/specialty variants

3. **Test Variant Selection** - Create test cases to validate agent's variant choices

## File Structure

```
packages/shared/src/types/
  └── proposal.ts                    # Schema with variant enums

apps/web/src/
  ├── lib/
  │   └── variant-mapper.tsx         # Component mapping system
  ├── app/proposals/[slug]/[token]/
  │   └── page.tsx                   # Uses dynamic components
  ├── components/proposal/
  │   ├── executive-summary.tsx      # Default variant (brief)
  │   └── variants/
  │       ├── README.md              # Developer guide
  │       └── executive-summary-detailed.tsx  # Example variant
  └── data/
      └── proposals.ts               # Test data with variants

apps/agent/
  └── docs/
      └── VARIANT_SELECTION_GUIDE.md # AI agent decision guide
```

## Benefits

1. **Flexibility** - Different proposals can have different presentations
2. **Scalability** - Add new variants without changing schema
3. **Maintainability** - Each variant is a separate component
4. **AI-Driven** - Agent chooses best presentation for each proposal
5. **Incremental** - Build variants as needed, not all at once

## Example Variants Per Section

| Section | Variants | Status |
|---------|----------|--------|
| Executive Summary | brief, detailed, visual, timeline | ✅ detailed |
| Understanding Needs | list, grid, cards, timeline | 🚧 all TODO |
| Solution | narrative, structured, visual, comparison | 🚧 all TODO |
| Features | grid, list, showcase, tabbed | 🚧 all TODO |
| Roadmap | timeline, phases, gantt, milestones | 🚧 all TODO |
| Why Us | list, grid, testimonial, stats | 🚧 all TODO |
| Pricing | tiers, table, custom, simple | 🚧 all TODO |
| Contact | standard, card, inline, footer | 🚧 all TODO |

**Total: 32 variants (1 built, 31 to be built as needed)**

---

**Ready to proceed with building the AI agent that will use this variant system!**
