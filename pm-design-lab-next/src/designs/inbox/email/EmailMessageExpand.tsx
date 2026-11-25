'use client'
/**
 * Version C: same bubble as the modal version (subject, attachment counts at the top, 2-line body),
 * but "View details" (or a count) expands the email in place, below — no pop-up.
 * Expanded: From / To, full body with quoted text, images and files, Hide details and Reply.
 *
 * Props:     subject, body?, dir ('in' | 'out'), from?, to?, quoted?, attachments? (see attachments.js)
 * Callbacks: onReply() · onDownload(file)
 */
import { useState } from 'react'
import { Image, Paperclip, Reply } from 'lucide-react'
import { PmButton } from '@/ds'
import { cx } from '@/lib/cx'
import { EmailAttachments } from './EmailAttachments'
import { EmailBody } from './EmailBody'
import { ImagePreview } from './ImagePreview'
import { isAvailable, isImage } from './attachments'
import type { EmailInThreadProps } from './types'

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
const chip = 'flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50'

// Extra props the thread passes for the full EmailMessage (failed, sending…) are ignored
export function EmailMessageExpand({ subject, body = '', dir = 'in', from, to, quoted, attachments = [], onReply, onDownload }: EmailInThreadProps) {
  const [open, setOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const imageCount = attachments.filter(isImage).length
  const fileCount = attachments.length - imageCount
  const images = attachments.filter((a) => isImage(a) && isAvailable(a))

  return (
    <div className={cx('w-full rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900', dir === 'out' ? 'bg-info-25' : 'bg-gray-50')}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 truncate font-semibold">{subject}</div>
        {/* Attachment counts */}
        {attachments.length > 0 && (
          <div className="flex shrink-0 items-center gap-1.5">
            {imageCount > 0 && <button type="button" className={chip} onClick={() => setOpen(true)}><Image size={13} className="text-gray-500" />{plural(imageCount, 'image')}</button>}
            {fileCount > 0 && <button type="button" className={chip} onClick={() => setOpen(true)}><Paperclip size={13} className="text-gray-500" />{plural(fileCount, 'file')}</button>}
          </div>
        )}
      </div>

      {/* Collapsed */}
      {!open && body && <p className="mt-1 line-clamp-2 whitespace-pre-line break-words">{body}</p>}

      {/* Expanded details */}
      {open && (
        <>
          {(from || to) && (
            <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
              {from && <><dt>From</dt><dd className="text-gray-700">{from}</dd></>}
              {to && <><dt>To</dt><dd className="text-gray-700">{to}</dd></>}
            </dl>
          )}
          <EmailBody body={body} quoted={quoted} className="mt-2" />
          {attachments.length > 0 && (
            <EmailAttachments
              attachments={attachments}
              small
              onDownload={(f) => onDownload?.(f)}
              onPreview={(i) => setPreviewIndex(i)}
            />
          )}
        </>
      )}

      <div className="mt-1 flex min-h-9 items-center gap-4">
        <button type="button" className="font-medium text-info-700 hover:underline" onClick={() => setOpen(!open)}>{open ? 'Hide details' : 'View details'}</button>
        {open && <PmButton size="sm" variant="ghost" className="ml-auto" onClick={() => onReply?.()}><Reply size={15} />Reply</PmButton>}
      </div>

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
