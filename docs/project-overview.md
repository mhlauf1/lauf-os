# LAUF OS - Project Overview

## What Is It?

LAUF OS is a **Personal Operating System** - a comprehensive command center for managing life, work, and growth. Built with Next.js 16, it provides a daily driver interface where you wake up, open the app, and know exactly what to do.

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Client State | Zustand |
| Server State | React Query (TanStack Query) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | Supabase Auth |
| Deployment | Vercel |
| Validation | Zod |

### Frontend Architecture

- **App Router** with `(auth)` and `(dashboard)` route groups
- `(dashboard)` routes protected by Supabase middleware
- **React Query** manages all server state with auto-invalidation on mutations
- **Zustand** handles UI-only state (filters, drafts, modals)
- **shadcn/ui** provides base components (Card, Dialog, Button, Badge, etc.)
- Dark mode first design with CSS custom properties

### Data Flow

```
Client Component
  -> React Query Hook (useQuery / useMutation)
    -> fetch('/api/{resource}')
      -> Next.js API Route
        -> Supabase Auth (verify user)
          -> Prisma ORM
            -> PostgreSQL
```

All API routes return `{ data: T | null, error: string | null }`.

### Database Schema (Prisma)

**Core Models:**
- `User` - Supabase auth integration, timezone, preferences
- `Task` - 90-min blocks, category/priority/energy, links to Activity + Goal
- `Activity` - Reusable task templates, tracks usage stats
- `Goal` - Daily/Weekly/Monthly/Yearly with targetValue/currentValue progress

**Client CRM Models:**
- `Client` - Health score (GREEN/YELLOW/RED), status, financial tracking
- `Project` - Kanban pipeline (Planning -> Launched), linked to Client
- `Opportunity` - Upsell/expansion opportunities

### State Management Hooks

| Hook | Exports |
|------|---------|
| `use-tasks.ts` | `useTasks`, `useCreateTask`, `useUpdateTask`, `useDeleteTask` |
| `use-activities.ts` | `useActivities`, `useCreateActivity`, `useUpdateActivity`, `useDeleteActivity` |
| `use-goals.ts` | `useGoals`, `useCreateGoal`, `useUpdateGoal` |
| `use-clients.ts` | `useClients`, `useClient`, `useCreateClient`, `useUpdateClient`, `useDeleteClient` |
| `use-projects.ts` | `useProjects`, `useProject`, `useCreateProject`, `useUpdateProject`, `useDeleteProject` |

All mutations auto-invalidate related query caches.

### Security

- Row-level authorization: every API route verifies `userId` matches authenticated user
- Client credentials encrypted with AES-256-GCM
- Supabase service role key only in server-side code
- `.env` files excluded from version control

## 9 Modules

| # | Module | Phase | Status |
|---|--------|-------|--------|
| 1 | Command Center | 1 | Complete (UI wired to API) |
| 2 | Client CRM | 1 | Complete (UI wired to API) |
| 3 | Creative Library | 2 | Planned |
| 4 | Health Tracker | 4 | Planned |
| 5 | Financial Tracker | 4 | Planned |
| 6 | Intel Feed | 3 | Planned |
| 7 | Social Manager | 5 | Planned |
| 8 | AI Hub | 3 | Planned |
| 9 | Relationships | 5 | Planned |

## Core Concept: Day Builder

1. Set **monthly goals** ("Complete 3 projects", "Post 30 tweets")
2. Build an **Activity Catalog** of everything you do
3. Each morning: **select activities** to fill 90-min blocks
4. **Execute blocks** - completion auto-increments linked goal progress
5. Daily progress compounds into weekly/monthly/yearly achievement

### Task Completion Side Effects

When a task is marked DONE:
1. `task.completedAt` is set
2. If linked to a Goal: `goal.currentValue` increments by 1
3. If linked to an Activity: `activity.timesUsed` increments, `lastUsed` updates

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Unprotected auth routes
│   ├── (dashboard)/        # Protected routes
│   │   ├── command/        # Command Center (tasks, calendar, goals)
│   │   ├── clients/        # Client CRM
│   │   ├── projects/       # Project pipeline
│   │   └── settings/       # User settings
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── modules/            # Module-specific components
│   ├── layouts/            # Shell, Sidebar, Header
│   └── providers.tsx       # React Query provider
├── hooks/                  # React Query hooks
├── stores/                 # Zustand stores
├── lib/                    # Prisma, Supabase, utilities
├── types/                  # TypeScript types
└── config/                 # Navigation, categories, site config
```

## API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/tasks` | GET, POST | List/create tasks (filters: date, dateFrom/dateTo, status, category) |
| `/api/tasks/[id]` | PATCH, DELETE | Update/delete task (auto-increments goal+activity on completion) |
| `/api/activities` | GET, POST | List/create activities |
| `/api/activities/[id]` | PATCH, DELETE | Update/delete activity |
| `/api/goals` | GET, POST | List/create goals (filters: type, completed) |
| `/api/goals/[id]` | PATCH | Update goal |
| `/api/clients` | GET, POST | List/create clients (filters: status, healthScore, search) |
| `/api/clients/[id]` | GET, PATCH, DELETE | Get/update/delete client |
| `/api/projects` | GET, POST | List/create projects (filters: status, clientId) |
| `/api/projects/[id]` | GET, PATCH, DELETE | Get/update/delete project |

## What's Wired Up

### Command Center (Phase 1)
- **Day Builder dashboard**: Timeline + GoalsPanel (with toggle) + Activity Catalog
- **Tasks page**: Status tabs (All/TODO/IN_PROGRESS/BLOCKED/DONE), category filter dropdown, search, create dialog
- **Goals page**: Type filters (All/Daily/Weekly/Monthly/Yearly), real stats (completed count, rate), completion toggle, create dialog for all types
- **Calendar week view**: 7-day grid with tasks in time slots, week navigation (prev/next/today), "+" button to create tasks at specific day/time
- **Task API**: `dateFrom`/`dateTo` query params for date-range filtering

### Client CRM (Phase 2)
- **Clients list**: Health stats cards (GREEN/YELLOW/RED counts), debounced search, status filter tabs (All/Active/Paused/Completed)
- **Client create**: Full form (name, company, email, phone, industry, URLs, financials, notes)
- **Client detail**: Overview with HealthScoreBadge + status badge, contact card, linked projects list, delete
- **Projects page**: Kanban board with real data, status change via `useUpdateProject`
- **Project detail**: Overview with status/priority badges, links (repo, staging, production), tasks list, delete
- **API routes**: `/api/clients/[id]` and `/api/projects/[id]` with GET/PATCH/DELETE + Zod validation + ownership checks

## Design System

- **Background**: `#0a0a0a` (dark)
- **Surface**: `#141414`, **Elevated**: `#1a1a1a`
- **Accent**: `#3b82f6` (blue)
- **Font**: Geist (sans + mono)
- 8 task categories with distinct color palettes
- Health scores: GREEN (healthy), YELLOW (attention), RED (at risk)
