# Claude Code Instructions

## 🚨 Critical Rules

### File Operations
- ✅ **ALWAYS use the Write tool** to create or modify files
- ❌ **NEVER use bash heredocs** (`cat << EOF`, `cat > file << 'EOF'`, etc.)
- ❌ **NEVER modify** `.claude/settings.local.json` during normal operation
- ❌ **NEVER add specific bash commands to permissions** - only patterns like `Bash(git *)`

### Why This Matters
In the past, Claude has accidentally corrupted `.claude/settings.local.json` by adding entire bash heredoc commands (with file contents) as permission entries. This breaks Claude Code startup and must be manually fixed.

**Example of what NOT to do:**
```json
// ❌ WRONG - This will corrupt the file
"Bash(cat > file.txt << 'EOF'\nContent here\nEOF)"
```

**Correct approach:**
```json
// ✅ CORRECT - Simple patterns only
"Bash(cat *)"
```

## Permissions Philosophy

The `.claude/settings.local.json` file uses simple, broad wildcards:
- `Bash(git *)` - allows all git commands
- `Bash(npm *)` - allows all npm commands
- `Bash(pnpm *)` - allows all pnpm commands

**Do not add specific command patterns.** The broad wildcards are intentional and prevent file corruption.

## Project Overview

This is a monorepo for an AI-powered proposal generation system:
- **Frontend:** Next.js 16 (apps/web) - deployed on Vercel
- **Backend:** Express + LangChain (apps/agent) - deployed on Railway
- **Shared:** TypeScript types and Zod schemas (packages/shared)

### Tech Stack
- **Monorepo:** Turborepo + pnpm workspaces
- **Language:** TypeScript with ES Modules
- **AI:** LangChain + Groq (in progress)
- **Styling:** Tailwind CSS + shadcn/ui
- **Web Scraping:** Puppeteer + Dembrandt CLI

### Key Commands
```bash
# Install dependencies
pnpm install

# Run dev servers
pnpm dev

# Build all packages
pnpm build

# Type check
pnpm --filter=@repo/web type-check
```

## Development Workflow

1. Always read relevant files before modifying them
2. Use the Write tool for file creation
3. Use the Edit tool for file modifications
4. Test changes before committing
5. Follow existing code patterns and structure

## Important Files

- **README.md** - Main project documentation
- **VARIANT_SYSTEM.md** - Component variant architecture
- **.claude/settings.local.json** - Permission settings (DO NOT MODIFY)
- **turbo.json** - Monorepo build configuration

## Deployment

- **Frontend:** https://proposal.tractis.ai (Vercel)
- **Backend:** https://repoagent-production-420c.up.railway.app (Railway)

## Contact

**Project Lead:** Gerhard Neumann
**Email:** gerhard@tractis.ai
