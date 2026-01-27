# Next Session: Critical Fixes + Modular Hardening

> **STATUS: COMPLETED** (2026-01-27) — All 4 workstreams implemented, build passes with zero TypeScript errors.

~~Pick up here. Four workstreams, in order. Each one is self-contained — finish it, test it, then move to the next.~~

---

## 1. Fix Critical Bugs (do first)

### 1a. GoalsPanel dashboard tabs are broken
**Problem:** Dashboard fetches `useGoals({ type: 'MONTHLY', completed: 'false' })` — only monthly goals. When you click Daily or Weekly in the GoalsPanel, those tabs are always empty because the data was never fetched.

**File:** `src/app/(dashboard)/page.tsx`
- Change the query to fetch ALL incomplete goals: `useGoals({ completed: 'false' })` (remove the `type` filter)
- The GoalsPanel already filters by `activeType` client-side, so this just works once the data includes all types
- Also update the `GoalFormDialog` on the dashboard to let you pick goal type (currently hardcodes `MONTHLY`)

**Test:** Create a Daily goal, switch to Daily tab in GoalsPanel — it should appear.

### 1b. Date timezone bug in daily timeline
**Problem:** `new Date('2025-01-26')` parses as UTC midnight, which is `2025-01-25T19:00:00` in EST. Tasks filtered by `date` on the dashboard may not match.

**Files:**
- `src/app/api/tasks/route.ts` (line 54): `dateFilter = { scheduledDate: new Date(date) }`
- `src/app/(dashboard)/page.tsx` (line 38): sends `todayStr` as `yyyy-MM-dd`

**Fix:** In the API route, when filtering by exact `date`, use a date range instead:
```typescript
if (date) {
  const d = new Date(date + 'T00:00:00') // local midnight, not UTC
  const nextDay = new Date(d)
  nextDay.setDate(nextDay.getDate() + 1)
  dateFilter = { scheduledDate: { gte: d, lt: nextDay } }
}
```
Same approach for `dateFrom`/`dateTo` — append `T00:00:00` to avoid UTC shift:
```typescript
...(dateFrom && { gte: new Date(dateFrom + 'T00:00:00') }),
...(dateTo && { lte: new Date(dateTo + 'T23:59:59') }),
```

**Test:** Create a task for today, refresh the dashboard — it should show in the timeline.

### 1c. useAuth infinite re-render
**Problem:** `createClient()` is called in the component body, creating a new Supabase client every render. The `useEffect` dependency on `supabase.auth` re-fires every render.

**File:** `src/hooks/use-auth.ts`

**Fix:** Wrap the client creation in `useMemo`:
```typescript
const supabase = useMemo(() => createClient(), [])
```

**Test:** Check browser console — no infinite re-renders or "Maximum update depth exceeded" errors.

### 1d. Forms close before mutation resolves
**Problem:** `TaskForm` and `ActivityForm` call `onOpenChange(false)` immediately after `onSubmit()`, before the async mutation finishes. If it fails, the user never knows.

**Files:**
- `src/components/modules/command/TaskForm.tsx` (line 111-115)
- `src/components/modules/command/ActivityForm.tsx` (line 79-83)

**Fix option A (quick):** Move the dialog close into the mutation's `onSuccess` callback. In each page that uses these forms, change the handler:
```typescript
// Before:
function handleCreateTask(data: TaskFormData) {
  createTask.mutate({ ... })
}
// TaskForm internally closes after calling onSubmit

// After:
function handleCreateTask(data: TaskFormData) {
  createTask.mutate({ ... }, {
    onSuccess: () => setTaskFormOpen(false),
    onError: (err) => { /* show error somehow */ },
  })
}
// TaskForm should NOT close itself — let the parent control it
```

This means `TaskForm` and `ActivityForm` should remove their `onOpenChange(false)` from `handleSubmit`. The parent decides when to close.

**Files to update:**
- `TaskForm.tsx` — remove `onOpenChange(false)` from `handleSubmit`
- `ActivityForm.tsx` — remove `onOpenChange(false)` from `handleSubmit`
- `src/app/(dashboard)/page.tsx` — add `onSuccess: () => setTaskFormOpen(false)` to `createTask.mutate`
- `src/app/(dashboard)/command/tasks/page.tsx` — same
- `src/app/(dashboard)/command/calendar/page.tsx` — same
- `src/app/(dashboard)/page.tsx` — same for `createActivity.mutate` / `updateActivity.mutate`

**Test:** Create a task — dialog should stay open briefly while saving, then close on success.

---

## 2. Wire Up Dead Buttons (or remove them)

Every button in the UI should either work or not exist. Go through each:

### Dashboard (TimeBlock)
**File:** `src/components/modules/command/TimeBlock.tsx`
- "Delete" dropdown → add `onDelete` prop, wire to `useDeleteTask`
- "Reschedule" dropdown → either wire to open TaskForm in edit mode, or remove for now

### Tasks Page (TaskCard)
**File:** `src/components/modules/command/TaskCard.tsx`
- "Edit" dropdown → needs an edit flow (open TaskForm pre-filled). For now, can remove or stub with a TODO comment
- "Schedule" dropdown → same, remove if not ready

**File:** `src/app/(dashboard)/command/tasks/page.tsx`
- Wire `onDelete` (already done), add `onEdit` if implementing

### Clients Page (ClientCard)
**File:** `src/components/modules/clients/ClientCard.tsx`
- "Edit" → link to `/clients/[id]` detail page (already exists) or open edit form
- "Add Project" → remove for now (no project create form exists yet)
- "Log Contact" → remove for now

### Projects Page (ProjectKanban)
**File:** `src/components/modules/clients/ProjectKanban.tsx`
- "+" button in each column → remove the button, or wire to a project create form
- "Edit" dropdown on project cards → link to `/projects/[id]`

**Strategy:** If a feature isn't ready, remove the button entirely. Don't ship buttons that do nothing.

---

## 3. Add Error Handling + Delete Confirmations

### 3a. Toast notification system
Install a toast library or use shadcn's toast component.

```bash
npx shadcn@latest add sonner
```

Then in each mutation's `onError`, show a toast:
```typescript
createTask.mutate(data, {
  onSuccess: () => { setTaskFormOpen(false); toast.success('Task created') },
  onError: (err) => toast.error(err.message || 'Failed to create task'),
})
```

### 3b. Delete confirmations
**Files:**
- `src/app/(dashboard)/clients/[id]/page.tsx` — `handleDelete`
- `src/app/(dashboard)/projects/[id]/page.tsx` — `handleDelete`
- `src/app/(dashboard)/clients/page.tsx` — `ClientCard` onDelete

Add a confirmation dialog before destructive deletes. Use shadcn's AlertDialog:
```bash
npx shadcn@latest add alert-dialog
```

This matters because deleting a client cascades to all their projects and tasks.

---

## 4. Fix Cache Invalidation Gaps

**File:** `src/hooks/use-tasks.ts`
- `useDeleteTask.onSuccess` → also invalidate `['goals']` and `['activities']`

**File:** `src/hooks/use-clients.ts`
- `useDeleteClient.onSuccess` → also invalidate `['projects']`

**File:** `src/hooks/use-projects.ts`
- `useCreateProject.onSuccess` → also invalidate `['clients']`
- `useDeleteProject.onSuccess` → also invalidate `['clients']`, `['tasks']`

---

## After These 4 Workstreams

The app will be in a solid state where every button works, errors are visible, and data stays consistent. From there, the next phase is going page-by-page to add the missing features (edit flows, project creation from client, etc.) and eventually the remaining modules (Creative Library, Intel Feed, etc.).

---

## Quick Reference: Files Touched

| Workstream | Files |
|-----------|-------|
| 1a. Goals tabs | `src/app/(dashboard)/page.tsx` |
| 1b. Timezone | `src/app/api/tasks/route.ts` |
| 1c. useAuth | `src/hooks/use-auth.ts` |
| 1d. Form close | `TaskForm.tsx`, `ActivityForm.tsx`, `page.tsx` (dashboard), `tasks/page.tsx`, `calendar/page.tsx` |
| 2. Dead buttons | `TimeBlock.tsx`, `TaskCard.tsx`, `ClientCard.tsx`, `ProjectKanban.tsx` + their parent pages |
| 3a. Toasts | `providers.tsx` or layout, all mutation callsites |
| 3b. Delete confirm | `clients/[id]/page.tsx`, `projects/[id]/page.tsx`, `clients/page.tsx` |
| 4. Cache | `use-tasks.ts`, `use-clients.ts`, `use-projects.ts` |
