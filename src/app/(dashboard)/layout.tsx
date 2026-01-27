import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder */}
      <aside className="hidden w-64 border-r border-border bg-surface md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-border px-4">
            <span className="text-lg font-semibold">LAUF OS</span>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/"
              className="flex items-center rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/ideas"
              className="flex items-center rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
            >
              Ideas
            </Link>
            <Link
              href="/calendar"
              className="flex items-center rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
            >
              Calendar
            </Link>
            <Link
              href="/compose"
              className="flex items-center rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
            >
              Compose
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="h-full p-6">{children}</div>
      </main>
    </div>
  )
}
