'use client'

import { use } from 'react'
import { ArrowLeft, Edit, ExternalLink, Github, Figma } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params)

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
          <h1 className="text-2xl font-semibold">Project Details</h1>
          <p className="text-sm text-text-secondary">ID: {id}</p>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Project not found placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-text-secondary">
              Project not found or you don&apos;t have access to this project.
            </p>
            <Link href="/projects" className="mt-4">
              <Button variant="outline">Back to Projects</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder sections for when project exists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Overview</CardTitle>
              <Badge variant="outline" className="text-violet-400 border-violet-400">
                PLANNING
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Client</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Type</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Budget</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Paid</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Start Date</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Due Date</p>
                <p className="font-medium">—</p>
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
              <span className="text-sm">No repository linked</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Figma className="h-4 w-4" />
              <span className="text-sm">No Figma linked</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm">No staging URL</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm">No production URL</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <Button size="sm">Add Task</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-text-tertiary py-8">
            No tasks for this project yet.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
