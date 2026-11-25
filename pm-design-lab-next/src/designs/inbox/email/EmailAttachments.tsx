'use client'
/**
 * Attachments of one email: images as thumbnails (click → preview), other files as cards with a download button.
 * Unavailable files (expired / blocked) are shown but can't be downloaded.
 *
 * Props:     attachments [{ id, name, size, url?, status? }], stacked? (files in one column, for narrow spaces),
 *            small? (80px image thumbnails in a row, like the simple E version), className?
 * Callbacks: onDownload(attachment) · onPreview(index into images)
 */
import { useState } from 'react'
import { Download, File, FileArchive, FileImage, FileSpreadsheet, FileText, ImageOff, ShieldAlert, Clock } from 'lucide-react'
import { cx } from '@/lib/cx'
import type { LucideIcon } from 'lucide-react'
import type { Attachment } from '@/mock/inbox-types'
import { isImage, isAvailable, kind, extension, formatSize, STATUS_TEXT } from './attachments'
import type { FileKind } from './attachments'

type Props = {
  attachments: Attachment[]
  stacked?: boolean
  small?: boolean
  className?: string
  onDownload?: (attachment: Attachment) => void
  onPreview?: (index: number) => void
}

// Thumbnails: up to 6, the last one shows "+N" when there are more.
// small: 4 images, then a separate "+N" tile for the rest (opens the preview at the 5th image).
const MAX = 6
const SMALL_MAX = 4

const icons: Record<FileKind, LucideIcon> = { pdf: FileText, doc: FileText, sheet: FileSpreadsheet, archive: FileArchive, image: FileImage, file: File }
const tiles: Record<FileKind, string> = {
  pdf: 'bg-error-50 text-error-700',
  doc: 'bg-info-50 text-info-700',
  sheet: 'bg-success-50 text-success-700',
  archive: 'bg-gray-100 text-gray-600',
  image: 'bg-gray-100 text-gray-600',
  file: 'bg-gray-100 text-gray-600',
}

export function EmailAttachments({ attachments, stacked, small, className, onDownload, onPreview }: Props) {
  const images = attachments.filter((a) => isImage(a) && isAvailable(a))
  const files = attachments.filter((a) => !isImage(a) || !isAvailable(a))
  const shown = images.slice(0, small ? SMALL_MAX : MAX)
  const hidden = images.length - MAX
  const rest = images.length - SMALL_MAX
  const [broken, setBroken] = useState<Record<string, boolean>>({})

  return (
    <div className={cx('mt-3 flex flex-col gap-2', className)}>
      {/* Images */}
      {shown.length > 0 && (
        <div className={small ? 'flex flex-wrap gap-1.5' : cx('grid gap-2', shown.length === 1 ? 'max-w-sm grid-cols-1' : shown.length === 2 ? 'max-w-lg grid-cols-2' : 'max-w-lg grid-cols-3')}>
          {shown.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={cx('group relative overflow-hidden border border-gray-200 bg-white', small ? 'size-20 rounded-lg' : ['rounded-xl', shown.length === 1 ? 'aspect-[4/3]' : 'aspect-square'])}
              title={img.name}
              onClick={() => onPreview?.(i)}
            >
              {broken[img.id] ? (
                <div className="flex size-full flex-col items-center justify-center gap-1 bg-gray-50 px-2 text-xs text-gray-500">
                  <ImageOff size={small ? 18 : 20} />{!small && "Image can't be shown"}
                </div>
              ) : (
                <img src={img.url} alt={img.name} loading="lazy" className="size-full object-cover" onError={() => setBroken((b) => ({ ...b, [img.id]: true }))} />
              )}
              {!small && i === MAX - 1 && hidden > 0 ? (
                <span className={cx('absolute inset-0 flex items-center justify-center bg-gray-900/60 font-semibold text-white', !small && 'text-lg')}>+{hidden}</span>
              ) : !small ? (
                <span
                  className="absolute right-1.5 top-1.5 hidden size-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 group-hover:flex"
                  title="Download"
                  onClick={(e) => { e.stopPropagation(); onDownload?.(img) }}
                ><Download size={14} /></span>
              ) : null}
            </button>
          ))}
          {small && rest > 0 && (
            <button
              type="button"
              className="flex size-20 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 font-semibold text-gray-700 hover:bg-gray-100"
              title={`${rest} more images`}
              onClick={() => onPreview?.(SMALL_MAX)}
            >+{rest}</button>
          )}
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div className={cx('grid max-w-2xl grid-cols-1 gap-2', !stacked && 'sm:grid-cols-2')}>
          {files.map((f) => {
            const Icon = icons[kind(f.name)]
            const StatusIcon = f.status === 'blocked' ? ShieldAlert : Clock
            return (
              <div key={f.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5">
                <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-lg', isAvailable(f) ? tiles[kind(f.name)] : 'bg-gray-100 text-gray-400')}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className={cx('truncate text-sm font-medium', isAvailable(f) ? 'text-gray-900' : 'text-gray-500')} title={f.name}>{f.name}</div>
                  {isAvailable(f) ? (
                    <div className="text-xs text-gray-500">{extension(f.name)} • {formatSize(f.size)}</div>
                  ) : (
                    <div className={cx('flex items-center gap-1 text-xs', f.status === 'blocked' ? 'text-error-700' : 'text-gray-500')}>
                      <StatusIcon size={12} />{STATUS_TEXT[f.status!]}
                    </div>
                  )}
                </div>
                {isAvailable(f) && (
                  <button
                    type="button"
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
                    title="Download"
                    onClick={() => onDownload?.(f)}
                  ><Download size={16} /></button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
