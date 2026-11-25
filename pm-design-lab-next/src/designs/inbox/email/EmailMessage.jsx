'use client'
/**
 * One email in a conversation thread: bold subject, body clamped to 2 lines, "View details" to expand.
 * Links like pmatch.dk/... in the body are rendered as links.
 *
 * Expanded: From / To, the full body, "Show quoted text" for earlier messages, and Reply.
 * Attachments are always visible (images as thumbnails with a preview, files with a download button).
 * An outgoing email that bounced shows the reason and Retry.
 *
 * Props:     subject, body?, dir ('in' | 'out'), from?, to?, quoted?,
 *            alwaysOpen? (no View details: everything is shown and Reply is always there),
 *            attachments? [{ id, name, size, url?, status? }] (see attachments.js),
 *            failed? (reason the email wasn't delivered), sending?
 * Callbacks: onReply() · onDownload(attachment) · onRetry()
 */
import { Fragment, useState } from 'react'
import { AlertCircle, Ellipsis, Loader, Paperclip, Reply, RotateCw } from 'lucide-react'
import { PmButton } from '@/ds'
import { cx } from '@/lib/cx'
import { EmailAttachments } from './EmailAttachments'
import { ImagePreview } from './ImagePreview'
import { isImage, isAvailable } from './attachments'

const LINK = /((?:https?:\/\/)?[\w-]+\.[a-z]{2,}\/\S+)/i
const linkify = (text) => text.split(LINK).map((t, i) => ({ t, link: i % 2 === 1 }))
const href = (t) => (t.startsWith('http') ? t : `https://${t}`)

export function EmailMessage({
  subject,
  body = '',
  dir = 'in',
  from,
  to,
  quoted,
  attachments = [],
  failed,
  alwaysOpen,
  sending,
  onReply,
  onDownload,
  onRetry,
}) {
  const [expanded, setExpanded] = useState(!!alwaysOpen)
  const [showQuoted, setShowQuoted] = useState(false)
  const canExpand = !!(body || quoted || from)
  const showReply = !failed && !sending && (expanded || !canExpand)

  const parts = linkify(body)
  const images = attachments.filter((a) => isImage(a) && isAvailable(a))
  const [previewIndex, setPreviewIndex] = useState(null)

  return (
    <div className={cx('w-full rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900', dir === 'out' ? 'bg-info-25' : 'bg-gray-50')}>
      <div className="flex items-start gap-2">
        <div className={cx('min-w-0 flex-1 font-semibold', !expanded && 'truncate')}>{subject}</div>
        {attachments.length > 0 && <Paperclip size={15} className="mt-1 shrink-0 text-gray-500" />}
      </div>

      {/* Sender and recipients (expanded) */}
      {expanded && (from || to) && (
        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
          {from && <><dt>From</dt><dd className="text-gray-700">{from}</dd></>}
          {to && <><dt>To</dt><dd className="text-gray-700">{to}</dd></>}
        </dl>
      )}

      {body && (
        <p className={cx('mt-1 whitespace-pre-line break-words', !expanded && 'line-clamp-2')}>
          {parts.map((p, i) => (p.link
            ? <a key={i} href={href(p.t)} target="_blank" rel="noopener" className="underline underline-offset-2">{p.t}</a>
            : <Fragment key={i}>{p.t}</Fragment>))}
        </p>
      )}

      {/* Earlier messages quoted in this email */}
      {expanded && quoted && (
        <>
          <button
            type="button"
            className="mt-2 flex h-5 items-center rounded-md bg-gray-200 px-1.5 text-gray-600 hover:bg-gray-300"
            title={showQuoted ? 'Hide quoted text' : 'Show quoted text'}
            onClick={() => setShowQuoted(!showQuoted)}
          ><Ellipsis size={16} /></button>
          {showQuoted && <p className="mt-2 whitespace-pre-line border-l-2 border-gray-300 pl-3 text-gray-500">{quoted}</p>}
        </>
      )}

      {attachments.length > 0 && (
        <EmailAttachments
          attachments={attachments}
          small={alwaysOpen}
          onDownload={(a) => onDownload?.(a)}
          onPreview={(i) => setPreviewIndex(i)}
        />
      )}

      {/* Not delivered (outgoing) */}
      {failed && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-error-200 bg-white px-3 py-2 text-error-700">
          <AlertCircle size={16} className="shrink-0" />
          <span className="min-w-0 flex-1"><span className="font-medium">Not delivered.</span> {failed}</span>
          <PmButton size="sm" variant="outline" className="shrink-0" onClick={() => onRetry?.()}><RotateCw size={14} />Retry</PmButton>
        </div>
      )}

      {((canExpand && !alwaysOpen) || showReply || sending) && (
        <div className="mt-1 flex min-h-9 items-center gap-4">
          {canExpand && !alwaysOpen && (
            <button type="button" className="font-medium text-info-700 hover:underline" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Hide details' : 'View details'}
            </button>
          )}
          {sending
            ? <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-500"><Loader size={14} className="animate-spin" />Sending</span>
            : showReply && <PmButton size="sm" variant="ghost" className="ml-auto" onClick={() => onReply?.()}><Reply size={15} />Reply</PmButton>}
        </div>
      )}

      {previewIndex !== null && (
        <ImagePreview
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          images={images}
          onClose={() => setPreviewIndex(null)}
          onDownload={(a) => onDownload?.(a)}
        />
      )}
    </div>
  )
}
