'use client'

import { useState } from 'react'
import { Plus, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'BLOCKED', label: 'Blocked' },
  { id: 'DONE', label: 'Done' },
]

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-sm text-text-secondary">
            Manage your task queue and schedule
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-border">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Task Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-surface-elevated p-4 mb-4">
              <Plus className="h-8 w-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
            <p className="text-sm text-text-secondary mb-4 max-w-sm">
              Create your first task to start organizing your work into
              90-minute blocks.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
