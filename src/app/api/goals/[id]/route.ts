import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'

const updateGoalSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional().nullable(),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  targetValue: z.number().int().min(1).optional().nullable(),
  currentValue: z.number().int().min(0).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
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

    const existing = await prisma.goal.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateGoalSchema.parse(body)

    const updateData: Record<string, unknown> = { ...validatedData }

    if (validatedData.dueDate) {
      updateData.dueDate = new Date(validatedData.dueDate)
    }

    if (validatedData.completedAt) {
      updateData.completedAt = new Date(validatedData.completedAt)
    } else if (validatedData.completedAt === null) {
      updateData.completedAt = null
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
