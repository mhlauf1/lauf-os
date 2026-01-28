'use client'

import { TweetDraftCard } from './TweetDraftCard'
import type { TweetDraft, TweetDraftStatus } from '@prisma/client'

interface TweetGridProps {
  drafts: TweetDraft[]
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: TweetDraftStatus) => void
}

export function TweetGrid({ drafts, onDelete, onStatusChange }: TweetGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <TweetDraftCard
          key={draft.id}
          draft={draft}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
