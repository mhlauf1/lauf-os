import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'

interface ShellProps {
  children: React.ReactNode
  className?: string
}

export function Shell({ children, className }: ShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className={cn('h-full p-6', className)}>{children}</div>
      </main>
    </div>
  )
}
