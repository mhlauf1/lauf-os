export interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: string
  disabled?: boolean
}

export const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
  },
  {
    label: 'Ideas',
    href: '/ideas',
  },
  {
    label: 'Calendar',
    href: '/calendar',
  },
  {
    label: 'Compose',
    href: '/compose',
  },
]

export const secondaryNavItems: NavItem[] = [
  {
    label: 'Feed',
    href: '/feed',
    badge: 'V0.2',
  },
  {
    label: 'Learn',
    href: '/learn',
    badge: 'V0.2',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    badge: 'V0.3',
  },
]

export const footerNavItems: NavItem[] = [
  {
    label: 'Settings',
    href: '/settings',
  },
]
