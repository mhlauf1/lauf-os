# Changelog

All notable changes to LAUF OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

_Next: Database migration, X/Twitter API integration, Intel Feed + AI Hub (Phase 3)_

---

## [0.9.0] - 2026-01-28

### Added

**Multi-Task Time Slots**

Time slots now support multiple tasks displayed as compact horizontal labels, enabling parallel work tracking within the same time block.

**Schema Changes**
- Removed `@@unique([userId, scheduledDate, slotIndex])` constraint from Task model
- Tasks can now share the same slot on the same day

**API Changes**
- `POST /api/tasks` — removed slot conflict validation, multiple tasks per slot allowed
- `PATCH /api/tasks/[id]` — removed slot conflict validation when moving tasks

**Component Updates**
- `DailyTimeline` — `tasksBySlot` changed from `Map<number, Task>` to `Map<number, Task[]>`
- `TimeSlotRow` — renders tasks as horizontal flex row with compact labels + always-visible "+" button
- `TimeBlock` — added `compact` prop for horizontal label style (smaller padding, truncated title, click-to-edit)

**UX Improvements**
- Multiple tasks per slot displayed as compact horizontal labels with category-colored left border
- "+" button always visible when tasks exist in a slot
- Click any task to edit
- Drag activities to slots with existing tasks to add more

---

## [0.8.0] - 2026-01-28

### Added

**Goal Progress & Cascades**

Comprehensive goal progress tracking system with pace calculation, library-goal linking, and bidirectional cascade effects on task/library mutations.

**Schema Changes**
- Added `startDate` field to `Goal` model for pace tracking
- Added `goalId` field to `LibraryItem` model for library-goal linking
- Added `libraryItems` relation on `Goal` model

**Goal Cascades Utility**
- New `src/lib/utils/goal-cascades.ts` with `computeBreakdown()` function
- Computes: `expectedPerWeek`, `expectedPerDay`, `expectedByNow`, `isOnTrack`, `progressPercent`
- Based on `startDate`/`dueDate` or goal type fallbacks (daily=1d, weekly=7d, monthly=30d, yearly=365d)

**Goal API Enhancements**
- `DELETE /api/goals/[id]` — delete a goal
- `PATCH /api/goals/[id]` — supports atomic `incrementValue` field for safe progress updates
- Auto-completes goal when `currentValue` reaches `targetValue`; reopens when decremented below
- `GET /api/goals` — new `includeBreakdown=true` query param returns pace data with each goal
- `POST /api/goals` — supports `startDate` field
- Zod validation schemas extracted to `src/lib/validations/goal.schema.ts`

**Task Completion Cascade Fixes**
- Task revert (DONE → non-DONE status): decrements linked goal's `currentValue` and reopens auto-completed goals
- Task revert: decrements linked activity's `timesUsed`
- Task delete (when status was DONE): decrements linked goal's `currentValue`
- Task completion: auto-completes goal when target reached (was missing before)

**Library-Goal Integration**
- LibraryItem can now link to a Goal (`goalId` field)
- Creating a library item with `goalId` auto-increments goal progress
- Updating a library item's `goalId` decrements old goal and increments new goal
- Deleting a library item with `goalId` decrements goal progress
- Library detail API includes linked goal data
- `LibraryItemForm` has goal dropdown (grouped by type via `<optgroup>`)
- Library mutations invalidate goals query cache

**New Components**
- `GoalCard` — full goal card with on-track indicator dot, progress bar, breakdown chips (~/wk, ~/day), linked item counts, increment/decrement buttons, edit/delete dropdown
- `GoalProgressBar` — visual progress bar with expected-by-now marker line, color-coded (green if on track, amber if slightly behind, red if far behind)
- `GoalFormDialog` — rewritten with `startDate`/`dueDate` date pickers, type-aware default dates (e.g., Monthly defaults to 1st–last of month)

**GoalsPanel Overhaul**
- Removed type tabs (Daily/Weekly/Monthly) — now shows all incomplete goals in one unified list
- Goals sorted by most behind pace first
- Compact progress bars per goal with inline increment buttons
- On-track count summary

**Goals Page Overhaul**
- Replaced type tabs with perspective views: Month, Week, Day
- Primary/secondary goal grouping based on perspective (e.g., Month view: Monthly+Yearly primary, Weekly+Daily secondary)
- Stats cards: active, on track, behind counts
- Increment/decrement buttons on each goal card
- Delete goals with confirmation dialog (`ConfirmDeleteDialog`)

**Dashboard Changes**
- Compact goals overview card with progress bars replacing old GoalsPanelContent
- "View All" link to goals page
- Active goal count in header
- Uses `useIncrementGoal` for progress updates

**TaskForm + LibraryItemForm**
- Goal dropdown now grouped by type (`<optgroup>`: Monthly, Weekly, Daily, Yearly)

**React Query Hooks**
- `use-goals.ts`: Added `useIncrementGoal`, `useDeleteGoal`, `GoalWithCounts` type, `includeBreakdown` filter
- `use-library.ts`: Added `goalId` to create/update interfaces, goals cache invalidation on all library mutations

---

## [0.7.0] - 2026-01-27

### Changed

**Activity Presets — Replace User-Created Catalog with 19 Fixed Presets**

Replaced the user-created Activity Catalog with exactly 19 predefined activity "buckets." Each preset is a reusable label (e.g., "Website Design") — when the user picks one, they enter a description and choose a duration.

- Created `src/config/activity-presets.ts` with 19 presets (source of truth): Morning Routine, Website Design, Website Development, Playbook Work, Meal Time, Break Time, Learning, Fitness, Wellness, Engineering, Mobile App Design, Mobile App Development, Lauf Admin Work, Lauf Client Work, Read, Graphic Design, Social Media Management, Generic Work, Night Routine
- `GET /api/activities` now auto-syncs presets: creates missing, reactivates matching, deactivates non-preset custom activities
- `POST /api/activities` returns 403 — presets are system-managed
- `PATCH /api/activities/[id]` restricted to `timesUsed`/`lastUsed` updates only
- `DELETE /api/activities/[id]` returns 403 — presets cannot be deleted
- `use-activities.ts` reduced to read-only `useActivities()` hook (removed create/update/delete mutations)
- `ActivityCatalog` component simplified: removed "New Activity" button, edit/delete dropdown menus
- `CommandSidebar` simplified: removed `onCreateActivity`, `onEditActivity`, `onDeleteActivity` props
- `TaskForm` description-first UX: activity-based tasks show description textarea with "What will you do in this block?" placeholder, hide title input (shown in dialog header), hide category picker (auto-set from preset)
- Deleted `ActivityForm.tsx` component (no longer needed)
- Removed `ActivityForm` export from `src/components/modules/command/index.ts`

**TimeBlock Category Colors**

- TimeBlock component now displays category-colored left border (matches calendar view styling)
- Uses `getCategoryConfig()` to resolve color from task category

---

## [0.6.0] - 2026-01-27

### Added

**Tweet Drafts Module (Social Manager Early Start)**

Full tweet draft management system — the first piece of the Social Manager module.

- `TweetDraft` Prisma model with `TweetDraftStatus` enum (DRAFT, READY, POSTED, ARCHIVED)
- Zod validation schemas (`src/lib/validations/tweet-draft.schema.ts`): 280-character limit, thread support (tweetNumber/totalTweets), tag arrays
- API routes: `/api/tweets` (GET with status/search/tag filters, POST) + `/api/tweets/[id]` (GET, PATCH, DELETE) with ownership validation
- React Query hooks (`use-tweet-drafts.ts`): useTweetDrafts, useTweetDraft, useCreateTweetDraft, useUpdateTweetDraft, useDeleteTweetDraft
- Components: TweetDraftCard (status badge, content preview, char count, tags, dropdown actions), TweetDraftForm (char counter with color warnings, status toggle, TagInput), TweetGrid (responsive 1-2-3 column grid)
- Social list page (`/social`) with stats cards (total/ready/posted), debounced search, status filter tabs, delete confirmations
- Social detail page (`/social/[id]`) with character counter, status actions (Ready/Posted/Draft/Archive), edit dialog, delete with redirect
- Navigation updated: "Social" section added to sidebar

**Command Center UX Enhancements**

- `TaskBacklog` component: draggable unscheduled task cards using `@dnd-kit/core` for Day Builder scheduling
- Calendar page redesign: continuous timeline (6 AM–11 PM) replacing discrete time slots; tasks positioned and sized proportionally; hour grid lines
- Various UX refinements across DailyTimeline, CommandSidebar, GoalsPanel, TaskForm, TimeBlock

**New shadcn/ui Components**

- `Command` (cmdk) — command palette/search interface
- `Popover` — floating content positioned relative to trigger
- `Select` — dropdown select with scroll buttons and keyboard navigation

**Dependencies**

- Added `@radix-ui/react-popover`, `@radix-ui/react-select`, `cmdk`

---

## [0.5.0] - 2026-01-27

### Added

**Creative Library Module**

Full Creative Library module with CRUD, search, filtering, and type-specific detail views.

- Zod validation schemas (`src/lib/validations/library.schema.ts`)
- API routes: `/api/library` (GET, POST) + `/api/library/[id]` (GET, PATCH, DELETE)
- React Query hooks (`use-library.ts`): useLibrary, useLibraryItem, useCreateLibraryItem, useUpdateLibraryItem, useDeleteLibraryItem
- Library type config (`src/config/library.ts`): colors, icons, labels per LibraryItemType
- Components: LibraryItemCard, LibraryGrid, LibraryItemForm, TagInput
- Library list page with stats cards, debounced search, type filter tabs, grid display
- Library detail page with type-specific fields, external links, edit/delete
- Navigation: Library moved from Coming Soon to new "Creative" nav group
- `ensureUser` helper (`src/lib/prisma/ensure-user.ts`) for consistent user creation in API routes

**Day Builder UX Overhaul**

Major UX improvements to the Command Center Day Builder with drag-and-drop and a unified sidebar.

- Installed `@dnd-kit/core` for drag-and-drop support
- `CommandSidebar` component: tabbed sidebar with Goals / Activities tabs (replaces separate GoalsPanel + ActivityCatalog sections)
- Draggable activities: `useDraggable` on ActivityCard in sidebar catalog with visual drag feedback
- Droppable timeline slots: `useDroppable` on EmptySlot in DailyTimeline with glow/ring highlight
- `DndContext` + `DragOverlay` wired into Command Center dashboard
- Drag activity from sidebar → drop on empty slot → task auto-created with toast confirmation
- TaskForm two-tab mode: "From Catalog" / "Manual" tabs when activities are available
- Extracted `GoalsPanelContent` and `ActivityCatalogContent` for reuse in sidebar
- Exported `ActivityCardInner` for DragOverlay rendering

**Bug Fixes**

- Fixed timezone bug in calendar date parsing: `parseCalendarDate()` strips UTC timezone from Prisma `@db.Date` to avoid off-by-one day errors in US timezones
- Applied timezone fix to DailyTimeline, Calendar week view, and all task creation flows
- Task creation now sends dates as UTC midnight (`T00:00:00.000Z`) for correct DB storage

---

## [0.4.0] - 2026-01-27

### Added

**Critical Fixes + Modular Hardening**

Comprehensive bug fix and UX hardening pass across all modules. Every button now works or has been removed, all mutations show toast feedback, and destructive actions require confirmation.

**Bug Fixes**
- GoalsPanel dashboard tabs now show all goal types (Daily/Weekly/Monthly), not just monthly
- GoalFormDialog supports picking goal type instead of hardcoding MONTHLY
- Task date filtering uses date range instead of exact match (fixes timezone mismatch)
- `useAuth` hook uses `useMemo` for stable Supabase client reference (fixes infinite re-render)
- TaskForm and ActivityForm no longer close prematurely — dialog closes on mutation success

**Dead Button Cleanup**
- TimeBlock "Delete" dropdown item wired to `useDeleteTask`
- TimeBlock "Reschedule" dropdown item removed (no flow exists)
- ClientCard "Add Project" and "Log Contact" dropdown items removed (no flows exist)
- ProjectKanban "Edit" dropdown item wired to navigate to project detail page

**Error Handling & UX**
- Sonner `<Toaster>` wired into root layout with dark theme
- Toast success/error notifications on every mutation across all pages (dashboard, tasks, calendar, clients, projects)
- Delete confirmation dialogs (AlertDialog) for clients and projects
- New reusable `ConfirmDeleteDialog` shared component (`src/components/shared/`)

**Cache Invalidation Fixes**
- `useDeleteTask` now also invalidates `['goals']` and `['activities']` query caches
- `useDeleteClient` now also invalidates `['projects']` query cache
- `useCreateProject` now also invalidates `['clients']` query cache
- `useDeleteProject` now also invalidates `['clients']` and `['tasks']` query caches

**New Components**
- `src/components/shared/ConfirmDeleteDialog.tsx` — reusable AlertDialog wrapper
- `src/components/ui/alert-dialog.tsx` — shadcn/ui AlertDialog primitive

---

## [0.3.0] - 2026-01-26

### Added

**Client CRM Wire-Up + Command Center Polish**

Full wire-up of Client CRM module and Command Center pages with real API data.

**Client CRM**
- React Query hooks: `use-clients.ts` (useClients, useClient, useCreateClient, useUpdateClient, useDeleteClient)
- React Query hooks: `use-projects.ts` (useProjects, useProject, useCreateProject, useUpdateProject, useDeleteProject)
- Individual API routes: `/api/clients/[id]` (GET, PATCH, DELETE) and `/api/projects/[id]` (GET, PATCH, DELETE)
- Clients list page with health stats cards, debounced search, status filter tabs
- Client create page with full form and redirect on success
- Client detail page with overview, contact info, linked projects, delete
- Projects page with Kanban board rendering real data, status change via drag
- Project detail page with overview, links, tasks list, delete

**Command Center Polish**
- Tasks page wired with status/category filters, search, and create dialog
- Goals page wired with type filters, real stats, completion toggle, goal creation
- GoalsPanel dashboard toggle (click to mark goals complete/incomplete)
- Calendar week view with date-range filtering, task rendering, week navigation

---

## [0.2.0] - 2026-01-26

### Added

**Day Builder + Activity Catalog**

The core Day Builder concept: build your day from a curated catalog of activities, with everything rolling up into monthly goals.

**Activity Model**
- New `Activity` Prisma model for the reusable activity catalog
- Fields: title, description, category, defaultDuration, energyLevel, timesUsed, lastUsed
- Activities pre-fill task creation for rapid day building

**Task + Goal Linking**
- `activityId` and `goalId` foreign keys on Task model
- `tasks` relation on Goal model
- Auto-increment goal `currentValue` when linked task is completed
- Auto-update activity `timesUsed` and `lastUsed` on task completion

**Activity CRUD API**
- `GET /api/activities` - List all active activities
- `POST /api/activities` - Create new activity
- `PATCH /api/activities/[id]` - Update activity
- `DELETE /api/activities/[id]` - Delete activity

**Task + Goal Individual APIs**
- `PATCH /api/tasks/[id]` - Update task (status, fields); auto-increments goal/activity on completion
- `DELETE /api/tasks/[id]` - Delete task
- `PATCH /api/goals/[id]` - Update goal progress/completion

**React Query Integration**
- `use-tasks.ts` - useTasks, useCreateTask, useUpdateTask, useDeleteTask
- `use-activities.ts` - useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity
- `use-goals.ts` - useGoals, useCreateGoal, useUpdateGoal
- QueryClientProvider wired into root layout

**Day Builder Dashboard**
- Complete rewrite of dashboard as Day Builder
- Two-column layout: Daily Timeline (2/3) + Goals Panel (1/3)
- Activity Catalog at bottom for quick block creation
- Stats cards: blocks completed, monthly goal progress, activity count
- Click activity → pre-filled task dialog → block created at next available slot

**Components**
- `ActivityCatalog` - Activity picker grid with category colors, duration, energy, usage counts
- `ActivityForm` - Create/edit activity dialog
- `TaskForm` updated with "from activity" quick-create mode and goal linking dropdown
- `GoalFormDialog` - Inline monthly goal creation

---

## [0.1.0] - 2026-01-26

### Added

**Major Pivot: Personal Operating System**

This release pivots LAUF OS from a content-creation tool to a full **Personal Operating System** with 9 modules.

**Prisma ORM**
- Installed Prisma 7 with pg adapter
- Created comprehensive schema with 16+ models
- Configured `prisma.config.ts` for CLI
- Created Prisma client singleton with connection pooling

**Database Schema**
- `User` - Profile, preferences, timezone
- `Task` - 90-minute time blocks with categories
- `Goal` - Daily/weekly/monthly/yearly goals
- `Client` - Client info, health scores, credentials
- `Project` - Project pipeline with statuses
- `Opportunity` - AI-generated upsell opportunities
- `Asset` - File storage with metadata
- Plus 9 more models for future phases

**New Route Structure**
- `/` - Command Center (dashboard home)
- `/command/tasks` - Task management
- `/command/calendar` - Week/month planning
- `/command/goals` - Goals tracking
- `/clients` - Client directory
- `/clients/[id]` - Client detail
- `/clients/new` - Create client
- `/projects` - Project pipeline
- `/projects/[id]` - Project detail

**API Routes**
- `GET/POST /api/tasks` - Task CRUD
- `GET/POST /api/clients` - Client CRUD
- `GET/POST /api/projects` - Project CRUD
- `GET/POST /api/goals` - Goal CRUD

**Components**
- Command Center: `TimeBlock`, `TaskCard`, `TaskForm`, `DailyTimeline`, `GoalsPanel`
- Client CRM: `HealthScoreBadge`, `ClientCard`, `ProjectKanban`

**Configuration**
- New navigation with grouped sections (Main, Work, Coming Soon)
- Task categories with colors (DESIGN, CODE, CLIENT, etc.)
- Category configuration in `src/config/categories.ts`

**Infrastructure**
- User creation trigger for Prisma schema
- Migration script (`scripts/run-migration.mjs`)

### Changed

- Replaced Supabase direct queries with Prisma
- Updated SPEC.md with full 9-module vision
- Updated CLAUDE.md with Prisma patterns
- Updated all documentation files

### Removed

- Old `content_ideas` table and related code
- Old routes: `/ideas`, `/compose`, `/feed`, `/learn`, `/analytics`
- Old types: `idea.types.ts`, `idea.schema.ts`
- Old pillar-based content system

---

## [0.0.2] - 2026-01-26

### Added

**Documentation Infrastructure**
- Created `/docs` folder with comprehensive documentation
- `docs/architecture.md` - Full system architecture
- `docs/changelog.md` - Version tracking
- `docs/mvp-checklist.md` - Implementation tracker
- `docs/future-features.md` - Feature roadmap
- `docs/security.md` - Security practices
- `docs/deployment.md` - Setup guide

**Project Structure**
- Migrated to `src/` directory structure
- Created route groups: `(auth)`, `(dashboard)`
- Built placeholder pages for all routes
- Added global error, loading, not-found pages

**Configuration & Utilities**
- `.env.example` - Environment variable template
- `src/config/pillars.ts` - Content pillars config
- `src/config/site.ts` - Site metadata
- `src/lib/utils/cn.ts` - Tailwind class merge
- `src/lib/validations/` - Zod schemas

**Dependencies**
- Supabase JS, React Query, Zustand, Zod
- date-fns, clsx, tailwind-merge

---

## [0.0.1] - 2026-01-26

### Added
- Initial Next.js 16 project with App Router
- Tailwind CSS v4 configuration
- TypeScript strict mode
- Basic project structure
- `.claude/SPEC.md` with feature specification
- `CLAUDE.md` with project guidance

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 0.9.0 | 2026-01-28 | Multi-Task Time Slots (multiple tasks per slot, compact TimeBlock mode, flexible scheduling) |
| 0.8.0 | 2026-01-28 | Goal Progress & Cascades (pace tracking, library-goal linking, cascade effects, GoalCard/GoalProgressBar) |
| 0.7.0 | 2026-01-27 | Activity Presets (19 fixed presets replacing user-created catalog), TimeBlock category colors |
| 0.6.0 | 2026-01-27 | Tweet Drafts module (Social Manager), TaskBacklog, calendar redesign, new UI components |
| 0.5.0 | 2026-01-27 | Creative Library module + Day Builder UX Overhaul (drag-and-drop, CommandSidebar, TaskForm tabs) |
| 0.4.0 | 2026-01-27 | Critical fixes + modular hardening (toasts, delete confirmations, cache fixes) |
| 0.3.0 | 2026-01-26 | Client CRM wire-up + Command Center polish |
| 0.2.0 | 2026-01-26 | Day Builder + Activity Catalog, React Query, full CRUD APIs |
| 0.1.0 | 2026-01-26 | Pivot to Personal OS, Prisma, new architecture |
| 0.0.2 | 2026-01-26 | Documentation, src/ structure |
| 0.0.1 | 2026-01-26 | Initial project setup |

---

## Upcoming Versions

### 0.10.0 - Intel Feed & AI Hub
- RSS feeds
- Article summaries
- AI tool tracking

### 1.0.0 - Social Publishing
- X/Twitter API integration
- Tweet scheduling
- Analytics dashboard

### 1.1.0 - Full MVP
- All 9 modules functional
- Mobile-friendly
- Daily usable

---

_This changelog is updated with each release._
