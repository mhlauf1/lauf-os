# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LAUF OS is a **Personal Operating System** - a comprehensive command center for life, work, and growth. Built for a developer/designer managing client work, personal projects, health, finances, and creative output.

**Core Philosophy:** Wake up, open LAUF OS, and know exactly what to do. Everything is prepped, automated in the background, and ready for execution.

**Detailed documentation:**
- Master Specification: `.claude/SPEC.md`
- Database Schema: `prisma/schema.prisma`

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **State (Client)** | Zustand |
| **State (Server)** | React Query (TanStack Query) |
| **Database** | PostgreSQL via Supabase |
| **ORM** | Prisma |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Deployment** | Vercel |
| **Validation** | Zod |
| **AI** | Claude API (primary), Gemini (long context) |

## Commands

```bash
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Production build (includes prisma generate)
npm run start            # Run production server
npm run lint             # ESLint
npm run typecheck        # TypeScript check
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio
```

## Architecture

### 9 Modules

| # | Module | Description | Phase |
|---|--------|-------------|-------|
| 1 | **Command Center** | Daily timeline, 90-min blocks, tasks, goals | Phase 1 |
| 2 | **Client CRM** | Clients, projects, health scores, opportunities | Phase 1 |
| 3 | **Creative Library** | Inspirations, templates, AI images, components | Phase 2 |
| 4 | **Health Tracker** | Workouts, nutrition, sobriety, check-ins | Phase 4 |
| 5 | **Financial Tracker** | Income, expenses, investments, goals | Phase 4 |
| 6 | **Intel Feed** | RSS aggregation, AI summaries, bookmarks | Phase 3 |
| 7 | **Social Manager** | Content queue, scheduling, X API, analytics | Phase 5 |
| 8 | **AI Hub** | Tool directory, cheat sheets, prompts | Phase 3 |
| 9 | **Relationships** | Contacts, follow-ups, network mapping | Phase 5 |

### Source Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (unprotected)
│   ├── (dashboard)/        # Protected routes
│   │   ├── command/        # Command Center (tasks, calendar, goals)
│   │   ├── clients/        # Client CRM
│   │   ├── projects/       # Project pipeline
│   │   └── settings/       # User settings
│   └── api/                # API routes
│       ├── tasks/          # GET, POST + [id] PATCH, DELETE
│       ├── activities/     # GET, POST + [id] PATCH, DELETE
│       ├── clients/        # GET, POST + [id] GET, PATCH, DELETE
│       ├── projects/       # GET, POST + [id] GET, PATCH, DELETE
│       └── goals/          # GET, POST + [id] PATCH
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── modules/            # Module-specific components
│   │   ├── command/        # TimeBlock, TaskCard, TaskForm, ActivityCatalog, ActivityForm, etc.
│   │   └── clients/        # ClientCard, HealthScoreBadge, etc.
│   ├── providers.tsx       # QueryClientProvider (React Query)
│   ├── layouts/            # Layout components
│   └── shared/             # Shared components
├── lib/
│   ├── prisma/             # Prisma client
│   ├── supabase/           # Supabase clients
│   ├── ai/                 # AI service clients
│   ├── validations/        # Zod schemas
│   └── utils/              # Utility functions
├── hooks/                  # React hooks (use-tasks, use-activities, use-goals, use-clients, use-projects, use-auth)
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
└── config/                 # App configuration
    ├── navigation.ts       # Sidebar navigation
    ├── categories.ts       # Task categories with colors
    └── site.ts             # Site metadata
```

### Path Alias

`@/*` maps to `./src/*`

Example: `import { cn } from '@/lib/utils'`

## Database Schema

Prisma schema located at `prisma/schema.prisma`. Key models:

### Core Models
- **User** - App user with preferences and timezone
- **Task** - 90-min blocks with category, priority, energy level; links to Activity + Goal
- **Activity** - Catalog of reusable activities (design, code, tweet, fitness, etc.) that pre-fill task creation
- **Goal** - Daily/weekly/monthly/yearly goals with progress; auto-incremented by task completion

### Client CRM Models
- **Client** - Client with health score, status, credentials
- **Project** - Kanban pipeline (Planning → Launched)
- **Opportunity** - Upsell/expansion opportunities
- **Asset** - Files linked to clients/projects

### Enums
- **TaskCategory**: DESIGN, CODE, CLIENT, LEARNING, FITNESS, ADMIN, SAAS, NETWORKING
- **TaskStatus**: TODO, IN_PROGRESS, BLOCKED, DONE
- **EnergyLevel**: DEEP_WORK, MODERATE, LIGHT
- **Priority**: LOW, MEDIUM, HIGH, URGENT
- **ClientStatus**: ACTIVE, PAUSED, COMPLETED, CHURNED
- **HealthScore**: GREEN, YELLOW, RED
- **ProjectStatus**: PLANNING, DESIGN, DEVELOPMENT, REVIEW, LAUNCHED

## Code Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.tsx | `TaskCard.tsx` |
| Utilities | kebab-case.ts | `format-date.ts` |
| Hooks | use-kebab-case.ts | `use-tasks.ts` |
| Types | kebab-case.types.ts | `task.types.ts` |
| Validations | kebab-case.schema.ts | `task.schema.ts` |

### Component Structure

```typescript
// 1. External imports
// 2. Internal imports (@ alias)
// 3. Types/interfaces
// 4. Component definition
// 5. Named export

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getCategoryConfig } from '@/config/categories'
import type { Task } from '@prisma/client'

interface TaskCardProps {
  task: Task
  onEdit?: (id: string) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  // Component logic
}
```

### API Response Format

All endpoints return consistent responses:

```typescript
type ApiResponse<T> = {
  data: T | null
  error: string | null
}
```

## Task Categories

| Category | Color | Icon | Description |
|----------|-------|------|-------------|
| **Design** | Purple `#8b5cf6` | Palette | Visual/UI work |
| **Code** | Blue `#3b82f6` | Code | Development tasks |
| **Client** | Green `#22c55e` | Users | Client communication |
| **Learning** | Orange `#f97316` | BookOpen | Courses, reading |
| **Fitness** | Red `#ef4444` | Dumbbell | Workouts, health |
| **Admin** | Gray `#6b7280` | FileText | Administrative |
| **SaaS** | Cyan `#06b6d4` | Rocket | Product building |
| **Networking** | Pink `#ec4899` | Network | Relationship building |

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

### Day Builder + Activity Catalog

The core concept: **Build your day from a curated catalog of activities.**

1. Set **monthly goals** ("Complete 3 projects", "Post 30 tweets", "Work out 20x")
2. Build an **Activity Catalog** of everything you do (design, code, tweet, fitness, etc.)
3. Each morning: **select activities** from the catalog to fill your day's 90-min blocks
4. **Execute blocks.** Completing them auto-increments linked goal progress.
5. Daily → weekly → monthly progress compounds.

### 90-Minute Blocks

Tasks are scheduled into 90-minute deep work blocks. Each task has:
- **Category** for color-coding
- **Priority** for urgency
- **Energy Level** to match to time of day
- **Scheduled Time** for calendar placement
- **Activity link** (optional) — pre-fills from activity defaults
- **Goal link** (optional) — auto-increments goal on completion

### Health Score System

Clients have a health score (GREEN/YELLOW/RED) based on:
- Payment status (40%)
- Communication frequency (30%)
- Project status (20%)
- Contract renewal (10%)

### State Management

- **Server state** (React Query): Tasks, activities, clients, projects, goals
  - Hooks: `use-tasks.ts`, `use-activities.ts`, `use-goals.ts`, `use-clients.ts`, `use-projects.ts`
  - Each hook exports `useX`, `useCreateX`, `useUpdateX`, `useDeleteX`
  - `use-clients.ts` and `use-projects.ts` also export `useClient(id)` and `useProject(id)` for single-record fetching
  - Mutations auto-invalidate related query caches
- **Client state** (Zustand): UI state, filters, drafts

### Authentication

- Supabase Auth with middleware protection
- `(dashboard)` routes are protected
- Client credentials encrypted at rest

## Common Tasks

### Adding a New Module

1. Create route: `src/app/(dashboard)/{module}/page.tsx`
2. Create components: `src/components/modules/{module}/`
3. Add Prisma model: `prisma/schema.prisma`
4. Create API routes: `src/app/api/{module}/route.ts`
5. Add to navigation: `src/config/navigation.ts`

### Adding a Database Table

1. Add model to `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Generate client: `npm run prisma:generate`

## Security Notes

- Never commit `.env.local` or `.env`
- Service role key only in server-side code
- Prisma handles database access
- Client credentials encrypted with AES-256-GCM

## Current Phase

**Phase 1: Foundation + Daily Driver** (Complete)
- [x] Prisma setup with full schema
- [x] Command Center routes and components
- [x] Client CRM routes and components
- [x] Navigation structure
- [x] Activity model + CRUD API (`/api/activities`)
- [x] Task individual API (`/api/tasks/[id]`) with PATCH + DELETE
- [x] Goal individual API (`/api/goals/[id]`) with PATCH
- [x] React Query hooks (use-tasks, use-activities, use-goals)
- [x] React Query provider wired into root layout
- [x] Activity Catalog component
- [x] Day Builder dashboard (timeline + goals + catalog)
- [x] Task completion auto-increments goal progress + activity usage
- [x] TaskForm "from activity" quick-create mode with goal linking
- [x] Tasks page wired with status/category filters, search, and create dialog
- [x] Goals page wired with type filters, real stats, completion toggle, goal creation
- [x] GoalsPanel dashboard toggle (click to mark goals complete/incomplete)
- [x] Calendar week view with date-range filtering, task rendering, week navigation
- [ ] Database migration (waiting for credentials)

**Phase 2: Client CRM Wire-Up** (Complete)
- [x] React Query hooks for clients (`use-clients.ts`) and projects (`use-projects.ts`)
- [x] Individual API routes: `/api/clients/[id]` (GET, PATCH, DELETE) and `/api/projects/[id]` (GET, PATCH, DELETE)
- [x] Clients list page with health stats, debounced search, status filter tabs
- [x] Client create page with full form and redirect on success
- [x] Client detail page with overview, contact info, linked projects, delete
- [x] Projects page with Kanban board rendering real data, status change via drag
- [x] Project detail page with overview, links, tasks list, delete

**Next Up:**
- [ ] Database migration (waiting for credentials)
- [ ] Creative Library (Phase 3)
- [ ] Intel Feed + AI Hub (Phase 3)
