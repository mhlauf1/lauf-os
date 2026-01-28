import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ACTIVITY_PRESETS } from '@/config/activity-presets'

// Transform presets into activity-like objects with deterministic IDs
function getActivitiesFromPresets() {
  return ACTIVITY_PRESETS.map((preset) => ({
    id: `preset-${preset.slug}`,
    title: preset.title,
    category: preset.category,
    energyLevel: preset.energyLevel,
    sortOrder: preset.sortOrder,
    isActive: true,
    // These fields are for UI compatibility but not persisted
    timesUsed: 0,
    lastUsed: null,
  }))
}

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return presets directly from config - no database sync needed
    const activities = getActivitiesFromPresets()

    return NextResponse.json({ data: activities })
  } catch (error) {
    console.error('Error fetching activities:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch activities'
    return NextResponse.json(
      { error: errorMessage },
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
