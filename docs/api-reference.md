# API Reference

> API documentation for LAUF OS endpoints

---

## Overview

All API routes use Prisma for database access and return consistent JSON responses.

### Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-app.vercel.app/api`

### Response Format

```typescript
interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}
```

### Authentication

All endpoints require authentication via Supabase session cookies. Unauthenticated requests receive `401 Unauthorized`.

---

## Tasks API

### GET /api/tasks

Get all tasks for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | string | Filter by scheduled date (YYYY-MM-DD) |
| `status` | string | Filter by status (TODO, IN_PROGRESS, BLOCKED, DONE) |
| `category` | string | Filter by category (DESIGN, CODE, CLIENT, etc.) |
| `projectId` | string | Filter by project |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Design homepage mockup",
      "category": "DESIGN",
      "status": "TODO",
      "priority": "HIGH",
      "scheduledDate": "2026-01-26",
      "scheduledTime": "09:00",
      "timeBlockMinutes": 90,
      "energyLevel": "DEEP_WORK"
    }
  ],
  "error": null
}
```

**Status:** Implemented

---

### POST /api/tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Design homepage mockup",
  "category": "DESIGN",
  "priority": "HIGH",
  "scheduledDate": "2026-01-26",
  "scheduledTime": "09:00",
  "timeBlockMinutes": 90,
  "energyLevel": "DEEP_WORK",
  "projectId": "optional-project-id"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Design homepage mockup",
    ...
  },
  "error": null,
  "message": "Task created"
}
```

**Status:** Implemented

---

### PATCH /api/tasks/[id]

Update an existing task. When status changes to `DONE`:
- Sets `completedAt` timestamp
- Auto-increments linked goal's `currentValue` (if `goalId` is set)
- Auto-completes goal if `currentValue` reaches `targetValue`
- Updates linked activity's `timesUsed` and `lastUsed` (if `activityId` is set)

When status reverts from `DONE` to another status:
- Clears `completedAt`
- Decrements linked goal's `currentValue` (reopens goal if it was auto-completed)
- Decrements linked activity's `timesUsed`

**Request Body:**
```json
{
  "status": "DONE",
  "title": "Updated title",
  "category": "CODE",
  "priority": "HIGH",
  "scheduledDate": "2026-01-26T00:00:00.000Z",
  "scheduledTime": "09:00",
  "activityId": "optional-activity-id",
  "goalId": "optional-goal-id"
}
```

All fields are optional.

**Status:** Implemented

---

### DELETE /api/tasks/[id]

Delete a task. If the task was `DONE` and linked to a goal, decrements the goal's `currentValue` (and reopens if auto-completed).

**Status:** Implemented

---

## Activities API

### GET /api/activities

Get all active activity presets for the authenticated user, ordered by sortOrder then usage frequency. **Auto-syncs presets**: if any of the 19 predefined presets are missing from the DB, they are created; stale custom activities are deactivated.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Website Design",
      "category": "DESIGN",
      "defaultDuration": 90,
      "energyLevel": "DEEP_WORK",
      "isActive": true,
      "sortOrder": 2,
      "timesUsed": 12,
      "lastUsed": "2026-01-25T14:00:00.000Z"
    }
  ],
  "error": null
}
```

**Status:** Implemented

---

### POST /api/activities

**Returns 403** — Activity presets are system-managed and cannot be created manually.

**Status:** Locked (403)

---

### PATCH /api/activities/[id]

Update activity usage stats only. Only `timesUsed` and `lastUsed` fields can be updated (used by task completion side effects). All other fields are rejected.

**Request Body:**
```json
{
  "timesUsed": 13,
  "lastUsed": "2026-01-27T14:00:00.000Z"
}
```

**Status:** Implemented (restricted)

---

### DELETE /api/activities/[id]

**Returns 403** — Activity presets are system-managed and cannot be deleted.

**Status:** Locked (403)

---

## Clients API

### GET /api/clients

Get all clients for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (ACTIVE, PAUSED, COMPLETED, CHURNED) |
| `healthScore` | string | Filter by health score (GREEN, YELLOW, RED) |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "company": "Acme Corporation",
      "status": "ACTIVE",
      "healthScore": "GREEN",
      "contractValue": 5000,
      "monthlyRetainer": 2000,
      "lastContacted": "2026-01-20"
    }
  ],
  "error": null
}
```

**Status:** Implemented

---

### POST /api/clients

Create a new client.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@acme.com",
  "company": "Acme Corporation",
  "industry": "Technology",
  "websiteUrl": "https://acme.com",
  "contractValue": 5000,
  "monthlyRetainer": 2000
}
```

**Status:** Implemented

---

### GET /api/clients/[id]

Get a single client with projects.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "projects": [
      {
        "id": "uuid",
        "name": "Website Redesign",
        "status": "DEVELOPMENT"
      }
    ]
  },
  "error": null
}
```

**Status:** Implemented

---

### PATCH /api/clients/[id]

Update an existing client.

**Request Body:**
```json
{
  "name": "Updated Name",
  "status": "PAUSED",
  "healthScore": "YELLOW",
  "contractValue": 10000
}
```

All fields are optional.

**Status:** Implemented

---

### DELETE /api/clients/[id]

Delete a client and all associated data (projects, opportunities).

**Status:** Implemented

---

## Projects API

### GET /api/projects

Get all projects for the authenticated user's clients.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (PLANNING, DESIGN, DEVELOPMENT, REVIEW, LAUNCHED) |
| `clientId` | string | Filter by client |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Website Redesign",
      "status": "DEVELOPMENT",
      "type": "WEBSITE",
      "priority": "HIGH",
      "budget": 10000,
      "paidAmount": 5000,
      "client": {
        "id": "uuid",
        "name": "Acme Corp"
      }
    }
  ],
  "error": null
}
```

**Status:** Implemented

---

### POST /api/projects

Create a new project.

**Request Body:**
```json
{
  "clientId": "client-uuid",
  "name": "Website Redesign",
  "type": "WEBSITE",
  "status": "PLANNING",
  "budget": 10000,
  "startDate": "2026-01-26",
  "dueDate": "2026-03-26"
}
```

**Status:** Implemented

---

### GET /api/projects/[id]

Get a single project with client, tasks, and asset counts.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Website Redesign",
    "status": "DEVELOPMENT",
    "client": { "id": "uuid", "name": "Acme Corp", "company": "Acme Corporation" },
    "tasks": [{ "id": "uuid", "title": "Design homepage", "category": "DESIGN", "status": "TODO" }],
    "_count": { "tasks": 5, "assets": 3 }
  },
  "error": null
}
```

**Status:** Implemented

---

### PATCH /api/projects/[id]

Update an existing project.

**Request Body:**
```json
{
  "name": "Updated Name",
  "status": "REVIEW",
  "priority": "URGENT",
  "budget": 15000
}
```

All fields are optional.

**Status:** Implemented

---

### DELETE /api/projects/[id]

Delete a project and associated data.

**Status:** Implemented

---

## Goals API

### GET /api/goals

Get all goals for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by type (DAILY, WEEKLY, MONTHLY, YEARLY) |
| `completed` | boolean | Filter by completion status |
| `includeBreakdown` | boolean | Include pace breakdown data (expectedPerWeek, expectedPerDay, expectedByNow, isOnTrack, progressPercent) |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Complete 4 deep work blocks",
      "type": "DAILY",
      "targetValue": 4,
      "currentValue": 2,
      "startDate": "2026-01-28T00:00:00.000Z",
      "dueDate": "2026-01-28T00:00:00.000Z",
      "completedAt": null,
      "_count": { "tasks": 3, "libraryItems": 0 },
      "breakdown": {
        "expectedPerWeek": null,
        "expectedPerDay": 4,
        "expectedByNow": 2,
        "isOnTrack": true,
        "progressPercent": 50
      }
    }
  ],
  "error": null
}
```

The `_count` and `breakdown` fields are always included. `breakdown` is only present when `includeBreakdown=true`.

**Status:** Implemented

---

### POST /api/goals

Create a new goal.

**Request Body:**
```json
{
  "title": "Complete 4 deep work blocks",
  "type": "DAILY",
  "targetValue": 4,
  "startDate": "2026-01-28T00:00:00.000Z",
  "dueDate": "2026-01-28T00:00:00.000Z"
}
```

**Status:** Implemented

---

### PATCH /api/goals/[id]

Update an existing goal. Supports direct progress updates, atomic increments, and completion toggling.

**Request Body:**
```json
{
  "title": "Updated goal",
  "currentValue": 15,
  "targetValue": 30,
  "startDate": "2026-01-01T00:00:00.000Z",
  "dueDate": "2026-01-31T00:00:00.000Z",
  "completedAt": "2026-01-26T00:00:00.000Z",
  "incrementValue": 1
}
```

All fields are optional. Set `completedAt` to `null` to un-complete.

`incrementValue` performs an atomic increment/decrement on `currentValue`. If the result reaches `targetValue`, the goal is auto-completed. If decremented below `targetValue`, the goal is reopened.

**Status:** Implemented

---

### DELETE /api/goals/[id]

Delete a goal.

**Status:** Implemented

---

## Tweet Drafts API

### GET /api/tweets

Get all tweet drafts for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (DRAFT, READY, POSTED, ARCHIVED) |
| `search` | string | Search in content |
| `tag` | string | Filter by tag |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "content": "Building in public is the best marketing strategy.",
      "tweetNumber": 1,
      "totalTweets": 1,
      "status": "DRAFT",
      "tags": ["marketing", "indie"],
      "postedAt": null,
      "createdAt": "2026-01-27T10:00:00.000Z"
    }
  ],
  "error": null
}
```

**Status:** Implemented

---

### POST /api/tweets

Create a new tweet draft.

**Request Body:**
```json
{
  "content": "Building in public is the best marketing strategy.",
  "status": "DRAFT",
  "tags": ["marketing", "indie"],
  "tweetNumber": 1,
  "totalTweets": 1
}
```

Content is required (1–280 characters). All other fields are optional.

**Status:** Implemented

---

### GET /api/tweets/[id]

Get a single tweet draft. Returns 404 if not found or not owned by user.

**Status:** Implemented

---

### PATCH /api/tweets/[id]

Update an existing tweet draft.

**Request Body:**
```json
{
  "content": "Updated content",
  "status": "READY",
  "tags": ["updated"],
  "postedAt": "2026-01-27T12:00:00.000Z"
}
```

All fields are optional.

**Status:** Implemented

---

### DELETE /api/tweets/[id]

Delete a tweet draft. Returns 404 if not found or not owned by user.

**Status:** Implemented

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

## Implementation Progress

| Endpoint | Status |
|----------|--------|
| `GET /api/tasks` | Implemented |
| `POST /api/tasks` | Implemented |
| `PATCH /api/tasks/[id]` | Implemented |
| `DELETE /api/tasks/[id]` | Implemented |
| `GET /api/activities` | Implemented (auto-syncs presets) |
| `POST /api/activities` | Locked (403 — system-managed) |
| `PATCH /api/activities/[id]` | Implemented (usage stats only) |
| `DELETE /api/activities/[id]` | Locked (403 — system-managed) |
| `GET /api/clients` | Implemented |
| `POST /api/clients` | Implemented |
| `GET /api/clients/[id]` | Implemented |
| `PATCH /api/clients/[id]` | Implemented |
| `DELETE /api/clients/[id]` | Implemented |
| `GET /api/projects` | Implemented |
| `POST /api/projects` | Implemented |
| `GET /api/projects/[id]` | Implemented |
| `PATCH /api/projects/[id]` | Implemented |
| `DELETE /api/projects/[id]` | Implemented |
| `GET /api/goals` | Implemented (supports includeBreakdown) |
| `POST /api/goals` | Implemented (supports startDate) |
| `PATCH /api/goals/[id]` | Implemented (supports incrementValue, auto-complete) |
| `DELETE /api/goals/[id]` | Implemented |
| `GET /api/tweets` | Implemented |
| `POST /api/tweets` | Implemented |
| `GET /api/tweets/[id]` | Implemented |
| `PATCH /api/tweets/[id]` | Implemented |
| `DELETE /api/tweets/[id]` | Implemented |

---

_Last updated: 2026-01-28_
