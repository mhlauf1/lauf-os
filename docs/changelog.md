# Changelog

All notable changes to LAUF OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

_Next: Database migration, drag-and-drop, calendar week view, Client CRM wire-up_

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
| 0.2.0 | 2026-01-26 | Day Builder + Activity Catalog, React Query, full CRUD APIs |
| 0.1.0 | 2026-01-26 | Pivot to Personal OS, Prisma, new architecture |
| 0.0.2 | 2026-01-26 | Documentation, src/ structure |
| 0.0.1 | 2026-01-26 | Initial project setup |

---

## Upcoming Versions

### 0.2.1 - Command Center Polish
- Drag-and-drop reordering
- Calendar week view
- Task category filtering
- Goal completion via UI

### 0.3.0 - Client CRM Complete
- Client management
- Project pipeline
- Health scores

### 0.4.0 - Library Module
- Design inspiration
- AI image gallery
- Component library

### 0.5.0 - Intel Feed & AI Hub
- RSS feeds
- Article summaries
- AI tool tracking

### 1.0.0 - Full MVP
- All 9 modules functional
- Mobile-friendly
- Daily usable

---

_This changelog is updated with each release._
