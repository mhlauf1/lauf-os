export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold tracking-tight">LAUF OS</h1>
        <p className="text-text-secondary text-lg">
          Personal command center for building in public
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-pillar-redesign" />
            <span className="text-sm text-text-secondary">Redesigns</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-pillar-build" />
            <span className="text-sm text-text-secondary">Builds</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-pillar-workflow" />
            <span className="text-sm text-text-secondary">Workflows</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-pillar-insight" />
            <span className="text-sm text-text-secondary">Insights</span>
          </div>
        </div>
      </main>
    </div>
  )
}
