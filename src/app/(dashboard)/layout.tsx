import { Shell } from '@/components/layouts'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Shell>{children}</Shell>
}
