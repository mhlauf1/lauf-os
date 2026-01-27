export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* X Connection */}
      <section className="space-y-4 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium">X (Twitter) Connection</h2>
        <p className="text-sm text-text-secondary">
          Connect your X account to post directly from LAUF OS.
        </p>
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80">
          Connect X Account
        </button>
      </section>

      {/* Default Schedule */}
      <section className="space-y-4 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium">Default Post Times</h2>
        <p className="text-sm text-text-secondary">
          Set your preferred posting times for each slot.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm text-text-tertiary">Morning</label>
            <input
              type="time"
              defaultValue="09:00"
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-text-tertiary">Afternoon</label>
            <input
              type="time"
              defaultValue="14:00"
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-text-tertiary">Evening</label>
            <input
              type="time"
              defaultValue="19:00"
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* API Keys (for development) */}
      <section className="space-y-4 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium">API Configuration</h2>
        <p className="text-sm text-text-secondary">
          API keys are configured via environment variables for security.
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-sm">Supabase connected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-text-tertiary" />
            <span className="text-sm text-text-secondary">
              X API not configured
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-text-tertiary" />
            <span className="text-sm text-text-secondary">
              Claude API not configured
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
