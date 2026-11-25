'use client'
/**
 * Attachments of a sent/received email, compact: image thumbnails (click → full-screen preview)
 * and files as chips (click → download).
 *
 * Props:     attachments [{ id, name, size, url?, status? }] (see ../attachments.js),
 *            row? (one line each: 4 image thumbnails, then a "+N" tile; files side by side, long names shortened),
 *            className?
 * Callbacks: onDownload(file)
 */
import { useState } from 'react'
import { Download, File, FileImage, FileSpreadsheet, FileText, ImageOff } from 'lucide-react'
import { cx } from '@/lib/cx'
import { formatSize, isAvailable, isImage, kind, STATUS_TEXT } from '../attachments'
import { ImagePreview } from '../ImagePreview'
import type { LucideIcon } from 'lucide-react'
import type { Attachment } from '@/mock/inbox-types'
import type { FileKind } from '../attachments'

const MAX = 6
const ROW_MAX = 4
const icons: Partial<Record<FileKind, LucideIcon>> = { pdf: FileText, doc: FileText, sheet: FileSpreadsheet, image: FileImage }

export function EmailFiles({ attachments, row, className, onDownload }: { attachments: Attachment[]; row?: boolean; className?: string; onDownload?: (file: Attachment) => void }) {
  const images = attachments.filter((a) => isImage(a) && isAvailable(a))
  const files = attachments.filter((a) => !isImage(a) || !isAvailable(a))
  const shown = images.slice(0, row ? ROW_MAX : MAX)
  const more = images.length - MAX
  const rest = images.length - ROW_MAX
  const [broken, setBroken] = useState<Record<string, boolean>>({})
  const [preview, setPreview] = useState<number | null>(null)

  return (
    <div className={cx('flex flex-col gap-2', className)}>
      {shown.length > 0 && (
        <div className={cx('flex gap-1.5', !row && 'flex-wrap')}>
          {shown.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              title={img.name}
              onClick={() => setPreview(i)}
            >
              {broken[img.id]
                ? <ImageOff size={18} className="m-auto text-gray-400" />
                : <img src={img.url} alt={img.name} loading="lazy" className="size-full object-cover" onError={() => setBroken((b) => ({ ...b, [img.id]: true }))} />}
              {!row && i === MAX - 1 && more > 0 && <span className="absolute inset-0 flex items-center justify-center bg-gray-900/60 font-semibold text-white">+{more}</span>}
            </button>
          ))}
          {row && rest > 0 && (
            <button
              type="button"
              className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 font-semibold text-gray-700 hover:bg-gray-100"
              title={`${rest} more images`}
              onClick={() => setPreview(ROW_MAX)}
            >+{rest}</button>
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className={cx('flex gap-1.5', !row && 'flex-wrap')}>
          {files.map((f) => {
            const Icon = icons[kind(f.name)] ?? File
            return (
              <button
                key={f.id}
                type="button"
                className={cx('flex min-w-0 max-w-64 items-center gap-2 rounded-lg border border-gray-200 bg-white py-1.5 pl-2 pr-2.5 text-xs disabled:cursor-default', isAvailable(f) && 'hover:bg-gray-50')}
                disabled={!isAvailable(f)}
                title={isAvailable(f) ? `Download ${f.name}` : STATUS_TEXT[f.status!]}
                onClick={() => onDownload?.(f)}
              >
                <Icon size={15} className={cx('shrink-0', isAvailable(f) ? 'text-gray-600' : 'text-gray-300')} />
                <span className={cx('min-w-0 truncate font-medium', isAvailable(f) ? 'text-gray-900' : 'text-gray-400')}>{f.name}</span>
                <span className="shrink-0 text-gray-500">{isAvailable(f) ? formatSize(f.size) : STATUS_TEXT[f.status!]}</span>
                {isAvailable(f) && <Download size={13} className="shrink-0 text-gray-500" />}
              </button>
            )
          })}
        </div>
      )}

      {preview !== null && <ImagePreview index={preview} onIndexChange={setPreview} images={images} onClose={() => setPreview(null)} onDownload={(a) => onDownload?.(a)} />}
    </div>
  )
}
