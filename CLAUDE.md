# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LAUF OS is a personal command center for "building in public" - a full-stack web app for managing content creation, learning, news curation, and growth tracking. Built specifically for a developer growing an audience on X (Twitter).

**Detailed documentation:**
- Specification: `.claude/SPEC.md`
- Architecture: `docs/architecture.md`
- MVP Checklist: `docs/mvp-checklist.md`
- Security: `docs/security.md`

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **State (Client)** | Zustand |
| **State (Server)** | React Query (TanStack Query) |
| **Database** | PostgreSQL via Supabase |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Deployment** | Vercel |
| **Validation** | Zod |
| **AI** | Claude API (primary), Gemini (long context) |

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run db:types     # Generate Supabase types
npm run db:migrate   # Push database migrations
```

## Architecture

### Source Directory Structure

All source code lives in `src/`:

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (unprotected)
│   ├── (dashboard)/        # Protected routes
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── features/           # Feature-specific components
│   └── layouts/            # Layout components
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── x-api/              # X API wrapper
│   ├── ai/                 # AI service clients
│   ├── validations/        # Zod schemas
│   └── utils/              # Utility functions
├── hooks/                  # React hooks
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
├── config/                 # App configuration
└── constants/              # App constants
```

### Path Alias

`@/*` maps to `./src/*`

Example: `import { cn } from '@/lib/utils/cn'`

## Code Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.tsx | `IdeaCard.tsx` |
| Utilities | kebab-case.ts | `format-date.ts` |
| Hooks | use-kebab-case.ts | `use-ideas.ts` |
| Types | kebab-case.types.ts | `idea.types.ts` |
| Validations | kebab-case.schema.ts | `idea.schema.ts` |
| Constants | SCREAMING_SNAKE_CASE | `PILLAR_COLORS` |

### Component Structure

```typescript
// 1. External imports
// 2. Internal imports (@ alias)
// 3. Types/interfaces
// 4. Component definition
// 5. Named export

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Idea } from '@/types/idea.types'

interface IdeaCardProps {
  idea: Idea
  onEdit?: (id: string) => void
}

export function IdeaCard({ idea, onEdit }: IdeaCardProps) {
  // Component logic
}
```

### API Response Format

All endpoints return consistent responses:

```typescript
type ApiResponse<T> = {
  data: T | null
  error: string | null
  message?: string
}
```

## The 4 Content Pillars

All content maps to one of these categories:

| Pillar | Color | Description |
|--------|-------|-------------|
| **Redesigns** | Pink `#f472b6` | Before/after visual transformations |
| **Builds** | Purple `#a78bfa` | Progress on side projects |
| **Workflows** | Cyan `#38bdf8` | Process posts, frameworks, how-tos |
| **Insights** | Amber `#fbbf24` | Learnings and observations |

Pillar configuration: `src/config/pillars.ts`

## Design System

### Colors (Dark Mode First)

```css
--background: #0a0a0a;
--surface: #141414;
--surface-elevated: #1a1a1a;
--border: #262626;
--text-primary: #fafafa;
--text-secondary: #a1a1a1;
--text-tertiary: #525252;
--accent: #3b82f6;
```

### Typography

- **Font**: Geist (sans), Geist Mono (mono)
- **CSS Variables**: `var(--font-geist-sans)`, `var(--font-geist-mono)`

## Key Patterns

### State Management

- **Server state** (React Query): Ideas, feed items, analytics
- **Client state** (Zustand): UI state, drafts, filters

### Validation

All API inputs validated with Zod schemas in `src/lib/validations/`

### Authentication

- Supabase Auth with RLS policies on all tables
- Middleware protects `(dashboard)` routes
- X OAuth tokens encrypted at rest

### Content Lifecycle

```
Idea → In Progress → Ready → Scheduled → Posted → Analyzed
```

## Common Tasks

### Adding a New Feature

1. Create route: `src/app/(dashboard)/{feature}/page.tsx`
2. Create components: `src/components/features/{feature}/`
3. Add Zod schema: `src/lib/validations/{feature}.schema.ts`
4. Add types: `src/types/{feature}.types.ts`
5. Create API routes: `src/app/api/{feature}/route.ts`
6. Add hook: `src/hooks/use-{feature}.ts`
7. Update navigation: `src/config/navigation.ts`

### Adding a Database Table

1. Create migration in `supabase/migrations/`
2. Run `npm run db:migrate`
3. Generate types: `npm run db:types`
4. Add RLS policies
5. Create corresponding types

## Security Notes

- Never commit `.env.local`
- Service role key only in server-side code
- RLS enabled on all tables
- X tokens encrypted with AES-256-GCM
- Cron endpoints authenticated with `CRON_SECRET`

## Current Phase

**MVP Phase 1: Foundation** - See `docs/mvp-checklist.md` for progress
