'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { categoryList } from '@/config/categories'
import type { TaskCategory, Priority, EnergyLevel, Activity, Goal } from '@prisma/client'

export interface TaskFormData {
  title: string
  description: string
  category: TaskCategory
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
}

const priorities: { value: Priority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
]

const energyLevels: { value: EnergyLevel; label: string }[] = [
  { value: 'DEEP_WORK', label: 'Deep Work' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'LIGHT', label: 'Light' },
]

const timeOptions = [30, 45, 60, 90, 120, 180]

function getDefaultFormData(
  initialData?: Partial<TaskFormData>,
  fromActivity?: Activity | null
): TaskFormData {
  if (fromActivity) {
    return {
      title: fromActivity.title,
      description: fromActivity.description || '',
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
}: TaskFormProps) {
  const formKey = open ? `${fromActivity?.id ?? 'manual'}-${initialData?.scheduledTime ?? ''}` : 'closed'
  const [formData, setFormData] = useState<TaskFormData>(
    getDefaultFormData(initialData, fromActivity)
  )

  // Reset form data when dialog opens with different context
  const [lastKey, setLastKey] = useState(formKey)
  if (formKey !== lastKey) {
    setLastKey(formKey)
    if (open) {
      setFormData(getDefaultFormData(initialData, fromActivity))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isFromActivity = !!fromActivity
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
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

          {/* Description - collapsed for quick-add */}
          {!isFromActivity && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Add more details..."
                className="w-full min-h-[80px] rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-4 gap-2">
              {categoryList.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: cat.id }))
                  }
                  className={`rounded-lg border p-2 text-xs font-medium transition-colors ${
                    formData.category === cat.id
                      ? 'border-text-primary/30 bg-white/10 text-text-primary'
                      : 'border-border text-text-secondary hover:border-border/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Energy */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex gap-1">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, priority: p.value }))
                    }
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                      formData.priority === p.value
                        ? 'border-text-primary/30 bg-white/10 text-text-primary'
                        : 'border-border text-text-secondary hover:border-border/80'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Energy Level</Label>
              <div className="flex gap-1">
                {energyLevels.map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, energyLevel: e.value }))
                    }
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                      formData.energyLevel === e.value
                        ? 'border-text-primary/30 bg-white/10 text-text-primary'
                        : 'border-border text-text-secondary hover:border-border/80'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Block */}
          <div className="space-y-2">
            <Label>Time Block (minutes)</Label>
            <div className="flex gap-2">
              {timeOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, timeBlockMinutes: mins }))
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    formData.timeBlockMinutes === mins
                      ? 'border-text-primary/30 bg-white/10 text-text-primary'
                      : 'border-border text-text-secondary hover:border-border/80'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

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

          {/* Goal Link */}
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
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                    {goal.targetValue
                      ? ` (${goal.currentValue}/${goal.targetValue})`
                      : ''}
                  </option>
                ))}
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
      </DialogContent>
    </Dialog>
  )
}
