'use client'

import { useState } from 'react'
import { Zap, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityCatalogContent } from './ActivityCatalog'
import { TaskBacklogContent } from './TaskBacklog'
import type { Activity, Task } from '@prisma/client'

type SidebarTab = 'activities' | 'tasks'

interface CommandSidebarProps {
  // Activity props
  activities: Activity[]
  onSelectActivity: (activity: Activity) => void
  onCreateActivity: () => void
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (id: string) => void
  // Backlog tasks props
  backlogTasks?: Task[]
}

export function CommandSidebar({
  activities,
  onSelectActivity,
  onCreateActivity,
  onEditActivity,
  onDeleteActivity,
  backlogTasks = [],
}: CommandSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('activities')

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {activeTab === 'activities' ? (
            <Zap className="h-4 w-4 text-text-tertiary" />
          ) : (
            <CheckSquare className="h-4 w-4 text-text-tertiary" />
          )}
          <CardTitle className="text-base">
            {activeTab === 'activities' ? 'Activities' : 'Tasks'}
          </CardTitle>
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
            onClick={() => setActiveTab('tasks')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              activeTab === 'tasks'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Tasks
            {backlogTasks.length > 0 && (
              <span className="ml-1 text-[10px] text-text-tertiary">
                ({backlogTasks.length})
              </span>
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {activeTab === 'activities' ? (
          <ActivityCatalogContent
            activities={activities}
            onSelectActivity={onSelectActivity}
            onCreateActivity={onCreateActivity}
            onEditActivity={onEditActivity}
            onDeleteActivity={onDeleteActivity}
            compact
          />
        ) : (
          <TaskBacklogContent tasks={backlogTasks} />
        )}
      </CardContent>
    </Card>
  )
}
