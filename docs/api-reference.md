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

Update an existing task.

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Status:** Planned

---

### DELETE /api/tasks/[id]

Delete a task.

**Status:** Planned

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

**Status:** Planned

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
| `PATCH /api/tasks/[id]` | Planned |
| `DELETE /api/tasks/[id]` | Planned |
| `GET /api/clients` | Implemented |
| `POST /api/clients` | Implemented |
| `GET /api/clients/[id]` | Planned |
| `GET /api/projects` | Implemented |
| `POST /api/projects` | Implemented |
| `GET /api/goals` | Implemented |
| `POST /api/goals` | Implemented |

---

_Last updated: 2026-01-26_
