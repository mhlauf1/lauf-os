'use client'

import { MoreHorizontal, Plus, ExternalLink, Github } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Project, ProjectStatus, Priority, Client } from '@prisma/client'

interface ProjectWithClient extends Project {
  client?: Pick<Client, 'id' | 'name'>
  _count?: { tasks: number; assets: number }
}

interface ProjectKanbanProps {
  projects: ProjectWithClient[]
  onProjectClick?: (id: string) => void
  onEditProject?: (id: string) => void
  onAddProject?: (status: ProjectStatus) => void
  onMoveProject?: (id: string, newStatus: ProjectStatus) => void
}

const stages: { id: ProjectStatus; label: string; color: string }[] = [
  { id: 'PLANNING', label: 'Planning', color: 'bg-gray-500' },
  { id: 'DESIGN', label: 'Design', color: 'bg-violet-500' },
  { id: 'DEVELOPMENT', label: 'Development', color: 'bg-blue-500' },
  { id: 'REVIEW', label: 'Review', color: 'bg-yellow-500' },
  { id: 'LAUNCHED', label: 'Launched', color: 'bg-green-500' },
]

const priorityColors: Record<Priority, string> = {
  LOW: 'text-gray-400 border-gray-400',
  MEDIUM: 'text-blue-400 border-blue-400',
  HIGH: 'text-orange-400 border-orange-400',
  URGENT: 'text-red-400 border-red-400',
}

export function ProjectKanban({
  projects,
  onProjectClick,
  onEditProject,
  onAddProject,
  onMoveProject,
}: ProjectKanbanProps) {
  const getProjectsByStatus = (status: ProjectStatus) =>
    projects.filter((p) => p.status === status)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageProjects = getProjectsByStatus(stage.id)

        return (
          <div key={stage.id} className="flex-shrink-0 w-72">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', stage.color)} />
                <h3 className="font-medium text-sm">{stage.label}</h3>
                <span className="text-xs text-text-tertiary">
                  {stageProjects.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onAddProject?.(stage.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Column Content */}
            <div className="space-y-2 min-h-[200px] rounded-lg border border-dashed border-border p-2">
              {stageProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-xs text-text-tertiary">
                    No projects in {stage.label.toLowerCase()}
                  </p>
                </div>
              ) : (
                stageProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onProjectClick?.(project.id)}
                    onEdit={() => onEditProject?.(project.id)}
                    onMove={(newStatus) => onMoveProject?.(project.id, newStatus)}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface ProjectCardProps {
  project: ProjectWithClient
  onClick?: () => void
  onEdit?: () => void
  onMove?: (status: ProjectStatus) => void
}

function ProjectCard({ project, onClick, onEdit, onMove }: ProjectCardProps) {
  const taskCount = project._count?.tasks ?? 0

  return (
    <div
      className="group rounded-lg border border-border bg-surface p-3 transition-all hover:border-border/80 hover:bg-surface-elevated cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{project.name}</h4>
          {project.client && (
            <p className="text-xs text-text-secondary mt-0.5">
              {project.client.name}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.()
              }}
            >
              Edit
            </DropdownMenuItem>
            {stages.map((stage) => (
              <DropdownMenuItem
                key={stage.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onMove?.(stage.id)
                }}
                disabled={project.status === stage.id}
              >
                Move to {stage.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={cn('text-xs', priorityColors[project.priority])}
        >
          {project.priority}
        </Badge>
        {taskCount > 0 && (
          <span className="text-xs text-text-tertiary">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Links */}
      {(project.repositoryUrl || project.productionUrl) && (
        <div className="mt-2 flex items-center gap-2">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-text-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-3 w-3" />
            </a>
          )}
          {project.productionUrl && (
            <a
              href={project.productionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-text-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {/* Due Date */}
      {project.dueDate && (
        <p className="mt-2 text-xs text-text-tertiary">
          Due: {new Date(project.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
