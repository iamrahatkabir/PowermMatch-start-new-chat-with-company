'use client'
// An internal note in the conversation: light yellow bubble on the right, @mentions in blue, text cut to 2 lines + "See more",
// edit + delete icons on hover (left of the bubble; edit turns the bubble into a text box), a Reply link or (when it has replies) a replies row: avatars · "5 replies" · "Last reply 14:31", and "note icon · avatar · author • time" underneath.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NotepadText, Pencil, Reply, Trash2 } from 'lucide-react'
import { PmAvatar } from '@/ds'
import type { NoteReply } from '@/mock/inbox-types'
import { cx } from '@/lib/cx'
import { EditBox } from './EditBox'
import { ClampedText } from './ClampedText'

type Props = {
  text: string
  /** Names mentioned in the text (written as "@Name"); shown in blue without the @ */
  mentions?: string[]
  author?: string
  authorPhoto?: string
  time?: string
  /** Replies to this note, oldest first. When there are any, the replies row replaces the Reply link. */
  replies?: NoteReply[]
  /** Red "• Unread" after the reply count (you're @mentioned and haven't opened the thread). Clicking it opens the thread, like "N replies". */
  unread?: boolean
  onReply?: () => void
  onOpenReplies?: () => void
  /** Shown as icons on hover when given (pass them only to the note's author). onEdit gets the new text (inline edit). */
  onEdit?: (text: string) => void
  /** When given, the pencil calls this instead of editing inside the bubble (e.g. edit in the composer) */
  onEditClick?: () => void
  onDelete?: () => void
  /** Shown at the end of the line under the bubble (e.g. the note type tag) */
  meta?: ReactNode
  /** Being edited: the note sits above the edit overlay (z-50), scrolls into view, light meta line, no hover icons */
  raised?: boolean
  /** Shown inside the bubble at the bottom right, on the replies / Reply row (e.g. the note type badge, version B) */
  corner?: ReactNode
}

export function NoteBubble({ text, mentions = [], author, authorPhoto, time, replies = [], unread, onReply, onOpenReplies, onEdit, onEditClick, onDelete, meta, corner, raised }: Props) {
  const [editing, setEditing] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => { if (raised) root.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [raised])
  return (
    <div ref={root} className={cx('group flex max-w-[70%] flex-col items-end gap-1.5 self-end', editing !== null && 'w-full', raised && 'pointer-events-none relative z-50')}>
      <div className="flex w-full items-center justify-end gap-2">
        {editing === null && !raised && (onEdit || onEditClick || onDelete) && (
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {(onEdit || onEditClick) && (
              <button type="button" className="flex size-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Edit note" onClick={() => (onEditClick ? onEditClick() : setEditing(text))}>
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
        // Two lines, then "See more"
        <ClampedText text={text} mentions={mentions} className="whitespace-pre-line [overflow-wrap:anywhere]" />
        )}
        {editing === null && (replies.length > 0 || onReply || corner) && (
          // Bottom row: replies row or Reply link on the left, corner (type badge) on the right; the badge never wraps
          <div className="mt-2 flex items-end gap-3">
            <div className="min-w-0 flex-1">
              {replies.length > 0 ? (
                <RepliesRow replies={replies} unread={unread} onOpen={onOpenReplies} />
              ) : onReply && (
                <button type="button" className="flex items-center gap-1 text-[13px] text-info-500 hover:text-info-700" onClick={onReply}>
                  <Reply size={14} />Reply
                </button>
              )}
            </div>
            {corner && <div className="ml-auto shrink-0">{corner}</div>}
          </div>
        )}
      </div>
      </div>
      <div className={cx('flex max-w-full items-center gap-1.5 text-xs', raised ? 'text-gray-200' : 'text-gray-500')}>
        <NotepadText size={13} className="shrink-0" />
        {authorPhoto && <span className="shrink-0"><PmAvatar name={author} src={authorPhoto} size={16} /></span>}
        {/* Long names are cut with … so the time and type badge stay on one line */}
        <span className="min-w-0 truncate">{author}</span>
        <span className="shrink-0 whitespace-nowrap">• {time}</span>
        {meta && <span className="ml-1 shrink-0">{meta}</span>}
      </div>
    </div>
  )
}

// Up to 2 repliers' photos (different people), "+N" for the rest of the replies, count, red "• Unread" (clickable) and last reply time
function RepliesRow({ replies, unread, onOpen }: { replies: NoteReply[]; unread?: boolean; onOpen?: () => void }) {
  const shown = replies.filter((r, i) => replies.findIndex((x) => x.author === r.author) === i).slice(0, 2)
  const more = replies.length - shown.length
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 whitespace-nowrap">
      <div className="flex items-center gap-1">
        {shown.map((r) => <PmAvatar key={r.id} name={r.author} src={r.authorPhoto} size={20} />)}
        {more > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full border border-gray-200 bg-white text-[10px] font-medium text-gray-700">+{more}</span>
        )}
      </div>
      {/* One button: "5 replies • Unread" (both parts darken together on hover) */}
      <button type="button" className="group/replies flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium" onClick={onOpen}>
        <span className="text-info-500 group-hover/replies:text-info-700">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
        {unread && <span className="text-error-500 group-hover/replies:text-error-700">• Unread</span>}
      </button>
      <span className="text-[13px] text-gray-500">Last reply {replies[replies.length - 1].time.slice(-5)}</span>
    </div>
  )
}
