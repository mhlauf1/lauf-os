export default function ComposePage() {
  const maxChars = 280
  const currentChars = 0

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Post</h1>
        <button className="text-sm text-text-secondary hover:text-text-primary">
          Save Draft
        </button>
      </div>

      {/* Pillar selector */}
      <div className="space-y-2">
        <label className="text-sm text-text-secondary">Pillar</label>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
            <span className="h-2 w-2 rounded-full bg-pillar-redesign" />
            Redesign
          </button>
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
            <span className="h-2 w-2 rounded-full bg-pillar-build" />
            Build
          </button>
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
            <span className="h-2 w-2 rounded-full bg-pillar-workflow" />
            Workflow
          </button>
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-secondary hover:bg-surface-elevated">
            <span className="h-2 w-2 rounded-full bg-pillar-insight" />
            Insight
          </button>
        </div>
      </div>

      {/* Composer */}
      <div className="space-y-2">
        <label className="text-sm text-text-secondary">Content</label>
        <textarea
          className="h-40 w-full resize-none rounded-lg border border-border bg-surface p-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="What's on your mind?"
        />
        <div className="flex items-center justify-between">
          <button className="text-sm text-text-secondary hover:text-text-primary">
            Attach media
          </button>
          <span
            className={`text-sm ${currentChars > maxChars ? 'text-error' : 'text-text-secondary'}`}
          >
            {currentChars} / {maxChars}
          </span>
        </div>
      </div>

      {/* Schedule options */}
      <div className="space-y-4 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="schedule" className="accent-accent" />
            <span className="text-sm">Post now</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="schedule"
              className="accent-accent"
              defaultChecked
            />
            <span className="text-sm">Schedule for later</span>
          </label>
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary"
          />
          <input
            type="time"
            className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface">
          Cancel
        </button>
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80">
          Schedule Post
        </button>
      </div>
    </div>
  )
}
