import { NextResponse } from 'next/server'

// Activities are now config-based presets, not database records
// These endpoints return 403 to indicate they are system-managed

export async function PATCH() {
  return NextResponse.json(
    { error: 'Activity presets are system-managed and cannot be modified' },
    { status: 403 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Activity presets are system-managed and cannot be deleted' },
    { status: 403 }
  )
}
