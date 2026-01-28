import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { updateLibraryItemSchema } from '@/lib/validations/library.schema'

export async function GET(
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

    const item = await prisma.libraryItem.findFirst({
      where: { id, userId: user.id },
      include: {
        assets: {
          orderBy: { createdAt: 'desc' },
        },
        goal: {
          select: { id: true, title: true, type: true, targetValue: true, currentValue: true },
        },
        _count: {
          select: { assets: true },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ data: item })
  } catch (error) {
    console.error('Error fetching library item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch library item' },
      { status: 500 }
    )
  }
}

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

    const existing = await prisma.libraryItem.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const body = await request.json()

    // Clean empty string URLs before validation
    const cleaned = { ...body }
    for (const key of ['sourceUrl', 'figmaUrl', 'githubUrl']) {
      if (cleaned[key] === '') cleaned[key] = null
    }

    const validatedData = updateLibraryItemSchema.parse(cleaned)

    const item = await prisma.libraryItem.update({
      where: { id },
      data: validatedData,
    })

    // Handle goalId changes: decrement old goal, increment new goal
    const oldGoalId = existing.goalId
    const newGoalId = validatedData.goalId

    if (newGoalId !== undefined && oldGoalId !== newGoalId) {
      // Decrement old goal
      if (oldGoalId) {
        const oldGoal = await prisma.goal.findUnique({ where: { id: oldGoalId } })
        if (oldGoal) {
          const newValue = Math.max(0, oldGoal.currentValue - 1)
          await prisma.goal.update({
            where: { id: oldGoalId },
            data: {
              currentValue: newValue,
              ...(oldGoal.completedAt ? { completedAt: null } : {}),
            },
          })
        }
      }

      // Increment new goal
      if (newGoalId) {
        const newGoal = await prisma.goal.update({
          where: { id: newGoalId },
          data: { currentValue: { increment: 1 } },
        })
        if (newGoal.targetValue && newGoal.currentValue >= newGoal.targetValue && !newGoal.completedAt) {
          await prisma.goal.update({
            where: { id: newGoalId },
            data: { completedAt: new Date() },
          })
        }
      }
    }

    return NextResponse.json({ data: item })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating library item:', error)
    return NextResponse.json(
      { error: 'Failed to update library item' },
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

    const existing = await prisma.libraryItem.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Decrement linked goal if present
    if (existing.goalId) {
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

    await prisma.libraryItem.delete({ where: { id } })

    return NextResponse.json({ data: { deleted: true } })
  } catch (error) {
    console.error('Error deleting library item:', error)
    return NextResponse.json(
      { error: 'Failed to delete library item' },
      { status: 500 }
    )
  }
}
