'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Clock, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { categoryList, getCategoryConfig } from '@/config/categories'
import type { Priority, EnergyLevel, Activity, Goal, Task } from '@prisma/client'

export interface TaskFormData {
  title: string
  description: string
  category: string
  priority: Priority
  energyLevel: EnergyLevel
  timeBlockMinutes: number
  scheduledDate: string
  scheduledTime: string
  activityId?: string
  goalId?: string
}

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TaskFormData) => void
  initialData?: Partial<TaskFormData>
  isEditing?: boolean
  fromActivity?: Activity | null
  goals?: Goal[]
  activities?: Activity[]
  backlogTasks?: Task[]
  onScheduleExistingTask?: (taskId: string, scheduledDate: string, scheduledTime: string) => void
}

type FormTab = 'catalog' | 'manual' | 'tasks'

const timeOptions = [30, 45, 60, 90, 120, 180]

const PRESET_COLORS = [
  '#3b82f6', '#8b5cf6', '#22c55e', '#f97316', '#ef4444',
  '#6b7280', '#06b6d4', '#ec4899', '#a78bfa', '#fbbf24',
]

function getDefaultFormData(
  initialData?: Partial<TaskFormData>,
  fromActivity?: Activity | null
): TaskFormData {
  if (fromActivity) {
    return {
      title: fromActivity.title,
      description: '',
      category: fromActivity.category,
      priority: 'MEDIUM',
      energyLevel: fromActivity.energyLevel,
      timeBlockMinutes: fromActivity.defaultDuration,
      scheduledDate: initialData?.scheduledDate || '',
      scheduledTime: initialData?.scheduledTime || '',
      activityId: fromActivity.id,
      goalId: initialData?.goalId || '',
    }
  }

  return {
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'CODE',
    priority: initialData?.priority || 'MEDIUM',
    energyLevel: initialData?.energyLevel || 'MODERATE',
    timeBlockMinutes: initialData?.timeBlockMinutes || 90,
    scheduledDate: initialData?.scheduledDate || '',
    scheduledTime: initialData?.scheduledTime || '',
    activityId: initialData?.activityId || '',
    goalId: initialData?.goalId || '',
  }
}

export function TaskForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
  fromActivity,
  goals = [],
  activities = [],
  backlogTasks = [],
  onScheduleExistingTask,
}: TaskFormProps) {
  const formKey = open ? `${fromActivity?.id ?? 'manual'}-${initialData?.scheduledTime ?? ''}` : 'closed'
  const [formData, setFormData] = useState<TaskFormData>(
    getDefaultFormData(initialData, fromActivity)
  )

  const hasActivities = activities.length > 0
  const hasBacklog = backlogTasks.length > 0
  const defaultTab: FormTab = hasActivities ? 'catalog' : hasBacklog ? 'tasks' : 'manual'
  const [formTab, setFormTab] = useState<FormTab>(defaultTab)

  // Reset form data when dialog opens with different context
  const [lastKey, setLastKey] = useState(formKey)
  if (formKey !== lastKey) {
    setLastKey(formKey)
    if (open) {
      setFormData(getDefaultFormData(initialData, fromActivity))
      const resetTab: FormTab = hasActivities ? 'catalog' : hasBacklog ? 'tasks' : 'manual'
      setFormTab(resetTab)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  function handlePickActivity(activity: Activity) {
    setFormData({
      title: activity.title,
      description: '',
      category: activity.category,
      priority: 'MEDIUM',
      energyLevel: activity.energyLevel,
      timeBlockMinutes: activity.defaultDuration,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      activityId: activity.id,
      goalId: formData.goalId,
    })
    setFormTab('manual')
  }

  function handlePickTask(task: Task) {
    if (onScheduleExistingTask) {
      onScheduleExistingTask(task.id, formData.scheduledDate, formData.scheduledTime)
    }
  }

  const isFromActivity = !!fromActivity
  const showTabs = !isFromActivity && !isEditing && (hasActivities || hasBacklog)
  const dialogTitle = isEditing
    ? 'Edit Task'
    : isFromActivity
      ? `Add "${fromActivity.title}" Block`
      : 'Create New Task'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        {/* Tab toggle when creating without a pre-selected activity */}
        {showTabs && (
          <div className="flex gap-1 rounded-lg bg-surface-elevated p-1">
            {hasActivities && (
              <button
                type="button"
                onClick={() => setFormTab('catalog')}
                className={cn(
                  'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  formTab === 'catalog'
                    ? 'bg-surface text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                From Catalog
              </button>
            )}
            {hasBacklog && (
              <button
                type="button"
                onClick={() => setFormTab('tasks')}
                className={cn(
                  'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  formTab === 'tasks'
                    ? 'bg-surface text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                From Tasks
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                  {backlogTasks.length}
                </Badge>
              </button>
            )}
            <button
              type="button"
              onClick={() => setFormTab('manual')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                formTab === 'manual'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Manual
            </button>
          </div>
        )}

        {/* Catalog picker */}
        {showTabs && formTab === 'catalog' ? (
          <CatalogPicker activities={activities} onPick={handlePickActivity} />
        ) : showTabs && formTab === 'tasks' ? (
          <TaskPicker tasks={backlogTasks} onPick={handlePickTask} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title — hidden when from activity (shown in dialog header) */}
            {!isFromActivity && (
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="What needs to be done?"
                  required
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {isFromActivity ? 'What will you work on?' : 'Description'}
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={
                  isFromActivity
                    ? 'What will you do in this block?'
                    : 'Add more details...'
                }
                className="w-full min-h-[80px] rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Category + Time Block — 2-column row */}
            {isFromActivity ? (
              /* Activity-based: only show duration (category auto-set) */
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select
                  value={String(formData.timeBlockMinutes)}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, timeBlockMinutes: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((mins) => (
                      <SelectItem key={mins} value={String(mins)}>
                        {mins}m
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <CategoryCombobox
                    value={formData.category}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time Block</Label>
                  <Select
                    value={String(formData.timeBlockMinutes)}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, timeBlockMinutes: Number(value) }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((mins) => (
                        <SelectItem key={mins} value={String(mins)}>
                          {mins}m
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Goal Link — grouped by type */}
            {goals.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="goalId">Link to Goal (optional)</Label>
                <select
                  id="goalId"
                  value={formData.goalId || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      goalId: e.target.value || undefined,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">No goal</option>
                  {(['MONTHLY', 'WEEKLY', 'DAILY', 'YEARLY'] as const).map((type) => {
                    const typeGoals = goals.filter((g) => g.type === type)
                    if (typeGoals.length === 0) return null
                    return (
                      <optgroup key={type} label={type.charAt(0) + type.slice(1).toLowerCase()}>
                        {typeGoals.map((goal) => (
                          <option key={goal.id} value={goal.id}>
                            {goal.title}
                            {goal.targetValue
                              ? ` (${goal.currentValue}/${goal.targetValue})`
                              : ''}
                          </option>
                        ))}
                      </optgroup>
                    )
                  })}
                </select>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Save Changes' : isFromActivity ? 'Add Block' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Searchable category combobox with "+" add button
interface CustomCategory {
  id: string
  label: string
  color: string
}

function CategoryCombobox({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#3b82f6')

  // Resolve display info from built-in or custom categories
  const builtIn = categoryList.find((c) => c.id === value)
  const custom = customCategories.find((c) => c.id === value)
  const selectedLabel = builtIn?.label ?? custom?.label ?? value
  const selectedColor = builtIn?.color ?? custom?.color ?? '#6b7280'

  function handleAddCategory() {
    const name = newName.trim()
    if (!name) return
    const id = name.toUpperCase().replace(/\s+/g, '_')
    setCustomCategories((prev) => [...prev, { id, label: name, color: newColor }])
    onChange(id)
    setNewName('')
    setNewColor('#3b82f6')
    setAddOpen(false)
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: selectedColor }}
              />
              {selectedLabel}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categoryList.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.label}
                    onSelect={() => {
                      onChange(cat.id)
                      setOpen(false)
                    }}
                  >
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === cat.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
                {customCategories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.label}
                    onSelect={() => {
                      onChange(cat.id)
                      setOpen(false)
                    }}
                  >
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === cat.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Add new category */}
      <Popover open={addOpen} onOpenChange={setAddOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0" type="button">
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 space-y-3">
          <p className="text-sm font-medium">New Category</p>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCategory()
              }
            }}
          />
          <div className="space-y-1.5">
            <Label className="text-xs text-text-secondary">Color</Label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className={cn(
                    'h-6 w-6 rounded-full border-2 transition-transform',
                    newColor === color
                      ? 'border-white scale-110'
                      : 'border-transparent hover:scale-110'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="w-full"
            onClick={handleAddCategory}
            disabled={!newName.trim()}
          >
            Add Category
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Compact catalog picker shown inside the TaskForm dialog
const energyLabelsMap: Record<string, string> = {
  DEEP_WORK: 'Deep',
  MODERATE: 'Moderate',
  LIGHT: 'Light',
}

function CatalogPicker({
  activities,
  onPick,
}: {
  activities: Activity[]
  onPick: (activity: Activity) => void
}) {
  return (
    <div className="max-h-[400px] overflow-y-auto space-y-2">
      <p className="text-xs text-text-tertiary mb-2">
        Pick an activity to pre-fill the form
      </p>
      <div className="grid grid-cols-2 gap-2">
        {activities.map((activity) => {
          const cat = getCategoryConfig(activity.category)
          return (
            <button
              key={activity.id}
              type="button"
              onClick={() => onPick(activity)}
              className={cn(
                'w-full rounded-lg border border-border p-3 text-left transition-all border-l-4',
                'hover:border-border/80 hover:bg-surface-elevated'
              )}
              style={{ borderLeftColor: cat.color }}
            >
              <p className="font-medium text-sm">{activity.title}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge
                  variant="secondary"
                  className={cn('text-[10px] px-1.5 py-0', cat.textColor)}
                >
                  {cat.label}
                </Badge>
                <span className="flex items-center gap-0.5 text-[10px] text-text-tertiary">
                  <Clock className="h-3 w-3" />
                  {activity.defaultDuration}m
                </span>
                <span className="text-[10px] text-text-tertiary">
                  {energyLabelsMap[activity.energyLevel]}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Task picker — schedule an existing unscheduled task into the current slot
const statusLabelsMap: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
}

function TaskPicker({
  tasks,
  onPick,
}: {
  tasks: Task[]
  onPick: (task: Task) => void
}) {
  return (
    <div className="max-h-[400px] overflow-y-auto space-y-2">
      <p className="text-xs text-text-tertiary mb-2">
        Pick a backlog task to schedule into this slot
      </p>
      <div className="grid grid-cols-2 gap-2">
        {tasks.map((task) => {
          const cat = getCategoryConfig(task.category)
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onPick(task)}
              className={cn(
                'w-full rounded-lg border border-border p-3 text-left transition-all border-l-4',
                'hover:border-border/80 hover:bg-surface-elevated'
              )}
              style={{ borderLeftColor: cat.color }}
            >
              <p className="font-medium text-sm">{task.title}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge
                  variant="secondary"
                  className={cn('text-[10px] px-1.5 py-0', cat.textColor)}
                >
                  {cat.label}
                </Badge>
                <span className="flex items-center gap-0.5 text-[10px] text-text-tertiary">
                  <Clock className="h-3 w-3" />
                  {task.timeBlockMinutes || 90}m
                </span>
                <span className="text-[10px] text-text-tertiary">
                  {statusLabelsMap[task.status] || task.status}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
