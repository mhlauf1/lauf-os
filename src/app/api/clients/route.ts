import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'

const createClientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  company: z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
  websiteUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  vercelUrl: z.string().url().optional(),
  figmaUrl: z.string().url().optional(),
  contractValue: z.number().min(0).optional(),
  monthlyRetainer: z.number().min(0).optional(),
  referredBy: z.string().max(200).optional(),
  notes: z.string().max(10000).optional(),
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
    const healthScore = searchParams.get('healthScore')
    const search = searchParams.get('search')

    const clients = await prisma.client.findMany({
      where: {
        userId: user.id,
        ...(status && status !== 'all' && { status: status as any }),
        ...(healthScore && { healthScore: healthScore as any }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        _count: {
          select: {
            projects: true,
            opportunities: true,
          },
        },
      },
    })

    return NextResponse.json({ data: clients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
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
    const validatedData = createClientSchema.parse(body)

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        industry: validatedData.industry,
        websiteUrl: validatedData.websiteUrl,
        githubUrl: validatedData.githubUrl,
        vercelUrl: validatedData.vercelUrl,
        figmaUrl: validatedData.figmaUrl,
        contractValue: validatedData.contractValue,
        monthlyRetainer: validatedData.monthlyRetainer,
        referredBy: validatedData.referredBy,
        notes: validatedData.notes,
      },
    })

    return NextResponse.json({ data: client }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
