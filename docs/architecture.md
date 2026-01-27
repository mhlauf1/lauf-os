# Architecture

> LAUF OS System Architecture Documentation

**Status:** Project structure complete, ready for Supabase integration

**Related Documentation:**
- [MVP Checklist](./mvp-checklist.md) - Implementation progress
- [Database Schema](./database-schema.md) - Full schema with RLS policies
- [API Reference](./api-reference.md) - Endpoint documentation
- [Security](./security.md) - Security practices

---

## Overview

LAUF OS is a personal command center for "building in public" - a full-stack web application for managing content creation, learning, news curation, and growth tracking. Built specifically for a developer growing an audience on X (Twitter).

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 (App Router) | Server-first React, Server Components |
| **Language** | TypeScript (strict mode) | Type safety, IDE support |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS, accessible components |
| **State (Client)** | Zustand | Lightweight global state |
| **State (Server)** | React Query (TanStack Query) | Async state, caching, mutations |
| **Database** | PostgreSQL via Supabase | RLS, real-time, managed |
| **Auth** | Supabase Auth | OAuth, sessions, RLS integration |
| **Storage** | Supabase Storage | Media uploads for posts |
| **Deployment** | Vercel | Edge functions, Cron jobs |
| **Validation** | Zod | Runtime validation, TypeScript inference |
| **AI (Primary)** | Claude API | Reasoning, content improvement |
| **AI (Secondary)** | Gemini | Long context summarization |

---

## Folder Structure

```
lauf-os/
├── src/                          # Source root (cleaner imports)
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth route group (unprotected)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── callback/
│   │   │       └── route.ts      # OAuth callback
│   │   ├── (dashboard)/          # Protected routes group
│   │   │   ├── layout.tsx        # Dashboard shell with nav
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── ideas/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx
│   │   │   ├── compose/
│   │   │   │   └── page.tsx
│   │   │   ├── feed/             # V0.2
│   │   │   │   └── page.tsx
│   │   │   ├── learn/            # V0.2
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/        # V0.3
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── x/
│   │   │   │   ├── auth/route.ts
│   │   │   │   ├── callback/route.ts
│   │   │   │   ├── post/route.ts
│   │   │   │   └── metrics/route.ts
│   │   │   ├── ideas/route.ts
│   │   │   ├── cron/
│   │   │   │   └── post-scheduled/route.ts
│   │   │   └── ai/
│   │   │       └── summarize/route.ts
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing → redirect to dashboard
│   │   ├── error.tsx             # Global error boundary
│   │   ├── loading.tsx           # Global loading state
│   │   └── not-found.tsx         # 404 page
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── features/             # Feature-specific components
│   │   │   ├── ideas/
│   │   │   ├── calendar/
│   │   │   ├── composer/
│   │   │   └── dashboard/
│   │   └── layouts/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── Shell.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   ├── admin.ts          # Admin client (service role)
│   │   │   └── middleware.ts     # Auth middleware helper
│   │   ├── x-api/
│   │   │   ├── client.ts         # X API wrapper
│   │   │   ├── auth.ts           # OAuth utilities
│   │   │   ├── post.ts           # Posting functions
│   │   │   └── types.ts          # X API types
│   │   ├── ai/
│   │   │   ├── claude.ts         # Claude API client
│   │   │   ├── prompts.ts        # Prompt templates
│   │   │   └── types.ts
│   │   ├── validations/          # Zod schemas
│   │   │   ├── idea.schema.ts
│   │   │   ├── user.schema.ts
│   │   │   └── common.schema.ts
│   │   └── utils/
│   │       ├── cn.ts             # clsx + tailwind-merge
│   │       ├── format-date.ts
│   │       ├── encrypt.ts        # Token encryption
│   │       └── api-response.ts   # Consistent API responses
│   ├── hooks/
│   │   ├── use-ideas.ts          # Ideas CRUD with React Query
│   │   ├── use-auth.ts           # Auth state hook
│   │   ├── use-toast.ts          # Toast notifications
│   │   └── use-media-upload.ts   # Media upload hook
│   ├── stores/                   # Zustand stores
│   │   ├── ui-store.ts           # UI state (sidebar, modals)
│   │   └── draft-store.ts        # Draft state (unsaved posts)
│   ├── types/
│   │   ├── database.types.ts     # Generated from Supabase
│   │   ├── idea.types.ts
│   │   ├── user.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts              # Re-exports
│   ├── config/
│   │   ├── site.ts               # Site metadata
│   │   ├── pillars.ts            # Content pillars config
│   │   └── navigation.ts         # Nav items
│   └── constants/
│       └── index.ts              # App-wide constants
├── docs/                         # Documentation
├── public/                       # Static assets
├── supabase/                     # Supabase local dev
│   ├── migrations/               # SQL migrations
│   └── seed.sql                  # Seed data
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local                    # gitignored
├── middleware.ts                 # Next.js middleware (auth)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Data Flow

### Server Components (Default)

```
Request → Route Handler/Server Component
       → Supabase Server Client (with cookies)
       → Database (RLS enforced)
       → Rendered HTML to Client
```

### Client Components (Interactive)

```
User Action → React Query Mutation
           → API Route Handler
           → Supabase Server Client
           → Database (RLS enforced)
           → Response → Query Cache Update → UI Update
```

### Authentication Flow

```
1. User clicks "Login with X"
2. Redirect to X OAuth
3. X redirects to /callback with code
4. Exchange code for tokens
5. Encrypt tokens, store in users table
6. Create Supabase session
7. Redirect to dashboard
```

### Post Scheduling Flow

```
1. User creates post, sets scheduled_for
2. Post saved with status: "scheduled"
3. Vercel Cron runs every minute
4. Cron job queries for due posts
5. For each due post:
   - Decrypt X tokens
   - POST to X API
   - Update status to "posted"
   - Store x_post_id
```

---

## State Management Strategy

### Server State (React Query)

Used for all data that lives on the server:

- Ideas list and CRUD
- Feed items
- Analytics data
- User profile

```typescript
// Example: use-ideas.ts
export function useIdeas(filters?: IdeaFilters) {
  return useQuery({
    queryKey: ['ideas', filters],
    queryFn: () => fetchIdeas(filters),
  })
}

export function useCreateIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    },
  })
}
```

### Client State (Zustand)

Used for UI-only state:

- Sidebar open/closed
- Modal visibility
- Draft content (before save)
- Filter selections

```typescript
// Example: ui-store.ts
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
```

---

## API Design

### Route Handler Pattern

All API routes follow this pattern:

```typescript
// src/app/api/ideas/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ideaSchema } from '@/lib/validations/idea.schema'
import { apiResponse } from '@/lib/utils/api-response'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Validate auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return apiResponse({ error: 'Unauthorized' }, 401)
    }

    // Validate input
    const body = await req.json()
    const parsed = ideaSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ error: parsed.error.message }, 400)
    }

    // Execute operation
    const { data, error } = await supabase
      .from('content_ideas')
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single()

    if (error) {
      return apiResponse({ error: error.message }, 500)
    }

    return apiResponse({ data })
  } catch (error) {
    return apiResponse({ error: 'Internal server error' }, 500)
  }
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

---

## Database Design

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | User profiles, X tokens (encrypted) |
| `content_ideas` | The core content idea bank |
| `post_metrics` | X post performance data |
| `feed_sources` | RSS feeds and X accounts to follow |
| `feed_items` | Ingested feed content |
| `learning_logs` | Learning session records |
| `follower_snapshots` | Historical follower counts |

### Row Level Security

All tables have RLS policies ensuring users can only access their own data:

```sql
CREATE POLICY "Users can view own ideas"
  ON content_ideas FOR SELECT
  USING (auth.uid() = user_id);
```

### Soft Deletes

Tables use `deleted_at` column for soft deletes:

```sql
-- All queries filter out deleted records
SELECT * FROM content_ideas WHERE deleted_at IS NULL;
```

---

## Component Architecture

### Component Organization

```
components/
├── ui/                    # Primitives (shadcn/ui)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Dialog.tsx
│   └── ...
├── features/              # Feature components
│   ├── ideas/
│   │   ├── IdeaCard.tsx
│   │   ├── IdeaList.tsx
│   │   ├── IdeaForm.tsx
│   │   └── IdeaFilters.tsx
│   └── ...
└── layouts/               # Layout components
    ├── Sidebar.tsx
    ├── Header.tsx
    └── Shell.tsx
```

### Component Pattern

```typescript
// Standard component structure
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Idea } from '@/types/idea.types'

interface IdeaCardProps {
  idea: Idea
  onEdit?: (id: string) => void
}

export function IdeaCard({ idea, onEdit }: IdeaCardProps) {
  // Component logic
  return (
    // JSX
  )
}
```

---

## The 4 Content Pillars

Every piece of content maps to one of these categories:

| Pillar | Description | Color |
|--------|-------------|-------|
| **Redesigns** | Before/after visual transformations | Pink `#f472b6` |
| **Builds** | Progress on side projects | Purple `#a78bfa` |
| **Workflows** | Process posts, frameworks, how-tos | Cyan `#38bdf8` |
| **Insights** | Learnings and observations | Amber `#fbbf24` |

---

## Content Lifecycle

```
Idea → Draft → Ready → Scheduled → Posted → Analyzed
```

Each status represents a stage in content creation:

1. **Idea**: Initial capture, may be rough
2. **In Progress**: Being developed
3. **Ready**: Written, reviewed, ready to schedule
4. **Scheduled**: Has a scheduled_for datetime
5. **Posted**: Published to X
6. **Analyzed**: Metrics collected (future)

---

## Design System

### Colors (Dark Mode)

```css
--background: #0a0a0a;      /* Near black */
--surface: #141414;          /* Cards, panels */
--surface-elevated: #1a1a1a; /* Modals, dropdowns */
--border: #262626;           /* Subtle dividers */
--text-primary: #fafafa;     /* White-ish */
--text-secondary: #a1a1a1;   /* Muted */
--text-tertiary: #525252;    /* Very muted */

--accent: #3b82f6;           /* Blue, primary actions */
--success: #22c55e;          /* Green, posted/complete */
--warning: #eab308;          /* Yellow, scheduled */
--error: #ef4444;            /* Red, issues */
```

### Typography

- **Font**: Geist (primary), system fallbacks
- **Scale**: 12px → 30px (xs to 3xl)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

- **Base unit**: 4px
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

---

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Source directory** | `src/` | Cleaner imports, clear separation |
| **State management** | React Query + Zustand | Server vs client state separation |
| **API layer** | Route Handlers | Next.js native, server-side |
| **Validation** | Zod | Runtime safety, TypeScript inference |
| **Database client** | Supabase JS v2 | Native RLS, real-time, auth integration |
| **Styling** | Tailwind + CSS Variables | Design tokens, utility-first |
| **Testing** | Vitest + Playwright | Fast unit tests, reliable E2E |
| **Auth** | Supabase + X OAuth | Unified auth, secure token storage |

---

## Performance Considerations

1. **Server Components by default**: Only use client components when interactivity is needed
2. **React Query caching**: Reduces redundant API calls
3. **Optimistic updates**: UI updates immediately, rolls back on error
4. **Database indexes**: On foreign keys and frequently queried columns
5. **Soft deletes**: Preserves data, enables recovery
6. **Connection pooling**: Supabase handles this automatically

---

## Error Handling

### API Errors

All API routes use consistent error responses:

```typescript
return apiResponse({ error: 'Descriptive error message' }, statusCode)
```

### Client Errors

React Query provides error states:

```typescript
const { data, error, isError } = useQuery(...)
if (isError) {
  return <ErrorDisplay error={error} />
}
```

### Global Error Boundary

`src/app/error.tsx` catches unhandled errors:

```typescript
'use client'

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

---

_Last updated: January 2026_
