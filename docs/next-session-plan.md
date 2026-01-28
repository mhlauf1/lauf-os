# Next Session Plan

> **Previous Session:** Goal Progress & Cascades (2026-01-28) — Complete
>
> Branch: `feat/goal-progress-and-cascades`

---

## What Was Completed

### Goal Progress & Cascades (v0.8.0)
- Goal model: added `startDate` for pace tracking, `libraryItems` relation
- LibraryItem model: added `goalId` for library-goal linking
- Goal cascades utility (`goal-cascades.ts`): `computeBreakdown()` with expectedPerWeek/Day/ByNow, isOnTrack
- Zod validation schemas extracted to `goal.schema.ts`
- `DELETE /api/goals/[id]` endpoint
- `PATCH /api/goals/[id]` supports atomic `incrementValue`, auto-complete/reopen
- `GET /api/goals` supports `includeBreakdown` query param
- Task revert (DONE → non-DONE) decrements linked goal + activity
- Task delete (when DONE) decrements linked goal
- Task completion auto-completes goal when target reached
- Library items linked to goals auto-increment/decrement on create/update/delete
- New components: GoalCard, GoalProgressBar, GoalFormDialog (startDate/dueDate)
- GoalsPanel overhaul: unified view, sorted by behind-pace first
- Goals page: perspective views (Month/Week/Day), increment/decrement buttons, delete
- Dashboard: compact goals overview with progress bars, "View All" link
- TaskForm + LibraryItemForm: goal dropdown grouped by type (optgroup)
- React Query hooks: `useIncrementGoal`, `useDeleteGoal`, `GoalWithCounts` type
- Library mutations invalidate goals cache

---

## Next Priorities

### 1. Database Migration
- Still waiting for production Supabase credentials
- Once available: `npm run prisma:migrate` to sync schema (includes Goal startDate, LibraryItem goalId, TweetDraft model)

### 2. Social Manager — Publishing
- X/Twitter API integration for publishing drafts
- Status flow: READY → POSTED with `postedAt` timestamp
- Tweet scheduling with calendar view

### 3. Remaining Polish Items
- Add task category filtering on tasks page
- Add inline edit flows for clients and projects
- Drag tasks to different days on calendar view
- Add Zod schemas for all remaining forms (client-side validation)
- Goal editing (currently only create + delete, no edit dialog)

### 4. Phase 3: Intel Feed + AI Hub
- RSS feed aggregation
- Article summaries with AI
- AI tool directory and cheat sheets
- Basic Claude API integration

### 5. Stretch Goals
- Supabase Storage integration for file uploads
- Client asset management
- Health score auto-calculation
- Tweet analytics dashboard

---

_Last updated: 2026-01-28_
