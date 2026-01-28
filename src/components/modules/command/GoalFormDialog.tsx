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
import type { GoalType } from '@prisma/client'

export interface GoalFormData {
  title: string
  type: string
  description?: string
  targetValue?: number
  startDate?: string
  dueDate?: string
}

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: GoalFormData) => void
  defaultType?: GoalType
}

const goalTypes: { id: GoalType; label: string }[] = [
  { id: 'DAILY', label: 'Daily' },
  { id: 'WEEKLY', label: 'Weekly' },
  { id: 'MONTHLY', label: 'Monthly' },
  { id: 'YEARLY', label: 'Yearly' },
]

function getDefaultStartDate(type: GoalType): string {
  const now = new Date()
  switch (type) {
    case 'DAILY':
      return formatDate(now)
    case 'WEEKLY': {
      // Monday of current week
      const day = now.getDay()
      const diff = day === 0 ? -6 : 1 - day
      const monday = new Date(now)
      monday.setDate(now.getDate() + diff)
      return formatDate(monday)
    }
    case 'MONTHLY':
      return formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
    case 'YEARLY':
      return formatDate(new Date(now.getFullYear(), 0, 1))
  }
}

function getDefaultDueDate(type: GoalType): string {
  const now = new Date()
  switch (type) {
    case 'DAILY':
      return formatDate(now)
    case 'WEEKLY': {
      // Sunday of current week
      const day = now.getDay()
      const diff = day === 0 ? 0 : 7 - day
      const sunday = new Date(now)
      sunday.setDate(now.getDate() + diff)
      return formatDate(sunday)
    }
    case 'MONTHLY':
      return formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    case 'YEARLY':
      return formatDate(new Date(now.getFullYear(), 11, 31))
  }
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

export function GoalFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultType = 'MONTHLY',
}: GoalFormDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<GoalType>(defaultType)
  const [targetValue, setTargetValue] = useState('')
  const [startDate, setStartDate] = useState(getDefaultStartDate(defaultType))
  const [dueDate, setDueDate] = useState(getDefaultDueDate(defaultType))

  // Sync default type when dialog opens
  const [lastOpen, setLastOpen] = useState(false)
  if (open && !lastOpen) {
    setType(defaultType)
    setTitle('')
    setDescription('')
    setTargetValue('')
    setStartDate(getDefaultStartDate(defaultType))
    setDueDate(getDefaultDueDate(defaultType))
  }
  if (open !== lastOpen) setLastOpen(open)

  function handleTypeChange(newType: GoalType) {
    setType(newType)
    setStartDate(getDefaultStartDate(newType))
    setDueDate(getDefaultDueDate(newType))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      type,
      description: description || undefined,
      targetValue: targetValue ? parseInt(targetValue, 10) : undefined,
      startDate: startDate
        ? new Date(startDate + 'T00:00:00').toISOString()
        : undefined,
      dueDate: dueDate
        ? new Date(dueDate + 'T00:00:00').toISOString()
        : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goalTitle">Goal *</Label>
            <Input
              id="goalTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "Complete 3 client projects"'
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalDescription">Description</Label>
            <textarea
              id="goalDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="w-full min-h-[60px] rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-1">
              {goalTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTypeChange(t.id)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                    type === t.id
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-border/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalTarget">Target Count</Label>
            <Input
              id="goalTarget"
              type="number"
              min="1"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="e.g. 30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="goalStartDate">Start Date</Label>
              <Input
                id="goalStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalDueDate">Due Date</Label>
              <Input
                id="goalDueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
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
            <Button type="submit">Create Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
