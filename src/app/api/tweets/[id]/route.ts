import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { updateTweetDraftSchema } from '@/lib/validations/tweet-draft.schema'

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

    const draft = await prisma.tweetDraft.findFirst({
      where: { id, userId: user.id },
    })

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    return NextResponse.json({ data: draft })
  } catch (error) {
    console.error('Error fetching tweet draft:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tweet draft' },
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

    const existing = await prisma.tweetDraft.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateTweetDraftSchema.parse(body)

    const draft = await prisma.tweetDraft.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({ data: draft })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating tweet draft:', error)
    return NextResponse.json(
      { error: 'Failed to update tweet draft' },
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

    const existing = await prisma.tweetDraft.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    await prisma.tweetDraft.delete({ where: { id } })

    return NextResponse.json({ data: { deleted: true } })
  } catch (error) {
    console.error('Error deleting tweet draft:', error)
    return NextResponse.json(
      { error: 'Failed to delete tweet draft' },
      { status: 500 }
    )
  }
}
