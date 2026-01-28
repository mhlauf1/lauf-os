# LAUF OS

## Personal Operating System — Master Specification

---

```
██╗      █████╗ ██╗   ██╗███████╗     ██████╗ ███████╗
██║     ██╔══██╗██║   ██║██╔════╝    ██╔═══██╗██╔════╝
██║     ███████║██║   ██║█████╗      ██║   ██║███████╗
██║     ██╔══██║██║   ██║██╔══╝      ██║   ██║╚════██║
███████╗██║  ██║╚██████╔╝██║         ╚██████╔╝███████║
╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝          ╚═════╝ ╚══════╝
```

---

|             |                    |
| ----------- | ------------------ |
| **Version** | 1.4                |
| **Created** | January 2025       |
| **Updated** | January 2026       |
| **Status**  | Active Development |

---

> _"A comprehensive command center for life, work, and growth. One place to wake up, open, and know exactly what to do."_

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Schema](#4-database-schema)
5. [Module Specifications](#5-module-specifications)
6. [AI Integration Strategy](#6-ai-integration-strategy)
7. [Development Roadmap](#7-development-roadmap)
8. [Claude Code & MCP Integration](#8-claude-code--mcp-integration)
9. [UI/UX Guidelines](#9-uiux-guidelines)
10. [Future Enhancements](#10-future-enhancements)
11. [Getting Started](#11-getting-started)
12. [Appendices](#12-appendices)

---

# 1. Executive Summary

## 1.1 Vision Statement

**LAUF OS** is a personal operating system designed to centralize every aspect of life management — client work, creative output, health tracking, financial planning, continuous learning, and daily productivity — into a single, intelligent platform.

The system is built to **compound value over time** through:

- Intelligent automation that learns your patterns
- AI integration across every workflow
- Visual progress tracking that motivates action
- A modular architecture that grows with your needs

**The Goal:** Wake up, open LAUF OS, and know exactly what to do. Everything is prepped, automated in the background, and ready for execution. No context-switching between 15 tabs. No decision fatigue. Just pure, focused output.

## 1.2 Core Objectives

| #   | Objective                       | Description                                                                           |
| --- | ------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | **Eliminate Context-Switching** | Consolidate all tools, data, and workflows into one unified interface                 |
| 2   | **Automate the Mundane**        | Surface actionable insights proactively; automate repetitive tasks                    |
| 3   | **Track Everything Visually**   | Maintain accountability with progress charts, streaks, and visual feedback            |
| 4   | **Scale Infinitely**            | Modular architecture that supports adding new features without breaking existing ones |
| 5   | **Leverage AI Strategically**   | Use the right AI tool for each task; maximize value from subscriptions                |
| 6   | **Showcase Work**               | Present designs, templates, and portfolio work in a high-quality, professional manner |
| 7   | **Compound Growth**             | Every action feeds into a larger system that gets smarter and more valuable over time |

## 1.3 Success Metrics

| Metric                   | Target           | Timeline | How to Measure             |
| ------------------------ | ---------------- | -------- | -------------------------- |
| Daily active usage       | 100% of workdays | Phase 1  | Login tracking             |
| Context switches reduced | 50% reduction    | Phase 2  | Self-reported              |
| Client response time     | < 24 hours       | Phase 1  | Last contacted timestamps  |
| Weekly content output    | 3+ pieces        | Phase 2  | Library item count         |
| Portfolio items tracked  | 100% coverage    | Phase 1  | Asset count vs actual work |
| 90-min blocks completed  | 4+ per day       | Phase 1  | Task completion rate       |
| Template library size    | 50+ items        | Phase 2  | Library count              |

## 1.4 The Problem We're Solving

**Current State (Pain Points):**

- Browsing the internet for hours getting distracted on what to design or build
- Client information scattered across emails, docs, and memory
- No single source of truth for assets, designs, and templates
- Manually tracking what needs to be done each day
- Losing track of follow-ups and opportunities
- No visibility into progress or compounding growth
- AI subscriptions underutilized — not knowing which tool to use when
- Health and fitness tracking disconnected from work/life flow

**Future State (With LAUF OS):**

- Wake up → Open LAUF OS → See exactly what to work on
- All client context in one place with proactive opportunity suggestions
- Visual library of all work, ready to showcase or reuse
- 90-minute blocks pre-planned with context preloaded
- Automated follow-up reminders and AI-generated action items
- Compounding charts showing growth across all areas
- AI Hub guiding which tool to use for each task
- Health tracking integrated into daily planning

---

# 2. Technology Stack

## 2.1 Core Framework

| Layer                    | Technology      | Version | Rationale                                                  |
| ------------------------ | --------------- | ------- | ---------------------------------------------------------- |
| **Frontend Framework**   | Next.js         | 14+     | App Router, Server Components, existing expertise          |
| **UI Library**           | React           | 18+     | Component-based architecture, massive ecosystem            |
| **Language**             | TypeScript      | 5+      | Type safety, better DX, catch errors at compile time       |
| **Styling**              | Tailwind CSS    | 3+      | Utility-first, rapid development, consistent design system |
| **UI Components**        | shadcn/ui       | Latest  | Beautiful, accessible, customizable primitives             |
| **State (Client)**       | Zustand         | 4+      | Lightweight, simple API, no boilerplate                    |
| **State (Server)**       | React Query     | 5+      | Caching, background updates, optimistic mutations          |
| **Forms**                | React Hook Form | 7+      | Performant, minimal re-renders                             |
| **Validation**           | Zod             | 3+      | TypeScript-first schema validation                         |
| **Database**             | PostgreSQL      | 15+     | Relational integrity, JSON support, full-text search       |
| **Backend-as-a-Service** | Supabase        | Latest  | Auth, DB, Storage, Realtime, Edge Functions                |
| **ORM**                  | Prisma          | 5+      | Type-safe queries, migrations, schema as source of truth   |
| **Deployment**           | Vercel          | -       | Zero-config Next.js deploys, edge network                  |

## 2.2 Database: Supabase + PostgreSQL

### Why Supabase + PostgreSQL?

| Feature                      | Benefit for LAUF OS                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Row Level Security (RLS)** | Encryption and access control at the database level. Client passwords and financial data protected even if API compromised. |
| **Real-time Subscriptions**  | Live updates across dashboard without polling. See task completions, new assets instantly.                                  |
| **Integrated Storage**       | S3-compatible storage for all design assets, screenshots, media. Automatic CDN.                                             |
| **Edge Functions**           | Serverless functions for AI integrations, webhooks, scheduled tasks.                                                        |
| **PostgreSQL JSON Columns**  | Flexible metadata storage. Store varying data structures without schema changes.                                            |
| **Full-Text Search**         | Search across clients, tasks, library items without external service.                                                       |
| **Vector Embeddings**        | Future AI features: semantic search, similar content discovery.                                                             |

### Storage Buckets Structure

```
supabase-storage/
├── avatars/              # User profile images
├── client-assets/        # Client-specific files
│   └── {client_id}/
│       ├── images/
│       ├── documents/
│       └── screenshots/
├── library/              # Personal library assets
│   └── {user_id}/
│       ├── inspirations/
│       ├── templates/
│       ├── ai-images/
│       └── components/
├── social/               # Social media content
└── exports/              # Generated exports, reports
```

## 2.3 Security Architecture

| Layer                     | Implementation         | Details                                                         |
| ------------------------- | ---------------------- | --------------------------------------------------------------- |
| **Authentication**        | Supabase Auth          | Email/password, Magic links, OAuth (Google, GitHub), MFA option |
| **Authorization**         | Row Level Security     | Policies on every table ensuring users only access their data   |
| **Encryption at Rest**    | AES-256                | Supabase managed PostgreSQL encrypts all data                   |
| **Encryption in Transit** | TLS 1.3                | All connections encrypted                                       |
| **Secrets Management**    | Environment Variables  | Sensitive keys in `.env.local`, never committed                 |
| **Client Credentials**    | Field-Level Encryption | Client passwords encrypted with user-specific derived key       |
| **API Security**          | Rate Limiting + CORS   | Prevent abuse, restrict origins                                 |

## 2.4 Third-Party Services

| Service            | Purpose                  | Integration Point      |
| ------------------ | ------------------------ | ---------------------- |
| **Vercel**         | Hosting, Edge Functions  | Deployment             |
| **Resend**         | Transactional emails     | Notifications          |
| **Anthropic API**  | Claude AI integration    | AI features            |
| **OpenAI API**     | ChatGPT/GPT-4            | Alternative AI         |
| **Perplexity API** | Research, current events | Intel Feed             |
| **X/Twitter API**  | Social posting           | Social Manager         |
| **Zapier**         | Automation workflows     | Background automations |

---

# 3. System Architecture

## 3.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  LAUF OS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│   │   Command   │ │   Client    │ │  Creative   │ │   Health    │          │
│   │   Center    │ │    CRM      │ │   Library   │ │   Tracker   │          │
│   │             │ │             │ │             │ │             │          │
│   │ • Daily View│ │ • Clients   │ │ • Inspire   │ │ • Workouts  │          │
│   │ • 90m Blocks│ │ • Projects  │ │ • Templates │ │ • Nutrition │          │
│   │ • Tasks     │ │ • Assets    │ │ • AI Images │ │ • Sobriety  │          │
│   │ • Goals     │ │ • Pipeline  │ │ • Ideas     │ │ • Check-ins │          │
│   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘          │
│          │               │               │               │                  │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│   │  Financial  │ │    Intel    │ │   Social    │ │    AI       │          │
│   │   Tracker   │ │    Feed     │ │   Manager   │ │    Hub      │          │
│   │             │ │             │ │             │ │             │          │
│   │ • Income    │ │ • News      │ │ • Queue     │ │ • Tools     │          │
│   │ • Expenses  │ │ • Blogs     │ │ • Schedule  │ │ • Guides    │          │
│   │ • Investing │ │ • AI News   │ │ • Analytics │ │ • Prompts   │          │
│   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘          │
│          │               │               │               │                  │
│   ┌─────────────┐        └───────────────┴───────────────┘                  │
│   │Relationships│                        │                                  │
│   │   Manager   │        ┌───────────────┴───────────────┐                  │
│   │             │        │       SHARED SERVICES         │                  │
│   │ • Contacts  │        │  Auth │ Storage │ AI │ Search │                  │
│   │ • Follow-up │        └───────────────┬───────────────┘                  │
│   │ • Network   │                        │                                  │
│   └─────────────┘        ┌───────────────┴───────────────┐                  │
│                          │       SUPABASE LAYER          │                  │
│                          │  PostgreSQL │ Storage │ Edge  │                  │
│                          └───────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Project Structure

```
lauf-os/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration history
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth routes (public)
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/          # Dashboard routes (protected)
│   │   │   ├── command/          # Command Center
│   │   │   ├── clients/          # Client CRM
│   │   │   ├── library/          # Creative Library
│   │   │   ├── health/           # Health Tracker
│   │   │   ├── finances/         # Financial Tracker
│   │   │   ├── intel/            # Intel Feed
│   │   │   ├── social/           # Social Manager
│   │   │   ├── ai-hub/           # AI Hub
│   │   │   ├── relationships/    # Relationships
│   │   │   └── settings/         # User settings
│   │   │
│   │   └── api/                  # API Routes
│   │       ├── clients/
│   │       ├── projects/
│   │       ├── tasks/
│   │       ├── tweets/           # Tweet drafts
│   │       ├── assets/
│   │       ├── library/
│   │       └── ai/
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layouts/              # Layout components
│   │   ├── modules/              # Module-specific components
│   │   │   ├── command/
│   │   │   ├── clients/
│   │   │   ├── library/
│   │   │   └── ...
│   │   └── shared/               # Shared components
│   │
│   ├── lib/
│   │   ├── supabase/             # Supabase client
│   │   ├── prisma/               # Prisma client
│   │   ├── ai/                   # AI integrations
│   │   ├── utils/                # Utilities
│   │   └── validations/          # Zod schemas
│   │
│   ├── hooks/                    # Custom React hooks
│   ├── stores/                   # Zustand stores
│   ├── types/                    # TypeScript types
│   └── styles/                   # Global styles
│
├── supabase/
│   ├── functions/                # Edge functions
│   └── migrations/               # Supabase migrations
│
├── CLAUDE.md                     # Claude Code context
├── SPEC.md                       # This file
└── package.json
```

## 3.3 Data Flow Patterns

### Client-Side Data Fetching (React Query)

```typescript
// hooks/use-clients.ts
export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await fetch("/api/clients");
      return res.json();
    },
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClientInput) => {
      const res = await fetch("/api/clients", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
```

### Server-Side Data Flow

```
Request → API Route → Validate (Zod) → Prisma Query → Response
```

---

# 4. Database Schema

## 4.1 Schema Overview

```
User (1) ─────< (many) Client ─────< (many) Project
  │                │                    │
  │                ▼                    ▼
  │              Asset ◄──────────── Asset
  │
  ├─────< Task
  ├─────< LibraryItem ─────< Asset
  ├─────< Workout
  ├─────< DailyCheckIn
  ├─────< Transaction
  ├─────< Contact
  ├─────< SocialPost
  ├─────< TweetDraft
  ├─────< FeedSource ─────< FeedItem
  ├─────< AITool
  ├─────< Opportunity
  └─────< Goal
```

## 4.2 Core Entities

### User

| Field         | Type     | Description   |
| ------------- | -------- | ------------- |
| `id`          | UUID     | Primary key   |
| `email`       | String   | Unique email  |
| `name`        | String?  | Display name  |
| `avatar_url`  | String?  | Profile image |
| `preferences` | JSON     | Settings      |
| `timezone`    | String   | User timezone |
| `created_at`  | DateTime | Created       |

### Client

| Field              | Type      | Description                        |
| ------------------ | --------- | ---------------------------------- |
| `id`               | UUID      | Primary key                        |
| `user_id`          | UUID      | Owner                              |
| `name`             | String    | Client name                        |
| `email`            | String?   | Contact email                      |
| `phone`            | String?   | Phone                              |
| `company`          | String?   | Company name                       |
| `industry`         | String?   | Industry                           |
| `website_url`      | String?   | Website                            |
| `github_url`       | String?   | Repo link                          |
| `vercel_url`       | String?   | Deploy URL                         |
| `figma_url`        | String?   | Figma link                         |
| `credentials`      | String?   | Encrypted passwords                |
| `status`           | Enum      | ACTIVE, PAUSED, COMPLETED, CHURNED |
| `health_score`     | Enum      | GREEN, YELLOW, RED                 |
| `contract_value`   | Decimal?  | Total value                        |
| `monthly_retainer` | Decimal?  | Retainer                           |
| `payment_status`   | Enum      | CURRENT, PENDING, OVERDUE          |
| `last_contacted`   | DateTime? | Last contact                       |
| `next_followup`    | DateTime? | Next follow-up                     |
| `referred_by`      | String?   | Referral source                    |
| `notes`            | Text?     | Notes                              |
| `metadata`         | JSON      | Extra data                         |

### Project

| Field            | Type      | Description                                     |
| ---------------- | --------- | ----------------------------------------------- |
| `id`             | UUID      | Primary key                                     |
| `client_id`      | UUID      | Parent client                                   |
| `name`           | String    | Project name                                    |
| `description`    | Text?     | Description                                     |
| `type`           | Enum      | WEBSITE, WEBAPP, MOBILE, BRANDING, OTHER        |
| `status`         | Enum      | PLANNING, DESIGN, DEVELOPMENT, REVIEW, LAUNCHED |
| `priority`       | Enum      | LOW, MEDIUM, HIGH, URGENT                       |
| `start_date`     | DateTime? | Start                                           |
| `due_date`       | DateTime? | Due                                             |
| `budget`         | Decimal?  | Budget                                          |
| `paid_amount`    | Decimal   | Paid                                            |
| `repository_url` | String?   | GitHub                                          |
| `staging_url`    | String?   | Staging                                         |
| `production_url` | String?   | Production                                      |

### Task

| Field                | Type      | Description                                                      |
| -------------------- | --------- | ---------------------------------------------------------------- |
| `id`                 | UUID      | Primary key                                                      |
| `user_id`            | UUID      | Owner                                                            |
| `project_id`         | UUID?     | Optional project                                                 |
| `title`              | String    | Task title                                                       |
| `description`        | Text?     | Details                                                          |
| `category`           | Enum      | DESIGN, CODE, CLIENT, LEARNING, FITNESS, ADMIN, SAAS, NETWORKING |
| `priority`           | Enum      | LOW, MEDIUM, HIGH, URGENT                                        |
| `status`             | Enum      | TODO, IN_PROGRESS, BLOCKED, DONE                                 |
| `goal_id`            | UUID?     | Optional goal (auto-increments on completion, decrements on revert) |
| `scheduled_date`     | Date?     | When scheduled                                                   |
| `scheduled_time`     | String?   | Time slot                                                        |
| `time_block_minutes` | Int       | Duration (default 90)                                            |
| `energy_level`       | Enum      | DEEP_WORK, MODERATE, LIGHT                                       |
| `linked_assets`      | UUID[]    | Related assets                                                   |
| `completed_at`       | DateTime? | Completed                                                        |

### LibraryItem

| Field          | Type     | Description                                      |
| -------------- | -------- | ------------------------------------------------ |
| `id`           | UUID     | Primary key                                      |
| `user_id`      | UUID     | Owner                                            |
| `type`         | Enum     | INSPIRATION, TEMPLATE, AI_IMAGE, COMPONENT, IDEA |
| `title`        | String   | Title                                            |
| `description`  | Text?    | Description                                      |
| `source_url`   | String?  | Original source                                  |
| `figma_url`    | String?  | Figma link                                       |
| `github_url`   | String?  | GitHub link                                      |
| `prompt`       | Text?    | AI prompt                                        |
| `ai_tool`      | String?  | midjourney, nanobanana                           |
| `tech_stack`   | String[] | Technologies                                     |
| `tags`         | String[] | Tags                                             |
| `is_showcased` | Boolean  | Portfolio item                                   |
| `is_for_sale`  | Boolean  | For sale                                         |
| `price`        | Decimal? | Price                                            |

### Asset

| Field             | Type     | Description                                 |
| ----------------- | -------- | ------------------------------------------- |
| `id`              | UUID     | Primary key                                 |
| `user_id`         | UUID     | Owner                                       |
| `project_id`      | UUID?    | Optional project                            |
| `client_id`       | UUID?    | Optional client                             |
| `library_item_id` | UUID?    | Optional library item                       |
| `type`            | Enum     | IMAGE, VIDEO, DOCUMENT, CODE, DESIGN, OTHER |
| `category`        | String   | screenshot, mockup, etc.                    |
| `name`            | String   | File name                                   |
| `storage_path`    | String   | Storage path                                |
| `url`             | String   | Public URL                                  |
| `thumbnail_url`   | String?  | Thumbnail                                   |
| `file_size`       | Int      | Bytes                                       |
| `mime_type`       | String   | MIME type                                   |
| `tags`            | String[] | Tags                                        |

## 4.3 Enums & Types

```typescript
// Client Status
enum ClientStatus {
  ACTIVE      // Currently working together
  PAUSED      // On hold
  COMPLETED   // Project finished
  CHURNED     // Lost client
}

// Health Score
enum HealthScore {
  GREEN       // All good
  YELLOW      // Some concerns
  RED         // At risk
}

// Project Status
enum ProjectStatus {
  PLANNING
  DESIGN
  DEVELOPMENT
  REVIEW
  LAUNCHED
}

// Task Category
enum TaskCategory {
  DESIGN
  CODE
  CLIENT
  LEARNING
  FITNESS
  ADMIN
  SAAS
  NETWORKING
}

// Task Status
enum TaskStatus {
  TODO
  IN_PROGRESS
  BLOCKED
  DONE
}

// Energy Level
enum EnergyLevel {
  DEEP_WORK
  MODERATE
  LIGHT
}

// Library Item Type
enum LibraryItemType {
  INSPIRATION
  TEMPLATE
  AI_IMAGE
  COMPONENT
  IDEA
}

// Tweet Draft Status
enum TweetDraftStatus {
  DRAFT       // Work in progress
  READY       // Ready to post
  POSTED      // Published
  ARCHIVED    // Shelved
}
```

---

# 5. Module Specifications

## 5.1 Command Center (Day Builder)

> _"Not a task manager. A Day Builder. Select from your activity catalog, build 90-min blocks, execute, and compound into monthly goals."_

### Core Philosophy

1. **Day Builder, not task manager**: Select from a curated activity catalog to build your day
2. **Work in 90-minute blocks**: Deep work requires uninterrupted focus
3. **Activity Catalog**: Everything you do is a reusable activity (design, code, tweet, fitness)
4. **Goal-linked execution**: Every completed block auto-increments monthly goal progress
5. **Energy mapping**: Match task energy to your natural patterns
6. **Compound progress**: Daily → weekly → monthly progress builds over time

### The Day Builder Flow

1. Set **monthly goals** ("Complete 3 client projects", "Post 30 tweets", "Work out 20x")
2. Build an **Activity Catalog** of everything you do
3. Each morning: **select activities** from the catalog to fill your day's 90-min blocks
4. **Execute blocks.** Completing them auto-increments linked goal progress.
5. Stats update in real-time. The system grows with you.

### Features

| Feature                | Description                                                   | Status |
| ---------------------- | ------------------------------------------------------------- | ------ |
| **Day Builder**        | Dashboard with timeline + goals + activity catalog            | Done   |
| **Activity Catalog**   | Grid of reusable activities to build your day from            | Done   |
| **Daily Timeline**     | Hour-by-hour view with 90-min blocks, color-coded by category | Done   |
| **Goals Panel**        | Monthly goals with auto-incrementing progress + toggle        | Done   |
| **Quick-Add from Activity** | Click activity → pre-filled dialog → block created       | Done   |
| **Goal Linking**       | Link blocks to goals for auto-progress tracking               | Done   |
| **Stats Cards**        | Real-time blocks completed, goal progress, activity count     | Done   |
| **Tasks Page**         | Full task queue with status tabs, category filter, search     | Done   |
| **Goals Page**         | Goal management with type filters, stats, completion toggle   | Done   |
| **Calendar Week View** | 7-day grid with tasks in time slots, week navigation          | Done   |
| **Drag-and-Drop**      | Drag activities from sidebar catalog onto empty timeline slots | Done   |
| **CommandSidebar**     | Tabbed sidebar with Goals + Activities tabs                   | Done   |
| **TaskForm Catalog Mode** | "From Catalog" / "Manual" tabs for quick activity picking  | Done   |
| **Task Backlog**       | Draggable unscheduled tasks for scheduling onto timeline      | Done   |
| **Calendar Redesign**  | Continuous timeline (6 AM–11 PM) with proportional positioning | Done   |
| **Multi-Task Slots**   | Multiple tasks per slot displayed as compact horizontal labels | Done   |
| **Context Preloader**  | Linked assets and project info per task                       | Planned |
| **Prep Mode**          | AI suggests tomorrow's schedule                               | Planned |
| **Weekly Review**      | What got done, what worked, next week planning                | Planned |

### UI Components

- `DailyTimeline` - Main timeline view with time slots + droppable empty slots (`@dnd-kit/core`), supports multiple tasks per slot
- `TimeBlock` - 90-min block card with play/complete/pause actions; supports `compact` mode for multi-task slots
- `TaskCard` - Task in queue with category badge, priority, energy level
- `TaskForm` - Create/edit task with "from activity" mode, "From Catalog" / "Manual" tabs, goal linking
- `ActivityCatalog` - Activity picker grid with draggable cards (`useDraggable`)
- ~~`ActivityForm`~~ - Removed (activities are now fixed presets, not user-editable)
- `CommandSidebar` - Tabbed sidebar (Goals / Activities tabs) for Day Builder
- `GoalsPanel` - Goals sidebar with progress tracking + clickable completion toggle
- `GoalCard` - Goal card with progress bar, increment/decrement buttons, edit/delete menu, on-track indicator, breakdown chips
- `GoalProgressBar` - Visual progress bar with expected-by-now marker, color-coded (green/amber/red)
- `GoalFormDialog` - Create goals of any type (Daily/Weekly/Monthly/Yearly) with type picker, startDate/dueDate fields
- `TaskBacklog` - Draggable unscheduled task cards for Day Builder (`useDraggable`)
- `CalendarPage` - Continuous timeline week view (6 AM–11 PM) with proportional task positioning
- `ConfirmDeleteDialog` - Reusable delete confirmation (AlertDialog wrapper)
- `PrepMode` - AI suggestions (planned)

### AI Integration

| Tier | Feature                | Phase   |
| ---- | ---------------------- | ------- |
| 1    | Task categorization    | Phase 1 |
| 2    | Scheduling suggestions | Phase 3 |
| 3    | Daily briefing         | Phase 5 |

---

## 5.2 Client CRM

> _"Complete client relationship management with project tracking and opportunity discovery."_

### Core Philosophy

1. **Single source of truth**: Everything about a client in one place
2. **Health visibility**: Instantly see which clients need attention
3. **Proactive opportunities**: AI surfaces ways to add value

### Features

| Feature                 | Description                                                | Status  |
| ----------------------- | ---------------------------------------------------------- | ------- |
| **Client Directory**    | Cards with health score, status, search, filter            | Done    |
| **Client Create**       | Full form with all fields, redirect on success             | Done    |
| **Client Detail**       | Overview, contact info, linked projects, delete            | Done    |
| **Project Pipeline**    | Kanban board (Planning → Design → Dev → Review → Launched) | Done    |
| **Project Detail**      | Overview, links, tasks list, delete                        | Done    |
| **Asset Vault**         | All files organized by type                                | Planned |
| **Credential Vault**    | Encrypted password storage                                 | Planned |
| **Opportunity Tracker** | AI-generated and manual opportunities                      | Planned |
| **Health Score**        | Auto-calculated based on payment, communication, status    | Planned |

### Health Score System

**Factors:**

- Payment status: 40%
- Communication frequency: 30%
- Project status: 20%
- Contract renewal: 10%

**Thresholds:**

- GREEN: ≥ 80
- YELLOW: 50-79
- RED: < 50

### UI Components

- `ClientCard` - Client card in directory grid with health badge, status, contact info
- `ClientForm` - Create client (full form: name, company, email, phone, industry, URLs, financials, notes)
- `ClientDetail` - Full client view with overview, contact, and linked projects
- `ProjectKanban` - Pipeline board with drag-to-move between status columns
- `HealthScoreBadge` - Visual GREEN/YELLOW/RED indicator
- `AssetGrid` - Asset gallery (planned)
- `CredentialVault` - Password manager (planned)
- `OpportunityCard` - Opportunity item (planned)

### AI Integration

| Tier | Feature                 | Phase   |
| ---- | ----------------------- | ------- |
| 1    | Health score calc       | Phase 1 |
| 2    | Follow-up reminders     | Phase 1 |
| 3    | Opportunity suggestions | Phase 3 |
| 4    | Auto-draft emails       | Phase 5 |

---

## 5.3 Creative Library

> _"Your personal design system, template library, and inspiration vault."_

### Core Philosophy

1. **Collect inspiration**: Save what inspires you
2. **Build reusable templates**: Every project creates reusable pieces
3. **Track AI generations**: Organize with prompts
4. **Showcase progress**: Visual compounding chart

### Features

| Feature                | Description                         |
| ---------------------- | ----------------------------------- |
| **Inspiration Board**  | Save websites with screenshots      |
| **Template Library**   | Figma designs, code templates       |
| **AI Image Vault**     | Midjourney, NanoBanana with prompts |
| **Component Library**  | Reusable code snippets              |
| **Idea Backlog**       | Future project ideas                |
| **Progress Dashboard** | Compounding chart                   |
| **Tagging System**     | Multi-tag with filtering            |
| **Remix Feature**      | Create variations                   |

### UI Components

- `InspirationCard` - Saved website
- `TemplateCard` - Template preview
- `AIImageCard` - AI image with prompt
- `IdeaCard` - Idea in backlog
- `LibraryGrid` - Masonry grid
- `TagFilter` - Tag filtering
- `ProgressChart` - Compounding viz

---

## 5.4 Health Tracker

> _"Physical and mental wellness tracking with accountability features."_

### Features

| Feature               | Description                         |
| --------------------- | ----------------------------------- |
| **Workout Logger**    | Log exercises, sets, reps, duration |
| **Exercise Library**  | Curated guides and videos           |
| **Nutrition Tracker** | Meal logging, recipes               |
| **Sobriety Counter**  | Day counter with milestones         |
| **Daily Check-ins**   | Mood, energy, sleep, stress         |
| **Motivation Hub**    | Quotes, videos, wins                |

### UI Components

- `WorkoutLogger` - Log form
- `ExerciseCard` - Exercise item
- `SobrietyCounter` - Big counter
- `MoodCheckin` - Check-in form
- `MotivationCard` - Quote/video

---

## 5.5 Financial Tracker

> _"Track income, expenses, and investment learning."_

### Features

| Feature                | Description                     |
| ---------------------- | ------------------------------- |
| **Income Dashboard**   | Revenue by client/project/month |
| **Expense Tracking**   | Categorized expenses            |
| **Investment Tracker** | Portfolio tracking (manual)     |
| **Financial Goals**    | Savings and revenue targets     |

### UI Components

- `IncomeChart` - Revenue viz
- `ExpenseList` - Expense list
- `TransactionForm` - Add transaction
- `GoalProgress` - Goal card

---

## 5.6 Intel Feed

> _"Curated news and insights from sources that matter."_

### Features

| Feature               | Description                                 |
| --------------------- | ------------------------------------------- |
| **Feed Categories**   | Business, Design, Dev, AI, Startups, Reddit |
| **Source Management** | Add/remove RSS feeds                        |
| **Feed View**         | Card and list views                         |
| **Save for Later**    | Bookmark articles                           |
| **Daily Digest**      | AI-summarized top stories                   |

### UI Components

- `FeedCard` - Article card
- `SourceManager` - Manage sources
- `CategoryTabs` - Category nav
- `DailyDigest` - AI summary

---

## 5.7 Social Media Manager

> _"Gather all your work and share it on X with scheduling and analytics."_

### Features

| Feature               | Description                                                | Status  |
| --------------------- | ---------------------------------------------------------- | ------- |
| **Tweet Drafts**      | Draft, edit, and manage tweets with 280-char enforcement   | Done    |
| **Draft Status Flow** | DRAFT → READY → POSTED / ARCHIVED status management       | Done    |
| **Thread Support**    | tweetNumber/totalTweets for multi-tweet threads            | Done    |
| **Tag System**        | Organize drafts with tags, filter by tag                   | Done    |
| **Stats Dashboard**   | Total drafts, ready count, posted count                    | Done    |
| **Detail View**       | Full draft view with character count, status actions       | Done    |
| **Content Queue**     | Draft posts, library integration                           | Planned |
| **Scheduling**        | Calendar view, optimal times                               | Planned |
| **Publishing**        | X/Twitter API integration                                  | Planned |
| **Analytics**         | Engagement, growth tracking                                | Planned |
| **Favorite Accounts** | Track accounts for inspiration                             | Planned |

### UI Components

- `TweetDraftCard` - Draft card with status badge, content preview, character count, tags, dropdown actions
- `TweetDraftForm` - Create/edit dialog with character counter (280 limit), status toggle (Draft/Ready), TagInput
- `TweetGrid` - Responsive 1-2-3 column grid for draft cards
- `PostComposer` - Full post composer (planned)
- `QueueList` - Scheduled posts (planned)
- `AnalyticsChart` - Engagement viz (planned)
- `AccountCard` - Tracked account (planned)

---

## 5.8 AI Hub

> _"Central management for all your AI subscriptions and tools."_

### AI Subscription Inventory

| Tool                 | Best For                  | Priority  |
| -------------------- | ------------------------- | --------- |
| Claude / Claude Code | Complex reasoning, coding | Primary   |
| ChatGPT / Codex      | Quick queries             | Secondary |
| Perplexity           | Research, citations       | High      |
| Google Gemini        | Multimodal                | Medium    |
| Grok AI              | X/Twitter, real-time      | Medium    |
| Midjourney           | Image generation          | High      |
| NanoBanana           | Image generation          | High      |
| Zapier               | Automation                | High      |
| Claude Cowork        | Desktop automation        | Medium    |
| X Pro Plan           | API access                | High      |

### Features

| Feature                | Description                 |
| ---------------------- | --------------------------- |
| **Tool Directory**     | All tools with status, cost |
| **When-to-Use Guides** | Decision tree               |
| **Prompt Library**     | Saved prompts               |
| **Cheat Sheets**       | Tips per tool               |
| **Project Ideas**      | AI-generated ideas          |

### UI Components

- `ToolCard` - AI tool overview
- `CheatSheet` - Tips view
- `PromptLibrary` - Saved prompts
- `UsageTracker` - Cost tracking

---

## 5.9 Relationships

> _"Track people, conversations, and networking opportunities."_

### Features

| Feature                   | Description           |
| ------------------------- | --------------------- |
| **Contact Directory**     | People with context   |
| **Contact Detail**        | Full profile, history |
| **Follow-up Queue**       | Due follow-ups        |
| **Network Visualization** | Visual network map    |
| **Interaction Logging**   | Log conversations     |

### UI Components

- `ContactCard` - Contact summary
- `ContactForm` - Create/edit
- `FollowUpQueue` - Due list
- `NetworkGraph` - Visual map

---

# 6. AI Integration Strategy

## 6.1 AI Subscription Inventory

| Tool           | Provider   | Monthly Cost | Primary Use                |
| -------------- | ---------- | ------------ | -------------------------- |
| Claude Pro     | Anthropic  | ~$20         | Reasoning, coding, writing |
| Claude Code    | Anthropic  | Included     | Development workflow       |
| ChatGPT Plus   | OpenAI     | ~$20         | Alternative perspective    |
| Perplexity Pro | Perplexity | ~$20         | Research, citations        |
| Google Gemini  | Google     | ~$20         | Multimodal                 |
| Grok           | X/Twitter  | ~$8          | Real-time, X integration   |
| Midjourney     | Midjourney | ~$30         | Image generation           |
| NanoBanana     | NanoBanana | ~$15         | Image generation           |
| Zapier         | Zapier     | ~$50         | Automation                 |
| X Pro          | Twitter    | ~$8          | API access                 |

**Total Monthly:** ~$191

## 6.2 Integration Tiers

| Tier       | Description              | When      |
| ---------- | ------------------------ | --------- |
| **Tier 1** | Rule-based (no AI calls) | Phase 1-2 |
| **Tier 2** | Basic AI (simple calls)  | Phase 2-3 |
| **Tier 3** | Advanced AI (multi-step) | Phase 3-4 |
| **Tier 4** | Full automation          | Phase 5+  |
| **Tier 5** | Agentic (future)         | Future    |

## 6.3 AI Use Cases by Module

### Command Center

- Task categorization (Tier 1)
- Scheduling suggestions (Tier 2)
- Daily briefing (Tier 3)

### Client CRM

- Health score (Tier 1)
- Follow-up reminders (Tier 1)
- Opportunity generation (Tier 2)
- Email drafts (Tier 4)

### Library

- Tag suggestions (Tier 2)
- Similar discovery (Tier 3)

### Intel Feed

- Article summarization (Tier 2)
- Daily digest (Tier 3)

### Social

- Hashtag suggestions (Tier 2)
- Caption generation (Tier 3)

## 6.4 Automation Workflows (Zapier)

| Trigger          | Action                 |
| ---------------- | ---------------------- |
| New client added | Create Notion page     |
| Task completed   | Log to Sheets          |
| Invoice paid     | Update client status   |
| Weekly           | Generate opportunities |

---

# 7. Development Roadmap

## 7.1 Phase Overview

| Phase | Focus                     | Duration  | Key Deliverables                        |
| ----- | ------------------------- | --------- | --------------------------------------- |
| 1     | Foundation + Daily Driver | 2-3 weeks | Auth, DB, Command Center, Basic Clients |
| 2     | Asset Management          | 2-3 weeks | Library, Asset uploads                  |
| 3     | Intelligence Layer        | 2 weeks   | Intel Feed, AI Hub                      |
| 4     | Life Management           | 2 weeks   | Health, Finances                        |
| 5     | Growth & Automation       | 3-4 weeks | Social, Relationships, Advanced AI      |

**Total:** 11-14 weeks

## 7.2 Phase 1: Foundation + Daily Driver

**Goal:** Build core architecture and get Command Center working for daily use.

### Week 1: Project Setup

- [x] Initialize Next.js with TypeScript
- [x] Configure Tailwind + shadcn/ui
- [x] Set up Supabase (Auth, DB, Storage)
- [x] Configure Prisma with full schema
- [ ] Run initial migration (waiting for credentials)
- [x] Implement auth flow

### Week 2: Dashboard Foundation

- [x] Build dashboard layout with sidebar
- [x] Create navigation
- [x] Build shared UI components
- [x] Set up Zustand stores
- [x] Configure React Query

### Week 3: Command Center + Basic Clients

- [x] Command Center: Daily timeline + Day Builder dashboard
- [x] Command Center: Task CRUD (API + hooks + UI)
- [x] Command Center: Time blocks
- [x] Command Center: Activity Catalog + goal linking
- [x] Command Center: Tasks page (status/category filters, search, create dialog)
- [x] Command Center: Goals page (type filters, stats, completion toggle, create dialog)
- [x] Command Center: Calendar week view (date-range filtering, task rendering, navigation)
- [x] Command Center: GoalsPanel toggle on dashboard
- [x] Client CRM: Client list with health stats, search, status filters
- [x] Client CRM: Client create form with all fields
- [x] Client CRM: Client detail page with overview, contact, projects
- [x] Client CRM: Project Kanban board with real data + status changes
- [x] Client CRM: Project detail page with overview, links, tasks
- [x] Client CRM: React Query hooks (use-clients, use-projects)
- [x] Client CRM: Individual API routes (/api/clients/[id], /api/projects/[id])

### Phase 1.5: Critical Fixes + Modular Hardening

- [x] Fix GoalsPanel dashboard tabs (fetch all incomplete goals, not just monthly)
- [x] GoalFormDialog supports Daily/Weekly/Monthly type selection
- [x] Fix timezone bug in task date filtering (date range instead of exact match)
- [x] Fix useAuth infinite re-render (useMemo for stable Supabase client)
- [x] Fix form close timing (dialog closes on mutation success, not on submit)
- [x] Wire TimeBlock delete button + remove dead Reschedule item
- [x] Remove dead ClientCard buttons (Add Project, Log Contact)
- [x] Wire ProjectKanban edit button to project detail navigation
- [x] Add Sonner toast notifications to root layout
- [x] Add toast success/error to all mutation callsites
- [x] Add delete confirmation dialogs (AlertDialog) for clients + projects
- [x] Create reusable ConfirmDeleteDialog shared component
- [x] Fix cross-model cache invalidation (delete task → goals/activities, delete client → projects, etc.)

## 7.3 Phase 2: Creative Library + Day Builder UX Overhaul

### Creative Library (Complete)
- [x] Zod validation schemas (`library.schema.ts`)
- [x] API routes: `/api/library` (GET, POST) + `/api/library/[id]` (GET, PATCH, DELETE)
- [x] React Query hooks (`use-library.ts`): useLibrary, useLibraryItem, CRUD mutations
- [x] Library type config with colors, icons, labels per type
- [x] Components: LibraryItemCard, LibraryGrid, LibraryItemForm, TagInput
- [x] Library list page with stats, debounced search, type filter tabs
- [x] Library detail page with type-specific fields, external links, edit/delete
- [x] Navigation: Library moved from Coming Soon to "Creative" nav group

### Day Builder UX Overhaul (Complete)
- [x] `@dnd-kit/core` for drag-and-drop (draggable activities, droppable timeline slots)
- [x] CommandSidebar: tabbed sidebar with Goals + Activities tabs
- [x] DragOverlay for visual drag feedback
- [x] TaskForm "From Catalog" / "Manual" two-tab mode
- [x] Fixed timezone bug in Prisma `@db.Date` calendar date parsing
- [x] `ensureUser` helper for API routes

### Remaining
- [ ] Configure Supabase Storage
- [ ] Build file upload system
- [ ] Client assets integration

## 7.4 Phase 3: Intelligence Layer

- [ ] RSS feed aggregation
- [ ] Intel Feed views
- [ ] AI Hub: Tool directory
- [ ] AI Hub: Cheat sheets
- [ ] Basic Claude API integration

## 7.5 Phase 4: Life Management

- [ ] Health: Workout logger
- [ ] Health: Sobriety counter
- [ ] Health: Daily check-ins
- [ ] Finances: Income dashboard
- [ ] Finances: Expense tracking

## 7.5.1 Tweet Drafts Module (Social Manager Early Start) (Complete)

- [x] `TweetDraft` Prisma model + `TweetDraftStatus` enum
- [x] Zod validation schemas with 280 char limit + thread support
- [x] API routes: `/api/tweets` (GET, POST) + `/api/tweets/[id]` (GET, PATCH, DELETE)
- [x] React Query hooks (`use-tweet-drafts.ts`): query + CRUD mutations
- [x] Components: TweetDraftCard, TweetDraftForm, TweetGrid
- [x] Social list page with stats, search, status filters
- [x] Social detail page with status actions, edit/delete
- [x] Navigation updated with Social section
- [x] TaskBacklog component (draggable unscheduled tasks)
- [x] Calendar page redesign (continuous 6 AM–11 PM timeline)
- [x] New shadcn/ui components: Command, Popover, Select

## 7.6 Phase 5: Growth & Automation

- [x] Social: Tweet draft management (CRUD, status flow, tags, character counting)
- [ ] Social: X API integration for publishing
- [ ] Social: Tweet scheduling with calendar view
- [ ] Social: Analytics dashboard
- [ ] Relationships: Contact management
- [ ] Advanced AI integrations
- [ ] Zapier workflows

---

# 8. Claude Code & MCP Integration

## 8.1 Recommended MCPs

| MCP                          | Purpose             |
| ---------------------------- | ------------------- |
| `@anthropics/mcp-postgres`   | Database queries    |
| `@anthropics/mcp-filesystem` | File operations     |
| `@anthropics/mcp-git`        | Git operations      |
| `mcp-server-fetch`           | Web fetching        |
| `supabase-mcp`               | Supabase operations |

## 8.2 Claude Code Workflow

1. **Initialize:** Scaffold Next.js project
2. **Schema First:** Define Prisma schema
3. **Generate Migrations:** Run migrations
4. **Component Building:** Build UI components
5. **API Routes:** Create API routes
6. **Testing:** Write tests

## 8.3 CLAUDE.md Configuration

```markdown
# LAUF OS - Personal Operating System

## Tech Stack

- Next.js 14+, TypeScript, Tailwind, shadcn/ui
- Zustand + React Query
- Supabase + Prisma + PostgreSQL

## Modules

1. Command Center
2. Client CRM
3. Creative Library
4. Health Tracker
5. Financial Tracker
6. Intel Feed
7. Social Manager
8. AI Hub
9. Relationships

## Current Phase

Phase 1: Foundation + Daily Driver
```

---

# 9. UI/UX Guidelines

## 9.1 Design Principles

1. Clarity over cleverness
2. Information density without overwhelm
3. Consistent patterns
4. Visual hierarchy
5. Responsive design
6. Dark mode support

## 9.2 Color System

### Category Colors

| Category   | Color  | Hex       |
| ---------- | ------ | --------- |
| Design     | Purple | `#8b5cf6` |
| Code       | Blue   | `#3b82f6` |
| Client     | Green  | `#22c55e` |
| Learning   | Orange | `#f97316` |
| Fitness    | Red    | `#ef4444` |
| Admin      | Gray   | `#6b7280` |
| SaaS       | Cyan   | `#06b6d4` |
| Networking | Pink   | `#ec4899` |

### Status Colors

| Status         | Hex       |
| -------------- | --------- |
| Success/Green  | `#22c55e` |
| Warning/Yellow | `#eab308` |
| Error/Red      | `#ef4444` |
| Info/Blue      | `#3b82f6` |

## 9.3 Typography

```css
--font-sans: "Inter", -apple-system, sans-serif;
--font-mono: "JetBrains Mono", monospace;
```

| Name  | Size | Usage           |
| ----- | ---- | --------------- |
| H1    | 36px | Page titles     |
| H2    | 24px | Section headers |
| H3    | 20px | Card headers    |
| Body  | 14px | Body text       |
| Small | 12px | Secondary text  |

---

# 10. Future Enhancements

## 10.1 Post-Launch Features

| Feature                   | Priority |
| ------------------------- | -------- |
| Mobile App (React Native) | High     |
| Browser Extension         | High     |
| Email Integration         | Medium   |
| Calendar Sync             | Medium   |
| Voice Commands            | Medium   |
| Offline Mode (PWA)        | Low      |

## 10.2 Mobile App

Key features:

- Quick task capture
- Today's schedule
- Client lookup
- Check-in logging
- Push notifications

## 10.3 Browser Extension

Key features:

- Save page as inspiration
- Quick task creation
- Quick idea capture

---

# 11. Getting Started

## 11.1 Prerequisites

- Node.js 18+
- pnpm (recommended)
- Supabase account
- Vercel account
- Claude Code (optional)

## 11.2 Initial Setup

```bash
# Create project
npx create-next-app@latest lauf-os --typescript --tailwind --eslint --app --src-dir

cd lauf-os

# Install dependencies
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add @prisma/client prisma
pnpm add zustand @tanstack/react-query
pnpm add zod react-hook-form @hookform/resolvers
pnpm add date-fns lucide-react

# Initialize Prisma
npx prisma init

# Install shadcn/ui
npx shadcn@latest init

# Add components
npx shadcn@latest add button card input dialog dropdown-menu
npx shadcn@latest add select tabs avatar badge progress toast table
```

## 11.3 Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Database
DATABASE_URL=your_connection_string

# AI APIs
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
PERPLEXITY_API_KEY=your_key
```

## 11.4 Running Locally

```bash
# Start dev server
pnpm dev

# Prisma Studio
npx prisma studio

# Run migrations
npx prisma migrate dev

# Build
pnpm build
```

---

# 12. Appendices

## Appendix A: Complete Prisma Schema

See `/prisma/schema.prisma` for full schema with all models:

- User
- Client
- Project
- Asset
- Task
- Goal
- LibraryItem
- TweetDraft
- Workout
- DailyCheckIn
- Transaction
- Contact
- SocialPost
- FeedSource
- FeedItem
- AITool
- Opportunity

## Appendix B: API Routes

### Implemented

| Method              | Route                  | Description                                                        |
| ------------------- | ---------------------- | ------------------------------------------------------------------ |
| GET/POST            | `/api/tasks`           | List (filter: date, dateFrom/dateTo, status, category) / Create    |
| PATCH/DELETE         | `/api/tasks/[id]`      | Update/Delete task (auto-increments goal + activity on completion)  |
| GET/POST            | `/api/activities`      | List/Create activities                                             |
| PATCH/DELETE         | `/api/activities/[id]` | Update/Delete activity                                             |
| GET/POST            | `/api/goals`           | List (filter: type, completed, includeBreakdown) / Create          |
| PATCH/DELETE        | `/api/goals/[id]`      | Update (supports incrementValue, auto-complete) / Delete goal      |
| GET/POST            | `/api/clients`         | List (filter: status, healthScore, search) / Create                |
| GET/PATCH/DELETE     | `/api/clients/[id]`    | Get (with projects, opportunities) / Update / Delete               |
| GET/POST            | `/api/projects`        | List (filter: status, clientId) / Create                           |
| GET/PATCH/DELETE     | `/api/projects/[id]`   | Get (with client, tasks, assets) / Update / Delete                 |
| GET/POST            | `/api/library`         | List (filter: type, search) / Create                               |
| GET/PATCH/DELETE     | `/api/library/[id]`    | Get / Update / Delete library item                                 |
| GET/POST            | `/api/tweets`          | List (filter: status, search, tag) / Create tweet draft            |
| GET/PATCH/DELETE     | `/api/tweets/[id]`     | Get / Update / Delete tweet draft                                  |

### Planned

| Method         | Route                        | Description         |
| -------------- | ---------------------------- | ------------------- |
| POST           | `/api/assets/upload`         | Upload asset        |
| GET/POST       | `/api/health/workouts`       | Workouts            |
| POST           | `/api/health/checkins`       | Check-ins           |
| GET/POST       | `/api/finances/transactions` | Transactions        |
| GET            | `/api/intel/feed`            | Feed items          |
| GET/POST       | `/api/social/posts`          | Social posts        |
| GET/POST       | `/api/contacts`              | Contacts            |
| POST           | `/api/ai/suggest`            | AI suggestions      |

## Appendix C: Component Index

### Shared

- Button, Card, Dialog, DropdownMenu
- Input, Select, Table, Tabs, Toast
- StatusBadge, EmptyState, LoadingSpinner

### Command Center

- DailyTimeline (with droppable EmptySlot), TimeBlock, TaskCard, TaskForm (with catalog picker)
- ActivityCatalog (read-only, draggable preset cards), CommandSidebar
- GoalsPanel (with GoalsPanelContent), GoalFormDialog
- TaskBacklog (draggable unscheduled tasks)
- CalendarPage (continuous timeline), PrepMode (planned)

### Clients

- ClientCard, ClientForm, ClientDetail
- ProjectKanban, AssetGrid, CredentialVault
- HealthScoreBadge, OpportunityCard

### Library

- LibraryItemCard, LibraryGrid, LibraryItemForm, TagInput
- InspirationCard, TemplateCard, AIImageCard (planned)
- ProgressChart (planned)

### Health

- WorkoutLogger, SobrietyCounter, MoodCheckin

### Finances

- IncomeChart, ExpenseList, TransactionForm

### Intel

- FeedCard, SourceManager, DailyDigest

### Social

- TweetDraftCard, TweetDraftForm, TweetGrid
- PostComposer, QueueList, AnalyticsChart (planned)

### Relationships

- ContactCard, ContactForm, FollowUpQueue, NetworkGraph

---

# End of Specification

---

**Version:** 1.5
**Last Updated:** January 2026
**Status:** Phase 1 Complete, Phase 1.5 Hardening Complete, Phase 2 Creative Library + Day Builder UX Overhaul Complete, Tweet Drafts Module Complete, Activity Presets Complete, Goal Progress & Cascades Complete, Multi-Task Time Slots Complete

---

> _"Ready to build something fucking awesome."_
