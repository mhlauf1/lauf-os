# API Reference

> API documentation for LAUF OS endpoints

---

## Overview

All API routes follow RESTful conventions and return consistent JSON responses.

### Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-app.vercel.app/api`

### Response Format

All endpoints return this structure:

```typescript
interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}
```

### Authentication

Most endpoints require authentication via Supabase session cookies. Unauthenticated requests receive a `401 Unauthorized` response.

---

## Endpoints

### Ideas

#### GET /api/ideas

Get all ideas for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `pillar` | string | Filter by pillar (redesign, build, workflow, insight) |
| `status` | string | Filter by status (idea, in_progress, ready, scheduled, posted) |
| `search` | string | Search in title and body |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "SaaS pricing page redesign",
      "body": "Before/after comparison...",
      "pillar": "redesign",
      "status": "ready",
      "media_urls": [],
      "scheduled_for": null,
      "created_at": "2026-01-26T10:00:00Z"
    }
  ],
  "error": null
}
```

**Status:** Planned (Phase 2)

---

#### POST /api/ideas

Create a new idea.

**Request Body:**
```json
{
  "title": "My new idea",
  "body": "Optional description",
  "pillar": "build",
  "status": "idea"
}
```

**Validation:** See `src/lib/validations/idea.schema.ts`

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "My new idea",
    ...
  },
  "error": null,
  "message": "Idea created"
}
```

**Status:** Planned (Phase 2)

---

#### GET /api/ideas/[id]

Get a single idea by ID.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "My idea",
    ...
  },
  "error": null
}
```

**Status:** Planned (Phase 2)

---

#### PUT /api/ideas/[id]

Update an existing idea.

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "ready"
}
```

**Status:** Planned (Phase 2)

---

#### DELETE /api/ideas/[id]

Soft delete an idea.

**Response:**
```json
{
  "data": null,
  "error": null,
  "message": "Idea deleted"
}
```

**Status:** Planned (Phase 2)

---

### X (Twitter) Integration

#### GET /api/x/auth

Initiate X OAuth flow. Redirects to X authorization page.

**Status:** Planned (Phase 4)

---

#### GET /api/x/callback

Handle X OAuth callback. Exchanges code for tokens, encrypts and stores them.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | string | Authorization code from X |
| `state` | string | CSRF protection state |

**Status:** Planned (Phase 4)

---

#### POST /api/x/post

Post content to X.

**Request Body:**
```json
{
  "idea_id": "uuid",
  "text": "Post content...",
  "media_ids": ["media_id_1"]
}
```

**Response:**
```json
{
  "data": {
    "x_post_id": "1234567890",
    "url": "https://x.com/user/status/1234567890"
  },
  "error": null
}
```

**Status:** Planned (Phase 4)

---

#### GET /api/x/metrics/[post_id]

Fetch metrics for a posted idea.

**Response:**
```json
{
  "data": {
    "impressions": 1500,
    "likes": 42,
    "replies": 5,
    "retweets": 12,
    "bookmarks": 8
  },
  "error": null
}
```

**Status:** Planned (V0.3)

---

### AI Services

#### POST /api/ai/summarize

Summarize an article or text.

**Request Body:**
```json
{
  "url": "https://example.com/article",
  "text": "Or provide text directly..."
}
```

**Response:**
```json
{
  "data": {
    "summary": "Key points from the article...",
    "key_points": ["Point 1", "Point 2"]
  },
  "error": null
}
```

**Status:** Planned (V0.3)

---

### Cron Jobs

#### GET /api/cron/post-scheduled

Process scheduled posts. Called by Vercel Cron every minute.

**Headers:**
| Header | Value |
|--------|-------|
| `Authorization` | `Bearer {CRON_SECRET}` |

**Response:**
```json
{
  "data": {
    "processed": 2,
    "failed": 0
  },
  "error": null
}
```

**Status:** Planned (Phase 4)

---

## Error Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Not authorized for resource |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limits

API endpoints are rate-limited based on Vercel's default limits:
- 1000 requests per 10 seconds per IP

X API has its own limits:
- 1500 tweets per 15-minute window
- 300 tweets per 3-hour window

---

## Implementation Progress

| Endpoint | Status | Phase |
|----------|--------|-------|
| `GET /api/ideas` | Planned | Phase 2 |
| `POST /api/ideas` | Planned | Phase 2 |
| `GET /api/ideas/[id]` | Planned | Phase 2 |
| `PUT /api/ideas/[id]` | Planned | Phase 2 |
| `DELETE /api/ideas/[id]` | Planned | Phase 2 |
| `GET /api/x/auth` | Planned | Phase 4 |
| `GET /api/x/callback` | Planned | Phase 4 |
| `POST /api/x/post` | Planned | Phase 4 |
| `GET /api/x/metrics/[id]` | Planned | V0.3 |
| `POST /api/ai/summarize` | Planned | V0.3 |
| `GET /api/cron/post-scheduled` | Planned | Phase 4 |

---

_Last updated: 2026-01-26_
