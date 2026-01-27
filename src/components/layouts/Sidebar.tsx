'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  navGroups,
  footerNavItems,
  type NavItem,
} from '@/config/navigation'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-surface md:flex">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <span className="text-lg font-semibold">LAUF OS</span>
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto p-4">
        {navGroups.map((group, index) => (
          <div key={group.label}>
            {index > 0 && <Separator className="my-4" />}
            <div className="space-y-1">
              <p className="mb-2 px-3 text-xs font-medium uppercase text-text-tertiary">
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href))
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Navigation */}
      <div className="border-t border-border p-4">
        {footerNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </aside>
  )
}

interface NavLinkProps {
  item: NavItem
  isActive: boolean
}

function NavLink({ item, isActive }: NavLinkProps) {
  const Icon = item.icon

  const content = (
    <>
      <Icon className="h-4 w-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" className="text-xs">
          {item.badge}
        </Badge>
      )}
    </>
  )

  if (item.disabled) {
    return (
      <span
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
          'cursor-not-allowed text-text-tertiary opacity-50'
        )}
      >
        {content}
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-accent/10 text-accent'
          : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
      )}
    >
      {content}
    </Link>
  )
}
