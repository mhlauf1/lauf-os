import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'

const createActivitySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.enum([
    'DESIGN',
    'CODE',
    'CLIENT',
    'LEARNING',
    'FITNESS',
    'ADMIN',
    'SAAS',
    'NETWORKING',
  ]),
  defaultDuration: z.number().int().min(15).max(480).optional(),
  energyLevel: z.enum(['DEEP_WORK', 'MODERATE', 'LIGHT']).optional(),
  icon: z.string().max(50).optional(),
  sortOrder: z.number().int().optional(),
})

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const validatedData = createActivitySchema.parse(body)

    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        defaultDuration: validatedData.defaultDuration ?? 90,
        energyLevel: validatedData.energyLevel ?? 'MODERATE',
        icon: validatedData.icon,
        sortOrder: validatedData.sortOrder ?? 0,
      },
    })

    return NextResponse.json({ data: activity }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}
