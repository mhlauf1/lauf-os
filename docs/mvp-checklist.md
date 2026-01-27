# MVP Checklist

> Phase-by-phase implementation tracker for LAUF OS MVP

---

## Overview

The MVP consists of 6 phases that deliver a working content command center:

1. **Foundation** - Project setup, auth, basic CRUD
2. **Idea Bank** - Content idea management
3. **Composer** - Post writing and preview
4. **X Integration** - Posting to X
5. **Calendar** - Visual scheduling
6. **Dashboard** - Home base overview

---

## Pre-Phase: Project Hardening (Complete)

**Goal**: Establish production-grade project structure and documentation

### Documentation
- [x] Create `/docs` folder structure
- [x] Write `architecture.md` with full system design
- [x] Write `changelog.md` with version tracking
- [x] Write `mvp-checklist.md` (this file)
- [x] Write `future-features.md` with backlog
- [x] Write `security.md` with security practices
- [x] Write `deployment.md` with setup guide

### Project Structure
- [x] Migrate to `src/` directory structure
- [x] Create route groups (`(auth)`, `(dashboard)`)
- [x] Set up placeholder pages for all routes
- [x] Create global error, loading, not-found pages
- [x] Update `tsconfig.json` for `src/` paths
- [x] Create `vercel.json` for cron configuration

### Configuration
- [x] Create `.env.example` with all variables
- [x] Create `src/config/pillars.ts`
- [x] Create `src/config/site.ts`
- [x] Create `src/config/navigation.ts`
- [x] Create `src/constants/index.ts`

### Utilities
- [x] Create `cn()` utility (clsx + tailwind-merge)
- [x] Create `apiResponse()` utility
- [x] Create date formatting utilities
- [x] Set up Zod validation schemas
- [x] Create TypeScript type definitions

### Dependencies
- [x] Install Supabase packages
- [x] Install React Query
- [x] Install Zustand
- [x] Install Zod
- [x] Install date-fns, clsx, tailwind-merge
- [x] Install dev tools (vitest, playwright, supabase CLI)

### Verification
- [x] `npm run build` passes
- [x] `npm run typecheck` passes
- [x] `npm run lint` passes (warnings OK)
- [x] Update `CLAUDE.md` with patterns

---

## Phase 1: Foundation

**Goal**: Project setup, authentication, basic CRUD operations

**Status**: In Progress

### Setup
- [ ] Set up Supabase project (cloud)
- [x] Configure environment variables (`.env.example` created)
- [ ] Create database schema with RLS policies
- [ ] Generate TypeScript types from Supabase
- [x] Install core dependencies (Supabase, React Query, Zustand, Zod)

### Authentication
- [ ] Configure Supabase Auth
- [x] Create login page (`/login`) - placeholder created
- [ ] Implement auth callback handler
- [ ] Add auth middleware for protected routes
- [ ] Create auth hook (`use-auth.ts`)

### App Shell
- [x] Build root layout with dark theme
- [x] Create sidebar navigation component (placeholder)
- [ ] Create header component
- [x] Create dashboard layout wrapper
- [x] Add loading and error states

### Foundation Utilities
- [x] Set up Zod validation schemas
- [x] Create API response utility
- [x] Create `cn()` utility (clsx + tailwind-merge)
- [ ] Configure shadcn/ui components

---

## Phase 2: Idea Bank

**Goal**: Full content idea management with filtering and organization

**Status**: Not Started

### API Layer
- [ ] Create ideas API route (`GET`, `POST`)
- [ ] Create ideas/:id API route (`GET`, `PUT`, `DELETE`)
- [x] Add Zod validation for idea operations
- [ ] Implement soft delete

### React Query Integration
- [ ] Create `use-ideas.ts` hook
- [ ] Implement list query with filters
- [ ] Implement create mutation
- [ ] Implement update mutation
- [ ] Implement delete mutation

### UI Components
- [ ] Create `IdeaCard` component
- [ ] Create `IdeaList` component
- [ ] Create `IdeaForm` component (modal)
- [ ] Create `IdeaFilters` component
- [ ] Create `QuickAdd` component

### Features
- [x] Idea bank page with filtering (pillar, status) - placeholder UI
- [ ] Create/edit idea modal
- [ ] Status transitions (idea → in progress → ready)
- [x] Pillar color coding (dots/badges) - implemented in CSS
- [ ] Drag-to-reorder within lists
- [x] Empty states - placeholder created

---

## Phase 3: Composer

**Goal**: Write, preview, and prepare posts for X

**Status**: Not Started

### API Layer
- [ ] Create media upload endpoint
- [ ] Configure Supabase Storage bucket
- [ ] Handle image optimization

### UI Components
- [ ] Create `PostComposer` component
- [ ] Create `CharacterCount` component
- [ ] Create `MediaUpload` component
- [ ] Create `PostPreview` component
- [ ] Create `ThreadComposer` component

### Features
- [x] Composer page - placeholder UI created
- [ ] Character count with visual feedback (280 limit)
- [ ] Image upload to Supabase Storage
- [ ] Preview pane (how it'll look on X)
- [ ] Save as draft functionality
- [ ] Thread composer (multiple tweets)
- [ ] Auto-save drafts to Zustand store

---

## Phase 4: X Integration

**Goal**: Connect to X and post content

**Status**: Not Started

### OAuth Flow
- [ ] Create X OAuth initiation endpoint
- [ ] Create X OAuth callback handler
- [ ] Implement token encryption (AES-256-GCM)
- [ ] Store encrypted tokens in users table
- [ ] Add token refresh logic

### Posting
- [ ] Create X API wrapper (`lib/x-api/`)
- [ ] Implement "Post Now" functionality
- [ ] Handle media upload to X
- [ ] Update idea status to "posted"
- [ ] Store `x_post_id` on idea record

### Scheduling
- [ ] Add `scheduled_for` field handling
- [ ] Create Vercel Cron job (`/api/cron/post-scheduled`)
- [ ] Query for due posts (scheduled_for <= now)
- [ ] Execute posting for each due post
- [ ] Error handling and retry logic
- [x] Cron authentication (CRON_SECRET) - configured in vercel.json

---

## Phase 5: Calendar

**Goal**: Visual scheduling interface

**Status**: Not Started

### UI Components
- [ ] Create `WeekView` component
- [ ] Create `TimeSlot` component
- [ ] Create `DraggableIdea` component
- [ ] Create `CalendarHeader` component

### Features
- [x] Calendar page with week view - placeholder UI created
- [ ] Display scheduled posts in time slots
- [x] Three slots per day (morning, afternoon, evening) - UI structure
- [ ] Drag from "Ready" queue to calendar
- [ ] Click to edit scheduled time
- [x] Visual indicator of pillar type - CSS configured
- [ ] Navigate between weeks
- [ ] Month view (stretch goal)

---

## Phase 6: Dashboard

**Goal**: Home base that surfaces what matters

**Status**: Not Started

### UI Components
- [ ] Create `TodaySchedule` component
- [ ] Create `StreakCounter` component
- [ ] Create `PillarStats` component
- [ ] Create `ReadyQueue` component

### Features
- [x] Dashboard home page - placeholder UI created
- [x] Today's schedule widget (3 time slots) - UI structure
- [ ] Posting streak counter (calculated from history)
- [x] Ideas summary by pillar (counts) - UI structure
- [ ] "Ready to post" queue (top 5)
- [x] Quick-add button - placeholder
- [ ] Link to full views

---

## MVP Complete Criteria

When all phases are complete, the app should:

- [ ] Allow user login via Supabase Auth
- [ ] Capture ideas by pillar
- [ ] Write and preview posts
- [ ] Post directly to X
- [ ] Schedule posts for future times
- [ ] Display posts on calendar
- [ ] Show dashboard overview
- [ ] Be usable daily by the developer

---

## Progress Tracking

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| Pre-Phase: Hardening | Complete | 2026-01-26 | 2026-01-26 |
| Phase 1: Foundation | In Progress | 2026-01-26 | - |
| Phase 2: Idea Bank | Not Started | - | - |
| Phase 3: Composer | Not Started | - | - |
| Phase 4: X Integration | Not Started | - | - |
| Phase 5: Calendar | Not Started | - | - |
| Phase 6: Dashboard | Not Started | - | - |

---

## Notes

- **2026-01-26**: Completed project hardening. All placeholder pages built, documentation complete, dependencies installed. Ready for Supabase setup.
- Each phase generates at least one showcase post
- Test each phase before moving to the next
- Focus on functionality over polish in MVP
- Document any blockers or decisions made

---

## Next Steps

1. Set up Supabase project (create account/project if needed)
2. Create database schema with migrations
3. Configure Supabase Auth
4. Initialize shadcn/ui for component library
5. Build functional login flow

---

_Last updated: 2026-01-26_
