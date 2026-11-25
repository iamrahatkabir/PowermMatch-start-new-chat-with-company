'use client'
/**
 * Version F: email in the thread with a modal for details.
 * The bubble shows the subject, attachment counts (images / files) at the top and a 2-line body.
 * "View details" (or a count) opens EmailDetailsModal with the full email, images, files and Reply.
 *
 * Props:     subject, body?, dir ('in' | 'out'), from?, to?, quoted?, attachments? (see attachments.js),
 *            details? — the details component to open (default EmailDetailsModal)
 * Callbacks: onReply() · onDownload(file)
 */
import { useState } from 'react'
import { Image, Paperclip } from 'lucide-react'
import { cx } from '@/lib/cx'
import { EmailDetailsModal } from './EmailDetailsModal'
import { isImage } from './attachments'

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// Extra props the thread passes for the full EmailMessage (failed, sending…) are ignored
export function EmailMessageModal({
  subject,
  body = '',
  dir = 'in',
  from,
  to,
  quoted,
  attachments = [],
  details: Details = EmailDetailsModal,
  onReply,
  onDownload,
}) {
  const [open, setOpen] = useState(false)

  const imageCount = attachments.filter(isImage).length
  const fileCount = attachments.length - imageCount

  function reply() {
    setOpen(false)
    onReply?.()
  }

  return (
    <div className={cx('w-full rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900', dir === 'out' ? 'bg-info-25' : 'bg-gray-50')}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 truncate font-semibold">{subject}</div>
        {/* Attachment counts */}
        {attachments.length > 0 && (
          <div className="flex shrink-0 items-center gap-1.5">
            {imageCount > 0 && (
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(true)}
              ><Image size={13} className="text-gray-500" />{plural(imageCount, 'image')}</button>
            )}
            {fileCount > 0 && (
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(true)}
              ><Paperclip size={13} className="text-gray-500" />{plural(fileCount, 'file')}</button>
            )}
          </div>
        )}
      </div>
      {body && <p className="mt-1 line-clamp-2 whitespace-pre-line break-words text-gray-900">{body}</p>}
      <button type="button" className="mt-1 font-medium text-info-700 hover:underline" onClick={() => setOpen(true)}>View details</button>

      {open && (
        <Details
          subject={subject}
          body={body}
          from={from}
          to={to}
          quoted={quoted}
          attachments={attachments}
          onClose={() => setOpen(false)}
          onReply={reply}
          onDownload={(f) => onDownload?.(f)}
        />
      )}
    </div>
  )
}
