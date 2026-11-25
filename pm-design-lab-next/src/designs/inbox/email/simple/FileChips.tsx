'use client'
/**
 * Files added to an email being written, each with a remove button.
 * Props: attachments [{ id, name, size }], className? · Callbacks: onRemove(id)
 */
import { File, FileImage, FileSpreadsheet, FileText, X } from 'lucide-react'
import { cx } from '@/lib/cx'
import type { LucideIcon } from 'lucide-react'
import type { Attachment } from '@/mock/inbox-types'
import { formatSize, kind } from '../attachments'
import type { FileKind } from '../attachments'

const icons: Partial<Record<FileKind, LucideIcon>> = { pdf: FileText, doc: FileText, sheet: FileSpreadsheet, image: FileImage }

export function FileChips({ attachments, className, onRemove }: { attachments: Attachment[]; className?: string; onRemove?: (id: string) => void }) {
  if (!attachments.length) return null
  return (
    <div className={cx('flex flex-wrap gap-1.5', className)}>
      {attachments.map((a) => {
        const Icon = icons[kind(a.name)] ?? File
        return (
          <span key={a.id} className="flex max-w-60 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-1 pl-2 pr-1 text-xs text-gray-700">
            <Icon size={14} className="shrink-0 text-gray-500" />
            <span className="min-w-0 truncate font-medium" title={a.name}>{a.name}</span>
            <span className="shrink-0 text-gray-500">{formatSize(a.size)}</span>
            <button type="button" className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-gray-200" title={`Remove ${a.name}`} onClick={() => onRemove?.(a.id)}><X size={12} /></button>
          </span>
        )
      })}
    </div>
  )
}
