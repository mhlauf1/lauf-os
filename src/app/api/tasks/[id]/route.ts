import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'

const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional().nullable(),
  category: z
    .enum([
      'DESIGN',
      'CODE',
      'CLIENT',
      'LEARNING',
      'FITNESS',
      'ADMIN',
      'SAAS',
      'NETWORKING',
      'PERSONAL',
      'LEISURE',
      'ROUTINE',
    ])
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE']).optional(),
  scheduledDate: z.string().datetime().optional().nullable(),
  slotIndex: z.number().int().min(0).max(9).optional().nullable(),
  energyLevel: z.enum(['DEEP_WORK', 'MODERATE', 'LIGHT']).optional(),
  projectId: z.string().uuid().optional().nullable(),
  activityId: z.string().optional().nullable(), // Accepts preset-{slug} format or UUID
  goalId: z.string().uuid().optional().nullable(),
})

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

    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateTaskSchema.parse(body)

    // Build update data
    const updateData: Record<string, unknown> = { ...validatedData }

    if (validatedData.scheduledDate) {
      updateData.scheduledDate = new Date(validatedData.scheduledDate)
    }

    // Handle completion: set completedAt, increment goal + activity
    const isCompletingTask =
      validatedData.status === 'DONE' && existing.status !== 'DONE'

    // Handle revert: was DONE, now moving to non-DONE status
    const isRevertingTask =
      existing.status === 'DONE' &&
      validatedData.status !== undefined &&
      validatedData.status !== 'DONE'

    if (isCompletingTask) {
      updateData.completedAt = new Date()
    }

    if (isRevertingTask) {
      updateData.completedAt = null
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    })

    // Side effects on completion
    if (isCompletingTask) {
      const goalId = validatedData.goalId ?? existing.goalId

      // Auto-increment linked goal's currentValue
      if (goalId) {
        const goal = await prisma.goal.update({
          where: { id: goalId },
          data: { currentValue: { increment: 1 } },
        })
        // Auto-complete goal if target reached
        if (goal.targetValue && goal.currentValue >= goal.targetValue && !goal.completedAt) {
          await prisma.goal.update({
            where: { id: goalId },
            data: { completedAt: new Date() },
          })
        }
      }
    }

    // Side effects on revert
    if (isRevertingTask) {
      const goalId = existing.goalId

      // Decrement linked goal's currentValue
      if (goalId) {
        const goal = await prisma.goal.findUnique({ where: { id: goalId } })
        if (goal) {
          const newValue = Math.max(0, goal.currentValue - 1)
          await prisma.goal.update({
            where: { id: goalId },
            data: {
              currentValue: newValue,
              // Reopen goal if it was auto-completed
              ...(goal.completedAt ? { completedAt: null } : {}),
            },
          })
        }
      }
    }

    return NextResponse.json({ data: task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
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

    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // If the deleted task was DONE and linked to a goal, decrement goal progress
    if (existing.status === 'DONE' && existing.goalId) {
      const goal = await prisma.goal.findUnique({ where: { id: existing.goalId } })
      if (goal) {
        const newValue = Math.max(0, goal.currentValue - 1)
        await prisma.goal.update({
          where: { id: existing.goalId },
          data: {
            currentValue: newValue,
            ...(goal.completedAt ? { completedAt: null } : {}),
          },
        })
      }
    }

    await prisma.task.delete({ where: { id } })

    return NextResponse.json({ data: { deleted: true } })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
