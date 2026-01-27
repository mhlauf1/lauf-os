'use client'

import Link from 'next/link'
import { Building2, Mail, Phone, ExternalLink, Folder, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HealthScoreBadge } from './HealthScoreBadge'
import type { Client, ClientStatus, HealthScore, Project } from '@prisma/client'

interface ClientCardProps {
  client: Pick<
    Client,
    | 'id'
    | 'name'
    | 'email'
    | 'phone'
    | 'company'
    | 'status'
    | 'healthScore'
    | 'websiteUrl'
    | 'lastContacted'
  > & {
    projects?: Pick<Project, 'id' | 'name' | 'status'>[]
    _count?: { projects: number }
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusColors: Record<ClientStatus, string> = {
  ACTIVE: 'text-green-400 bg-green-500/10',
  PAUSED: 'text-yellow-400 bg-yellow-500/10',
  COMPLETED: 'text-blue-400 bg-blue-500/10',
  CHURNED: 'text-gray-400 bg-gray-500/10',
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const projectCount = client._count?.projects ?? client.projects?.length ?? 0

  return (
    <Link href={`/clients/${client.id}`}>
      <div className="group rounded-lg border border-border bg-surface p-4 transition-all hover:border-border/80 hover:bg-surface-elevated">
        <div className="flex items-start justify-between">
          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {/* Avatar Placeholder */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <span className="text-sm font-medium">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium truncate">{client.name}</h3>
                {client.company && (
                  <p className="text-sm text-text-secondary flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {client.company}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              {client.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {client.email}
                </span>
              )}
              {client.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {client.phone}
                </span>
              )}
              {client.websiteUrl && (
                <span className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Website
                </span>
              )}
            </div>

            {/* Status Row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <HealthScoreBadge score={client.healthScore} size="sm" />
              <Badge
                variant="secondary"
                className={cn('text-xs', statusColors[client.status])}
              >
                {client.status}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-text-tertiary">
                <Folder className="h-3 w-3" />
                {projectCount} project{projectCount !== 1 ? 's' : ''}
              </span>
              {client.lastContacted && (
                <span className="text-xs text-text-tertiary">
                  Last contact:{' '}
                  {new Date(client.lastContacted).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  onEdit?.(client.id)
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Add Project</DropdownMenuItem>
              <DropdownMenuItem>Log Contact</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete?.(client.id)
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Link>
  )
}
