'use client'

import { useState } from 'react'
import { Zap, Target, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ActivityCatalogContent } from './ActivityCatalog'
import { GoalsPanelContent } from './GoalsPanel'
import type { Activity } from '@prisma/client'
import type { GoalWithCounts } from '@/hooks/use-goals'

type SidebarTab = 'activities' | 'goals'

interface CommandSidebarProps {
  activities: Activity[]
  goals: GoalWithCounts[]
  onSelectActivity: (activity: Activity) => void
  onAddGoal?: () => void
}

export function CommandSidebar({
  activities,
  goals,
  onSelectActivity,
  onAddGoal,
}: CommandSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('activities')

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'activities' ? (
              <Zap className="h-4 w-4 text-text-tertiary" />
            ) : (
              <Target className="h-4 w-4 text-text-tertiary" />
            )}
            <CardTitle className="text-base">
              {activeTab === 'activities' ? 'Activities' : 'Goals'}
            </CardTitle>
          </div>
          {activeTab === 'goals' && onAddGoal && (
            <Button variant="ghost" size="sm" onClick={onAddGoal}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
        {/* Tab Toggle */}
        <div className="flex gap-1 rounded-lg bg-surface-elevated p-1 mt-2">
          <button
            onClick={() => setActiveTab('activities')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              activeTab === 'activities'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              activeTab === 'goals'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Goals
            {goals.length > 0 && (
              <span className="ml-1 text-[10px] text-text-tertiary">
                ({goals.filter((g) => !g.completedAt).length})
              </span>
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {activeTab === 'activities' ? (
          <ActivityCatalogContent
            activities={activities}
            onSelectActivity={onSelectActivity}
            compact
          />
        ) : (
          <GoalsPanelContent goals={goals} />
        )}
      </CardContent>
    </Card>
  )
}
