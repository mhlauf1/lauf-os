# Database Schema

> Prisma-based database schema for LAUF OS

---

## Overview

LAUF OS uses Prisma 7 as the ORM with PostgreSQL (via Supabase). The schema supports all 9 modules with a focus on the MVP (Command Center + Client CRM).

### Key Concepts

- **Prisma as source of truth** - Schema defined in `prisma/schema.prisma`
- **Supabase for Auth** - User trigger syncs `auth.users` → `public.users`
- **Type-safe queries** - Generated TypeScript types from Prisma
- **90-minute blocks** - Tasks default to 90-minute time blocks

---

## Schema Status

| Model | Phase | Status |
|-------|-------|--------|
| `User` | MVP | Complete |
| `Task` | MVP | Complete (+ activityId, goalId) |
| `Activity` | MVP | Complete |
| `Goal` | MVP | Complete (+ tasks relation) |
| `Client` | MVP | Complete |
| `Project` | MVP | Complete |
| `Opportunity` | MVP | Complete |
| `Asset` | MVP | Complete |
| `LibraryItem` | Phase 2 | Schema ready |
| `Workout` | Phase 4 | Schema ready |
| `DailyCheckIn` | Phase 4 | Schema ready |
| `Transaction` | Phase 4 | Schema ready |
| `Contact` | Phase 5 | Schema ready |
| `SocialPost` | Phase 5 | Schema ready |
| `FeedSource` | Phase 3 | Schema ready |
| `FeedItem` | Phase 3 | Schema ready |
| `AITool` | Phase 3 | Schema ready |

---

## Enums

```prisma
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

enum TaskStatus {
  TODO
  IN_PROGRESS
  BLOCKED
  DONE
}

enum EnergyLevel {
  DEEP_WORK      // High focus tasks
  MODERATE       // Normal tasks
  LIGHT          // Low energy tasks
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum ClientStatus {
  ACTIVE
  PAUSED
  COMPLETED
  CHURNED
}

enum HealthScore {
  GREEN          // Happy, engaged
  YELLOW         // Needs attention
  RED            // At risk
}

enum PaymentStatus {
  CURRENT
  PENDING
  OVERDUE
}

enum ProjectStatus {
  PLANNING
  DESIGN
  DEVELOPMENT
  REVIEW
  LAUNCHED
}

enum GoalType {
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}
```

---

## Core Models

### User

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  avatarUrl String?  @map("avatar_url")
  preferences Json   @default("{}")
  timezone  String   @default("America/New_York")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  tasks         Task[]
  goals         Goal[]
  clients       Client[]
  // ... other relations

  @@map("users")
}
```

### Task

The core productivity unit - 90-minute time blocks. Can link to an Activity (for pre-filling defaults) and a Goal (for auto-incrementing progress on completion).

```prisma
model Task {
  id               String       @id @default(uuid())
  userId           String       @map("user_id")
  projectId        String?      @map("project_id")
  activityId       String?      @map("activity_id")
  goalId           String?      @map("goal_id")
  title            String
  description      String?
  category         TaskCategory
  priority         Priority     @default(MEDIUM)
  status           TaskStatus   @default(TODO)
  scheduledDate    DateTime?    @map("scheduled_date") @db.Date
  scheduledTime    String?      @map("scheduled_time") // "09:00"
  timeBlockMinutes Int          @default(90) @map("time_block_minutes")
  energyLevel      EnergyLevel  @default(MODERATE) @map("energy_level")
  linkedAssets     String[]     @default([]) @map("linked_assets")
  completedAt      DateTime?    @map("completed_at")
  createdAt        DateTime     @default(now()) @map("created_at")
  updatedAt        DateTime     @updatedAt @map("updated_at")

  user     User      @relation(...)
  project  Project?  @relation(...)
  activity Activity? @relation(...)
  goal     Goal?     @relation(...)

  @@index([userId])
  @@index([activityId])
  @@index([goalId])
  @@index([scheduledDate])
  @@map("tasks")
}
```

### Activity

A reusable catalog entry. Users build a catalog of activities they do regularly, then select from them to build their day.

```prisma
model Activity {
  id              String       @id @default(uuid())
  userId          String       @map("user_id")
  title           String
  description     String?
  category        TaskCategory
  defaultDuration Int          @default(90) @map("default_duration")
  energyLevel     EnergyLevel  @default(MODERATE) @map("energy_level")
  icon            String?
  isActive        Boolean      @default(true) @map("is_active")
  sortOrder       Int          @default(0) @map("sort_order")
  timesUsed       Int          @default(0) @map("times_used")
  lastUsed        DateTime?    @map("last_used")
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  user  User   @relation(...)
  tasks Task[]

  @@index([userId])
  @@map("activities")
}
```

### Goal

Goals track progress toward targets. When a task linked to a goal is completed, the goal's `currentValue` is auto-incremented.

```prisma
model Goal {
  id           String    @id @default(uuid())
  userId       String    @map("user_id")
  title        String
  description  String?
  type         GoalType  // DAILY, WEEKLY, MONTHLY, YEARLY
  targetValue  Int?      @map("target_value")
  currentValue Int       @default(0) @map("current_value")
  dueDate      DateTime? @map("due_date")
  completedAt  DateTime? @map("completed_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  user  User   @relation(...)
  tasks Task[]

  @@map("goals")
}
```

---

## Client CRM Models

### Client

```prisma
model Client {
  id              String        @id @default(uuid())
  userId          String        @map("user_id")
  name            String
  email           String?
  phone           String?
  company         String?
  industry        String?
  websiteUrl      String?       @map("website_url")
  githubUrl       String?       @map("github_url")
  vercelUrl       String?       @map("vercel_url")
  figmaUrl        String?       @map("figma_url")
  credentials     String?       // Encrypted
  status          ClientStatus  @default(ACTIVE)
  healthScore     HealthScore   @default(GREEN) @map("health_score")
  contractValue   Decimal?      @map("contract_value") @db.Decimal(10, 2)
  monthlyRetainer Decimal?      @map("monthly_retainer") @db.Decimal(10, 2)
  paymentStatus   PaymentStatus @default(CURRENT) @map("payment_status")
  lastContacted   DateTime?     @map("last_contacted")
  nextFollowup    DateTime?     @map("next_followup")
  referredBy      String?       @map("referred_by")
  notes           String?
  metadata        Json          @default("{}")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  user          User          @relation(...)
  projects      Project[]
  assets        Asset[]
  opportunities Opportunity[]

  @@index([userId])
  @@index([healthScore])
  @@map("clients")
}
```

### Project

```prisma
model Project {
  id            String        @id @default(uuid())
  clientId      String        @map("client_id")
  name          String
  description   String?
  type          ProjectType   @default(WEBSITE)
  status        ProjectStatus @default(PLANNING)
  priority      Priority      @default(MEDIUM)
  startDate     DateTime?     @map("start_date") @db.Date
  dueDate       DateTime?     @map("due_date") @db.Date
  budget        Decimal?      @db.Decimal(10, 2)
  paidAmount    Decimal       @default(0) @map("paid_amount") @db.Decimal(10, 2)
  repositoryUrl String?       @map("repository_url")
  stagingUrl    String?       @map("staging_url")
  productionUrl String?       @map("production_url")
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  client Client  @relation(...)
  tasks  Task[]
  assets Asset[]

  @@index([clientId])
  @@index([status])
  @@map("projects")
}
```

### Opportunity

AI-generated upsell opportunities.

```prisma
model Opportunity {
  id          String   @id @default(uuid())
  clientId    String   @map("client_id")
  title       String
  description String?
  value       Decimal? @db.Decimal(10, 2)
  isAiGenerated Boolean @default(false) @map("is_ai_generated")
  isDismissed Boolean  @default(false) @map("is_dismissed")
  isConverted Boolean  @default(false) @map("is_converted")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  client Client @relation(...)

  @@map("opportunities")
}
```

---

## Asset Model

```prisma
model Asset {
  id            String    @id @default(uuid())
  userId        String    @map("user_id")
  projectId     String?   @map("project_id")
  clientId      String?   @map("client_id")
  type          AssetType
  category      String?   // screenshot, mockup, etc.
  name          String
  storagePath   String    @map("storage_path")
  url           String
  thumbnailUrl  String?   @map("thumbnail_url")
  fileSize      Int       @map("file_size")
  mimeType      String    @map("mime_type")
  tags          String[]  @default([])
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@map("assets")
}
```

---

## Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Create migration
npx prisma migrate dev --name <name>

# Deploy migrations
npx prisma migrate deploy
```

---

## User Trigger

When a user signs up via Supabase Auth, a trigger creates the corresponding `public.users` record:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, preferences, timezone, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    '{}',
    'America/New_York',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Query Examples

### Get today's tasks

```typescript
const tasks = await prisma.task.findMany({
  where: {
    userId: user.id,
    scheduledDate: new Date(),
  },
  orderBy: { scheduledTime: 'asc' },
})
```

### Get clients by health score

```typescript
const atRiskClients = await prisma.client.findMany({
  where: {
    userId: user.id,
    healthScore: 'RED',
  },
  include: { projects: true },
})
```

### Get project pipeline

```typescript
const projects = await prisma.project.findMany({
  where: {
    client: { userId: user.id },
  },
  include: { client: true },
  orderBy: { status: 'asc' },
})
```

---

_Last updated: January 2026_
