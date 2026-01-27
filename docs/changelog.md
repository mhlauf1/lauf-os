# Changelog

All notable changes to LAUF OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

_Nothing yet - next up is Supabase integration_

---

## [0.0.2] - 2026-01-26

### Added

**Documentation Infrastructure**
- Created `/docs` folder with comprehensive documentation
- `docs/architecture.md` - Full system architecture and patterns
- `docs/changelog.md` - Version tracking with semantic versioning
- `docs/mvp-checklist.md` - Phase-by-phase implementation tracker
- `docs/future-features.md` - Backlog and feature roadmap
- `docs/security.md` - Security practices and threat model
- `docs/deployment.md` - Environment setup and deployment guide

**Project Structure**
- Migrated to `src/` directory structure for cleaner imports
- Created route groups: `(auth)` for login, `(dashboard)` for protected routes
- Built placeholder pages for all MVP routes (Dashboard, Ideas, Calendar, Compose, Settings)
- Created future placeholder pages (Feed, Learn, Analytics) with version badges
- Added global error, loading, and not-found pages
- Created Next.js middleware placeholder for auth

**Configuration & Utilities**
- `.env.example` - Complete environment variable template
- `src/config/pillars.ts` - Content pillars with colors and metadata
- `src/config/site.ts` - Site metadata and app settings
- `src/config/navigation.ts` - Navigation structure
- `src/lib/utils/cn.ts` - Tailwind class merge utility
- `src/lib/utils/api-response.ts` - Consistent API response helper
- `src/lib/utils/format-date.ts` - Date formatting utilities
- `src/lib/validations/idea.schema.ts` - Zod validation schemas for ideas
- `src/lib/validations/common.schema.ts` - Common validation schemas
- `src/types/*` - TypeScript type definitions (ideas, users, API)
- `src/constants/index.ts` - App-wide constants
- `vercel.json` - Cron job configuration for scheduled posts

**Dependencies**
- Added `@supabase/supabase-js` and `@supabase/ssr` for database/auth
- Added `@tanstack/react-query` for server state management
- Added `zustand` for client state management
- Added `zod` for runtime validation
- Added `clsx` and `tailwind-merge` for CSS utilities
- Added `date-fns` for date manipulation
- Added dev dependencies: `vitest`, `@playwright/test`, `supabase` CLI

**Design System**
- Implemented dark mode first theme with CSS custom properties
- Added pillar colors (Redesign: pink, Build: purple, Workflow: cyan, Insight: amber)
- Configured Geist font family
- Created scrollbar styling for dark mode

### Changed
- Moved `app/` to `src/app/` for cleaner imports
- Updated `tsconfig.json` paths: `@/*` now maps to `./src/*`
- Enhanced `CLAUDE.md` with comprehensive architecture patterns and code conventions
- Updated `package.json` with new scripts: `typecheck`, `test`, `db:types`, `db:migrate`, `db:reset`

---

## [0.0.1] - 2026-01-26

### Added
- Initial Next.js 16 project with App Router
- Tailwind CSS v4 configuration
- TypeScript strict mode enabled
- Basic project structure
- `.claude/SPEC.md` with complete feature specification
- `CLAUDE.md` with initial project guidance

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 0.0.2 | 2026-01-26 | Project hardening, documentation, src/ structure |
| 0.0.1 | 2026-01-26 | Initial project setup |

---

## Upcoming Versions

### 0.1.0 - MVP Foundation (In Progress)
- Supabase project setup and configuration
- Database schema with RLS policies
- Authentication flow
- Basic dashboard shell with real components

### 0.2.0 - Content Management
- Idea bank with full CRUD
- Post composer with character count
- Calendar view with scheduling

### 0.3.0 - X Integration
- X OAuth flow
- Post to X functionality
- Scheduled posting via Vercel Cron

### 0.4.0 - Learning & Feeds (V0.2 features)
- Curated news feed
- Learning log
- Feed-to-idea conversion

### 0.5.0 - Analytics (V0.3 features)
- Post performance tracking
- Follower tracking
- AI-assisted features

### 1.0.0 - Full System
- Growth plan embedded
- Weekly review flow
- Mobile quick capture (PWA)

---

## Versioning Guidelines

### Major Version (X.0.0)
- Breaking changes to database schema
- Breaking changes to API contracts
- Major feature milestones

### Minor Version (0.X.0)
- New features
- Non-breaking database changes
- New API endpoints

### Patch Version (0.0.X)
- Bug fixes
- Performance improvements
- Documentation updates
- Project structure changes

---

## Migration Notes

### 0.0.1 → 0.0.2
- No database changes (no database yet)
- Path alias changed from `@/*` → `./*` to `@/*` → `./src/*`
- All imports using `@/` now resolve to `src/` directory

### 0.0.2 → 0.1.0
_Pending - will document Supabase setup and database migrations_

---

_This changelog is updated with each release._
