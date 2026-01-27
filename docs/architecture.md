# Architecture

> LAUF OS System Architecture Documentation

**Status:** MVP Phase 1 - Command Center + Client CRM

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
| **Social** | Phase 5 | X posting, scheduling, analytics |
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
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── tasks/
│   │       │   ├── route.ts           # GET, POST
│   │       │   └── [id]/route.ts      # PATCH, DELETE
│   │       ├── activities/
│   │       │   ├── route.ts           # GET, POST
│   │       │   └── [id]/route.ts      # PATCH, DELETE
│   │       ├── clients/route.ts
│   │       ├── projects/route.ts
│   │       └── goals/
│   │           ├── route.ts           # GET, POST
│   │           └── [id]/route.ts      # PATCH
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── providers.tsx             # QueryClientProvider (React Query)
│   │   ├── modules/
│   │   │   ├── command/              # Command Center components
│   │   │   │   ├── TimeBlock.tsx
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── TaskForm.tsx       # Task create/edit + "from activity" mode
│   │   │   │   ├── ActivityCatalog.tsx # Activity picker grid
│   │   │   │   ├── ActivityForm.tsx    # Activity create/edit dialog
│   │   │   │   ├── DailyTimeline.tsx
│   │   │   │   └── GoalsPanel.tsx
│   │   │   └── clients/              # Client CRM components
│   │   │       ├── HealthScoreBadge.tsx
│   │   │       ├── ClientCard.tsx
│   │   │       └── ProjectKanban.tsx
│   │   └── layouts/
│   │       └── Sidebar.tsx
│   ├── lib/
│   │   ├── prisma/
│   │   │   └── client.ts             # Prisma client singleton
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts
│   │   ├── validations/
│   │   └── utils/
│   │       ├── cn.ts
│   │       └── encrypt.ts
│   ├── hooks/
│   │   ├── use-auth.ts               # Auth state management
│   │   ├── use-tasks.ts              # React Query hooks for tasks
│   │   ├── use-activities.ts         # React Query hooks for activities
│   │   └── use-goals.ts              # React Query hooks for goals
│   ├── stores/
│   ├── types/
│   └── config/
│       ├── navigation.ts
│       ├── categories.ts
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
- Activities catalog (`use-activities.ts`)
- Goals and check-ins (`use-goals.ts`)
- Clients and projects
- Feed items

Each hook follows the same pattern: `useX` for reads, `useCreateX` / `useUpdateX` / `useDeleteX` for mutations with automatic cache invalidation.

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
| `Activity` | Reusable catalog of activities (design, code, fitness, etc.) that pre-fill task creation |
| `Goal` | Daily/weekly/monthly goals with progress; auto-incremented by task completion |
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
│   ├── TaskForm.tsx        # Create/edit task + "from activity" quick-create
│   ├── ActivityCatalog.tsx # Activity picker grid for Day Builder
│   ├── ActivityForm.tsx    # Create/edit activity dialog
│   ├── DailyTimeline.tsx   # Hour-by-hour view
│   └── GoalsPanel.tsx      # Goals sidebar
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

---

_Last updated: January 2026_
