import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUser } from '@/lib/prisma/ensure-user'
import { createTweetDraftSchema } from '@/lib/validations/tweet-draft.schema'
import type { TweetDraftStatus } from '@prisma/client'

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
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const drafts = await prisma.tweetDraft.findMany({
      where: {
        userId: user.id,
        ...(status && { status: status as TweetDraftStatus }),
        ...(search && {
          content: { contains: search, mode: 'insensitive' },
        }),
        ...(tag && { tags: { has: tag } }),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: drafts })
  } catch (error) {
    console.error('Error fetching tweet drafts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tweet drafts' },
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
    const validatedData = createTweetDraftSchema.parse(body)

    const draft = await prisma.tweetDraft.create({
      data: {
        userId: user.id,
        content: validatedData.content,
        tweetNumber: validatedData.tweetNumber ?? 1,
        totalTweets: validatedData.totalTweets ?? 1,
        status: validatedData.status ?? 'DRAFT',
        tags: validatedData.tags || [],
      },
    })

    return NextResponse.json({ data: draft }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating tweet draft:', error)
    return NextResponse.json(
      { error: 'Failed to create tweet draft' },
      { status: 500 }
    )
  }
}
