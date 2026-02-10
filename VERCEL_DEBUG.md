# Vercel Deployment Debugging Guide

## 🚨 CRITICAL RULE

**NEVER modify the tractis-demo (standard 8-section) proposal when debugging Imperial or Vercel issues.**

### Why?
The tractis-demo proposal is the **reference implementation** with all features:
- Full businessCase with ROI calculations
- Complete techStack with categories
- Full contact schema (role, website, linkedin, calendly, cta)
- All variant fields
- Complete feature/roadmap arrays

---

## 🏗️ Architecture

### Two Proposal Types:

1. **Standard (tractis-demo)**
   - Uses 8-section structure
   - Renders with variant components
   - Full layout wrapper with branding CSS
   - **MUST remain intact - never simplify or strip features**

2. **Custom (imperial)**
   - Uses custom component (imperial-custom.tsx)
   - Handles own styling completely
   - Minimal layout wrapper (just sticky header)
   - Data can be adjusted independently

---

## 🐛 When Vercel Fails

### Step 1: Identify the Error Type

**Type Errors (most common):**
- Check if shared types match proposal data
- Verify all required fields are present
- Don't strip fields from tractis-demo to "fix" type errors

**Build Errors:**
- Check import paths
- Verify all files exist
- Check for syntax errors

**Runtime Errors:**
- Check console logs in Vercel deployment
- Verify environment variables
- Check for missing assets

### Step 2: Debug Imperial ONLY

If Imperial is broken:
1. Check `apps/web/src/data/proposals.ts` Imperial section (lines 22-131)
2. Check `apps/web/src/components/proposal/custom/imperial-custom.tsx`
3. Check `apps/web/src/app/proposals/[slug]/[token]/layout.tsx` custom proposal path

**NEVER:**
- Don't change tractis-demo data structure
- Don't remove variant fields from tractis-demo
- Don't simplify businessCase or techStack in tractis-demo

### Step 3: Fix at the Source

**Type mismatches?**
- Fix the schema in `packages/shared/src/types/proposal.ts`
- OR adjust Imperial data to match schema
- NEVER strip features from tractis-demo

**Missing fields?**
- Add them to Imperial data
- OR make them optional in schema
- NEVER remove them from tractis-demo

---

## ✅ Vercel Pre-flight Checklist

Before pushing to trigger Vercel deployment:

```bash
# 1. Type check passes
pnpm type-check

# 2. Tests pass
pnpm test:web

# 3. Build succeeds locally
pnpm build

# 4. Verify tractis-demo is intact
# Check that it still has:
# - businessCase object
# - techStack object
# - Full contact info with all fields
# - All variant fields
```

---

## 📝 Common Vercel Errors & Fixes

### Error: Type mismatch in proposals.ts

**❌ WRONG FIX:**
```typescript
// DON'T strip features from tractis-demo
proposal: {
  // Removed businessCase ❌
  // Removed techStack ❌
}
```

**✅ CORRECT FIX:**
```typescript
// Keep tractis-demo intact, fix Imperial or schema instead
// Option A: Make field optional in schema
businessCase: BusinessCaseSchema.optional()

// Option B: Add missing data to Imperial
businessCase: undefined // explicitly undefined if not used
```

### Error: Module not found

**Check:**
- File paths are correct
- Imports use correct extensions (.tsx not .ts for React components)
- Files exist in the repo

### Error: Environment variable missing

**Fix:**
- Add to Vercel project settings
- Verify variable names match code

---

## 🎯 Summary

**Golden Rule:** When Vercel fails, debug Imperial or schema. **NEVER simplify tractis-demo.**

The tractis-demo proposal is sacred - it's your working reference implementation with all features. Protect it at all costs.
