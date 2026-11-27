'use client'
// Bar above the composer while a note or reply is being edited there: pencil icon (label is its accessible name only) · "Esc to cancel" · X.
import { Pencil, X } from 'lucide-react'

type Props = { onCancel: () => void; label?: string }

export function EditingBar({ onCancel, label = 'Editing note' }: Props) {
  return (
    <div className="flex items-center gap-2 border-b border-brand-light px-4 py-2 text-xs text-gray-700">
      <Pencil size={13} className="shrink-0 text-gray-500" aria-label={label} />
      <span className="text-gray-500">Esc to cancel</span>
      <button type="button" className="ml-auto flex size-6 items-center justify-center rounded-md text-gray-500 hover:bg-brand-light hover:text-gray-700" title="Cancel editing" onClick={onCancel}>
        <X size={14} />
      </button>
    </div>
  )
}
