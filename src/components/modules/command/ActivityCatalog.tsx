'use client'

import { Plus, Zap, Clock, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCategoryConfig } from '@/config/categories'
import type { Activity } from '@prisma/client'

interface ActivityCatalogProps {
  activities: Activity[]
  onSelectActivity: (activity: Activity) => void
  onCreateActivity: () => void
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (id: string) => void
}

interface ActivityCatalogContentProps extends ActivityCatalogProps {
  compact?: boolean
}

const energyLabels: Record<string, string> = {
  DEEP_WORK: 'Deep',
  MODERATE: 'Moderate',
  LIGHT: 'Light',
}

export function ActivityCatalogContent({
  activities,
  onSelectActivity,
  onCreateActivity,
  onEditActivity,
  onDeleteActivity,
  compact = false,
}: ActivityCatalogContentProps) {
  return (
    <div>
      {/* New Activity button */}
      <div className="flex justify-end mb-3">
        <Button variant="ghost" size="sm" onClick={onCreateActivity}>
          <Plus className="mr-1 h-4 w-4" />
          New Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-text-tertiary">
            No activities yet. Create your first activity to start building
            your day.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={onCreateActivity}
          >
            <Plus className="mr-1 h-4 w-4" />
            Create Activity
          </Button>
        </div>
      ) : (
        <div className={cn(
          'grid gap-3',
          compact
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        )}>
          {activities.map((activity) => (
            <DraggableActivityCard
              key={activity.id}
              activity={activity}
              onSelect={() => onSelectActivity(activity)}
              onEdit={() => onEditActivity(activity)}
              onDelete={() => onDeleteActivity(activity.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ActivityCatalog({
  activities,
  onSelectActivity,
  onCreateActivity,
  onEditActivity,
  onDeleteActivity,
}: ActivityCatalogProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-text-tertiary" />
            <CardTitle className="text-base">Activity Catalog</CardTitle>
            <span className="text-xs text-text-tertiary">
              Click or drag to add
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ActivityCatalogContent
          activities={activities}
          onSelectActivity={onSelectActivity}
          onCreateActivity={onCreateActivity}
          onEditActivity={onEditActivity}
          onDeleteActivity={onDeleteActivity}
        />
      </CardContent>
    </Card>
  )
}

interface ActivityCardProps {
  activity: Activity
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

function DraggableActivityCard({ activity, onSelect, onEdit, onDelete }: ActivityCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `activity-${activity.id}`,
    data: { type: 'activity', activity },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ActivityCardInner
        activity={activity}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  )
}

export function ActivityCardInner({
  activity,
  onSelect,
  onEdit,
  onDelete,
  isDragging = false,
}: ActivityCardProps & { isDragging?: boolean }) {
  const categoryConfig = getCategoryConfig(activity.category)

  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative w-full rounded-lg border border-border p-3 text-left transition-all',
        'hover:border-border/80 hover:bg-surface-elevated',
        'border-l-4',
        isDragging && 'opacity-50 ring-2 ring-accent'
      )}
      style={{ borderLeftColor: categoryConfig.color }}
    >
      {/* Menu */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-400"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <p className="font-medium text-sm pr-6">{activity.title}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className={cn('text-[10px] px-1.5 py-0', categoryConfig.textColor)}
          >
            {categoryConfig.label}
          </Badge>
          <span className="flex items-center gap-0.5 text-[10px] text-text-tertiary">
            <Clock className="h-3 w-3" />
            {activity.defaultDuration}m
          </span>
          <span className="text-[10px] text-text-tertiary">
            {energyLabels[activity.energyLevel]}
          </span>
        </div>

        {activity.timesUsed > 0 && (
          <p className="text-[10px] text-text-tertiary">
            used {activity.timesUsed}x
          </p>
        )}
      </div>
    </button>
  )
}
