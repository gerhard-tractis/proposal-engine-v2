---
title: 'Backend API Security - Authentication, CORS, and Rate Limiting'
slug: 'backend-api-security'
created: '2026-02-12'
status: 'review'
stepsCompleted: [1, 2, 3]
tech_stack: ['express@4.21.2', 'cors@2.8.5', 'express-rate-limit', 'dotenv@16.4.7', 'typescript@5.7.3', 'tsx@4.19.2']
files_to_modify: ['apps/agent/src/server.ts', 'apps/agent/src/middleware/auth.ts', 'apps/agent/src/middleware/rate-limit.ts', 'apps/agent/package.json', 'apps/agent/.env.example']
code_patterns: ['express Router() per route file', 'app.use() for middleware in server.ts', 'ES modules with .js extensions in imports', 'dotenv config() at startup', 'async route handlers with try/catch']
test_patterns: ['no tests exist in apps/agent - clean slate for test setup']
---

# Tech-Spec: Backend API Security - Authentication, CORS, and Rate Limiting

**Created:** 2026-02-12

## Overview

### Problem Statement

The Express backend (apps/agent) has no authentication, no CORS restrictions, and no rate limiting. Anyone who discovers the Railway URL (https://repoagent-production-420c.up.railway.app) can call all endpoints without authorization. This exposes Anthropic and Groq API credits to unauthorized consumption, enables abuse of file upload and web scraping endpoints, and provides no way to attribute usage or enforce quotas. This is RISK-3 from the architectural review.

### Solution

Add three layers of backend security as Express middleware: (1) API key authentication via Authorization header validated against an environment variable, (2) CORS locked down to only allow the frontend origin (https://proposal.tractis.ai), and (3) rate limiting on all API endpoints. Health check and root endpoints remain public.

### Scope

**In Scope:**
- API key authentication middleware for all `/api/*` routes
- Environment variable `API_KEY` for storing the secret key
- CORS configuration restricted to `https://proposal.tractis.ai` (plus localhost for dev)
- Rate limiting middleware on `/api/*` routes
- Proper error responses (401 Unauthorized, 429 Too Many Requests)
- Frontend configuration to send API key via `Authorization: Bearer <key>` header

**Out of Scope:**
- JWT or session-based authentication
- User-level authentication or multi-tenant API keys
- Database-backed key storage or key rotation mechanism
- Frontend-side rate limiting (already exists in Vercel Edge middleware)
- CSRF protection
- Changes to the frontend Vercel deployment configuration

## Context for Development

### Codebase Patterns

- **Module System:** ES Modules with `"type": "module"` in package.json. All internal imports use `.js` extension (e.g., `import extractDesignRouter from './routes/extract-design.js'`)
- **Express Setup:** Single `server.ts` file creates the Express app, registers global middleware (`cors()`, `express.json()`), mounts route handlers, adds error handler, and starts listening
- **Route Pattern:** Each route file exports a default `Router()` instance. Routes are mounted via `app.use('/api/path', router)` in `server.ts`
- **Route Handlers:** All use async handlers with try/catch, returning JSON responses. Error responses follow `{ error: string, message: string }` shape
- **Environment Variables:** Loaded via `dotenv` `config()` at top of `server.ts`. Accessed via `process.env.KEY`. No validation of required env vars at startup
- **TypeScript Config:** Target ES2022, moduleResolution "bundler", strict mode enabled
- **No Middleware Directory:** All middleware is currently inline in `server.ts` (just `cors()` and `express.json()`)
- **No Test Infrastructure:** No test files, no test framework configured in apps/agent
- **Frontend Does Not Call Backend Yet:** The admin page (`apps/web/src/app/admin/page.tsx`) does not currently make HTTP calls to the Railway backend. The frontend agent file (`apps/web/src/lib/agent.ts`) calls its own Next.js API routes, not the Express backend. This means adding auth headers to frontend calls is a future task when the integration is built.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `apps/agent/src/server.ts` | Express app setup: middleware registration, route mounting, error handler, server start. **Primary file to modify.** |
| `apps/agent/package.json` | Dependencies. Currently has `cors@2.8.5`, `express@4.21.2`, `dotenv@16.4.7`. Needs `express-rate-limit` added. |
| `apps/agent/.env.example` | Environment variable template. Currently has `GROQ_API_KEY`, `PORT`, `NEXT_PUBLIC_APP_URL`. Needs `API_KEY` and `CORS_ORIGIN` added. |
| `apps/agent/tsconfig.json` | TypeScript config: ES2022, ESNext modules, strict, bundler resolution. New files must follow this. |
| `apps/agent/src/routes/generate-proposal.ts` | Main AI pipeline route. Uses `Router()`, async handler, try/catch. Pattern to follow. |
| `apps/agent/src/routes/extract-design.ts` | Web scraping route with Puppeteer. Sensitive - needs auth protection. |
| `apps/agent/src/routes/extract-text.ts` | File upload route with multer. Sensitive - needs auth protection. |
| `apps/agent/src/routes/create-proposal.ts` | Placeholder route (TODO implementation). Still needs auth protection. |

### Technical Decisions

1. **Middleware File Structure:** Create `apps/agent/src/middleware/` directory with separate files for auth and rate limiting. This follows separation of concerns and keeps `server.ts` clean. Each middleware exports a function that can be applied globally or per-route.
2. **`express-rate-limit` Package:** Mature, well-maintained (7M+ weekly downloads), uses in-memory store by default (sufficient for single-instance Railway deployment). No Redis dependency needed now. Compatible with Express 4.
3. **API Key via `Authorization: Bearer <key>` Header:** Standard HTTP pattern. Simple string comparison against `API_KEY` env var. No cryptographic hashing needed for a shared secret.
4. **Single API Key:** Sufficient for current architecture where only one frontend calls the backend. Multi-key support can be added later if needed.
5. **CORS Allowed Origins:** `https://proposal.tractis.ai` in production. In development (`NODE_ENV !== 'production'`), also allow `http://localhost:3000` and `http://localhost:3001`. Configurable via `CORS_ORIGIN` env var.
6. **Rate Limit:** 100 requests per 15-minute window per IP. Returns standard `429 Too Many Requests` with `Retry-After` header. Applied only to `/api/*` routes.
7. **Public Endpoints:** Health check (`/health`) and root (`/`) remain unauthenticated and unrate-limited for Railway health monitoring.
8. **Startup Validation:** Add a check at server startup that warns (but does not crash) if `API_KEY` is not set. In production, the server should log an error but still start to avoid deployment failures from missing config.

## Implementation Plan

### Tasks

- [ ] Task 1: Install `express-rate-limit` dependency
  - File: `apps/agent/package.json`
  - Action: Run `pnpm --filter=@repo/agent add express-rate-limit`
  - Notes: This adds the rate limiting package. No `@types` package needed - `express-rate-limit` ships its own TypeScript types.

- [ ] Task 2: Create API key authentication middleware
  - File: `apps/agent/src/middleware/auth.ts` (new file)
  - Action: Create a new middleware file that exports an Express middleware function `requireApiKey`. The middleware must:
    1. Extract the `Authorization` header from the request
    2. Validate it matches the format `Bearer <key>`
    3. Compare the extracted key against `process.env.API_KEY` using timing-safe comparison (`crypto.timingSafeEqual`)
    4. If valid, call `next()`
    5. If missing, return `401` with `{ error: 'Unauthorized', message: 'Missing Authorization header. Expected: Bearer <api-key>' }`
    6. If invalid, return `401` with `{ error: 'Unauthorized', message: 'Invalid API key' }`
    7. If `API_KEY` env var is not set, log a warning and allow the request through (development convenience)
  - Notes: Use `crypto.timingSafeEqual` to prevent timing attacks. Import `crypto` from Node.js built-in. The middleware must be a standard Express `(req, res, next)` function typed with `express.RequestHandler`.

- [ ] Task 3: Create rate limiting middleware
  - File: `apps/agent/src/middleware/rate-limit.ts` (new file)
  - Action: Create a new middleware file that exports a configured `express-rate-limit` instance `apiRateLimiter`. Configuration:
    1. `windowMs`: 15 * 60 * 1000 (15 minutes)
    2. `limit`: 100 (requests per window per IP)
    3. `standardHeaders`: `'draft-7'` (sends `RateLimit-*` headers)
    4. `legacyHeaders`: false (disables `X-RateLimit-*` headers)
    5. `message`: `{ error: 'Too Many Requests', message: 'Rate limit exceeded. Try again in 15 minutes.' }`
    6. `keyGenerator`: Use `req.ip` (default behavior, but explicit for clarity)
  - Notes: Import `rateLimit` from `express-rate-limit`. Export as named export.

- [ ] Task 4: Configure CORS with restricted origins
  - File: `apps/agent/src/server.ts`
  - Action: Replace `app.use(cors())` with a configured CORS setup:
    1. Define `allowedOrigins` array: `['https://proposal.tractis.ai']`
    2. If `process.env.CORS_ORIGIN` is set, add it to the array
    3. If `process.env.NODE_ENV !== 'production'`, add `'http://localhost:3000'` and `'http://localhost:3001'`
    4. Pass `cors({ origin: allowedOrigins, methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] })` to `app.use()`
  - Notes: The `cors` package already supports an array of origins. The `allowedHeaders` must include `Authorization` for the API key header to pass CORS preflight.

- [ ] Task 5: Wire middleware into Express app
  - File: `apps/agent/src/server.ts`
  - Action: Modify the middleware and route registration order:
    1. Add imports at top: `import { requireApiKey } from './middleware/auth.js'` and `import { apiRateLimiter } from './middleware/rate-limit.js'`
    2. Keep existing global middleware: CORS (now configured) and `express.json()`
    3. Add startup validation: After `config()`, check if `process.env.API_KEY` is set. If not and `NODE_ENV === 'production'`, log `console.error('WARNING: API_KEY not set. All API routes are unprotected.')`
    4. Keep health check routes (`/` and `/health`) BEFORE the API middleware (they remain public)
    5. Add a middleware group for `/api/*` routes: `app.use('/api', requireApiKey, apiRateLimiter)`
    6. Keep existing route mounts AFTER the middleware group
  - Notes: The order matters. The middleware group on `/api` will apply to all sub-routes. Health check routes must be registered before the `/api` middleware to stay public. The existing route mounts (`app.use('/api/extract-design', ...)`) will inherit the `/api` middleware.

  **Updated `server.ts` structure (pseudocode):**
  ```
  import cors, express, dotenv
  import { requireApiKey } from './middleware/auth.js'
  import { apiRateLimiter } from './middleware/rate-limit.js'
  import route handlers...

  config()  // load env vars

  // Startup validation
  if (!process.env.API_KEY && process.env.NODE_ENV === 'production') {
    console.error('WARNING: API_KEY not set...')
  }

  const app = express()

  // Global middleware
  app.use(cors({ origin: allowedOrigins, ... }))
  app.use(express.json())

  // Public routes (no auth, no rate limit)
  app.get('/', ...)
  app.get('/health', ...)

  // API middleware (auth + rate limit for all /api/* routes)
  app.use('/api', requireApiKey, apiRateLimiter)

  // Protected API routes
  app.use('/api/extract-design', extractDesignRouter)
  app.use('/api/extract-text', extractTextRouter)
  app.use('/api/create-proposal', createProposalRouter)
  app.use('/api', generateProposalRouter)

  // Error handler
  app.use(errorHandler)

  app.listen(...)
  ```

- [ ] Task 6: Update environment variable template
  - File: `apps/agent/.env.example`
  - Action: Add the following environment variables:
    ```
    # API Authentication (generate a strong random key, e.g., openssl rand -hex 32)
    API_KEY=your_api_key_here

    # CORS: Additional allowed origin (optional, https://proposal.tractis.ai is always allowed)
    CORS_ORIGIN=

    # Environment (set to 'production' on Railway)
    NODE_ENV=development
    ```
  - Notes: Keep existing variables. Add new ones below with clear comments.

- [ ] Task 7: Verify TypeScript compilation
  - File: All new and modified files
  - Action: Run `pnpm --filter=@repo/agent type-check` to verify no TypeScript errors
  - Notes: Must pass with zero errors before considering implementation complete.

### Acceptance Criteria

- [ ] AC 1: Given a request to `POST /api/generate-proposal` with no Authorization header, when the request is received, then the server returns `401 Unauthorized` with body `{ "error": "Unauthorized", "message": "Missing Authorization header. Expected: Bearer <api-key>" }`

- [ ] AC 2: Given a request to `POST /api/generate-proposal` with `Authorization: Bearer wrong-key`, when the request is received, then the server returns `401 Unauthorized` with body `{ "error": "Unauthorized", "message": "Invalid API key" }`

- [ ] AC 3: Given a request to `POST /api/generate-proposal` with `Authorization: Bearer <valid-key>` (matching `API_KEY` env var), when the request is received, then the request proceeds to the route handler normally

- [ ] AC 4: Given a request to `GET /health` with no Authorization header, when the request is received, then the server returns `200 OK` with health status (no auth required)

- [ ] AC 5: Given a request to `GET /` with no Authorization header, when the request is received, then the server returns `200 OK` with service info (no auth required)

- [ ] AC 6: Given 101 requests from the same IP to `/api/*` endpoints within 15 minutes, when the 101st request arrives, then the server returns `429 Too Many Requests` with body `{ "error": "Too Many Requests", "message": "Rate limit exceeded. Try again in 15 minutes." }` and a `Retry-After` header

- [ ] AC 7: Given a request from `https://proposal.tractis.ai` with the `Origin` header set, when the request is received, then the CORS headers include `Access-Control-Allow-Origin: https://proposal.tractis.ai`

- [ ] AC 8: Given a request from `https://evil-site.com` with the `Origin` header set, when the request is received, then the CORS headers do NOT include `Access-Control-Allow-Origin` (request is blocked by CORS)

- [ ] AC 9: Given a CORS preflight `OPTIONS` request to any `/api/*` endpoint, when the request is received, then the response includes `Access-Control-Allow-Headers` containing `Authorization` and `Content-Type`

- [ ] AC 10: Given the server starts with `API_KEY` env var not set and `NODE_ENV=production`, when the server logs are checked, then a warning message is visible: `WARNING: API_KEY not set. All API routes are unprotected.`

- [ ] AC 11: Given the server starts with `API_KEY` env var not set and `NODE_ENV=development`, when a request to `/api/*` is made without an Authorization header, then the request is allowed through (development convenience)

- [ ] AC 12: Given `pnpm --filter=@repo/agent type-check` is run, when TypeScript compilation is attempted, then it completes with zero errors

## Additional Context

### Dependencies

- **`express-rate-limit`** (npm) - Rate limiting middleware for Express. Version `^7.0.0` recommended (latest major, ships with TypeScript types). No additional dependencies required for in-memory store.
- **`crypto`** (Node.js built-in) - For `timingSafeEqual` in API key comparison. No install needed.
- **Railway environment variables** - `API_KEY` must be configured in the Railway project dashboard before deployment. `NODE_ENV` should already be set to `production` by Railway.

### Testing Strategy

**Manual Testing (minimum for deployment):**

1. Start the dev server: `pnpm --filter=@repo/agent dev`
2. Test unauthenticated health check: `curl http://localhost:3001/health` (should return 200)
3. Test unauthenticated API call: `curl -X POST http://localhost:3001/api/generate-proposal` (should return 401 or pass through in dev mode without API_KEY set)
4. Set `API_KEY=test-key-123` in `.env`, restart server
5. Test without auth: `curl -X POST http://localhost:3001/api/generate-proposal` (should return 401)
6. Test with wrong key: `curl -X POST -H "Authorization: Bearer wrong" http://localhost:3001/api/generate-proposal` (should return 401)
7. Test with correct key: `curl -X POST -H "Authorization: Bearer test-key-123" -H "Content-Type: application/json" -d '{"documentText":"test"}' http://localhost:3001/api/generate-proposal` (should proceed to handler)
8. Test CORS: `curl -H "Origin: https://evil-site.com" -I http://localhost:3001/api/generate-proposal` (should not include Access-Control-Allow-Origin for evil origin)

**Future Testing (out of scope for this spec):**

- Unit tests with `vitest` for the auth middleware (mock `process.env`, test all branches)
- Integration tests for rate limiting (verify counter resets, verify 429 response)
- E2E tests from the frontend when the admin dashboard integrates with the backend

### Notes

- **Addresses:** RISK-3 (No Backend Authentication) from the architectural review, plus the "No rate limiting on backend" gap from the gaps table
- **Timing-Safe Comparison:** Using `crypto.timingSafeEqual` prevents timing attacks where an attacker could determine the correct API key character by character based on response time differences. Both strings must be the same length for `timingSafeEqual`, so pad/hash if needed, or compare lengths first and reject immediately if different.
- **Rate Limit Store:** The in-memory store resets on server restart. This is acceptable for Railway's single-instance deployment. If Railway scales to multiple instances, switch to `rate-limit-redis` with Upstash Redis.
- **Frontend Integration:** The frontend does not currently call the backend API. When that integration is built (likely via the admin dashboard), the frontend must include `Authorization: Bearer <key>` in all requests to the backend. The API key should be stored as `NEXT_PUBLIC_AGENT_API_KEY` (or a server-side env var if using Next.js API routes as a proxy).
- **Key Generation:** For production, generate the API key with: `openssl rand -hex 32` (produces a 64-character hex string)
- **No Breaking Changes:** Health check and root endpoints remain public. Existing monitoring or health checks on Railway will not break.
