import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { addCollectionItemSchema, removeCollectionItemSchema } from '@/lib/validations/collection.schema'

export async function POST(
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

    const { id: collectionId } = await params

    // Verify collection belongs to user
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId: user.id },
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = addCollectionItemSchema.parse(body)

    // Verify library item belongs to user
    const libraryItem = await prisma.libraryItem.findFirst({
      where: { id: validatedData.libraryItemId, userId: user.id },
    })

    if (!libraryItem) {
      return NextResponse.json({ error: 'Library item not found' }, { status: 404 })
    }

    // Check if already in collection
    const existing = await prisma.collectionItem.findUnique({
      where: {
        collectionId_libraryItemId: {
          collectionId,
          libraryItemId: validatedData.libraryItemId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Item already in collection' }, { status: 409 })
    }

    const collectionItem = await prisma.collectionItem.create({
      data: {
        collectionId,
        libraryItemId: validatedData.libraryItemId,
        sortOrder: validatedData.sortOrder ?? 0,
      },
      include: {
        libraryItem: true,
      },
    })

    return NextResponse.json({ data: collectionItem }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error adding item to collection:', error)
    return NextResponse.json(
      { error: 'Failed to add item to collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const { id: collectionId } = await params

    // Verify collection belongs to user
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId: user.id },
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = removeCollectionItemSchema.parse(body)

    const collectionItem = await prisma.collectionItem.findUnique({
      where: {
        collectionId_libraryItemId: {
          collectionId,
          libraryItemId: validatedData.libraryItemId,
        },
      },
    })

    if (!collectionItem) {
      return NextResponse.json({ error: 'Item not in collection' }, { status: 404 })
    }

    await prisma.collectionItem.delete({
      where: { id: collectionItem.id },
    })

    return NextResponse.json({ data: { deleted: true } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error removing item from collection:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from collection' },
      { status: 500 }
    )
  }
}
