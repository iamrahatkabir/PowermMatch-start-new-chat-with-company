'use client'
// Composer button to choose the note type before saving (version C). Shows "Note type" until one is picked.
import { ChevronDown, Tag } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NoteTypeMenu } from './NoteTypeTag'
import { NOTE_TYPES, type NoteType } from './noteTypes'

type Props = { value: NoteType | null; onChange: (t: NoteType) => void }

export function NoteTypePicker({ value, onChange }: Props) {
  const t = NOTE_TYPES.find((x) => x.key === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 text-xs font-medium text-gray-700 outline-none hover:bg-gray-50 focus-visible:shadow-focus">
          {!t && <Tag size={14} className="text-gray-500" />}
          {t?.label ?? 'Note type'}
          <ChevronDown size={14} className="text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <NoteTypeMenu value={value} onChange={onChange} align="end" />
    </DropdownMenu>
  )
}
