'use client'

import { useState } from 'react'
import { Plus, Folder, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const pipelineStages = [
  { id: 'PLANNING', label: 'Planning', color: 'bg-gray-500' },
  { id: 'DESIGN', label: 'Design', color: 'bg-violet-500' },
  { id: 'DEVELOPMENT', label: 'Development', color: 'bg-blue-500' },
  { id: 'REVIEW', label: 'Review', color: 'bg-yellow-500' },
  { id: 'LAUNCHED', label: 'Launched', color: 'bg-green-500' },
]

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-text-secondary">
            Track project progress across all clients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-sm ${
                viewMode === 'kanban'
                  ? 'bg-surface-elevated text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm ${
                viewMode === 'list'
                  ? 'bg-surface-elevated text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              List
            </button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-72">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <CardTitle className="text-sm font-medium">
                    {stage.label}
                  </CardTitle>
                  <span className="ml-auto text-sm text-text-tertiary">0</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 min-h-[200px]">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-xs text-text-tertiary">
                    No projects in {stage.label.toLowerCase()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-surface-elevated p-4 mb-4">
              <Folder className="h-8 w-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-sm text-text-secondary mb-4 max-w-sm">
              Projects are linked to clients. Add a client first, then create
              projects for them.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/clients">
                  Go to Clients
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
