export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      {/* Follower growth placeholder */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium">Follower Growth</h2>
        <div className="mt-4 flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
          <span className="text-text-tertiary">Growth chart</span>
        </div>
      </div>

      {/* Top posts placeholder */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium">Top Performing Posts</h2>
        <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
          <span className="text-text-tertiary">No posts analyzed yet</span>
        </div>
      </div>

      {/* V0.3 placeholder */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <span className="mb-2 text-2xl">V0.3</span>
        <p className="text-text-secondary">
          Full analytics coming in version 0.3
        </p>
        <p className="text-sm text-text-tertiary">
          Post metrics, follower tracking, and AI insights
        </p>
      </div>
    </div>
  )
}
