'use client'
// An internal note in the conversation: light yellow bubble on the right, @mentions in blue,
// a Reply link, and "note icon · avatar · author • time" underneath.
import { NotepadText, Reply } from 'lucide-react'
import { PmAvatar } from '@/ds'
import { splitMentions } from './mentions'

type Props = {
  text: string
  /** Names mentioned in the text (written as "@Name"); shown in blue without the @ */
  mentions?: string[]
  author?: string
  authorPhoto?: string
  time?: string
  onReply?: () => void
}

export function NoteBubble({ text, mentions = [], author, authorPhoto, time, onReply }: Props) {
  return (
    <div className="flex max-w-[70%] flex-col items-end gap-1.5 self-end">
      <div className="rounded-2xl bg-brand-bg px-4 py-3 text-sm leading-6 text-gray-900">
        <p className="whitespace-pre-line">
          {splitMentions(text, mentions).map((part, i) =>
            part.mention ? <span key={i} className="text-info-500">{part.text}</span> : <span key={i}>{part.text}</span>,
          )}
        </p>
        {onReply && (
          <button type="button" className="mt-1.5 flex items-center gap-1 text-[13px] text-info-500 hover:text-info-700" onClick={onReply}>
            <Reply size={14} />Reply
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <NotepadText size={13} />
        {authorPhoto && <PmAvatar name={author} src={authorPhoto} size={16} />}
        {author} • {time}
      </div>
    </div>
  )
}
