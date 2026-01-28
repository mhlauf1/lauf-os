import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUser } from '@/lib/prisma/ensure-user'
import { ACTIVITY_PRESETS, PRESET_TITLES } from '@/config/activity-presets'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureUser(user)

    // Fetch ALL user activities (including inactive) for sync comparison
    const allActivities = await prisma.activity.findMany({
      where: { userId: user.id },
    })

    const titleMap = new Map(
      allActivities.map((a) => [a.title.toLowerCase(), a])
    )

    const toCreate: typeof ACTIVITY_PRESETS = []
    const toReactivate: { id: string; sortOrder: number }[] = []

    for (const preset of ACTIVITY_PRESETS) {
      const existing = titleMap.get(preset.title.toLowerCase())
      if (!existing) {
        toCreate.push(preset)
      } else if (!existing.isActive) {
        // Reactivate preset that was previously deactivated
        toReactivate.push({ id: existing.id, sortOrder: preset.sortOrder })
      }
    }

    // Deactivate custom activities not in preset list
    const toDeactivate = allActivities.filter(
      (a) => a.isActive && !PRESET_TITLES.has(a.title.toLowerCase())
    )

    // Batch operations
    const ops: Promise<unknown>[] = []

    if (toCreate.length > 0) {
      ops.push(
        prisma.activity.createMany({
          data: toCreate.map((p) => ({
            userId: user.id,
            title: p.title,
            category: p.category,
            defaultDuration: p.defaultDuration,
            energyLevel: p.energyLevel,
            sortOrder: p.sortOrder,
          })),
        })
      )
    }

    for (const item of toReactivate) {
      ops.push(
        prisma.activity.update({
          where: { id: item.id },
          data: { isActive: true, sortOrder: item.sortOrder },
        })
      )
    }

    for (const item of toDeactivate) {
      ops.push(
        prisma.activity.update({
          where: { id: item.id },
          data: { isActive: false },
        })
      )
    }

    if (ops.length > 0) {
      await Promise.all(ops)
    }

    // Return active activities ordered by sortOrder
    const activities = await prisma.activity.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { timesUsed: 'desc' }],
    })

    return NextResponse.json({ data: activities })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Activity presets are system-managed and cannot be created manually' },
    { status: 403 }
  )
}
