'use client'

import { use } from 'react'
import { ArrowLeft, Edit, Trash2, ExternalLink, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ClientDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = use(params)

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
          <h1 className="text-2xl font-semibold">Client Details</h1>
          <p className="text-sm text-text-secondary">ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" className="text-red-400 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Client not found placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-text-secondary">
              Client not found or you don&apos;t have access to this client.
            </p>
            <Link href="/clients" className="mt-4">
              <Button variant="outline">Back to Clients</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder sections for when client exists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Overview</CardTitle>
              <Badge variant="outline" className="text-green-400 border-green-400">
                GREEN
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Company</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Industry</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Contract Value</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Monthly Retainer</p>
                <p className="font-medium">—</p>
              </div>
            </div>
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
              <span className="text-sm">—</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Phone className="h-4 w-4" />
              <span className="text-sm">—</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm">—</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Button size="sm">Add Project</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-text-tertiary py-8">
            No projects for this client yet.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
