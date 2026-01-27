'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  Users,
  Folder,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CommandCenterPage() {
  const [currentDate] = useState(new Date())

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Command Center</h1>
          <p className="text-sm text-text-secondary">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Today&apos;s Blocks
            </CardTitle>
            <Clock className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / 4</div>
            <p className="text-xs text-text-tertiary">90-min blocks completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Weekly Goals
            </CardTitle>
            <Target className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-text-tertiary">0 of 0 completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-text-tertiary">0 need follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Active Projects
            </CardTitle>
            <Folder className="h-4 w-4 text-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-text-tertiary">across 0 clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Timeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Today&apos;s Schedule</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Today</span>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'].map(
                (time) => (
                  <div
                    key={time}
                    className="flex items-center gap-4 rounded-lg border border-dashed border-border p-4 transition-colors hover:border-accent/50 hover:bg-surface"
                  >
                    <span className="w-16 text-sm text-text-secondary">
                      {time}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-text-tertiary">
                        Empty 90-min block
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Task Queue */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Task Queue</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-sm text-text-tertiary">
              No tasks in queue. Create your first task to get started.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
