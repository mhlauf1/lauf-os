export default function LearnPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Learning Log</h1>
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80">
          + Log Session
        </button>
      </div>

      {/* Weekly summary placeholder */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium">This Week</h2>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div>
            <span className="text-2xl font-bold">0h</span>
            <span className="block text-sm text-text-secondary">
              Total learning
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold">0</span>
            <span className="block text-sm text-text-secondary">Sessions</span>
          </div>
          <div>
            <span className="text-2xl font-bold">0</span>
            <span className="block text-sm text-text-secondary">Topics</span>
          </div>
          <div>
            <span className="text-2xl font-bold">0</span>
            <span className="block text-sm text-text-secondary">
              Ideas created
            </span>
          </div>
        </div>
      </div>

      {/* V0.2 placeholder */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <span className="mb-2 text-2xl">V0.2</span>
        <p className="text-text-secondary">
          Learning log coming in version 0.2
        </p>
        <p className="text-sm text-text-tertiary">
          Track learning sessions and turn them into content ideas
        </p>
      </div>
    </div>
  )
}
