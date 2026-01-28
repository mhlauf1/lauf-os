import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUser } from '@/lib/prisma/ensure-user'
import { createGoalSchema } from '@/lib/validations/goal.schema'
import { computeBreakdown } from '@/lib/utils/goal-cascades'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const completed = searchParams.get('completed')
    const includeBreakdown = searchParams.get('includeBreakdown') === 'true'

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        ...(type && { type: type as any }),
        ...(completed === 'true' && { completedAt: { not: null } }),
        ...(completed === 'false' && { completedAt: null }),
      },
      orderBy: [{ completedAt: 'asc' }, { dueDate: 'asc' }],
      include: {
        _count: {
          select: { tasks: true, libraryItems: true },
        },
      },
    })

    if (includeBreakdown) {
      const enriched = goals.map((goal) => ({
        ...goal,
        breakdown: computeBreakdown({
          type: goal.type,
          targetValue: goal.targetValue,
          currentValue: goal.currentValue,
          startDate: goal.startDate,
          dueDate: goal.dueDate,
        }),
      }))
      return NextResponse.json({ data: enriched })
    }

    return NextResponse.json({ data: goals })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureUser(user)

    const body = await request.json()
    const validatedData = createGoalSchema.parse(body)

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        targetValue: validatedData.targetValue,
        startDate: validatedData.startDate
          ? new Date(validatedData.startDate)
          : null,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : null,
      },
    })

    return NextResponse.json({ data: goal }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}
