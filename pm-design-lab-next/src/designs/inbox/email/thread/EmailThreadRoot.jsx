'use client'
/**
 * Version A: the first email of a thread, shown in the conversation. Replies are not listed in the
 * conversation; instead the bubble ends with a summary row — reply avatars, "N replies", last reply time —
 * that opens the Thread panel.
 * Without replies (empty state, like notes) it ends with a blue "Reply" link that opens the Thread panel.
 * Clicking the email itself expands it in place (From / To and the full text); clicking again collapses it.
 *
 * Props:     subject, body?, dir ('in' | 'out'), from?, to?, attachments?, replies? [{ author, authorPhoto?, time }]
 * Callbacks: onOpenThread() · onDownload(file)
 */
import { Fragment, useState } from 'react'
import { Reply } from 'lucide-react'
import { PmAvatar } from '@/ds'
import { cx } from '@/lib/cx'
import { EmailAttachments } from '../EmailAttachments'
import { ImagePreview } from '../ImagePreview'
import { isAvailable, isImage } from '../attachments'
import { href, linkify } from '../simple/compose'

// Extra props the thread passes for the full EmailMessage (quoted, failed…) are ignored
export function EmailThreadRoot({ subject, body = '', dir = 'in', from, to, attachments = [], replies = [], onOpenThread, onDownload }) {
  const parts = linkify(body)
  const images = attachments.filter((a) => isImage(a) && isAvailable(a))
  const [previewIndex, setPreviewIndex] = useState(null)

  // Click anywhere on the email to expand / collapse it — except on links, buttons, files, or while selecting text
  const [expanded, setExpanded] = useState(false)
  function toggle(e) {
    // React events bubble through portals: ignore clicks inside the image preview (it isn't inside this element in the DOM)
    if (!e.currentTarget.contains(e.target)) return
    if (e.target.closest('a, button') || window.getSelection()?.toString()) return
    setExpanded((v) => !v)
  }

  // Up to 2 avatars of different people who replied, then "+N"
  const people = [...new Map(replies.map((r) => [r.author, r])).values()]
  const last = replies.at(-1)

  return (
    <div
      className={cx('group relative w-full cursor-pointer rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900', dir === 'out' ? 'bg-info-25' : 'bg-gray-50')}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === 'Enter' && e.target === e.currentTarget) setExpanded((v) => !v) }}
    >
      <div className={cx('font-semibold', !expanded && 'truncate')}>{subject}</div>
      {expanded && (from || to) && (
        <dl className="mt-0.5 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
          {from && <><dt>From</dt><dd className="text-gray-700">{from}</dd></>}
          {to && <><dt>To</dt><dd className="text-gray-700">{to}</dd></>}
        </dl>
      )}
      {body && (
        <p className={cx('mt-1 whitespace-pre-line break-words', !expanded && 'line-clamp-3')}>
          {parts.map((p, i) => (p.link
            ? <a key={i} href={href(p.t)} target="_blank" rel="noopener" className="underline underline-offset-2">{p.t}</a>
            : <Fragment key={i}>{p.t}</Fragment>))}
        </p>
      )}
      {attachments.length > 0 && (
        <EmailAttachments
          attachments={attachments}
          small
          onDownload={(f) => onDownload?.(f)}
          onPreview={(i) => setPreviewIndex(i)}
        />
      )}

      {/* No replies yet: Reply link (same as the notes empty state) */}
      {!replies.length && (
        <button type="button" className="mt-2 flex items-center gap-1 text-[13px] font-medium text-info-700 hover:underline" onClick={() => onOpenThread?.()}>
          <Reply size={14} />Reply
        </button>
      )}

      {/* Replies summary */}
      {replies.length > 0 && (
        <button type="button" className="group/replies mt-2 flex items-center gap-2 text-xs" onClick={() => onOpenThread?.()}>
          <span className="flex -space-x-1">
            {people.slice(0, 2).map((r) => <PmAvatar key={r.author} name={r.author} src={r.authorPhoto} size={20} className="ring-2 ring-white" />)}
          </span>
          {people.length > 2 && <span className="text-[10px] text-gray-500">+{people.length - 2}</span>}
          <span className="font-medium text-info-700 group-hover/replies:underline">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
          <span className="text-gray-500">Last reply {last.time}</span>
        </button>
      )}

      {previewIndex !== null && (
        <ImagePreview
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          images={images}
          onClose={() => setPreviewIndex(null)}
          onDownload={(f) => onDownload?.(f)}
        />
      )}
    </div>
  )
}
