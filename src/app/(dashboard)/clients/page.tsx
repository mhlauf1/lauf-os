'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Users, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ClientCard } from '@/components/modules/clients/ClientCard'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { useClients, useDeleteClient } from '@/hooks/use-clients'

const statusFilters = [
  { id: 'all', label: 'All Clients' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PAUSED', label: 'Paused' },
  { id: 'COMPLETED', label: 'Completed' },
]

export default function ClientsPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Debounce search for server-side filtering
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filter: Record<string, string> = {}
  if (activeFilter !== 'all') filter.status = activeFilter
  if (debouncedSearch) filter.search = debouncedSearch

  const { data: clients = [], isLoading } = useClients(filter)
  const deleteClient = useDeleteClient()

  const healthStats = useMemo(() => {
    const green = clients.filter((c) => c.healthScore === 'GREEN').length
    const yellow = clients.filter((c) => c.healthScore === 'YELLOW').length
    const red = clients.filter((c) => c.healthScore === 'RED').length
    return { green, yellow, red }
  }, [clients])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-text-secondary">
            Manage your client relationships
          </p>
        </div>
        <Button onClick={() => router.push('/clients/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Healthy
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{healthStats.green}</div>
            <p className="text-xs text-text-tertiary">GREEN status</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Needs Attention
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{healthStats.yellow}</div>
            <p className="text-xs text-text-tertiary">YELLOW status</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              At Risk
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{healthStats.red}</div>
            <p className="text-xs text-text-tertiary">RED status</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Client List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">Loading clients...</p>
            </div>
          </CardContent>
        </Card>
      ) : clients.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-surface-elevated p-4 mb-4">
                <Users className="h-8 w-8 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {debouncedSearch ? 'No matching clients' : 'No clients yet'}
              </h3>
              <p className="text-sm text-text-secondary mb-4 max-w-sm">
                {debouncedSearch
                  ? 'Try adjusting your search query.'
                  : 'Add your first client to start tracking relationships, projects, and opportunities.'}
              </p>
              {!debouncedSearch && (
                <Button onClick={() => router.push('/clients/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Client
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => { if (!open) setDeleteConfirmId(null) }}
        title="Delete client?"
        description="This will permanently delete this client and all associated data. This action cannot be undone."
        isPending={deleteClient.isPending}
        onConfirm={() => {
          if (!deleteConfirmId) return
          deleteClient.mutate(deleteConfirmId, {
            onSuccess: () => {
              toast.success('Client deleted')
              setDeleteConfirmId(null)
            },
            onError: (err) => toast.error(err.message || 'Failed to delete client'),
          })
        }}
      />
    </div>
  )
}
