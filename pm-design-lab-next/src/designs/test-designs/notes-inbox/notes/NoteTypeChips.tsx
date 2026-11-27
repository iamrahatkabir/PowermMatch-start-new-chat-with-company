'use client'
// Version D: the four note types as one-click chips next to Save note. One must be picked before saving.
// Uses shadcn ToggleGroup (single choice), styled with PowerMatch colors. Wraps to a second line when narrow.
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { NOTE_TYPES, type NoteType } from './noteTypes'

type Props = { value: NoteType | null; onChange: (t: NoteType) => void }

export function NoteTypeChips({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      spacing={1}
      aria-label="Note type"
      className="flex-wrap justify-end"
      value={value ?? ''}
      onValueChange={(v) => { const t = NOTE_TYPES.find((x) => x.key === v); if (t) onChange(t.key) }}
    >
      {NOTE_TYPES.map((t) => (
        <ToggleGroupItem
          key={t.key}
          value={t.key}
          className="h-7 rounded-full border-gray-200 bg-white px-3 text-xs font-normal text-gray-700 hover:bg-gray-50 data-[state=on]:border-gray-900 data-[state=on]:bg-white data-[state=on]:font-medium data-[state=on]:text-gray-900"
        >
          {t.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
