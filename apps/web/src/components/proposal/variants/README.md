# Component Variants Guide

This directory contains alternative UI variations for proposal sections. Each variant provides a different visual/structural presentation of the same data.

## Architecture Overview

```
packages/shared/types/proposal.ts
  └── Defines variant enums and schema fields

apps/web/src/lib/variant-mapper.tsx
  └── Maps variant names to components

apps/web/src/components/proposal/variants/
  └── Variant component implementations
```

## How to Add a New Variant

### Step 1: Ensure the variant is defined in the schema

Check `packages/shared/types/proposal.ts` - the variant should already be listed in the appropriate enum (e.g., `ExecutiveSummaryVariants`).

If you need to add a new variant option:
1. Add it to the variant enum array
2. The type system will automatically pick it up

### Step 2: Create the variant component

Create a new file in this directory following the naming pattern:
- `{section-name}-{variant-name}.tsx`
- Example: `executive-summary-detailed.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';

interface ExecutiveSummaryDetailedProps {
  content: string; // Match the props of the original component
}

export function ExecutiveSummaryDetailed({ content }: ExecutiveSummaryDetailedProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Your custom UI implementation */}
    </motion.section>
  );
}
```

**Important:**
- Keep the same prop interface as the base component
- Use framer-motion for animations (already installed)
- Use CSS variables for branding: `var(--brand-primary)`, `var(--brand-accent)`
- Follow dark mode patterns (use `text-foreground`, `bg-background`, etc.)
- Add a JSDoc comment explaining when this variant should be used

### Step 3: Register in variant-mapper

Update `apps/web/src/lib/variant-mapper.tsx`:

```typescript
// Add import
import { ExecutiveSummaryDetailed } from '@/components/proposal/variants/executive-summary-detailed';

// Update mapping
export const executiveSummaryVariants: Record<ExecutiveSummaryVariant, ComponentType<any>> = {
  brief: ExecutiveSummary,
  detailed: ExecutiveSummaryDetailed, // ✅ Register here
  visual: ExecutiveSummary,
  timeline: ExecutiveSummary,
};
```

### Step 4: Test the variant

Update a test proposal in `apps/web/src/data/proposals.ts` to use the new variant:

```typescript
{
  // ... other fields
  proposal: {
    executiveSummary: "Your content...",
    executiveSummaryVariant: "detailed", // ✅ Test the new variant
    // ...
  }
}
```

## Variant Selection Guidelines

### When the AI Agent Should Choose Each Variant

#### Executive Summary
- **brief**: Short summary (< 100 words), single key message
- **detailed**: Longer summary (200+ words), multiple paragraphs
- **visual**: Needs icons/graphics, has distinct sections
- **timeline**: Historical context or phased explanation

#### Understanding Needs
- **list**: 3-5 simple needs, bullet point format
- **grid**: 6+ needs, equal importance
- **cards**: Needs with detailed descriptions
- **timeline**: Needs discovered/prioritized over time

#### Solution
- **narrative**: Story-driven, process explanation
- **structured**: Multi-part solution, clear divisions
- **visual**: Diagrams/architecture, technical solution
- **comparison**: Before/after, problem/solution contrast

#### Features
- **grid**: 6+ features, visual cards
- **list**: 3-5 features, detailed descriptions
- **showcase**: 1-3 hero features, spotlight presentation
- **tabbed**: Features grouped by category

#### Roadmap
- **timeline**: Linear sequence, date-driven
- **phases**: Grouped deliverables by phase
- **gantt**: Parallel workstreams, dependencies
- **milestones**: Key achievements, goal-focused

#### Why Us
- **list**: Simple reasons, bullet points
- **grid**: Multiple strengths, visual cards
- **testimonial**: Social proof, quote-driven
- **stats**: Data-driven, metrics showcase

#### Pricing
- **tiers**: Multiple packages, feature comparison
- **table**: Detailed comparison, many options
- **custom**: Unique pricing model, consultation-based
- **simple**: Single price, straightforward

#### Contact
- **standard**: Name, email, phone, next steps
- **card**: Highlighted contact, call-to-action
- **inline**: Embedded in content, subtle
- **footer**: Minimal, end-of-page placement

## Best Practices

1. **Maintain Consistency**: All variants should feel like part of the same design system
2. **Respect Branding**: Always use CSS variables for colors
3. **Performance**: Use framer-motion sparingly, lazy load heavy components
4. **Accessibility**: Ensure all variants meet WCAG AA standards
5. **Responsive**: Test on mobile, tablet, desktop
6. **Error Handling**: Gracefully handle missing or malformed data

## Testing Checklist

Before marking a variant as complete:
- [ ] Component renders without errors
- [ ] Respects dark mode theme
- [ ] Uses brand colors correctly
- [ ] Animates smoothly
- [ ] Props match base component interface
- [ ] Registered in variant-mapper
- [ ] Tested with real data
- [ ] Responsive on all screen sizes
- [ ] Documented when to use it

## Example Variants by Section

### ExecutiveSummary
- ✅ `brief` (default) - apps/web/src/components/proposal/executive-summary.tsx
- ✅ `detailed` - apps/web/src/components/proposal/variants/executive-summary-detailed.tsx
- 🚧 `visual` - TODO
- 🚧 `timeline` - TODO

### Other Sections
- 🚧 Coming soon as needed

---

**Note**: We follow an incremental approach. Variants are built on-demand based on proposal requirements, not all at once.
