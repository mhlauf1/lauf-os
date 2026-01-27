export default function IdeasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Idea Bank</h1>
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80">
          + New Idea
        </button>
      </div>

      {/* Pillar filters */}
      <div className="flex gap-2">
        <button className="rounded-full bg-surface-elevated px-3 py-1 text-sm text-text-primary">
          All
        </button>
        <button className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          <span className="h-2 w-2 rounded-full bg-pillar-redesign" />
          Redesigns
        </button>
        <button className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          <span className="h-2 w-2 rounded-full bg-pillar-build" />
          Builds
        </button>
        <button className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          <span className="h-2 w-2 rounded-full bg-pillar-workflow" />
          Workflows
        </button>
        <button className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          <span className="h-2 w-2 rounded-full bg-pillar-insight" />
          Insights
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2">
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          Ideas
        </button>
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          In Progress
        </button>
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          Ready
        </button>
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          Scheduled
        </button>
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          Posted
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <p className="text-text-secondary">No ideas yet.</p>
        <p className="text-sm text-text-tertiary">
          Click &quot;+ New Idea&quot; to add your first content idea.
        </p>
      </div>
    </div>
  )
}
