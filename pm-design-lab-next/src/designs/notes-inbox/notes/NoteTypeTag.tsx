'use client'
// Small chip with a note's type (label only). With onChange it opens a menu to change the type.
// detecting = AI is still working ("Detecting type…"). No AI icon, no colour dots, no tooltip. Icons: Lucide (PowerMatch set).
// Uses shadcn DropdownMenu.
import { Check, ChevronDown } from 'lucide-react'
import { cx } from '@/lib/cx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NOTE_TYPES, type NoteType } from './noteTypes'

type Props = {
  type?: NoteType | null
  detecting?: boolean
  /** Shown as a menu when given (e.g. only for the note's author) */
  onChange?: (t: NoteType) => void
  /** Label when no type is set yet */
  emptyLabel?: string
  /** On a light yellow note: white badge instead of gray */
  onYellow?: boolean
  className?: string
}

export function NoteTypeTag({ type, detecting, onChange, emptyLabel = 'Add type', onYellow, className }: Props) {
  if (detecting) {
    return (
      <span className={cx('flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs text-gray-500', onYellow ? 'bg-white' : 'bg-gray-50', className)}>
        <span className="animate-pulse">Detecting type…</span>
      </span>
    )
  }
  const t = NOTE_TYPES.find((x) => x.key === type)
  const chip = (
    <span className={cx('flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs', onYellow ? 'bg-white' : 'bg-gray-50', t ? 'text-gray-700' : 'text-gray-500', onChange && (onYellow ? 'hover:text-gray-900' : 'hover:bg-gray-100'), className)}>
      {t?.label ?? emptyLabel}
      {onChange && <ChevronDown size={12} className="text-gray-500" />}
    </span>
  )
  if (!onChange) return chip
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rounded-md outline-none focus-visible:shadow-focus">{chip}</button>
      </DropdownMenuTrigger>
      <NoteTypeMenu value={type} onChange={onChange} />
    </DropdownMenu>
  )
}

// The list of types (used by the tag and by the composer's picker)
export function NoteTypeMenu({ value, onChange, align = 'end' }: { value?: NoteType | null; onChange: (t: NoteType) => void; align?: 'start' | 'end' }) {
  return (
    <DropdownMenuContent align={align} className="w-44">
      {NOTE_TYPES.map((x) => (
        <DropdownMenuItem key={x.key} onSelect={() => onChange(x.key)} className="text-sm text-gray-900">
          {x.label}
          {x.key === value && <Check size={14} className="ml-auto text-gray-700" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  )
}
