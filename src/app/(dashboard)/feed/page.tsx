export default function FeedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Feed</h1>
        <button className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface">
          Manage Sources
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2">
        <button className="rounded-full bg-surface-elevated px-3 py-1 text-sm text-text-primary">
          All
        </button>
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          AI
        </button>
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          Design
        </button>
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          Dev
        </button>
        <button className="rounded-full bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
          Indie
        </button>
      </div>

      {/* V0.2 placeholder */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <span className="mb-2 text-2xl">V0.2</span>
        <p className="text-text-secondary">
          Curated news feed coming in version 0.2
        </p>
        <p className="text-sm text-text-tertiary">
          RSS feeds, X accounts, and AI summaries
        </p>
      </div>
    </div>
  )
}
