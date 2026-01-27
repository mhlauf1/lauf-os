'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, ExternalLink, Github, Figma, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProject, useDeleteProject } from '@/hooks/use-projects'
import type { Project, ProjectStatus, Priority, TaskStatus, TaskCategory } from '@prisma/client'

interface ProjectWithRelations extends Project {
  client?: { id: string; name: string; company: string | null }
  tasks?: Array<{
    id: string
    title: string
    category: TaskCategory
    status: TaskStatus
  }>
  _count?: { tasks: number; assets: number }
}

const statusColors: Record<ProjectStatus, string> = {
  PLANNING: 'text-gray-400 border-gray-400',
  DESIGN: 'text-violet-400 border-violet-400',
  DEVELOPMENT: 'text-blue-400 border-blue-400',
  REVIEW: 'text-yellow-400 border-yellow-400',
  LAUNCHED: 'text-green-400 border-green-400',
}

const priorityColors: Record<Priority, string> = {
  LOW: 'text-gray-400 border-gray-400',
  MEDIUM: 'text-blue-400 border-blue-400',
  HIGH: 'text-orange-400 border-orange-400',
  URGENT: 'text-red-400 border-red-400',
}

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: project, isLoading, error } = useProject(id)
  const deleteProject = useDeleteProject()

  function handleDelete() {
    deleteProject.mutate(id, {
      onSuccess: () => router.push('/projects'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
        <p className="mt-2 text-sm text-text-tertiary">Loading project...</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Project Details</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-text-secondary">
                Project not found or you don&apos;t have access to this project.
              </p>
              <Link href="/projects" className="mt-4">
                <Button variant="outline">Back to Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const p = project as ProjectWithRelations
  const client = p.client
  const tasks = p.tasks || []
  const formatDate = (d: string | Date | null) =>
    d ? new Date(d).toLocaleDateString() : '\u2014'
  const formatCurrency = (val: number | { toNumber(): number } | null | undefined) =>
    val != null ? `$${Number(val).toLocaleString()}` : '\u2014'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{p.name}</h1>
          {client && (
            <Link href={`/clients/${client.id}`} className="text-sm text-text-secondary hover:text-accent">
              {client.name}{client.company ? ` (${client.company})` : ''}
            </Link>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-red-400 hover:text-red-500"
            onClick={handleDelete}
            disabled={deleteProject.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Overview</CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={statusColors[p.status]}
                >
                  {p.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={priorityColors[p.priority]}
                >
                  {p.priority}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {p.description && (
              <p className="text-sm text-text-secondary">{p.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Client</p>
                <p className="font-medium">
                  {client ? client.name : '\u2014'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Type</p>
                <p className="font-medium">{p.type || '\u2014'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Budget</p>
                <p className="font-medium">{formatCurrency(p.budget)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Paid</p>
                <p className="font-medium">{formatCurrency(p.paidAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Start Date</p>
                <p className="font-medium">{formatDate(p.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Due Date</p>
                <p className="font-medium">{formatDate(p.dueDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <Github className="h-4 w-4" />
              {p.repositoryUrl ? (
                <a
                  href={p.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent"
                >
                  Repository
                </a>
              ) : (
                <span className="text-sm">No repository linked</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Figma className="h-4 w-4" />
              <span className="text-sm">No Figma linked</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <ExternalLink className="h-4 w-4" />
              {p.stagingUrl ? (
                <a
                  href={p.stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent"
                >
                  Staging
                </a>
              ) : (
                <span className="text-sm">No staging URL</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <ExternalLink className="h-4 w-4" />
              {p.productionUrl ? (
                <a
                  href={p.productionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent"
                >
                  Production
                </a>
              ) : (
                <span className="text-sm">No production URL</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Tasks {p._count && p._count.tasks > 0 && `(${p._count.tasks})`}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-center text-sm text-text-tertiary py-8">
              No tasks for this project yet.
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {task.category} &middot; {task.status}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
