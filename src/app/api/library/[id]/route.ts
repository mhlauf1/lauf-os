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
