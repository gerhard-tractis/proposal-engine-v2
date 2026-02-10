# AI Agent Variant Selection Guide

## Overview

When generating proposals, the AI agent must choose the most appropriate UI variant for each section based on the proposal content, complexity, and client context.

## Decision Framework

For each section, consider these factors:
1. **Content Length**: How much text/data is in this section?
2. **Content Structure**: Is it simple or multi-layered?
3. **Visual Needs**: Does it benefit from graphics/icons?
4. **Client Industry**: What presentation style fits their sector?
5. **Formality Level**: Is this a formal RFP or casual pitch?

---

## Section 1: Executive Summary

### Available Variants
- `brief` (default)
- `detailed`
- `visual`
- `timeline`

### Selection Logic

```
IF content_length < 100 words:
  → Use 'brief'

ELSE IF content_length >= 200 words AND has_multiple_paragraphs:
  → Use 'detailed'

ELSE IF has_historical_context OR shows_progression:
  → Use 'timeline'

ELSE IF highly_technical AND needs_visual_aids:
  → Use 'visual'

DEFAULT:
  → Use 'brief'
```

### Examples

**Example 1: Brief**
```
Input: "We propose an AI chatbot to automate your customer support, reducing response time by 60%."
Reasoning: Single sentence, clear message
Variant: 'brief'
```

**Example 2: Detailed**
```
Input: "Your organization faces three critical challenges... [3 paragraphs totaling 250 words]"
Reasoning: Multiple paragraphs, structured argument
Variant: 'detailed'
```

---

## Section 2: Understanding Needs

### Available Variants
- `list` (default)
- `grid`
- `cards`
- `timeline`

### Selection Logic

```
IF number_of_needs <= 3:
  → Use 'list'

ELSE IF number_of_needs >= 6 AND all_equal_importance:
  → Use 'grid'

ELSE IF needs_have_detailed_descriptions:
  → Use 'cards'

ELSE IF needs_evolved_over_time:
  → Use 'timeline'

DEFAULT:
  → Use 'list'
```

### Examples

**Grid vs. List**
```
3-5 needs = 'list'
6+ needs = 'grid'
```

---

## Section 3: Solution

### Available Variants
- `narrative` (default)
- `structured`
- `visual`
- `comparison`

### Selection Logic

```
IF solution_has_distinct_phases OR components:
  → Use 'structured'

ELSE IF emphasizes_before_vs_after OR problem_solving:
  → Use 'comparison'

ELSE IF highly_technical OR architecture_driven:
  → Use 'visual'

ELSE:
  → Use 'narrative'
```

---

## Section 4: Features

### Available Variants
- `grid` (default)
- `list`
- `showcase`
- `tabbed`

### Selection Logic

```
IF number_of_features >= 6:
  → Use 'grid'

ELSE IF number_of_features <= 3 AND are_hero_features:
  → Use 'showcase'

ELSE IF features_grouped_by_category:
  → Use 'tabbed'

ELSE:
  → Use 'list'
```

---

## Section 5: Roadmap

### Available Variants
- `timeline` (default)
- `phases`
- `gantt`
- `milestones`

### Selection Logic

```
IF strict_date_sequence:
  → Use 'timeline'

ELSE IF grouped_by_phases WITH deliverables:
  → Use 'phases'

ELSE IF parallel_workstreams OR dependencies:
  → Use 'gantt'

ELSE IF goal_focused WITHOUT specific_dates:
  → Use 'milestones'

DEFAULT:
  → Use 'timeline'
```

---

## Section 6: Why Us

### Available Variants
- `list` (default)
- `grid`
- `testimonial`
- `stats`

### Selection Logic

```
IF has_customer_quotes OR social_proof:
  → Use 'testimonial'

ELSE IF has_metrics OR data_points:
  → Use 'stats'

ELSE IF number_of_points >= 6:
  → Use 'grid'

ELSE:
  → Use 'list'
```

---

## Section 7: Pricing

### Available Variants
- `tiers` (default)
- `table`
- `custom`
- `simple`

### Selection Logic

```
IF has_multiple_packages WITH feature_comparison:
  → Use 'tiers'

ELSE IF complex_options WITH detailed_comparison:
  → Use 'table'

ELSE IF single_fixed_price:
  → Use 'simple'

ELSE IF consultation_required OR variable_pricing:
  → Use 'custom'

DEFAULT:
  → Use 'tiers'
```

---

## Section 8: Contact

### Available Variants
- `standard` (default)
- `card`
- `inline`
- `footer`

### Selection Logic

```
IF strong_call_to_action OR urgent:
  → Use 'card'

ELSE IF minimal_contact_info:
  → Use 'footer'

ELSE IF embedded_in_content:
  → Use 'inline'

ELSE:
  → Use 'standard'
```

---

## Complete Decision Tree Example

Given this input proposal:
```json
{
  "executiveSummary": "[300 words with 3 paragraphs]",
  "needs": ["Need 1", "Need 2", "Need 3"],
  "solution": "[Multi-component solution with 3 phases]",
  "features": [/* 8 features */],
  "roadmap": [/* 5 items with dates */],
  "whyUs": ["10 years experience", "50+ clients", "99.9% uptime"],
  "pricing": {
    "tiers": [/* 3 tiers */]
  },
  "contact": { /* standard fields */ }
}
```

**Agent Output:**
```json
{
  "executiveSummaryVariant": "detailed",  // 300 words = detailed
  "needsVariant": "list",                 // 3 needs = list
  "solutionVariant": "structured",        // Multi-component = structured
  "featuresVariant": "grid",              // 8 features = grid
  "roadmapVariant": "timeline",           // Has dates = timeline
  "whyUsVariant": "stats",                // Metrics-focused = stats
  "pricingVariant": "tiers",              // Multiple tiers = tiers
  "contactVariant": "standard"            // Default = standard
}
```

---

## Implementation in LangChain Agent

The agent should:
1. Parse the proposal content
2. Analyze each section using the decision trees above
3. Return variant selections as part of the proposal output
4. Include reasoning in the agent logs for debugging

### Example Prompt Template

```
Given this proposal content, select the most appropriate UI variant for each section.

CONTENT:
{proposal_content}

DECISION CRITERIA:
- Executive Summary: Length, structure, visual needs
- Needs: Count, depth, evolution
- Solution: Structure, technical depth, comparison needs
- Features: Count, importance, categorization
- Roadmap: Dates, phases, dependencies
- Why Us: Social proof, metrics, count
- Pricing: Complexity, packages, customization
- Contact: Urgency, detail level

OUTPUT FORMAT:
```json
{
  "executiveSummaryVariant": "...",
  "needsVariant": "...",
  "solutionVariant": "...",
  "featuresVariant": "...",
  "roadmapVariant": "...",
  "whyUsVariant": "...",
  "pricingVariant": "...",
  "contactVariant": "..."
}
```

RESPOND ONLY WITH THE JSON OBJECT.
```

---

## Testing Variant Selection

Create test cases covering:
- ✅ Short proposals (all defaults)
- ✅ Long proposals (detailed variants)
- ✅ Technical proposals (visual/structured variants)
- ✅ Sales-focused proposals (showcase/stats variants)
- ✅ Enterprise RFPs (formal variants)

Run agent on sample proposals and validate variant choices make sense.

---

**Last Updated**: 2026-02-05
**Related Files**:
- `packages/shared/types/proposal.ts` - Schema definitions
- `apps/web/src/lib/variant-mapper.tsx` - Component mapping
- `apps/web/src/components/proposal/variants/README.md` - Developer guide
