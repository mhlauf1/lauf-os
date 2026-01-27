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

**Goal**: Functional daily productivity system

### Task Management
- [ ] Wire up TaskForm to create tasks via API
- [ ] Display tasks in DailyTimeline by scheduled time
- [ ] Implement task status transitions (TODO → IN_PROGRESS → DONE)
- [ ] Add task category filtering
- [ ] Implement drag-and-drop reordering
- [ ] Add task completion (mark done, record completedAt)

### Time Blocking
- [ ] Display 90-minute blocks on timeline
- [ ] Allow scheduling tasks to specific time slots
- [ ] Show energy level indicators
- [ ] Support different block durations (45, 90, 120 min)

### Goals
- [ ] Create daily goals
- [ ] Track goal progress (currentValue/targetValue)
- [ ] Display goals in sidebar widget
- [ ] Mark goals complete

### Calendar View
- [ ] Week view with days as columns
- [ ] Drag tasks to different days
- [ ] Show task counts per day
- [ ] Navigate between weeks

---

## Phase 2: Client CRM Core

**Goal**: Functional client management system

### Client Management
- [ ] Create new clients via form
- [ ] Edit client details
- [ ] Display client list with health score badges
- [ ] Filter clients by status (Active, Paused, etc.)
- [ ] Filter clients by health score

### Project Pipeline
- [ ] Create projects linked to clients
- [ ] Kanban board with project statuses
- [ ] Drag projects between columns
- [ ] Project detail view

### Health Scores
- [ ] Manual health score updates
- [ ] Visual indicators (GREEN/YELLOW/RED)
- [ ] Health score history (stretch)

### Client Details
- [ ] Quick links (website, GitHub, Figma, Vercel)
- [ ] Encrypted credentials storage
- [ ] Notes and metadata
- [ ] Follow-up reminders

---

## Phase 3: Integration & Polish

**Goal**: Connect modules and add finishing touches

### Cross-Module Integration
- [ ] Link tasks to projects
- [ ] Show client tasks in client detail
- [ ] Project tasks view

### UI Polish
- [ ] Loading states for all data
- [ ] Error handling and display
- [ ] Empty states with CTAs
- [ ] Toast notifications

### Data Validation
- [ ] Zod schemas for all forms
- [ ] Server-side validation
- [ ] Client-side validation feedback

---

## MVP Complete Criteria

When complete, the app should:

- [x] Allow user login via Supabase Auth
- [ ] Create and schedule tasks in 90-minute blocks
- [ ] View daily timeline with tasks
- [ ] Track daily/weekly goals
- [ ] Manage clients with health scores
- [ ] Track projects in pipeline view
- [ ] Navigate between all MVP routes
- [ ] Be usable daily

---

## Progress Tracking

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| Phase 0: Infrastructure | Complete | 2026-01-26 | 2026-01-26 |
| Phase 1: Command Center | In Progress | 2026-01-26 | - |
| Phase 2: Client CRM | Not Started | - | - |
| Phase 3: Integration | Not Started | - | - |

---

## Notes

- **2026-01-26**: Completed infrastructure pivot. Prisma schema with 16+ models, new route structure, core components built, user creation trigger fixed.
- Focus on functionality over polish in MVP
- Document any blockers or decisions made

---

## Next Steps

1. Wire up TaskForm to create tasks via API
2. Fetch and display tasks in DailyTimeline
3. Implement task status transitions
4. Add task completion functionality

---

_Last updated: 2026-01-26_
