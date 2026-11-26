'use client'
// Inline edit box for a note or reply: text area + Cancel / Save. Enter saves, Shift+Enter new line, Esc cancels.
import { useState } from 'react'
import { PmButton } from '@/ds'

type Props = {
  initial: string
  onSave: (text: string) => void
  onCancel: () => void
}

export function EditBox({ initial, onSave, onCancel }: Props) {
  const [value, setValue] = useState(initial)
  const save = () => value.trim() && onSave(value.trim())
  return (
    <div>
      <textarea
        autoFocus
        value={value}
        rows={Math.min(8, Math.max(2, value.split('\n').length, Math.ceil(value.length / 34)))}
        className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:shadow-focus"
        onFocus={(e) => e.currentTarget.setSelectionRange(value.length, value.length)}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') { e.preventDefault(); onCancel() }
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save() }
        }}
      />
      <div className="mt-2 flex justify-end gap-2">
        <PmButton size="sm" variant="secondary" onClick={onCancel}>Cancel</PmButton>
        <PmButton size="sm" disabled={!value.trim()} onClick={save}>Save</PmButton>
      </div>
    </div>
  )
}
