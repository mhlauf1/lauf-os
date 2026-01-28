import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUser } from '@/lib/prisma/ensure-user'
import { createCollectionSchema } from '@/lib/validations/collection.schema'

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
    const search = searchParams.get('search')

    const collections = await prisma.collection.findMany({
      where: {
        userId: user.id,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: {
          select: { items: true },
        },
      },
    })

    return NextResponse.json({ data: collections })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
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
    const validatedData = createCollectionSchema.parse(body)

    const collection = await prisma.collection.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        description: validatedData.description,
        color: validatedData.color,
        icon: validatedData.icon,
        sortOrder: validatedData.sortOrder ?? 0,
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
    })

    return NextResponse.json({ data: collection }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}
