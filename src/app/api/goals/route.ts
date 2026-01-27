import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'

const createGoalSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  targetValue: z.number().int().min(1).optional(),
  dueDate: z.string().datetime().optional(),
})

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

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        ...(type && { type: type as any }),
        ...(completed === 'true' && { completedAt: { not: null } }),
        ...(completed === 'false' && { completedAt: null }),
      },
      orderBy: [{ completedAt: 'asc' }, { dueDate: 'asc' }],
    })

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

    const body = await request.json()
    const validatedData = createGoalSchema.parse(body)

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        targetValue: validatedData.targetValue,
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
