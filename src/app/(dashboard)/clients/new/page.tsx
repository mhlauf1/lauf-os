'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateClient } from '@/hooks/use-clients'

export default function NewClientPage() {
  const router = useRouter()
  const createClient = useCreateClient()

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState('')
  const [referredBy, setReferredBy] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [figmaUrl, setFigmaUrl] = useState('')
  const [vercelUrl, setVercelUrl] = useState('')
  const [contractValue, setContractValue] = useState('')
  const [monthlyRetainer, setMonthlyRetainer] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createClient.mutate(
      {
        name,
        company: company || undefined,
        email: email || undefined,
        phone: phone || undefined,
        industry: industry || undefined,
        referredBy: referredBy || undefined,
        websiteUrl: websiteUrl || undefined,
        githubUrl: githubUrl || undefined,
        figmaUrl: figmaUrl || undefined,
        vercelUrl: vercelUrl || undefined,
        contractValue: contractValue ? parseFloat(contractValue) : undefined,
        monthlyRetainer: monthlyRetainer ? parseFloat(monthlyRetainer) : undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          router.push('/clients')
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Add New Client</h1>
          <p className="text-sm text-text-secondary">
            Create a new client profile
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe or Company Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Company Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="Technology, Design, etc."
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referredBy">Referred By</Label>
                <Input
                  id="referredBy"
                  placeholder="How did they find you?"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                />
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website</Label>
                <Input
                  id="websiteUrl"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub</Label>
                <Input
                  id="githubUrl"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="figmaUrl">Figma</Label>
                <Input
                  id="figmaUrl"
                  placeholder="https://figma.com/..."
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vercelUrl">Vercel</Label>
                <Input
                  id="vercelUrl"
                  placeholder="https://vercel.com/..."
                  value={vercelUrl}
                  onChange={(e) => setVercelUrl(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contractValue">Contract Value</Label>
                <Input
                  id="contractValue"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={contractValue}
                  onChange={(e) => setContractValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRetainer">Monthly Retainer</Label>
                <Input
                  id="monthlyRetainer"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={monthlyRetainer}
                  onChange={(e) => setMonthlyRetainer(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[120px] rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Any additional notes about this client..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/clients">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={createClient.isPending}>
            {createClient.isPending ? 'Creating...' : 'Create Client'}
          </Button>
        </div>
      </form>
    </div>
  )
}
