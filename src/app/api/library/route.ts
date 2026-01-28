import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUser } from '@/lib/prisma/ensure-user'
import { createLibraryItemSchema } from '@/lib/validations/library.schema'
import type { LibraryItemType, LibraryItemStatus } from '@prisma/client'

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
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const items = await prisma.libraryItem.findMany({
      where: {
        userId: user.id,
        ...(type && { type: type as LibraryItemType }),
        ...(status && { status: status as LibraryItemStatus }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(tag && { tags: { has: tag } }),
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        assets: {
          take: 1,
          select: { id: true, thumbnailUrl: true, url: true },
        },
        _count: {
          select: { assets: true },
        },
      },
    })

    return NextResponse.json({ data: items })
  } catch (error) {
    console.error('Error fetching library items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch library items' },
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

    // Clean empty string URLs before validation
    const cleaned = { ...body }
    for (const key of ['sourceUrl', 'figmaUrl', 'githubUrl', 'thumbnailUrl']) {
      if (cleaned[key] === '') delete cleaned[key]
    }

    const validatedData = createLibraryItemSchema.parse(cleaned)

    const item = await prisma.libraryItem.create({
      data: {
        userId: user.id,
        type: validatedData.type,
        status: validatedData.status || 'ACTIVE',
        title: validatedData.title,
        description: validatedData.description,
        sourceUrl: validatedData.sourceUrl || null,
        figmaUrl: validatedData.figmaUrl || null,
        githubUrl: validatedData.githubUrl || null,
        techStack: validatedData.techStack || [],
        tags: validatedData.tags || [],
        // Code fields
        code: validatedData.code || null,
        language: validatedData.language || null,
        // Image field
        thumbnailUrl: validatedData.thumbnailUrl || null,
        goalId: validatedData.goalId || null,
      },
    })

    // Increment linked goal progress
    if (validatedData.goalId) {
      const goal = await prisma.goal.update({
        where: { id: validatedData.goalId },
        data: { currentValue: { increment: 1 } },
      })
      // Auto-complete goal if target reached
      if (goal.targetValue && goal.currentValue >= goal.targetValue && !goal.completedAt) {
        await prisma.goal.update({
          where: { id: validatedData.goalId },
          data: { completedAt: new Date() },
        })
      }
    }

    return NextResponse.json({ data: item }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating library item:', error)
    return NextResponse.json(
      { error: 'Failed to create library item' },
      { status: 500 }
    )
  }
}
