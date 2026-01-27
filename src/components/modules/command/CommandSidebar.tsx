'use client'

import { useState } from 'react'
import { Target, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoalsPanelContent } from './GoalsPanel'
import { ActivityCatalogContent } from './ActivityCatalog'
import type { Activity, Goal, GoalType } from '@prisma/client'

type SidebarTab = 'goals' | 'activities'

interface CommandSidebarProps {
  // Goals props
  goals: Goal[]
  activeGoalType?: GoalType
  onGoalTypeChange?: (type: GoalType) => void
  onGoalClick?: (id: string) => void
  onAddGoal?: () => void
  onToggleGoalComplete?: (id: string, completed: boolean) => void
  // Activity props
  activities: Activity[]
  onSelectActivity: (activity: Activity) => void
  onCreateActivity: () => void
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (id: string) => void
}

export function CommandSidebar({
  goals,
  activeGoalType,
  onGoalTypeChange,
  onGoalClick,
  onAddGoal,
  onToggleGoalComplete,
  activities,
  onSelectActivity,
  onCreateActivity,
  onEditActivity,
  onDeleteActivity,
}: CommandSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('activities')

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {activeTab === 'goals' ? (
            <Target className="h-4 w-4 text-text-tertiary" />
          ) : (
            <Zap className="h-4 w-4 text-text-tertiary" />
          )}
          <CardTitle className="text-base">
            {activeTab === 'goals' ? 'Goals' : 'Activities'}
          </CardTitle>
        </div>
        {/* Tab Toggle */}
        <div className="flex gap-1 rounded-lg bg-surface-elevated p-1 mt-2">
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
          </button>
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
        </div>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {activeTab === 'goals' ? (
          <GoalsPanelContent
            goals={goals}
            activeType={activeGoalType}
            onTypeChange={onGoalTypeChange}
            onGoalClick={onGoalClick}
            onAddGoal={onAddGoal}
            onToggleComplete={onToggleGoalComplete}
          />
        ) : (
          <ActivityCatalogContent
            activities={activities}
            onSelectActivity={onSelectActivity}
            onCreateActivity={onCreateActivity}
            onEditActivity={onEditActivity}
            onDeleteActivity={onDeleteActivity}
            compact
          />
        )}
      </CardContent>
    </Card>
  )
}
