import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'

const updateActivitySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
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
    ])
    .optional(),
  defaultDuration: z.number().int().min(15).max(480).optional(),
  energyLevel: z.enum(['DEEP_WORK', 'MODERATE', 'LIGHT']).optional(),
  icon: z.string().max(50).optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
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

    const existing = await prisma.activity.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateActivitySchema.parse(body)

    const activity = await prisma.activity.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({ data: activity })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating activity:', error)
    return NextResponse.json(
      { error: 'Failed to update activity' },
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

    const existing = await prisma.activity.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    await prisma.activity.delete({ where: { id } })

    return NextResponse.json({ data: { deleted: true } })
  } catch (error) {
    console.error('Error deleting activity:', error)
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    )
  }
}
