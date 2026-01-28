# Future Features

> Module roadmap and feature backlog for LAUF OS

---

## The 9 Modules

LAUF OS is designed as a **Personal Operating System** with 9 core modules:

| Module | Phase | Description |
|--------|-------|-------------|
| **Command Center** | MVP | Daily timeline, 90-min blocks, goals |
| **Client CRM** | MVP | Client management, projects, health scores |
| **Library** | Phase 2 | Design inspiration, AI images, components |
| **Intel Feed** | Phase 3 | RSS feeds, saved articles |
| **AI Hub** | Phase 3 | AI tool subscriptions, cheat sheets |
| **Health** | Phase 4 | Workouts, check-ins, sobriety tracking |
| **Finances** | Phase 4 | Income/expenses, MRR tracking |
| **Social** | Phase 5 | X posting, scheduling, analytics |
| **Relationships** | Phase 5 | Contact management, follow-ups |

---

## Phase 2: Library Module (Complete)

**Status**: Implemented in v0.5.0

### Completed Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Library CRUD** | Full create/read/update/delete with Zod validation | Done |
| **Type Filtering** | Filter by Inspiration, Template, AI Image, Component, Idea | Done |
| **Search** | Debounced search across title and description | Done |
| **Detail Views** | Type-specific fields, external links, edit/delete | Done |
| **Tag System** | TagInput component with multi-tag support | Done |
| **Stats Cards** | Item counts per type on list page | Done |

### Remaining Library Work

| Feature | Description | Priority |
|---------|-------------|----------|
| **File Uploads** | Supabase Storage for images/screenshots | High |
| **Masonry Grid** | Pinterest-style layout for visual items | Medium |
| **Progress Dashboard** | Compounding chart of library growth | Low |

---

## Phase 3: Intel Feed & AI Hub

### Intel Feed

**Goal**: Curated news in one place

| Feature | Description | Priority |
|---------|-------------|----------|
| **RSS Feeds** | Subscribe to blogs, newsletters | High |
| **Article Summaries** | AI-powered summaries | High |
| **Save for Later** | Bookmark interesting items | Medium |
| **Categories** | AI, Design, Dev, Business | Medium |

#### Recommended Sources
- AI: OpenAI blog, Anthropic blog, The Rundown AI
- Design: Awwwards, Muzli, Dribbble
- Dev: Hacker News, Dev.to, Vercel blog
- Indie: Indie Hackers, X accounts

### AI Hub

**Goal**: Manage AI tool subscriptions

| Feature | Description | Priority |
|---------|-------------|----------|
| **Tool Inventory** | Track all AI subscriptions | High |
| **Monthly Costs** | Total AI spend tracking | High |
| **Cheat Sheets** | Best prompts per tool | Medium |
| **Best Use Cases** | What each tool excels at | Medium |

---

## Phase 4: Health & Finances

### Health Module

**Goal**: Track physical and mental wellness

| Feature | Description | Priority |
|---------|-------------|----------|
| **Workout Logging** | Exercises, sets, reps, weight | High |
| **Daily Check-ins** | Mood, energy, sleep, stress | High |
| **Sobriety Counter** | Days sober tracker | Medium |
| **Trends** | Weekly/monthly patterns | Medium |

### Finances Module

**Goal**: Simple income/expense tracking

| Feature | Description | Priority |
|---------|-------------|----------|
| **Income Tracking** | Client payments, salary | High |
| **Expense Tracking** | Subscriptions, tools, etc. | High |
| **MRR Dashboard** | Monthly recurring revenue | Medium |
| **Client Revenue** | Revenue per client | Medium |

---

## Phase 5: Social & Relationships

### Social Module

**Goal**: X (Twitter) management

**Status**: Tweet Drafts implemented in v0.6.0

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **Tweet Drafts** | Draft, edit, manage tweets with 280-char limit | High | Done |
| **Draft Status Flow** | DRAFT → READY → POSTED / ARCHIVED management | High | Done |
| **Thread Support** | tweetNumber/totalTweets for multi-tweet threads | High | Done |
| **Tag System** | Organize and filter drafts by tags | Medium | Done |
| **X API Publishing** | Publish tweets via X/Twitter API | High | Planned |
| **Scheduling** | Schedule posts for optimal times | High | Planned |
| **Analytics** | Track post performance | Medium | Planned |
| **Post Composer** | Rich post composer with previews | Medium | Planned |

### Relationships Module

**Goal**: Personal CRM for networking

| Feature | Description | Priority |
|---------|-------------|----------|
| **Contact Database** | Name, company, notes | High |
| **Follow-up Reminders** | "Reach out to X" | High |
| **Interaction Log** | Track conversations | Medium |
| **Categories** | Friends, mentors, colleagues | Medium |

---

## Future Ideas (Parking Lot)

### Integrations

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Zapier** | Auto-import bookmarks, articles | Medium |
| **Chrome Extension** | Quick capture while browsing | High |
| **Calendar Sync** | Google Calendar integration | Medium |

### Productivity

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Mobile App** | React Native for quick capture | High |
| **PWA Mode** | Installable web app | Low |
| **Keyboard Shortcuts** | Power user navigation | Low |
| **Voice Input** | Speech-to-text for tasks | Medium |

### AI Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Smart Suggestions** | AI-recommended tasks | Medium |
| **Auto-categorization** | Classify tasks automatically | Low |
| **Client Insights** | AI-generated opportunities | Medium |
| **Daily Briefing** | AI summary of the day | Medium |

---

## Prioritization Framework

### Priority Levels

| Level | Criteria |
|-------|----------|
| **P0 (Critical)** | Blocks daily usage, must have |
| **P1 (High)** | Significantly improves workflow |
| **P2 (Medium)** | Nice to have, clear value |
| **P3 (Low)** | Future consideration |

### Evaluation Criteria

1. **Daily Usage Impact** - Does it improve daily workflow?
2. **Time Saved** - Does it reduce manual work?
3. **Business Value** - Does it help manage clients/revenue?
4. **Build Complexity** - How long to implement?

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-26 | Pivot to Personal OS | Broader scope, more daily value |
| 2026-01-26 | Add Prisma ORM | Type-safe queries, schema as source of truth |
| 2026-01-26 | 90-minute blocks | Optimal deep work duration |
| 2026-01-26 | Client health scores | Quick visual status of relationships |
| 2026-01-27 | Sonner over shadcn toast | Direct import with `theme="dark"`, avoids next-themes dependency |
| 2026-01-27 | Parent-controlled dialog close | Forms don't close themselves; parent closes on mutation success for better UX |
| 2026-01-27 | Date range filter over exact match | Fixes timezone mismatch when filtering tasks by date |
| 2026-01-27 | Cross-model cache invalidation | Ensures UI consistency when deleting entities with relations |
| 2026-01-27 | @dnd-kit/core for drag-and-drop | Lightweight, only need core (no sortable). PointerSensor with distance:8 distinguishes click vs drag |
| 2026-01-27 | CommandSidebar tabbed panel | Combines Goals + Activities in one sidebar card, saves vertical space |
| 2026-01-27 | TaskForm two-tab mode | "From Catalog" / "Manual" tabs for quick activity picking vs manual entry |
| 2026-01-27 | parseCalendarDate() for Prisma @db.Date | Strips UTC timezone to prevent off-by-one day in US timezones |
| 2026-01-27 | ensureUser helper for API routes | Consistent user creation across all API routes, avoids duplication |
| 2026-01-27 | Tweet Drafts before full Social Manager | Start with draft management (most value, no API dependency), add X API later |
| 2026-01-27 | TweetDraft separate from SocialPost | SocialPost is for published posts with platform data; TweetDraft is for pre-publish workflow |
| 2026-01-27 | 280-char Zod validation | Enforce Twitter character limit at schema level, with visual warnings at 260+ |
| 2026-01-27 | Continuous calendar timeline | Proportional positioning (6 AM–11 PM) instead of discrete time slots for more accurate task visualization |
| 2026-01-28 | Goal cascades with pace tracking | computeBreakdown() utility computes expectedByNow based on startDate/dueDate, enables on-track/behind status |
| 2026-01-28 | Atomic goal increments via incrementValue | PATCH endpoint accepts incrementValue for safe concurrent updates instead of direct currentValue overwrites |
| 2026-01-28 | Library-goal linking | LibraryItem.goalId links items to goals, auto-increments progress — same pattern as task-goal linking |
| 2026-01-28 | Goal perspective views | Month/Week/Day perspectives group goals as primary/secondary for focused views instead of flat type tabs |

---

## Feature Requests Log

_Space to log feature requests as they come up_

| Date | Request | Source | Status |
|------|---------|--------|--------|
| - | - | - | - |

---

_Last updated: January 2026 (v0.8.0)_
