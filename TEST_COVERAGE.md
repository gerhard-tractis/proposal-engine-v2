# Test Coverage Report

## Overview

This document tracks test coverage for the Tractis Commercial Engine V2.

**Current Status:** ✅ 19 tests passing
**Last Updated:** 2026-02-10

---

## Test Suites

### 1. Branding Module Tests ✅
**File:** `apps/web/src/lib/branding.test.ts`
**Tests:** 7 passing
**Coverage:** Critical branding bug fix verification

#### Tests Included:
- ✅ `getProposalBranding` returns client colors when provided
- ✅ Uses client primary color for `--brand-primary` (not hardcoded #dfad30)
- ✅ Uses client primary color for `--primary` CSS variable
- ✅ Uses client accent color for `--border` CSS variable
- ✅ Uses client primary color for `--ring` CSS variable
- ✅ Generates hover colors based on client colors
- ✅ Real-world Imperial proposal branding test

**Bug Fixed:** Hardcoded Tractis colors (#dfad30, #7b8b9d) were overriding client branding. Tests verify that client colors are now properly applied.

---

### 2. Admin Authentication Tests ✅
**File:** `apps/web/src/app/admin/admin.test.tsx`
**Tests:** 12 passing
**Coverage:** Login, logout, session persistence, security validation

#### Tests Included:

**Login Screen:**
- ✅ Shows login screen when not authenticated
- ✅ Doesn't show dashboard when not authenticated
- ✅ Accepts correct password and shows dashboard
- ✅ Rejects incorrect password
- ✅ Clears password input after failed login

**Session Persistence:**
- ✅ Persists authentication in sessionStorage
- ✅ Auto-authenticates if session exists

**Logout Functionality:**
- ✅ Shows logout button when authenticated
- ✅ Logs out and returns to login screen
- ✅ Clears sessionStorage on logout

**Security Validation:**
- ✅ Doesn't accept empty password
- ✅ Requires exact password match (case-sensitive)

**Security Feature:** Admin dashboard now requires password authentication (default: `tractis2024`). Sessions persist using `sessionStorage`.

---

## Running Tests

### Run all tests:
```bash
pnpm test
```

### Run web app tests only:
```bash
pnpm test:web
```

### Run tests in watch mode (during development):
```bash
cd apps/web && pnpm test
```

### Run tests with UI (visual test runner):
```bash
cd apps/web && pnpm test:ui
```

---

## Test Framework

- **Runner:** Vitest 4.0.18
- **Testing Library:** @testing-library/react 16.3.2
- **Environment:** jsdom 28.0.0
- **Config:** `apps/web/vitest.config.ts`

---

## Coverage Goals

### Current Coverage: 2 modules
- ✅ Branding module (100%)
- ✅ Admin authentication (100%)

### Next Priority (from Code Review):
1. ⏳ Zod schema validation tests (`packages/shared/src/types/proposal.test.ts`)
2. ⏳ Proposal lookup logic tests (`apps/web/src/lib/proposal-helpers.test.ts`)
3. ⏳ Agent workflow tests (`apps/agent/src/services/*.test.ts`)
4. ⏳ Variant mapper tests (`apps/web/src/lib/variant-mapper.test.tsx`)
5. ⏳ Error boundary tests

### Future Coverage:
- E2E tests for proposal rendering
- Integration tests for agent API
- Performance tests for LLM calls
- Security tests for token validation

---

## CI/CD Integration

### Recommended GitHub Actions Workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:web
      - run: pnpm type-check
```

---

## Test-Driven Development (TDD) Guidelines

Going forward, follow this workflow:

### 1. RED - Write Failing Test First
```typescript
it('should do something', () => {
  const result = functionThatDoesntExist();
  expect(result).toBe('expected');
});
```

### 2. GREEN - Make Test Pass
```typescript
function functionThatDoesntExist() {
  return 'expected';
}
```

### 3. REFACTOR - Clean Up Code
```typescript
function functionWithBetterName() {
  return 'expected';
}
```

---

## Notes

- All tests are colocated with source files for easy discovery
- Tests use realistic data (Imperial proposal, Tractis colors)
- Security tests verify password protection requirements
- Branding tests prevent regression of critical bug

---

## Maintenance

**Add tests when:**
- Fixing bugs (write test that reproduces bug first)
- Adding new features (test-driven development)
- Refactoring code (tests verify behavior unchanged)

**Update this document when:**
- New test suites are added
- Coverage goals are achieved
- CI/CD pipeline is configured
