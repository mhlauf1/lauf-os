'use client'

import { LibraryItemCard } from './LibraryItemCard'
import type { LibraryItem } from '@prisma/client'

interface LibraryGridProps {
  items: LibraryItem[]
  onDelete?: (id: string) => void
}

export function LibraryGrid({ items, onDelete }: LibraryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <LibraryItemCard key={item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  )
}
