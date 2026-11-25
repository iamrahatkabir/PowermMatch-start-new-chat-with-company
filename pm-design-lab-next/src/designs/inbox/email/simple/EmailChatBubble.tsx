'use client'
/**
 * Version G: an email shown like a chat message. The subject is a small label on top, the whole text
 * is visible (long emails: first 8 lines + Show more), files sit right under it. Nothing to open.
 * Hovering shows a small Reply link (the composer already replies to the newest email by default).
 *
 * Props:     subject, body?, dir ('in' | 'out'), attachments?
 * Callbacks: onReply() · onDownload(file)
 */
import { Fragment, useState } from 'react'
import { Mail, Reply } from 'lucide-react'
import { cx } from '@/lib/cx'
import { EmailFiles } from './EmailFiles'
import { href, linkify } from './compose'
import type { EmailInThreadProps } from '../types'

// Extra props the thread passes for the full EmailMessage (from, to, quoted…) are ignored
export function EmailChatBubble({ subject, body = '', dir = 'in', attachments = [], onReply, onDownload }: EmailInThreadProps) {
  const [more, setMore] = useState(false)
  const parts = linkify(body)
  const long = body.split('\n').length > 8 || body.length > 600

  return (
    <div className={cx('group flex w-full flex-col gap-2 rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900', dir === 'out' ? 'bg-info-25' : 'bg-gray-50')}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        <Mail size={13} className="shrink-0" />
        <span className="min-w-0 truncate">{subject}</span>
        <button type="button" className="ml-auto hidden shrink-0 items-center gap-1 text-gray-600 hover:text-gray-900 group-hover:flex" onClick={() => onReply?.()}><Reply size={13} />Reply</button>
      </div>
      {body && (
        <div>
          <p className={cx('whitespace-pre-line break-words', long && !more && 'line-clamp-8')}>
            {parts.map((p, i) => (p.link
              ? <a key={i} href={href(p.t)} target="_blank" rel="noopener" className="underline underline-offset-2">{p.t}</a>
              : <Fragment key={i}>{p.t}</Fragment>))}
          </p>
          {long && <button type="button" className="text-xs font-medium text-info-700 hover:underline" onClick={() => setMore(!more)}>{more ? 'Show less' : 'Show more'}</button>}
        </div>
      )}
      {attachments.length > 0 && <EmailFiles attachments={attachments} onDownload={(f) => onDownload?.(f)} />}
    </div>
  )
}
