import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUser } from '@/lib/prisma/ensure-user'

const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  category: z.enum([
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
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE']).optional(),
  scheduledDate: z.string().datetime().optional(),
  slotIndex: z.number().int().min(0).max(9).optional(),
  energyLevel: z.enum(['DEEP_WORK', 'MODERATE', 'LIGHT']).optional(),
  projectId: z.string().uuid().optional(),
  activityId: z.string().optional(), // Accepts preset-{slug} format or UUID
  goalId: z.string().uuid().optional(),
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
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const date = searchParams.get('date')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const scheduled = searchParams.get('scheduled')

    // Build date filter: use range to avoid timezone mismatch
    let dateFilter: Record<string, unknown> | undefined
    if (date) {
      dateFilter = {
        scheduledDate: {
          gte: new Date(date + 'T00:00:00.000Z'),
          lte: new Date(date + 'T23:59:59.999Z'),
        },
      }
    } else if (dateFrom || dateTo) {
      dateFilter = {
        scheduledDate: {
          ...(dateFrom && { gte: new Date(dateFrom + 'T00:00:00.000Z') }),
          ...(dateTo && { lte: new Date(dateTo + 'T23:59:59.999Z') }),
        },
      }
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        ...(status && status !== 'all' && { status: status as any }),
        ...(category && { category: category as any }),
        ...dateFilter,
        ...(scheduled === 'true' && { scheduledDate: { not: null } }),
        ...(scheduled === 'false' && { scheduledDate: null }),
      },
      orderBy: [{ scheduledDate: 'asc' }, { slotIndex: 'asc' }],
      include: {
        project: {
          select: {
            id: true,
            name: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ data: tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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
    const validatedData = createTaskSchema.parse(body)

    // Don't store preset-style activityId in DB (no FK constraint)
    // The activity info is already captured in title/category/energyLevel
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        priority: validatedData.priority || 'MEDIUM',
        status: validatedData.status || 'TODO',
        scheduledDate: validatedData.scheduledDate
          ? new Date(validatedData.scheduledDate)
          : null,
        slotIndex: validatedData.slotIndex,
        timeBlockMinutes: 90, // Always 90 minutes
        energyLevel: validatedData.energyLevel || 'MODERATE',
        projectId: validatedData.projectId,
        activityId: null, // Activities are config-based, not DB-linked
        goalId: validatedData.goalId,
      },
    })

    return NextResponse.json({ data: task }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
