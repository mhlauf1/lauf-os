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
- Updates linked activity's `timesUsed` and `lastUsed` (if `activityId` is set)

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

Delete a task.

**Status:** Implemented

---

## Activities API

### GET /api/activities

Get all active activities for the authenticated user, ordered by sortOrder then usage frequency.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Design Work",
      "description": "Client design deliverables",
      "category": "DESIGN",
      "defaultDuration": 90,
      "energyLevel": "DEEP_WORK",
      "isActive": true,
      "sortOrder": 0,
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

Create a new activity for the catalog.

**Request Body:**
```json
{
  "title": "Design Work",
  "description": "Client design deliverables",
  "category": "DESIGN",
  "defaultDuration": 90,
  "energyLevel": "DEEP_WORK"
}
```

**Status:** Implemented

---

### PATCH /api/activities/[id]

Update an existing activity.

**Request Body:**
```json
{
  "title": "Updated title",
  "defaultDuration": 120,
  "isActive": false
}
```

All fields are optional.

**Status:** Implemented

---

### DELETE /api/activities/[id]

Delete an activity.

**Status:** Implemented

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
      "completedAt": null
    }
  ],
  "error": null
}
```

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
  "dueDate": "2026-01-26"
}
```

**Status:** Implemented

---

### PATCH /api/goals/[id]

Update an existing goal. Supports direct progress updates and completion toggling.

**Request Body:**
```json
{
  "title": "Updated goal",
  "currentValue": 15,
  "targetValue": 30,
  "completedAt": "2026-01-26T00:00:00.000Z"
}
```

All fields are optional. Set `completedAt` to `null` to un-complete.

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
| `GET /api/activities` | Implemented |
| `POST /api/activities` | Implemented |
| `PATCH /api/activities/[id]` | Implemented |
| `DELETE /api/activities/[id]` | Implemented |
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
| `GET /api/goals` | Implemented |
| `POST /api/goals` | Implemented |
| `PATCH /api/goals/[id]` | Implemented |

---

_Last updated: 2026-01-27_
