import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'

const updateClientSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'CHURNED']).optional(),
  healthScore: z.enum(['GREEN', 'YELLOW', 'RED']).optional(),
  websiteUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  vercelUrl: z.string().url().optional().nullable(),
  figmaUrl: z.string().url().optional().nullable(),
  contractValue: z.number().min(0).optional().nullable(),
  monthlyRetainer: z.number().min(0).optional().nullable(),
  referredBy: z.string().max(200).optional().nullable(),
  notes: z.string().max(10000).optional().nullable(),
  lastContacted: z.string().datetime().optional().nullable(),
})

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

    const client = await prisma.client.findFirst({
      where: { id, userId: user.id },
      include: {
        projects: {
          orderBy: { updatedAt: 'desc' },
          include: {
            _count: {
              select: { tasks: true, assets: true },
            },
          },
        },
        opportunities: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            projects: true,
            opportunities: true,
          },
        },
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json({ data: client })
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client' },
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

    const existing = await prisma.client.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateClientSchema.parse(body)

    const updateData: Record<string, unknown> = { ...validatedData }

    if (validatedData.lastContacted) {
      updateData.lastContacted = new Date(validatedData.lastContacted)
    }

    const client = await prisma.client.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ data: client })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
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

    const existing = await prisma.client.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    await prisma.client.delete({ where: { id } })

    return NextResponse.json({ data: { deleted: true } })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
