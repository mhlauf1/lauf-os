'use client'

import { Zap } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCategoryConfig } from '@/config/categories'
import type { Activity } from '@prisma/client'

interface ActivityCatalogProps {
  activities: Activity[]
  onSelectActivity: (activity: Activity) => void
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
  compact = false,
}: ActivityCatalogContentProps) {
  return (
    <div>
      {activities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-text-tertiary">
            Loading activity presets...
          </p>
        </div>
      ) : (
        <div className={cn(
          'grid gap-2',
          compact
            ? 'grid-cols-1'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        )}>
          {activities.map((activity) => (
            <DraggableActivityCard
              key={activity.id}
              activity={activity}
              onSelect={() => onSelectActivity(activity)}
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
        />
      </CardContent>
    </Card>
  )
}

interface ActivityCardProps {
  activity: Activity
  onSelect: () => void
}

function DraggableActivityCard({ activity, onSelect }: ActivityCardProps) {
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
        isDragging={isDragging}
      />
    </div>
  )
}

export function ActivityCardInner({
  activity,
  onSelect,
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
      {/* Content */}
      <div className="space-y-2">
        <p className="font-medium text-sm">{activity.title}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className={cn('text-[10px] px-1.5 py-0', categoryConfig.textColor)}
          >
            {categoryConfig.label}
          </Badge>
          <span className="text-[10px] text-text-tertiary">
            {energyLabels[activity.energyLevel]}
          </span>
        </div>
      </div>
    </button>
  )
}
