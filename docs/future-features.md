# Future Features

> Backlog and feature roadmap for LAUF OS beyond MVP

---

## Version Roadmap

### V0.2 - Learning & Feeds

| Feature | Description | Priority |
|---------|-------------|----------|
| **Curated News Feed** | RSS feeds and X accounts in one place | High |
| **Learning Log** | Track learning sessions, turn into content | High |
| **Feed-to-Idea Conversion** | One-click to create idea from feed item | High |
| **Feed Categories** | Filter by AI, Design, Dev, Indie | Medium |
| **Article Summaries** | AI-powered summaries of saved articles | Medium |

#### Feed Details
- Add RSS sources (blogs, newsletters, publications)
- Add X accounts to follow (fetch their posts)
- Categories: AI / Design / Dev / Indie Hackers / General
- Actions per item: Save / Dismiss / Create Idea
- Mark as read tracking

#### Recommended Sources
- AI: OpenAI blog, Anthropic blog, The Rundown AI, Ben's Bites
- Design: Awwwards, Muzli, Dribbble
- Dev: Hacker News, Dev.to, Vercel blog
- Indie: Indie Hackers, X accounts

#### Learning Log Details
- Log entry: date, topic, duration, notes
- Tag by area: AI / Design / Dev / Business
- One-click: "Turn into post idea" → creates Insight draft
- Weekly summary: hours learned, topics covered
- Resource links: attach articles, videos, tutorials

---

### V0.3 - Analytics & Intelligence

| Feature | Description | Priority |
|---------|-------------|----------|
| **Post Performance** | Track likes, replies, retweets, impressions | High |
| **Follower Tracking** | Daily follower count, growth chart | High |
| **Best Posts Leaderboard** | See what content performs best | Medium |
| **AI Summarization** | Summarize articles via Claude/Gemini | Medium |
| **AI Draft Improvement** | Polish post drafts with AI | Medium |
| **Thread Expander** | Turn short idea into thread outline | Low |

#### Analytics Details
- Pull metrics from X API after posting
- Attach metrics to idea records
- Performance dashboard: best posts, trends by pillar
- "What worked this week" summary

#### AI Integration Details
- Summarize article: Paste URL → get summary
- Generate post ideas: Based on article or learning
- Improve draft: Polish a post draft
- Thread expander: Turn idea into thread outline
- Hashtag/hook suggestions (optional)

---

### V1.0 - Full System

| Feature | Description | Priority |
|---------|-------------|----------|
| **Embedded Growth Plan** | Strategy doc lives in the app | High |
| **Weekly Review Flow** | Guided reflection prompts | High |
| **Milestones** | Celebrate 500, 1k, 2k, 5k, 10k followers | Medium |
| **Growth Projection** | Projected date to goal | Low |

#### Growth Plan Details
- Editable markdown document
- Content ideas linked from plan
- Milestone tracker with deadlines
- Weekly review checklist/prompt

#### Weekly Review Details
- Prompted questions: What worked? What flopped? Adjust what?
- Auto-populated stats: posts made, engagement, follower change
- Note-taking space
- Generates "focus for next week"

---

## Future / V2+ Ideas (Parking Lot)

### Integrations

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Zapier Integration** | Auto-import bookmarked tweets, saved articles | Medium |
| **Chrome Extension** | Capture ideas while browsing | High |
| **Midjourney Integration** | Generate images from composer | Medium |
| **Grok Integration** | X-native AI insights | Low |

### Content Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Content Templates** | Pre-built structures for each pillar | Low |
| **A/B Testing** | Test different hooks/images | High |
| **Repurposing** | Turn posts into threads, threads into blogs | Medium |

### Social Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Collaboration** | Invite team members or VA | High |
| **Public Dashboard** | Share growth stats publicly | Medium |

### Productivity

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Email Digest** | Daily summary of feed + reminders | Medium |
| **Mobile App** | React Native quick capture | High |
| **PWA Mode** | Minimal mobile capture | Low |
| **Keyboard Shortcuts** | Power user navigation | Low |

---

## Prioritization Framework

### Priority Levels

| Level | Criteria |
|-------|----------|
| **P0 (Critical)** | Blocks daily usage, must have for launch |
| **P1 (High)** | Significantly improves workflow |
| **P2 (Medium)** | Nice to have, clear value |
| **P3 (Low)** | Future consideration, speculative value |

### Evaluation Criteria

1. **Daily Usage Impact**: Does it make the app more useful daily?
2. **Content Generation**: Does it help create more/better content?
3. **Time Saved**: Does it reduce manual work?
4. **Growth Potential**: Does it help grow the audience?
5. **Build Complexity**: How long to implement?

---

## AI Integration Strategy

### Tiered Approach

| Tier | Phase | Description |
|------|-------|-------------|
| **Tier 1** | V0.3 | Manual AI triggers - "Improve this draft", "Summarize article" |
| **Tier 2** | V0.4 | Smart suggestions - "Turn this learning into a post idea" |
| **Tier 3** | V0.5 | AI-assisted scheduling - "Suggest best time to post" |
| **Tier 4** | V1.0 | Daily briefings, auto-draft suggestions |
| **Tier 5** | V2.0 | Full automation workflows via Zapier |

### AI Services

| Service | Primary Use | Priority |
|---------|-------------|----------|
| Claude API | Complex reasoning, content improvement, summarization | Primary |
| Gemini | Long context (article summarization) | Secondary |
| Perplexity | Research, current events | Future |
| Grok | X-native insights | Future |
| Midjourney/NanoBanana | Image generation | Manual integration |

---

## Mobile Strategy

### Phase 1: PWA (V1.0)
- Minimal UI: title + pillar + save
- Works on mobile browsers
- No app store needed

### Phase 2: React Native (V2.0, if needed)
- Voice-to-text option
- Native notifications
- Better offline support

---

## Feature Requests Log

_Space to log feature requests as they come up_

| Date | Request | Source | Status |
|------|---------|--------|--------|
| - | - | - | - |

---

## Decision Log

_Document major feature decisions_

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-26 | Use shadcn/ui from start | Faster component development |
| 2026-01-26 | Zustand + React Query | Clean separation of client/server state |
| 2026-01-26 | Vercel Cron for scheduling | Simpler than alternatives, free tier |

---

_Last updated: January 2026_
