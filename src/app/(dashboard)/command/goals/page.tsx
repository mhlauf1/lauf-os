'use client'

import { useState } from 'react'
import { Plus, Target, TrendingUp, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const goalTabs = [
  { id: 'DAILY', label: 'Daily' },
  { id: 'WEEKLY', label: 'Weekly' },
  { id: 'MONTHLY', label: 'Monthly' },
  { id: 'YEARLY', label: 'Yearly' },
]

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState('WEEKLY')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Goals</h1>
          <p className="text-sm text-text-secondary">
            Track your progress and stay accountable
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Goals Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-text-tertiary">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              In Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-text-tertiary">Active goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Completion Rate
            </CardTitle>
            <Target className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-text-tertiary">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Tabs */}
      <div className="flex gap-2 border-b border-border">
        {goalTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goal List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base capitalize">
            {activeTab.toLowerCase()} Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-surface-elevated p-4 mb-4">
              <Target className="h-8 w-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No goals set</h3>
            <p className="text-sm text-text-secondary mb-4 max-w-sm">
              Set goals to track your progress and stay accountable to your
              commitments.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Set a Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
