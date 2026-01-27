import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  Target,
  Users,
  Folder,
  Library,
  Heart,
  DollarSign,
  Rss,
  Share2,
  Bot,
  Network,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
  disabled?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// Main navigation - Command Center
export const mainNavItems: NavItem[] = [
  {
    label: 'Command Center',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Tasks',
    href: '/command/tasks',
    icon: ListTodo,
  },
  {
    label: 'Calendar',
    href: '/command/calendar',
    icon: Calendar,
  },
  {
    label: 'Goals',
    href: '/command/goals',
    icon: Target,
  },
]

// Work navigation - Client CRM
export const workNavItems: NavItem[] = [
  {
    label: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: Folder,
  },
]

// Future modules - Coming soon
export const comingSoonNavItems: NavItem[] = [
  {
    label: 'Library',
    href: '/library',
    icon: Library,
    badge: 'Phase 2',
    disabled: true,
  },
  {
    label: 'Health',
    href: '/health',
    icon: Heart,
    badge: 'Phase 4',
    disabled: true,
  },
  {
    label: 'Finances',
    href: '/finances',
    icon: DollarSign,
    badge: 'Phase 4',
    disabled: true,
  },
  {
    label: 'Intel Feed',
    href: '/intel',
    icon: Rss,
    badge: 'Phase 3',
    disabled: true,
  },
  {
    label: 'Social',
    href: '/social',
    icon: Share2,
    badge: 'Phase 5',
    disabled: true,
  },
  {
    label: 'AI Hub',
    href: '/ai-hub',
    icon: Bot,
    badge: 'Phase 3',
    disabled: true,
  },
  {
    label: 'Relationships',
    href: '/relationships',
    icon: Network,
    badge: 'Phase 5',
    disabled: true,
  },
]

// Footer navigation
export const footerNavItems: NavItem[] = [
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

// Grouped navigation for sidebar
export const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: mainNavItems,
  },
  {
    label: 'Work',
    items: workNavItems,
  },
  {
    label: 'Coming Soon',
    items: comingSoonNavItems,
  },
]
