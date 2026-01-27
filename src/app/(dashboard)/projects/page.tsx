'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Folder, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProjectKanban } from '@/components/modules/clients/ProjectKanban'
import { useProjects, useUpdateProject } from '@/hooks/use-projects'
import type { ProjectStatus } from '@prisma/client'

export default function ProjectsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const { data: projects = [], isLoading } = useProjects()
  const updateProject = useUpdateProject()

  function handleMoveProject(id: string, newStatus: ProjectStatus) {
    updateProject.mutate({ id, status: newStatus })
  }

  function handleProjectClick(id: string) {
    router.push(`/projects/${id}`)
  }

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
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">Loading projects...</p>
            </div>
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
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
                <Button variant="outline" onClick={() => router.push('/clients')}>
                  Go to Clients
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ProjectKanban
          projects={projects as Parameters<typeof ProjectKanban>[0]['projects']}
          onProjectClick={handleProjectClick}
          onMoveProject={handleMoveProject}
        />
      )}
    </div>
  )
}
