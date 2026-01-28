'use client'

import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
  className?: string
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn('flex items-center gap-1 rounded-lg border border-border p-1', className)}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7',
          value === 'grid' && 'bg-surface-elevated text-text-primary'
        )}
        onClick={() => onChange('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7',
          value === 'list' && 'bg-surface-elevated text-text-primary'
        )}
        onClick={() => onChange('list')}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
