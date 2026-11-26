'use client'
// An internal note in the conversation: light yellow bubble on the right, @mentions in blue,
// edit + delete icons on hover (left of the bubble; edit turns the bubble into a text box), a Reply link or (when it has replies) a replies row: avatars · "5 replies" · "Last reply 14:31", and "note icon · avatar · author • time" underneath.
import { useState } from 'react'
import { NotepadText, Pencil, Reply, Trash2 } from 'lucide-react'
import { PmAvatar } from '@/ds'
import type { NoteReply } from '@/mock/inbox-types'
import { cx } from '@/lib/cx'
import { EditBox } from './EditBox'
import { MentionText } from './MentionText'

type Props = {
  text: string
  /** Names mentioned in the text (written as "@Name"); shown in blue without the @ */
  mentions?: string[]
  author?: string
  authorPhoto?: string
  time?: string
  /** Replies to this note, oldest first. When there are any, the replies row replaces the Reply link. */
  replies?: NoteReply[]
  onReply?: () => void
  onOpenReplies?: () => void
  /** Shown as icons on hover when given (pass them only to the note's author). onEdit gets the new text. */
  onEdit?: (text: string) => void
  onDelete?: () => void
}

export function NoteBubble({ text, mentions = [], author, authorPhoto, time, replies = [], onReply, onOpenReplies, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null)
  return (
    <div className={cx('group flex max-w-[70%] flex-col items-end gap-1.5 self-end', editing !== null && 'w-full')}>
      <div className="flex w-full items-center justify-end gap-2">
        {editing === null && (onEdit || onDelete) && (
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {onEdit && (
              <button type="button" className="flex size-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Edit note" onClick={() => setEditing(text)}>
                <Pencil size={15} />
              </button>
            )}
            {onDelete && (
              <button type="button" className="flex size-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-error-500" title="Delete note" onClick={onDelete}>
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      <div className={cx('rounded-2xl bg-brand-bg px-4 py-3 text-sm leading-6 text-gray-900', editing !== null && 'w-full')}>
        {editing !== null ? (
          <EditBox initial={editing} onCancel={() => setEditing(null)} onSave={(t) => { onEdit?.(t); setEditing(null) }} />
        ) : (
        <p className="whitespace-pre-line">
          <MentionText text={text} mentions={mentions} />
        </p>
        )}
        {editing !== null ? null : replies.length > 0 ? (
          <RepliesRow replies={replies} onOpen={onOpenReplies} />
        ) : onReply && (
          <button type="button" className="mt-1.5 flex items-center gap-1 text-[13px] text-info-500 hover:text-info-700" onClick={onReply}>
            <Reply size={14} />Reply
          </button>
        )}
      </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <NotepadText size={13} />
        {authorPhoto && <PmAvatar name={author} src={authorPhoto} size={16} />}
        {author} • {time}
      </div>
    </div>
  )
}

// Up to 2 repliers' photos (different people), "+N" for the rest of the replies, count and last reply time
function RepliesRow({ replies, onOpen }: { replies: NoteReply[]; onOpen?: () => void }) {
  const shown = replies.filter((r, i) => replies.findIndex((x) => x.author === r.author) === i).slice(0, 2)
  const more = replies.length - shown.length
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex items-center gap-1">
        {shown.map((r) => <PmAvatar key={r.id} name={r.author} src={r.authorPhoto} size={20} />)}
        {more > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full border border-gray-200 bg-white text-[10px] font-medium text-gray-700">+{more}</span>
        )}
      </div>
      <button type="button" className="text-[13px] font-medium text-info-500 hover:text-info-700" onClick={onOpen}>
        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </button>
      <span className="text-[13px] text-gray-500">Last reply {replies[replies.length - 1].time.slice(-5)}</span>
    </div>
  )
}
