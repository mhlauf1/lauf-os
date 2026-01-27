'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, ExternalLink, Phone, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HealthScoreBadge } from '@/components/modules/clients/HealthScoreBadge'
import { useClient, useDeleteClient } from '@/hooks/use-clients'
import type { Client, HealthScore, ClientStatus, ProjectStatus } from '@prisma/client'

interface ClientWithRelations extends Client {
  projects?: Array<{
    id: string
    name: string
    status: ProjectStatus
    _count?: { tasks: number; assets: number }
  }>
}

const statusColors: Record<ClientStatus, string> = {
  ACTIVE: 'text-green-400 border-green-400',
  PAUSED: 'text-yellow-400 border-yellow-400',
  COMPLETED: 'text-blue-400 border-blue-400',
  CHURNED: 'text-gray-400 border-gray-400',
}

const projectStatusColors: Record<ProjectStatus, string> = {
  PLANNING: 'bg-gray-500/10 text-gray-400',
  DESIGN: 'bg-violet-500/10 text-violet-400',
  DEVELOPMENT: 'bg-blue-500/10 text-blue-400',
  REVIEW: 'bg-yellow-500/10 text-yellow-400',
  LAUNCHED: 'bg-green-500/10 text-green-400',
}

interface ClientDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: client, isLoading, error } = useClient(id)
  const deleteClient = useDeleteClient()

  function handleDelete() {
    deleteClient.mutate(id, {
      onSuccess: () => router.push('/clients'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
        <p className="mt-2 text-sm text-text-tertiary">Loading client...</p>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Client Details</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-text-secondary">
                Client not found or you don&apos;t have access to this client.
              </p>
              <Link href="/clients" className="mt-4">
                <Button variant="outline">Back to Clients</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const c = client as ClientWithRelations
  const projects = c.projects || []
  const formatCurrency = (val: number | { toNumber(): number } | null | undefined) =>
    val != null ? `$${Number(val).toLocaleString()}` : '\u2014'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{c.name}</h1>
          {c.company && (
            <p className="text-sm text-text-secondary">{c.company}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-red-400 hover:text-red-500"
            onClick={handleDelete}
            disabled={deleteClient.isPending}
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
                <HealthScoreBadge score={c.healthScore as HealthScore} size="sm" />
                <Badge
                  variant="outline"
                  className={statusColors[c.status as ClientStatus]}
                >
                  {c.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Company</p>
                <p className="font-medium">{c.company || '\u2014'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Industry</p>
                <p className="font-medium">{c.industry || '\u2014'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Contract Value</p>
                <p className="font-medium">{formatCurrency(c.contractValue)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Monthly Retainer</p>
                <p className="font-medium">{formatCurrency(c.monthlyRetainer)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Referred By</p>
                <p className="font-medium">{c.referredBy || '\u2014'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Last Contacted</p>
                <p className="font-medium">
                  {c.lastContacted
                    ? new Date(c.lastContacted).toLocaleDateString()
                    : '\u2014'}
                </p>
              </div>
            </div>
            {c.notes && (
              <div>
                <p className="text-sm text-text-secondary mb-1">Notes</p>
                <p className="text-sm whitespace-pre-wrap">{c.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <Mail className="h-4 w-4" />
              <span className="text-sm">
                {c.email ? (
                  <a href={`mailto:${c.email}`} className="hover:text-accent">
                    {c.email}
                  </a>
                ) : (
                  '\u2014'
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{c.phone || '\u2014'}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm">
                {c.websiteUrl ? (
                  <a
                    href={c.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    Website
                  </a>
                ) : (
                  '\u2014'
                )}
              </span>
            </div>
            {c.githubUrl && (
              <div className="flex items-center gap-2 text-text-secondary">
                <ExternalLink className="h-4 w-4" />
                <a
                  href={c.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent"
                >
                  GitHub
                </a>
              </div>
            )}
            {c.figmaUrl && (
              <div className="flex items-center gap-2 text-text-secondary">
                <ExternalLink className="h-4 w-4" />
                <a
                  href={c.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent"
                >
                  Figma
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Button size="sm" onClick={() => router.push('/projects')}>
              View All Projects
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-center text-sm text-text-tertiary py-8">
              No projects for this client yet.
            </p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-surface-elevated"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {project._count?.tasks || 0} tasks
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={projectStatusColors[project.status]}
                  >
                    {project.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
