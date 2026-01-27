import { cn } from '@/lib/utils'

interface HeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function Header({ title, description, children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  )
}
