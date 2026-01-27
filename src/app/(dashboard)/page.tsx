export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Command Center</h1>
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80">
          + New Idea
        </button>
      </div>

      {/* Today section */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Today</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <span className="text-sm text-text-secondary">9:00 AM</span>
            <p className="mt-1 text-text-tertiary">Empty slot</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <span className="text-sm text-text-secondary">2:00 PM</span>
            <p className="mt-1 text-text-tertiary">Empty slot</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <span className="text-sm text-text-secondary">7:00 PM</span>
            <p className="mt-1 text-text-tertiary">Empty slot</p>
          </div>
        </div>
      </section>

      {/* Idea Bank summary */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Idea Bank</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-pillar-redesign" />
            <span className="text-sm text-text-secondary">Redesigns (0)</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-pillar-build" />
            <span className="text-sm text-text-secondary">Builds (0)</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-pillar-workflow" />
            <span className="text-sm text-text-secondary">Workflows (0)</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-pillar-insight" />
            <span className="text-sm text-text-secondary">Insights (0)</span>
          </div>
        </div>
      </section>

      {/* Ready to post */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Ready to Post</h2>
        <p className="text-text-secondary">No ideas ready to post yet.</p>
      </section>
    </div>
  )
}
