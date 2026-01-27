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
import type { TaskCategory, EnergyLevel, Activity } from '@prisma/client'

interface ActivityFormData {
  title: string
  description: string
  category: TaskCategory
  defaultDuration: number
  energyLevel: EnergyLevel
}

interface ActivityFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ActivityFormData) => void
  editingActivity?: Activity | null
}

const energyLevels: { value: EnergyLevel; label: string }[] = [
  { value: 'DEEP_WORK', label: 'Deep Work' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'LIGHT', label: 'Light' },
]

const durationOptions = [30, 45, 60, 90, 120, 180]

function getDefaultData(activity?: Activity | null): ActivityFormData {
  if (activity) {
    return {
      title: activity.title,
      description: activity.description || '',
      category: activity.category,
      defaultDuration: activity.defaultDuration,
      energyLevel: activity.energyLevel,
    }
  }
  return {
    title: '',
    description: '',
    category: 'CODE',
    defaultDuration: 90,
    energyLevel: 'MODERATE',
  }
}

export function ActivityForm({
  open,
  onOpenChange,
  onSubmit,
  editingActivity,
}: ActivityFormProps) {
  const formKey = open ? `${editingActivity?.id ?? 'new'}` : 'closed'
  const [formData, setFormData] = useState<ActivityFormData>(getDefaultData(editingActivity))

  // Reset form data when dialog opens with different activity
  const [lastKey, setLastKey] = useState(formKey)
  if (formKey !== lastKey) {
    setLastKey(formKey)
    if (open) {
      setFormData(getDefaultData(editingActivity))
    }
  }

  const isEditing = !!editingActivity

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Activity' : 'New Activity'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="actTitle">Title *</Label>
            <Input
              id="actTitle"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. Design Work, Tweet, Fitness"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actDesc">Description</Label>
            <Input
              id="actDesc"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Optional description"
            />
          </div>

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
                      ? `border-current ${cat.textColor} ${cat.bgColor}`
                      : 'border-border text-text-secondary hover:border-border/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Duration</Label>
            <div className="flex gap-2">
              {durationOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      defaultDuration: mins,
                    }))
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    formData.defaultDuration === mins
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-border/80'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Energy Level</Label>
            <div className="flex gap-2">
              {energyLevels.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, energyLevel: e.value }))
                  }
                  className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    formData.energyLevel === e.value
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-border/80'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Create Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
