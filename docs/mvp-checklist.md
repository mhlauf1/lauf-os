# MVP Checklist

> Phase-by-phase implementation tracker for LAUF OS MVP

---

## Overview

The MVP focuses on two core modules:

1. **Command Center** - Daily productivity with 90-minute blocks
2. **Client CRM** - Client management with health scores

---

## Phase 0: Infrastructure (Complete)

**Goal**: Set up Prisma, new route structure, and core components

### Prisma Setup
- [x] Install Prisma packages (`prisma`, `@prisma/client`, `@prisma/adapter-pg`)
- [x] Create `prisma/schema.prisma` with all 16+ models
- [x] Create `prisma.config.ts` for CLI configuration
- [x] Create Prisma client singleton (`src/lib/prisma/client.ts`)
- [x] Push schema to database (`npx prisma db push`)
- [x] Fix user creation trigger for new schema

### Route Structure
- [x] Create `/command/tasks` route
- [x] Create `/command/calendar` route
- [x] Create `/command/goals` route
- [x] Create `/clients` route
- [x] Create `/clients/[id]` route
- [x] Create `/clients/new` route
- [x] Create `/projects` route
- [x] Create `/projects/[id]` route
- [x] Update dashboard home to Command Center

### API Routes
- [x] Create `/api/tasks` route (GET, POST)
- [x] Create `/api/clients` route (GET, POST)
- [x] Create `/api/projects` route (GET, POST)
- [x] Create `/api/goals` route (GET, POST)

### Navigation
- [x] Update navigation config with new structure
- [x] Add "Coming Soon" items for future modules
- [x] Group navigation (Main, Work, Coming Soon)

### Core Components
- [x] Create `TimeBlock` component
- [x] Create `TaskCard` component
- [x] Create `TaskForm` component
- [x] Create `DailyTimeline` component
- [x] Create `GoalsPanel` component
- [x] Create `HealthScoreBadge` component
- [x] Create `ClientCard` component
- [x] Create `ProjectKanban` component

### Documentation
- [x] Update SPEC.md with ACTUAL-SPEC content
- [x] Update CLAUDE.md with new architecture
- [x] Update all docs/*.md files

### Cleanup
- [x] Remove old migrations
- [x] Remove old types (idea.types.ts, etc.)
- [x] Remove old routes (/ideas, /compose, /feed, /learn)
- [x] Drop old database tables (content_ideas, etc.)

---

## Phase 1: Command Center Core

**Goal**: Functional daily productivity system — Day Builder + Activity Catalog

### Day Builder + Activity Catalog
- [x] Create `Activity` model in Prisma schema
- [x] Add `activityId` and `goalId` to `Task` model
- [x] Add `tasks` relation to `Goal` model
- [x] Create Activity CRUD API (`/api/activities`, `/api/activities/[id]`)
- [x] Create Task individual API (`/api/tasks/[id]` — PATCH, DELETE)
- [x] Create Goal individual API (`/api/goals/[id]` — PATCH)
- [x] Create React Query hooks (`use-tasks`, `use-activities`, `use-goals`)
- [x] Wire QueryClientProvider into root layout
- [x] Build `ActivityCatalog` component (activity picker grid)
- [x] Build `ActivityForm` component (create/edit activity dialog)
- [x] Update `TaskForm` with "from activity" quick-create mode + goal linking
- [x] Build Day Builder dashboard (timeline + goals panel + catalog)
- [x] Auto-increment goal progress on task completion
- [x] Auto-update activity usage stats on task completion

### Task Management
- [x] Wire up TaskForm to create tasks via API
- [x] Display tasks in DailyTimeline by scheduled time
- [x] Implement task status transitions (TODO → IN_PROGRESS → DONE)
- [ ] Add task category filtering
- [ ] Implement drag-and-drop reordering
- [x] Add task completion (mark done, record completedAt)
- [x] Delete task from timeline (TimeBlock delete button)

### Time Blocking
- [x] Display 90-minute blocks on timeline
- [x] Allow scheduling tasks to specific time slots
- [x] Show energy level indicators
- [x] Support different block durations (45, 90, 120 min)

### Goals
- [x] Create monthly goals
- [x] Track goal progress (currentValue/targetValue)
- [x] Display goals in sidebar widget
- [x] Mark goals complete via UI
- [x] GoalsPanel supports all goal types (Daily/Weekly/Monthly)
- [x] GoalFormDialog type picker (Daily/Weekly/Monthly)

### Calendar View
- [x] Week view with days as columns
- [ ] Drag tasks to different days
- [x] Show task counts per day
- [x] Navigate between weeks

---

## Phase 2: Client CRM Core (Complete)

**Goal**: Functional client management system

### Client Management
- [x] Create new clients via form
- [ ] Edit client details (inline edit form)
- [x] Display client list with health score badges
- [x] Filter clients by status (Active, Paused, etc.)
- [x] Filter clients by health score
- [x] Delete client with confirmation dialog

### Project Pipeline
- [x] Create projects linked to clients
- [x] Kanban board with project statuses
- [x] Drag projects between columns
- [x] Project detail view
- [x] Delete project with confirmation dialog

### Health Scores
- [x] Manual health score updates
- [x] Visual indicators (GREEN/YELLOW/RED)
- [ ] Health score history (stretch)

### Client Details
- [x] Quick links (website, GitHub, Figma, Vercel)
- [ ] Encrypted credentials storage
- [x] Notes and metadata
- [ ] Follow-up reminders

---

## Phase 1.5: Critical Fixes + Modular Hardening (Complete)

**Goal**: Fix bugs, wire dead buttons, add error handling

### Bug Fixes
- [x] Fix GoalsPanel dashboard tabs (fetch all goals, not just monthly)
- [x] Fix timezone bug in task date filtering (use date range)
- [x] Fix useAuth infinite re-render (useMemo)
- [x] Fix form close timing (close on mutation success)

### Dead Button Cleanup
- [x] Wire TimeBlock delete button
- [x] Remove dead TimeBlock Reschedule item
- [x] Remove dead ClientCard buttons (Add Project, Log Contact)
- [x] Wire ProjectKanban edit to detail page navigation

### Error Handling
- [x] Sonner toast notifications in root layout
- [x] Toast success/error on all mutations across all pages
- [x] Delete confirmation dialogs (AlertDialog)
- [x] Reusable ConfirmDeleteDialog shared component

### Cache Invalidation
- [x] useDeleteTask invalidates goals + activities
- [x] useDeleteClient invalidates projects
- [x] useCreateProject invalidates clients
- [x] useDeleteProject invalidates clients + tasks

---

## Phase 3: Integration & Polish

**Goal**: Connect modules and add finishing touches

### Cross-Module Integration
- [x] Link tasks to projects
- [x] Show client tasks in client detail
- [x] Project tasks view

### UI Polish
- [x] Loading states for all data
- [x] Error handling and display
- [x] Empty states with CTAs
- [x] Toast notifications

### Data Validation
- [ ] Zod schemas for all forms
- [x] Server-side validation
- [ ] Client-side validation feedback

---

## MVP Complete Criteria

When complete, the app should:

- [x] Allow user login via Supabase Auth
- [x] Create and schedule tasks in 90-minute blocks
- [x] View daily timeline with tasks
- [x] Track monthly goals with auto-incrementing progress
- [x] Manage clients with health scores
- [x] Track projects in pipeline view
- [x] Navigate between all MVP routes
- [x] Be usable daily

---

## Progress Tracking

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| Phase 0: Infrastructure | Complete | 2026-01-26 | 2026-01-26 |
| Phase 1: Command Center | Complete | 2026-01-26 | 2026-01-26 |
| Phase 2: Client CRM | Complete | 2026-01-26 | 2026-01-26 |
| Phase 1.5: Hardening | Complete | 2026-01-27 | 2026-01-27 |
| Phase 3: Integration | In Progress | 2026-01-27 | - |

---

## Notes

- **2026-01-26**: Completed infrastructure pivot. Prisma schema with 16+ models, new route structure, core components built, user creation trigger fixed.
- **2026-01-26**: Implemented Day Builder + Activity Catalog. Activity model, full CRUD APIs for activities/tasks/goals, React Query hooks, Day Builder dashboard with timeline + goals + activity catalog. Task completion auto-increments goals and activity usage.
- **2026-01-26**: Wired up Command Center and Client CRM with real data. Tasks, goals, calendar, clients list, client detail, project Kanban, project detail all functional.
- **2026-01-27**: Critical fixes + modular hardening. Fixed GoalsPanel tabs, timezone bug, useAuth re-render, form close timing. Wired dead buttons, added toast notifications, delete confirmations, and cache invalidation fixes across all modules.
- Focus on functionality over polish in MVP
- Document any blockers or decisions made

---

## Next Steps

1. Run database migration (waiting for credentials)
2. Add drag-and-drop reordering for timeline blocks
3. Add task category filtering
4. Add inline edit flows for clients and projects
5. Start Creative Library (Phase 2)

---

_Last updated: 2026-01-27_
