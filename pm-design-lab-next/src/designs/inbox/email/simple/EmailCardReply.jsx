'use client'
/**
 * Version D: an email as a clear card. Subject on top with a tertiary Reply button that appears when the
 * card is hovered (or focused with the keyboard), then text (first 6 lines, Show more) and files.
 *
 * Props:     subject, body?, attachments?
 * Callbacks: onReply() · onDownload(file)
 */
import { Fragment, useState } from 'react'
import { Reply } from 'lucide-react'
import { PmButton } from '@/ds'
import { cx } from '@/lib/cx'
import { EmailFiles } from './EmailFiles'
import { href, linkify } from './compose'

// Extra props the thread passes for the full EmailMessage (dir, from, to, quoted…) are ignored
export function EmailCardReply({ subject, body = '', attachments = [], onReply, onDownload }) {
  const [more, setMore] = useState(false)
  const parts = linkify(body)
  const long = body.split('\n').length > 6 || body.length > 450

  return (
    <div className="group w-full rounded-2xl border border-gray-200 bg-white text-sm leading-6 text-gray-900">
      <div className="flex items-center gap-3 px-4 pt-3">
        <div className="min-w-0 flex-1 truncate font-semibold">{subject}</div>
        <PmButton size="sm" variant="ghost" className="-mr-2 shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" onClick={() => onReply?.()}><Reply size={15} />Reply</PmButton>
      </div>
      {body && (
        <div className="px-4 pt-2">
          <p className={cx('whitespace-pre-line break-words text-gray-700', long && !more && 'line-clamp-6')}>
            {parts.map((p, i) => (p.link
              ? <a key={i} href={href(p.t)} target="_blank" rel="noopener" className="underline underline-offset-2">{p.t}</a>
              : <Fragment key={i}>{p.t}</Fragment>))}
          </p>
          {long && <button type="button" className="text-xs font-medium text-info-700 hover:underline" onClick={() => setMore(!more)}>{more ? 'Show less' : 'Show more'}</button>}
        </div>
      )}
      {attachments.length > 0 && <EmailFiles attachments={attachments} row className="px-4 pt-3" onDownload={(f) => onDownload?.(f)} />}
      <div className="h-3" />
    </div>
  )
}
