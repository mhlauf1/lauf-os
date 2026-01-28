# Architecture

> LAUF OS System Architecture Documentation

**Status:** MVP Phase 1 Complete + Phase 1.5 Hardening Complete + Phase 2 Creative Library + Day Builder UX Overhaul Complete + Tweet Drafts Module Complete + Activity Presets Complete + Goal Progress & Cascades Complete

**Related Documentation:**
- [MVP Checklist](./mvp-checklist.md) - Implementation progress
- [Database Schema](./database-schema.md) - Prisma schema documentation
- [API Reference](./api-reference.md) - Endpoint documentation
- [Security](./security.md) - Security practices

---

## Overview

LAUF OS is a **Personal Operating System** - a unified dashboard for managing all aspects of life and work. Built for a solo developer/entrepreneur managing client work, personal productivity, health, finances, and social presence.

### The 9 Modules

| Module | Phase | Description |
|--------|-------|-------------|
| **Command Center** | MVP | Daily timeline, 90-min blocks, goals |
| **Client CRM** | MVP | Client management, projects, health scores |
| **Library** | Phase 2 | Design inspiration, AI images, components |
| **Health** | Phase 4 | Workouts, check-ins, sobriety tracking |
| **Finances** | Phase 4 | Income/expenses, MRR tracking |
| **Intel Feed** | Phase 3 | RSS feeds, saved articles |
| **Social** | Phase 5 | Tweet drafts (done), X posting, scheduling, analytics |
| **AI Hub** | Phase 3 | AI tool subscriptions, cheat sheets |
| **Relationships** | Phase 5 | Contact management, follow-ups |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 (App Router) | Server-first React, Server Components |
| **Language** | TypeScript (strict mode) | Type safety, IDE support |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS, accessible components |
| **State (Client)** | Zustand | Lightweight global state |
| **State (Server)** | React Query (TanStack Query) | Async state, caching, mutations |
| **ORM** | Prisma 7 | Type-safe database queries, migrations |
| **Database** | PostgreSQL via Supabase | Managed PostgreSQL |
| **Auth** | Supabase Auth | OAuth, sessions, magic links |
| **Storage** | Supabase Storage | Media uploads, client assets |
| **Deployment** | Vercel | Edge functions, Cron jobs |
| **Validation** | Zod | Runtime validation, TypeScript inference |
| **Drag & Drop** | @dnd-kit/core | Drag activities onto timeline slots |
| **AI (Primary)** | Claude API | Reasoning, content improvement |

---

## Folder Structure

```
lauf-os/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Command Center home
│   │   │   ├── command/
│   │   │   │   ├── tasks/page.tsx
│   │   │   │   ├── calendar/page.tsx
│   │   │   │   └── goals/page.tsx
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── library/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── social/
│   │   │   │   ├── page.tsx              # Tweet drafts list
│   │   │   │   └── [id]/page.tsx         # Tweet draft detail
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── tasks/
│   │       │   ├── route.ts           # GET, POST
│   │       │   └── [id]/route.ts      # PATCH, DELETE
│   │       ├── activities/
│   │       │   ├── route.ts           # GET (auto-syncs presets), POST (403)
│   │       │   └── [id]/route.ts      # PATCH (usage stats only), DELETE (403)
│   │       ├── clients/
│   │       │   ├── route.ts           # GET, POST
│   │       │   └── [id]/route.ts      # GET, PATCH, DELETE
│   │       ├── projects/
│   │       │   ├── route.ts           # GET, POST
│   │       │   └── [id]/route.ts      # GET, PATCH, DELETE
│   │       ├── goals/
│   │       │   ├── route.ts           # GET (incl. breakdown), POST
│   │       │   └── [id]/route.ts      # PATCH (incl. incrementValue), DELETE
│   │       ├── library/
│   │       │   ├── route.ts           # GET, POST
│   │       │   └── [id]/route.ts      # GET, PATCH, DELETE
│   │       └── tweets/
│   │           ├── route.ts           # GET, POST
│   │           └── [id]/route.ts      # GET, PATCH, DELETE
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── providers.tsx             # QueryClientProvider (React Query)
│   │   ├── modules/
│   │   │   ├── command/              # Command Center components
│   │   │   │   ├── TimeBlock.tsx
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── TaskForm.tsx       # Task create/edit + catalog picker + "from activity" mode
│   │   │   │   ├── TaskBacklog.tsx     # Draggable unscheduled task cards
│   │   │   │   ├── ActivityCatalog.tsx # Read-only activity preset grid (draggable cards)
│   │   │   │   ├── CommandSidebar.tsx  # Tabbed sidebar (Goals / Activities)
│   │   │   │   ├── DailyTimeline.tsx   # Timeline with droppable empty slots
│   │   │   │   ├── GoalCard.tsx        # Goal card with progress, increment, edit/delete
│   │   │   │   ├── GoalProgressBar.tsx # Progress bar with expected-by-now marker
│   │   │   │   ├── GoalFormDialog.tsx  # Goal create dialog with startDate/dueDate
│   │   │   │   └── GoalsPanel.tsx      # Goals panel + GoalsPanelContent export
│   │   │   ├── library/              # Creative Library components
│   │   │   │   ├── LibraryItemCard.tsx
│   │   │   │   ├── LibraryGrid.tsx
│   │   │   │   ├── LibraryItemForm.tsx
│   │   │   │   └── TagInput.tsx
│   │   │   ├── social/               # Social Manager components
│   │   │   │   ├── TweetDraftCard.tsx
│   │   │   │   ├── TweetDraftForm.tsx
│   │   │   │   └── TweetGrid.tsx
│   │   │   └── clients/              # Client CRM components
│   │   │       ├── HealthScoreBadge.tsx
│   │   │       ├── ClientCard.tsx
│   │   │       └── ProjectKanban.tsx
│   │   ├── shared/                   # Shared components
│   │   │   └── ConfirmDeleteDialog.tsx # Reusable delete confirmation
│   │   └── layouts/
│   │       └── Sidebar.tsx
│   ├── lib/
│   │   ├── prisma/
│   │   │   └── client.ts             # Prisma client singleton
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts
│   │   ├── validations/              # Zod schemas (goal.schema.ts, library.schema.ts, etc.)
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── encrypt.ts
│   │       └── goal-cascades.ts      # Pace tracking: computeBreakdown()
│   ├── hooks/
│   │   ├── use-auth.ts               # Auth state management (useMemo for stable client)
│   │   ├── use-tasks.ts              # React Query hooks for tasks
│   │   ├── use-activities.ts         # React Query hooks for activities
│   │   ├── use-goals.ts              # React Query hooks for goals
│   │   ├── use-clients.ts            # React Query hooks for clients
│   │   ├── use-projects.ts           # React Query hooks for projects
│   │   └── use-library.ts            # React Query hooks for library items
│   ├── stores/
│   ├── types/
│   └── config/
│       ├── navigation.ts
│       ├── categories.ts
│       ├── activity-presets.ts       # 19 fixed activity presets (source of truth)
│       ├── library.ts                # Library type config (colors, icons, labels)
│       └── site.ts
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/
├── docs/
├── supabase/
│   └── migrations/
└── scripts/
    └── run-migration.mjs
```

---

## Data Flow

### Server Components (Default)

```
Request → Route Handler/Server Component
       → Prisma Client
       → Database (PostgreSQL)
       → Rendered HTML to Client
```

### Client Components (Interactive)

```
User Action → React Query Mutation
           → API Route Handler
           → Prisma Client
           → Database
           → Response → Query Cache Update → UI Update
```

### Authentication Flow

```
1. User enters email/password or requests magic link
2. Supabase Auth handles authentication
3. Session stored in HTTP-only cookies
4. Trigger creates user record in public.users
5. Middleware validates session on protected routes
6. Redirect to Command Center
```

---

## State Management Strategy

### Server State (React Query)

Used for all data that lives on the server:

- Tasks and time blocks (`use-tasks.ts`)
- Activity presets (`use-activities.ts` — read-only)
- Goals and check-ins (`use-goals.ts` — includes `useIncrementGoal`, `useDeleteGoal`)
- Clients (`use-clients.ts`)
- Projects (`use-projects.ts`)
- Library items (`use-library.ts`)
- Tweet drafts (`use-tweet-drafts.ts`)
- Feed items (planned)

Each hook follows the same pattern: `useX` for reads, `useCreateX` / `useUpdateX` / `useDeleteX` for mutations with automatic cache invalidation. Exception: `use-activities.ts` is read-only (`useActivities` only) since activities are fixed presets.

```typescript
// Example: use-tasks.ts
export function useTasks(filter?: TasksFilter) {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => fetchTasks(filter),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })     // goal progress
      queryClient.invalidateQueries({ queryKey: ['activities'] }) // usage stats
    },
  })
}
```

### Client State (Zustand)

Used for UI-only state:

- Sidebar open/closed
- Modal visibility
- Filter selections
- Draft content

---

## Database Design

### ORM: Prisma 7

Prisma provides type-safe database access with:
- Schema as source of truth
- Auto-generated TypeScript types
- Migration management
- Connection pooling via pg adapter

### Key Models (MVP)

| Model | Purpose |
|-------|---------|
| `User` | User profile, preferences, timezone |
| `Task` | 90-minute time blocks with categories; links to Activity + Goal |
| `Activity` | 19 fixed activity presets (auto-synced from config) that pre-fill task creation |
| `Goal` | Daily/weekly/monthly/yearly goals with progress, startDate, pace tracking; auto-incremented by task completion and library item creation |
| `Client` | Client info, health scores, credentials |
| `Project` | Project pipeline with statuses |
| `Asset` | Files, screenshots, documents |
| `Opportunity` | Upsell opportunities (AI-generated) |

### Task Categories

| Category | Color | Description |
|----------|-------|-------------|
| DESIGN | Pink | UI/UX design work |
| CODE | Purple | Development tasks |
| CLIENT | Blue | Client communication |
| LEARNING | Cyan | Learning/research |
| FITNESS | Green | Workouts, health |
| ADMIN | Gray | Admin/paperwork |
| SAAS | Orange | SaaS product work |
| NETWORKING | Amber | Networking, outreach |

### Client Health Scores

| Score | Color | Meaning |
|-------|-------|---------|
| GREEN | Green | Happy, engaged |
| YELLOW | Yellow | Needs attention |
| RED | Red | At risk of churn |

---

## API Design

### Route Handler Pattern

All API routes follow this pattern:

```typescript
// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { scheduledDate: 'asc' },
  })

  return NextResponse.json({ data: tasks })
}
```

### API Response Format

```typescript
type ApiResponse<T> = {
  data: T | null
  error: string | null
  message?: string
}
```

---

## Component Architecture

### Module Components

```
components/modules/
├── command/                # Command Center
│   ├── TimeBlock.tsx       # 90-min block card
│   ├── TaskCard.tsx        # Task in queue
│   ├── TaskForm.tsx        # Create/edit task + catalog picker + description-first UX for presets
│   ├── ActivityCatalog.tsx # Read-only activity preset grid for Day Builder (draggable)
│   ├── DailyTimeline.tsx   # Hour-by-hour view with droppable slots
│   ├── DayColumn.tsx       # Calendar week view day column
│   ├── GoalCard.tsx        # Goal card with progress, increment/decrement, edit/delete
│   ├── GoalProgressBar.tsx # Progress bar with expected-by-now marker
│   ├── GoalFormDialog.tsx  # Create goal with startDate/dueDate
│   └── GoalsPanel.tsx      # Goals sidebar (unified view, no type tabs)
└── clients/                # Client CRM
    ├── HealthScoreBadge.tsx
    ├── ClientCard.tsx
    └── ProjectKanban.tsx
```

### Component Pattern

```typescript
import { cn } from '@/lib/utils'
import type { Task } from '@prisma/client'

interface TaskCardProps {
  task: Task
  onEdit?: (id: string) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  return (
    // JSX
  )
}
```

---

## Design System

### Colors (Dark Mode)

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

### Health Score Colors

```css
--health-green: #22c55e;
--health-yellow: #eab308;
--health-red: #ef4444;
```

### Typography

- **Font**: Geist (primary), Geist Mono (code)
- **Scale**: 12px → 30px (xs to 3xl)

---

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **ORM** | Prisma 7 | Type-safe queries, schema as source of truth |
| **Auth** | Supabase Auth | OAuth, magic links, session management |
| **Database** | Supabase PostgreSQL | Managed, same as auth provider |
| **State** | React Query + Zustand | Server vs client state separation |
| **Styling** | Tailwind + CSS Variables | Design tokens, utility-first |
| **Time blocks** | 90 minutes | Optimal deep work duration |
| **Drag & Drop** | @dnd-kit/core | DnD from activity catalog to timeline |
| **Calendar dates** | parseCalendarDate() | Strip UTC from Prisma @db.Date to avoid timezone off-by-one |
| **Activity presets** | Config + lazy DB sync | 19 fixed presets defined in config, auto-synced to DB on GET |
| **Goal cascades** | computeBreakdown() utility | Pace tracking based on startDate/dueDate with type fallbacks |
| **Atomic goal increments** | incrementValue in PATCH | Safe concurrent progress updates, auto-complete/reopen |
| **Library-goal linking** | goalId on LibraryItem | Library items auto-increment/decrement linked goal progress |
| **Goal perspective views** | Month/Week/Day | Goals page groups by primary/secondary based on perspective |

---

_Last updated: January 2026 (v0.8.0 — Goal Progress & Cascades)_
