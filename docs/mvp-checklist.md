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
- [x] ~~Build `ActivityForm` component~~ (removed — activities are now fixed presets)
- [x] Update `TaskForm` with "from activity" quick-create mode + goal linking
- [x] Build Day Builder dashboard (timeline + goals panel + catalog)
- [x] Auto-increment goal progress on task completion
- [x] Auto-update activity usage stats on task completion

### Task Management
- [x] Wire up TaskForm to create tasks via API
- [x] Display tasks in DailyTimeline by scheduled time
- [x] Implement task status transitions (TODO → IN_PROGRESS → DONE)
- [ ] Add task category filtering
- [x] Implement drag-and-drop from Activity Catalog to timeline slots (`@dnd-kit/core`)
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

### Day Builder UX Overhaul
- [x] CommandSidebar: tabbed sidebar with Goals + Activities tabs
- [x] Draggable activities from sidebar catalog (`useDraggable`)
- [x] Droppable empty timeline slots (`useDroppable`) with visual feedback
- [x] DndContext + DragOverlay on dashboard page
- [x] Auto-create task on activity drop
- [x] TaskForm "From Catalog" / "Manual" two-tab mode
- [x] GoalsPanelContent + ActivityCatalogContent extracted for reuse
- [x] Timezone fix: `parseCalendarDate()` for Prisma `@db.Date` fields

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

## Phase 2.5: Creative Library (Complete)

**Goal**: Full library module for inspirations, templates, AI images, components, and ideas

### Library Module
- [x] Zod validation schemas (`library.schema.ts`)
- [x] API routes: `/api/library` (GET, POST) + `/api/library/[id]` (GET, PATCH, DELETE)
- [x] React Query hooks (`use-library.ts`): useLibrary, useLibraryItem, CRUD mutations
- [x] Library type config (`src/config/library.ts`): colors, icons, labels per type
- [x] Components: LibraryItemCard, LibraryGrid, LibraryItemForm, TagInput
- [x] Library list page with stats, debounced search, type filter tabs, grid display
- [x] Library detail page with type-specific fields, external links, edit/delete
- [x] Navigation: Library moved from Coming Soon to "Creative" nav group
- [x] `ensureUser` helper for API routes

---

## Phase 3: Tweet Drafts Module (Social Manager Early Start) (Complete)

**Goal**: Tweet draft management as the first piece of the Social Manager module

### Prisma Schema
- [x] `TweetDraft` model with content, status, tags, thread support
- [x] `TweetDraftStatus` enum (DRAFT, READY, POSTED, ARCHIVED)
- [x] User relation (`tweetDrafts` on User model)

### API Routes
- [x] `/api/tweets` (GET with status/search/tag filters, POST with Zod validation)
- [x] `/api/tweets/[id]` (GET, PATCH, DELETE with ownership checks)

### React Query Hooks
- [x] `use-tweet-drafts.ts`: useTweetDrafts, useTweetDraft, useCreateTweetDraft, useUpdateTweetDraft, useDeleteTweetDraft

### Components
- [x] `TweetDraftCard` — card with status badge, content preview, char count, tags, dropdown actions
- [x] `TweetDraftForm` — create/edit with character counter (280 limit), status toggle, TagInput
- [x] `TweetGrid` — responsive 1-2-3 column grid

### Pages
- [x] `/social` — list page with stats cards, debounced search, status filter tabs
- [x] `/social/[id]` — detail page with status actions, edit dialog, delete

### Command Center Enhancements
- [x] `TaskBacklog` — draggable unscheduled task cards for Day Builder
- [x] Calendar page redesign — continuous timeline (6 AM–11 PM) with proportional positioning
- [x] New shadcn/ui components: Command (cmdk), Popover, Select

### Navigation
- [x] Social section added to sidebar navigation

---

## Phase 3.5: Activity Presets + UX Refinements (Complete)

**Goal**: Replace user-created Activity Catalog with 19 fixed presets, streamline UX

### Activity Presets
- [x] Define 19 presets in `src/config/activity-presets.ts` (source of truth)
- [x] Auto-sync presets on `GET /api/activities` (create missing, deactivate custom, reactivate matching)
- [x] Lock `POST /api/activities` (403 — system-managed)
- [x] Restrict `PATCH /api/activities/[id]` to `timesUsed`/`lastUsed` only
- [x] Lock `DELETE /api/activities/[id]` (403 — system-managed)
- [x] Remove mutation hooks from `use-activities.ts` (read-only `useActivities` only)
- [x] Remove create/edit/delete UI from `ActivityCatalog` component
- [x] Simplify `CommandSidebar` props (remove activity CRUD callbacks)
- [x] Delete `ActivityForm.tsx` component
- [x] Remove `ActivityForm` export from index.ts

### TaskForm Description-First UX
- [x] Activity-based tasks show description textarea ("What will you do in this block?")
- [x] Hide title input for activity tasks (shown in dialog header as preset title)
- [x] Hide category picker for activity tasks (auto-set from preset)
- [x] Keep duration selector (editable, pre-filled with preset default)

### TimeBlock Category Colors
- [x] TimeBlock component shows category-colored left border (matches calendar view)

---

## Phase 4: Integration & Polish

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
| Phase 2.5: Creative Library | Complete | 2026-01-27 | 2026-01-27 |
| Day Builder UX Overhaul | Complete | 2026-01-27 | 2026-01-27 |
| Phase 3: Tweet Drafts | Complete | 2026-01-27 | 2026-01-27 |
| Phase 3.5: Activity Presets | Complete | 2026-01-27 | 2026-01-27 |
| Phase 4: Integration | In Progress | 2026-01-27 | - |

---

## Notes

- **2026-01-26**: Completed infrastructure pivot. Prisma schema with 16+ models, new route structure, core components built, user creation trigger fixed.
- **2026-01-26**: Implemented Day Builder + Activity Catalog. Activity model, full CRUD APIs for activities/tasks/goals, React Query hooks, Day Builder dashboard with timeline + goals + activity catalog. Task completion auto-increments goals and activity usage.
- **2026-01-26**: Wired up Command Center and Client CRM with real data. Tasks, goals, calendar, clients list, client detail, project Kanban, project detail all functional.
- **2026-01-27**: Critical fixes + modular hardening. Fixed GoalsPanel tabs, timezone bug, useAuth re-render, form close timing. Wired dead buttons, added toast notifications, delete confirmations, and cache invalidation fixes across all modules.
- **2026-01-27**: Creative Library module complete. Full CRUD, search, type filtering, detail views with type-specific fields. Navigation updated.
- **2026-01-27**: Day Builder UX Overhaul complete. `@dnd-kit/core` drag-and-drop from Activity Catalog to timeline slots, CommandSidebar with Goals/Activities tabs, TaskForm two-tab mode ("From Catalog" / "Manual"), timezone fix for Prisma `@db.Date` fields.
- **2026-01-27**: Tweet Drafts module complete. TweetDraft model, full CRUD API with filters, React Query hooks, TweetDraftCard/Form/Grid components, social list + detail pages, navigation updated. Also added TaskBacklog component and redesigned calendar page with continuous timeline.
- **2026-01-27**: Activity Presets complete. Replaced user-created Activity Catalog with 19 fixed presets. Config-driven with auto-sync on GET. Locked mutations. Simplified UX: description-first TaskForm, read-only catalog, category-colored TimeBlock borders.
- Focus on functionality over polish in MVP
- Document any blockers or decisions made

---

## Next Steps

1. Run database migration (waiting for credentials)
2. X/Twitter API integration for tweet publishing
3. Tweet scheduling with calendar view
4. Add task category filtering
5. Add inline edit flows for clients and projects
6. Start Intel Feed + AI Hub (Phase 3)

---

_Last updated: 2026-01-27_
