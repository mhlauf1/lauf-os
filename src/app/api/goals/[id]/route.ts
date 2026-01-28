import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { updateGoalSchema } from '@/lib/validations/goal.schema'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.goal.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateGoalSchema.parse(body)

    const { incrementValue, ...restData } = validatedData
    const updateData: Record<string, unknown> = { ...restData }

    // Handle atomic increment
    if (incrementValue !== undefined) {
      const newValue = Math.max(0, existing.currentValue + incrementValue)
      updateData.currentValue = newValue

      // Auto-complete goal if target reached
      if (
        existing.targetValue &&
        newValue >= existing.targetValue &&
        !existing.completedAt
      ) {
        updateData.completedAt = new Date()
      }

      // Reopen goal if decremented below target
      if (
        existing.targetValue &&
        newValue < existing.targetValue &&
        existing.completedAt
      ) {
        updateData.completedAt = null
      }
    }

    if (validatedData.dueDate) {
      updateData.dueDate = new Date(validatedData.dueDate)
    }

    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }

    if (validatedData.completedAt) {
      updateData.completedAt = new Date(validatedData.completedAt)
    } else if (validatedData.completedAt === null) {
      updateData.completedAt = null
    }

    // If currentValue is explicitly set (not via increment), check auto-completion
    if (
      validatedData.currentValue !== undefined &&
      incrementValue === undefined
    ) {
      const target = validatedData.targetValue ?? existing.targetValue
      if (target && validatedData.currentValue >= target && !existing.completedAt) {
        updateData.completedAt = new Date()
      }
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ data: goal })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.goal.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    await prisma.goal.delete({ where: { id } })

    return NextResponse.json({ data: { deleted: true } })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}
