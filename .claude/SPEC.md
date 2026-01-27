# SPEC.md — Command Center

WE WILL CALL THIS LAUF OS

## Project Overview

### Vision

A personal command center for building in public. One app to manage content creation, learning, news curation, and growth tracking—purpose-built for a full-stack builder growing an audience on X.

### Why This Exists

You're a developer who designs AND builds. You're growing from 0 → 10k followers by posting redesigns, build progress, workflows, and insights. You need a single place where strategy meets execution—not 6 disconnected tools.

### Who It's For

**V1:** You. Only you. Built fast, opinionated, no compromises for other users.

**Future:** Potentially other indie hackers, full-stack builders, creators who build in public. But that's later.

### The Meta-Play

This app IS your first showcase project. Building it publicly generates content. Using it generates more content. The tool creates its own flywheel.

---

## Tool Arsenal (What We Can Tap Into)

| Tool                     | How We Might Use It                                         |
| ------------------------ | ----------------------------------------------------------- |
| **X Pro Plan**           | Full API access for posting, scheduling, analytics          |
| **Zapier**               | Automation glue—RSS to database, webhooks, notifications    |
| **Claude / Claude Code** | Build acceleration, content suggestions, summarization      |
| **ChatGPT / Codex**      | Alternative AI for variety, code generation                 |
| **Perplexity**           | Research assistant, deep dives on topics                    |
| **Google Gemini**        | Long context for article summarization, multimodal (images) |
| **Grok AI**              | X-native AI—potentially useful for X-specific insights      |
| **Midjourney**           | Generate hero images, thumbnails, visual content            |
| **Nano Banana**          | Image generation alternative                                |
| **Claude Cowork**        | Potential for automated workflows                           |

---

## Core Concepts

### The 4 Content Pillars

Every piece of content maps to one of these:

1. **Redesigns** — Before/after visual transformations
2. **Builds** — Progress on side projects, shipped features
3. **Workflows** — Process posts, frameworks, how-tos
4. **Insights** — Genuine learnings, observations, questions

### Content Lifecycle

```
Idea → Draft → Ready → Scheduled → Posted → Analyzed
```

### Daily Rhythm the App Supports

1. **Morning:** Check curated feed, capture ideas
2. **Work blocks:** Build/design, log learnings
3. **Post times:** 3x daily from scheduled queue
4. **Evening:** Quick review, prep tomorrow
5. **Weekly:** Analyze what worked, adjust strategy

---

## Feature Specification

### MVP (Version 0.1) — "I'd Use This Tomorrow"

The absolute minimum to replace your current scattered workflow.

#### 1. Content Idea Bank

**Purpose:** Capture and organize content ideas by pillar.

**Features:**

- Quick-add idea (title + optional notes)
- Assign to pillar (Redesign / Build / Workflow / Insight)
- Status: Idea → In Progress → Ready → Scheduled → Posted
- Simple list view filtered by pillar and status
- Edit/delete ideas
- Drag to reorder priority

**Data:**

```
ContentIdea {
  id
  title
  body (optional, markdown)
  pillar: enum
  status: enum
  media: array of URLs (optional)
  scheduled_for: datetime (optional)
  posted_at: datetime (optional)
  x_post_id: string (optional, for linking back)
  created_at
  updated_at
}
```

#### 2. Calendar View

**Purpose:** Visualize and plan your posting schedule.

**Features:**

- Week view (default) + month view
- See scheduled posts by day/time
- Drag ideas from "Ready" into calendar slots
- 3 slots per day (morning, afternoon, evening)
- Click to edit scheduled time
- Visual indicator of pillar type (color coded)

#### 3. Compose & Post to X

**Purpose:** Write and schedule posts directly to X.

**Features:**

- Rich text composer (or plain text, your call)
- Attach images (upload or paste)
- Character count with limit warning
- Preview how it'll look
- Post now OR schedule for later
- Thread composer (for workflow posts)
- Save as draft

**Integration:** X API v2 (via your Pro plan)

#### 4. Basic Dashboard

**Purpose:** See your current state at a glance.

**Features:**

- This week's schedule (posts planned vs. posted)
- Posting streak counter
- Ideas in bank (by pillar)
- Quick-add button
- Today's focus/reminders

---

### Version 0.2 — "Learning & Feeds"

#### 5. Curated News Feed

**Purpose:** One place for AI news, design inspo, dev content.

**Features:**

- Add RSS sources (blogs, newsletters, publications)
- Add X accounts to follow (fetch their posts)
- Categorize sources: AI / Design / Dev / Indie Hackers / General
- Feed view: scroll through items
- Actions per item: Save / Dismiss / → Create Idea
- Mark as read tracking
- Filter by category

**Sources to start:**

- AI: OpenAI blog, Anthropic blog, The Rundown AI, Ben's Bites
- Design: Awwwards, Muzli, Dribbble
- Dev: Hacker News, Dev.to, Vercel blog
- Indie: Indie Hackers, X accounts you follow

**Technical options:**

- RSS parsing (most sites have feeds)
- Zapier → Supabase for automation
- X API for fetching account posts
- Potential: Perplexity API for article summaries

#### 6. Learning Log

**Purpose:** Track what you're learning and turn it into content.

**Features:**

- Log entry: date, topic, duration (optional), notes
- Tag by area: AI / Design / Dev / Business
- One-click: "Turn into post idea" → creates Insight draft
- Weekly summary: hours learned, topics covered
- Resource links: attach articles, videos, tutorials

**Data:**

```
LearningLog {
  id
  date
  topic
  duration_minutes (optional)
  notes (markdown)
  tags: array
  resources: array of URLs
  converted_to_idea_id (optional)
  created_at
}
```

---

### Version 0.3 — "Analytics & Intelligence"

#### 7. Post Performance Tracking

**Purpose:** See what's working so you can do more of it.

**Features:**

- Pull metrics from X API after posting (likes, replies, retweets, impressions, bookmarks)
- Attach metrics to ContentIdea records
- Performance dashboard: best posts, trends by pillar
- "What worked this week" summary

**Data addition:**

```
PostMetrics {
  idea_id
  impressions
  likes
  replies
  retweets
  bookmarks
  fetched_at
}
```

#### 8. Follower Tracking

**Purpose:** Visualize growth over time.

**Features:**

- Daily follower count (manual input or API)
- Graph: followers over time
- Milestones: celebrate 500, 1k, 2k, 5k, 10k
- Projected date to goal (simple linear projection)

#### 9. AI-Assisted Features

**Purpose:** Use your AI tools to accelerate content creation.

**Features:**

- **Summarize article:** Paste URL or text → get summary (Claude/Gemini)
- **Generate post ideas:** Based on an article or learning log
- **Improve draft:** Polish a post draft
- **Thread expander:** Turn a short idea into a thread outline
- **Hashtag/hook suggestions:** Optional, if you want them

**Implementation:** API calls to Claude or Gemini, user-triggered (not automatic spam)

---

### Version 1.0 — "Full System"

#### 10. The Growth Plan (Embedded)

**Purpose:** Your strategy doc lives in the app, not a separate file.

**Features:**

- Editable markdown doc (your growth plan)
- Content ideas bank linked from plan
- Milestone tracker with deadlines
- Weekly review checklist/prompt

#### 11. Weekly Review Flow

**Purpose:** Guided reflection to improve each week.

**Features:**

- Prompted questions: What worked? What flopped? Adjust what?
- Auto-populated stats: posts made, engagement, follower change
- Note-taking space
- Generates "focus for next week"

#### 12. Mobile Quick Capture (React Native or PWA)

**Purpose:** Capture ideas on the go.

**Features:**

- Minimal UI: title + pillar + save
- Voice-to-text option
- Syncs to main app instantly

---

### Future / V2+ Ideas (Parking Lot)

- **Zapier integrations:** Auto-import bookmarked tweets, saved articles
- **Midjourney integration:** Generate images from within composer
- **Content templates:** Pre-built structures for each pillar
- **Collaboration:** If you ever want Clare or a VA involved
- **Public dashboard:** Share your growth stats publicly (social proof)
- **Chrome extension:** Capture ideas while browsing
- **Email digest:** Daily summary of your feed + reminders
- **Grok integration:** X-native AI insights on your posts
- **A/B testing:** Test different hooks/images for same content
- **Repurposing:** Auto-suggest turning posts into threads, or threads into blog posts

---

## UI/UX Design Principles

### Philosophy

- **Dense but not cluttered:** You want information density, not empty space
- **Dark mode first:** You'll use this at night
- **Keyboard-friendly:** Power user shortcuts
- **Fast:** No loading spinners for basic actions
- **Your aesthetic:** Clean, modern, slightly brutalist? You decide as you design

### Design System Tokens

**Colors (Dark Mode Primary):**

```
Background: #0a0a0a (near black)
Surface: #141414 (cards, panels)
Surface Elevated: #1a1a1a (modals, dropdowns)
Border: #262626 (subtle dividers)
Text Primary: #fafafa (white-ish)
Text Secondary: #a1a1a1 (muted)
Text Tertiary: #525252 (very muted)

Accent: #3b82f6 (blue, for primary actions)
Success: #22c55e (green, for posted/complete)
Warning: #eab308 (yellow, for scheduled)
Error: #ef4444 (red, for issues)

Pillar Colors:
- Redesign: #f472b6 (pink)
- Build: #a78bfa (purple)
- Workflow: #38bdf8 (cyan)
- Insight: #fbbf24 (amber)
```

**Typography:**

```
Font: Inter (or Geist if you want that Vercel vibe)
Sizes:
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px

Weights:
- normal: 400
- medium: 500
- semibold: 600
- bold: 700
```

**Spacing:**

```
Base unit: 4px
Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

**Radius:**

```
sm: 4px
md: 8px
lg: 12px
xl: 16px
full: 9999px
```

### Key Screens (MVP)

#### 1. Dashboard (Home)

```
┌─────────────────────────────────────────────────────────┐
│  Command Center                      [+ New Idea]  [⚙]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TODAY                          STREAK: 🔥 12 days      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │ 9:00 AM │ │ 2:00 PM │ │ 7:00 PM │                   │
│  │ Redesign│ │ Insight │ │ (empty) │ ← drag here       │
│  │ Gym hero│ │ Dark... │ │         │                   │
│  └─────────┘ └─────────┘ └─────────┘                   │
│                                                         │
│  THIS WEEK                                              │
│  Mon ●●●  Tue ●●○  Wed ○○○  Thu ○○○  Fri ○○○           │
│                                                         │
│  IDEA BANK                                              │
│  Redesigns (4)  Builds (7)  Workflows (3)  Insights (9) │
│                                                         │
│  READY TO POST (3)                                      │
│  • SaaS pricing page redesign — Redesign               │
│  • Auth flow progress — Build                          │
│  • My Figma-to-code workflow — Workflow                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 2. Idea Bank

```
┌─────────────────────────────────────────────────────────┐
│  Idea Bank                           [+ New]  [Filter ▾]│
├─────────────────────────────────────────────────────────┤
│  [All] [Redesigns] [Builds] [Workflows] [Insights]      │
│  [Ideas] [In Progress] [Ready] [Scheduled] [Posted]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ● Redesign                              [Ready] │   │
│  │ SaaS pricing page — before/after                │   │
│  │ Added 2 days ago                    [Schedule →]│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ● Build                           [In Progress] │   │
│  │ User auth flow with Supabase                    │   │
│  │ Added 5 days ago                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ● Insight                               [Idea]  │   │
│  │ Why I switched from REST to tRPC                │   │
│  │ Added just now                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 3. Composer

```
┌─────────────────────────────────────────────────────────┐
│  New Post                              [Save Draft] [X] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Pillar: [Redesign ▾]                                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  Revamped this SaaS pricing page.              │   │
│  │                                                 │   │
│  │  Before → After                                │   │
│  │                                                 │   │
│  │  The old version buried the CTA. I brought it  │   │
│  │  above the fold and simplified the tiers.      │   │
│  │                                                 │   │
│  │  What do you think?                            │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📎 Attach media                        243 / 280 chars │
│                                                         │
│  ┌──────────┐ ┌──────────┐                             │
│  │  before  │ │  after   │   [+ Add more]              │
│  │  .png    │ │  .png    │                             │
│  └──────────┘ └──────────┘                             │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ○ Post now                                            │
│  ● Schedule for: [Jan 27, 2026 ▾] [9:00 AM ▾]          │
│                                                         │
│              [Cancel]              [Schedule Post →]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 4. Calendar

```
┌─────────────────────────────────────────────────────────┐
│  Calendar                    [← Week →]  [Month view]   │
├─────────────────────────────────────────────────────────┤
│           Mon 27   Tue 28   Wed 29   Thu 30   Fri 31   │
│  ─────────────────────────────────────────────────────  │
│  Morning   ┌─────┐ ┌─────┐                             │
│  9 AM      │Redes│ │Build│  (empty)  (empty)  (empty)  │
│            │ign  │ │     │                             │
│            └─────┘ └─────┘                             │
│  ─────────────────────────────────────────────────────  │
│  Afternoon ┌─────┐                                      │
│  2 PM      │Insig│ (empty)  (empty)  (empty)  (empty)  │
│            │ht   │                                      │
│            └─────┘                                      │
│  ─────────────────────────────────────────────────────  │
│  Evening                                                │
│  7 PM      (empty) (empty)  (empty)  (empty)  (empty)  │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  READY TO SCHEDULE (drag to calendar)                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │Workflow │ │Insight  │ │Redesign │                   │
│  │Figma... │ │Dark mode│ │Real est.│                   │
│  └─────────┘ └─────────┘ └─────────┘                   │
└─────────────────────────────────────────────────────────┘
```

#### 5. Feed (V0.2)

```
┌─────────────────────────────────────────────────────────┐
│  Feed                    [All ▾]  [Mark all read]  [⚙]  │
├─────────────────────────────────────────────────────────┤
│  [All] [AI] [Design] [Dev] [Indie]                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ The Rundown AI • 2 hours ago                    │   │
│  │ OpenAI announces new reasoning model...         │   │
│  │ [Read more →]                                   │   │
│  │                        [Save] [Dismiss] [→ Idea]│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ @levelsio • 4 hours ago                         │   │
│  │ Just hit $50k MRR on PhotoAI...                 │   │
│  │                        [Save] [Dismiss] [→ Idea]│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Awwwards • 6 hours ago                          │   │
│  │ Site of the Day: Incredible parallax...         │   │
│  │                        [Save] [Dismiss] [→ Idea]│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Stack

| Layer             | Technology                      | Why                            |
| ----------------- | ------------------------------- | ------------------------------ |
| **Frontend**      | Next.js 15 + App Router         | Your strength, latest features |
| **Styling**       | Tailwind CSS + Framer Motion    | Fast, consistent, animated     |
| **Database**      | Supabase (Postgres)             | Auth, DB, real-time, storage   |
| **Auth**          | Supabase Auth                   | Simple, secure, OAuth for X    |
| **File Storage**  | Supabase Storage                | Images for posts               |
| **Hosting**       | Vercel                          | Easy deploys, edge functions   |
| **X Integration** | X API v2                        | Post, schedule, fetch metrics  |
| **RSS Parsing**   | rss-parser (npm) or Zapier      | Fetch feed items               |
| **AI**            | Claude API / Gemini API         | Summarization, suggestions     |
| **Scheduling**    | Vercel Cron or Supabase pg_cron | Trigger scheduled posts        |

### Database Schema (MVP)

```sql
-- Users (just you for now, but built properly)
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  x_username text,
  x_access_token text, -- encrypted
  x_refresh_token text, -- encrypted
  created_at timestamptz default now()
);

-- Content Ideas
create table content_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  title text not null,
  body text,
  pillar text check (pillar in ('redesign', 'build', 'workflow', 'insight')),
  status text default 'idea' check (status in ('idea', 'in_progress', 'ready', 'scheduled', 'posted')),
  media_urls text[], -- array of storage URLs
  scheduled_for timestamptz,
  posted_at timestamptz,
  x_post_id text,
  sort_order int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Post Metrics (V0.3)
create table post_metrics (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references content_ideas(id),
  impressions int,
  likes int,
  replies int,
  retweets int,
  bookmarks int,
  fetched_at timestamptz default now()
);

-- Feed Sources (V0.2)
create table feed_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  name text not null,
  type text check (type in ('rss', 'x_account')),
  url text not null,
  category text check (category in ('ai', 'design', 'dev', 'indie', 'general')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Feed Items (V0.2)
create table feed_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references feed_sources(id),
  title text,
  content text,
  url text,
  image_url text,
  published_at timestamptz,
  is_read boolean default false,
  is_saved boolean default false,
  is_dismissed boolean default false,
  converted_to_idea_id uuid references content_ideas(id),
  created_at timestamptz default now()
);

-- Learning Logs (V0.2)
create table learning_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null,
  topic text not null,
  duration_minutes int,
  notes text,
  tags text[],
  resource_urls text[],
  converted_to_idea_id uuid references content_ideas(id),
  created_at timestamptz default now()
);

-- Follower Snapshots (V0.3)
create table follower_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  count int not null,
  recorded_at date not null,
  created_at timestamptz default now()
);
```

### X API Integration

**Required Scopes:**

- `tweet.read` — read your tweets
- `tweet.write` — post tweets
- `users.read` — read your profile
- `offline.access` — refresh tokens

**Key Endpoints:**

- `POST /2/tweets` — create a tweet
- `GET /2/tweets/:id` — get tweet with metrics
- `GET /2/users/me` — get your profile (follower count)
- `DELETE /2/tweets/:id` — delete a tweet

**Scheduling Approach:**
X API doesn't have native scheduling. Options:

1. **Vercel Cron:** Check every minute for posts due, then post via API
2. **Supabase pg_cron:** Same idea, database-triggered
3. **Zapier:** Trigger on schedule, call your API endpoint

Recommended: **Vercel Cron** — simple, free tier covers it, keeps logic in your codebase.

### Folder Structure

```
/command-center
├── app/
│   ├── layout.tsx
│   ├── page.tsx (dashboard)
│   ├── ideas/
│   │   ├── page.tsx (idea bank)
│   │   └── [id]/page.tsx (edit idea)
│   ├── calendar/
│   │   └── page.tsx
│   ├── compose/
│   │   └── page.tsx
│   ├── feed/
│   │   └── page.tsx (V0.2)
│   ├── learn/
│   │   └── page.tsx (V0.2)
│   ├── analytics/
│   │   └── page.tsx (V0.3)
│   ├── settings/
│   │   └── page.tsx
│   └── api/
│       ├── x/
│       │   ├── auth/route.ts
│       │   ├── post/route.ts
│       │   ├── metrics/route.ts
│       │   └── callback/route.ts
│       ├── ideas/route.ts
│       ├── feed/route.ts
│       ├── cron/
│       │   └── post-scheduled/route.ts
│       └── ai/
│           └── summarize/route.ts
├── components/
│   ├── ui/ (shadcn components)
│   ├── dashboard/
│   ├── ideas/
│   ├── calendar/
│   ├── composer/
│   └── feed/
├── lib/
│   ├── supabase.ts
│   ├── x-api.ts
│   ├── ai.ts
│   └── utils.ts
├── hooks/
├── types/
└── styles/
```

---

## Build Plan

### Phase 1: Foundation (Days 1-3)

**Goal:** Project setup, auth, basic CRUD

- [ ] Initialize Next.js 15 project with Tailwind
- [ ] Set up Supabase project (database, auth)
- [ ] Create database schema (MVP tables)
- [ ] Build basic layout/navigation shell
- [ ] Implement Supabase auth (email or OAuth)
- [ ] Create ContentIdea CRUD operations
- [ ] Build simple idea list view

**Showcase Post:** "Starting to build my personal command center. Here's the stack..."

### Phase 2: Idea Bank (Days 4-6)

**Goal:** Full idea management UI

- [ ] Idea bank page with filtering (pillar, status)
- [ ] Create/edit idea modal or page
- [ ] Status transitions (idea → in progress → ready)
- [ ] Drag-to-reorder within lists
- [ ] Pillar color coding
- [ ] Quick-add idea component

**Showcase Post:** "Built the idea bank for my command center. Here's how I'm organizing content by pillar..."

### Phase 3: Composer (Days 7-9)

**Goal:** Write and preview posts

- [ ] Composer page/modal
- [ ] Character count with visual feedback
- [ ] Image upload to Supabase Storage
- [ ] Preview pane (how it'll look)
- [ ] Save as draft functionality
- [ ] Thread composer (multiple tweets)

**Showcase Post:** "Added the composer. Now I can draft and preview posts before scheduling..."

### Phase 4: X Integration (Days 10-14)

**Goal:** Actually post to X

- [ ] X OAuth flow (connect your account)
- [ ] Store tokens securely
- [ ] "Post Now" functionality
- [ ] Test posting with images
- [ ] Scheduled_for field on ideas
- [ ] Vercel Cron job to check and post scheduled content
- [ ] Update status to "posted" after successful post

**Showcase Post:** "Just posted this tweet FROM my command center. The X integration is live..."

### Phase 5: Calendar (Days 15-18)

**Goal:** Visual scheduling interface

- [ ] Week view calendar component
- [ ] Display scheduled posts in time slots
- [ ] Drag from "Ready" queue to calendar
- [ ] Click to edit scheduled time
- [ ] Month view (optional)
- [ ] Today's posts on dashboard

**Showcase Post:** "Built a calendar view for planning my posting schedule. Here's how it works..."

### Phase 6: Dashboard (Days 19-21)

**Goal:** Home base that surfaces what matters

- [ ] Today's schedule widget
- [ ] Posting streak counter (calculate from post history)
- [ ] Ideas summary by pillar
- [ ] "Ready to post" queue
- [ ] Quick-add button
- [ ] Polish overall UX

**Showcase Post:** "The dashboard is done. My entire content system in one view..."

---

### MVP Complete! 🎉

At this point you have a working app:

- Capture ideas by pillar
- Write and preview posts
- Schedule to X
- Calendar to plan your week
- Dashboard to see the big picture

---

### Phase 7: Feed (Days 22-28) — V0.2

- [ ] Feed sources management (add RSS, X accounts)
- [ ] RSS parsing and storing feed items
- [ ] Feed view with category filters
- [ ] Save/dismiss/convert-to-idea actions
- [ ] Zapier integration for automated ingestion (optional)

### Phase 8: Learning Log (Days 29-32) — V0.2

- [ ] Learning log CRUD
- [ ] Convert to post idea feature
- [ ] Weekly summary view
- [ ] Dashboard widget for learning time

### Phase 9: Analytics (Days 33-40) — V0.3

- [ ] Fetch post metrics from X API
- [ ] Store and display metrics per post
- [ ] Best posts leaderboard
- [ ] Follower tracking (manual or API)
- [ ] Growth chart

### Phase 10: AI Features (Days 41-47) — V0.3

- [ ] Article summarization (Claude/Gemini)
- [ ] Post idea generation from feed items
- [ ] Draft improvement suggestions
- [ ] Thread expander

---

## Showcase Plan (Content From Building)

Every phase generates at least one post. Here's the content calendar from the build itself:

| Day | Content                                                                        | Pillar   |
| --- | ------------------------------------------------------------------------------ | -------- |
| 1   | "Starting to build my personal command center"                                 | Build    |
| 3   | "Set up the database schema. Here's how I'm thinking about content pillars..." | Workflow |
| 6   | "The idea bank is live. Before → after of my content organization..."          | Build    |
| 9   | "Built a composer with live preview. Here's what it looks like..."             | Build    |
| 12  | "X API integration done. Just posted this FROM my app..."                      | Build    |
| 14  | "Scheduling works! Here's how I built the cron job..."                         | Workflow |
| 18  | "Calendar view shipped. Drag and drop scheduling..."                           | Build    |
| 21  | "Dashboard complete. Here's the full tour of V1..."                            | Build    |
| 25  | "Added a curated feed. How I'm organizing my learning sources..."              | Build    |
| 30  | "Built a learning log that turns notes into post ideas..."                     | Build    |
| 35  | "Analytics are live. Here's what's working for me so far..."                   | Insight  |
| 40  | "Added AI summarization. My reading workflow just got 10x faster..."           | Build    |

That's **12+ posts** just from the build process, not counting your regular redesigns and insights.

---

## Success Metrics

### For the App

- [ ] You use it daily (the only metric that matters for V1)
- [ ] Posting streak maintained
- [ ] Ideas don't get lost
- [ ] Scheduling works reliably

### For Growth

- [ ] 500 followers by week 4
- [ ] 2,000 followers by week 12
- [ ] 5,000 followers by week 26
- [ ] 10,000 followers by week 52
- [ ] First inbound lead from X

---

## Open Questions

1. **App name?** "Command Center" is working title. Other ideas: Launchpad, Flywheel, BuildLog, PostPilot?

2. **Domain?** commandcenter.lauf.co? buildlog.lauf.co? Separate domain?

3. **Public or private?** Keep it private forever, or eventually open-source / productize?

4. **Mobile priority?** PWA good enough, or React Native needed for quick capture?

5. **Which AI to prioritize?** Claude for most things, Gemini for long articles, or mix?

---

## Next Steps

1. **Review this spec** — what's missing? what's wrong? what's overly ambitious?
2. **Finalize MVP scope** — are all Phase 1-6 features truly MVP?
3. **Design first screens** — Figma mockups before code
4. **Set up project** — repo, Supabase, Vercel
5. **Start building** — Day 1 of the build plan
6. **Post about it** — Day 1 showcase post

---

_Last updated: January 2026_
_Author: Mike + Claude_
