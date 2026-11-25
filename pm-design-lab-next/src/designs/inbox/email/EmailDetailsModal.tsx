'use client'
/**
 * Modal with one full email: subject, From / To, body, quoted text, images, files and Reply.
 * Esc or the backdrop closes it.
 *
 * Props:     subject, body?, from?, to?, quoted?, attachments?
 * Callbacks: onClose() · onReply() · onDownload(file)
 */
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Reply, X } from 'lucide-react'
import { PmButton } from '@/ds'
import { EmailAttachments } from './EmailAttachments'
import { EmailBody } from './EmailBody'
import { useModalKeys } from './useModalKeys'
import { ImagePreview } from './ImagePreview'
import { isAvailable, isImage } from './attachments'
import type { Attachment } from '@/mock/inbox-types'

export type EmailDetailsModalProps = {
  subject: string
  body?: string
  from?: string
  to?: string
  quoted?: string
  attachments?: Attachment[]
  onClose?: () => void
  onReply?: () => void
  onDownload?: (file: Attachment) => void
}

export function EmailDetailsModal({ subject, body = '', from, to, quoted, attachments = [], onClose, onReply, onDownload }: EmailDetailsModalProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const images = attachments.filter((a) => isImage(a) && isAvailable(a))
  useModalKeys(() => onClose?.(), () => previewIndex !== null)

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/70 p-4 sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" role="dialog" aria-modal="true" aria-label={subject}>
          <div className="flex shrink-0 items-start gap-3 border-b border-gray-200 px-6 py-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{subject}</h2>
              {(from || to) && (
                <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
                  {from && <><dt>From</dt><dd className="text-gray-700">{from}</dd></>}
                  {to && <><dt>To</dt><dd className="text-gray-700">{to}</dd></>}
                </dl>
              )}
            </div>
            <button type="button" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50" title="Close" onClick={() => onClose?.()}><X size={20} /></button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 text-sm leading-6 text-gray-900">
            <EmailBody body={body} quoted={quoted} />

            {attachments.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <EmailAttachments
                  attachments={attachments}
                  className="!mt-0"
                  onDownload={(f) => onDownload?.(f)}
                  onPreview={(i) => setPreviewIndex(i)}
                />
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-200 px-6 py-4">
            <PmButton variant="secondary" onClick={() => onClose?.()}>Close</PmButton>
            <PmButton onClick={() => onReply?.()}><Reply size={16} />Reply</PmButton>
          </div>
        </div>
      </div>

      {previewIndex !== null && (
        <ImagePreview
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          images={images}
          onClose={() => setPreviewIndex(null)}
          onDownload={(a) => onDownload?.(a)}
        />
      )}
    </>,
    document.body,
  )
}
