'use client'
// Filter bar for profile notes: [Type] [Author] [Date] [× Clear filter] (no chevrons; ticked boxes gray-600), and a chips row under it
// ("Type: Sales × Screening × +1 · Author: … · Date: Last 30 days ×"). Type and Author are multi-select checkbox
// menus (stay open while ticking); Date has quick presets and a custom range calendar.
// Uses shadcn DropdownMenu, Checkbox, Popover and Calendar, PowerMatch colors.
import { useState } from 'react'
import type { DateRange as DayRange } from 'react-day-picker'
import { CalendarDays, Tag, User, X } from 'lucide-react'
import { PmAvatar } from '@/ds'
import { cx } from '@/lib/cx'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { NOTE_TYPES, noteTypeLabel, type NoteType } from '@/designs/notes-inbox/notes/noteTypes'
import { DATE_PRESETS, dateLabel, emptyFilter, fromYmd, isFiltered, presetRange, ymd, type NotesFilter } from './filters'

type Props = {
  value: NotesFilter
  onChange: (f: NotesFilter) => void
  /** People who wrote notes on this profile */
  authors: { name: string; photo?: string }[]
}

const triggerCls = (on: boolean) =>
  cx('flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border bg-white px-3 text-sm outline-none hover:bg-gray-50 focus-visible:shadow-focus data-[state=open]:bg-gray-50',
    on ? 'border-gray-300 font-medium text-gray-900' : 'border-gray-200 text-gray-700')
// ! so the menu row's hover (which recolours every element inside it, the tick svg too) doesn't change a ticked box
const checkCls = 'pointer-events-none data-checked:border-gray-600! data-checked:bg-gray-600! data-checked:text-white! [&_svg]:text-white!'

export function NotesFilters({ value: f, onChange, authors }: Props) {
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Type */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={triggerCls(f.types.length > 0)}><Tag size={15} className="text-gray-500" />Type</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            {NOTE_TYPES.map((t) => (
              <DropdownMenuItem key={t.key} className="gap-2.5 py-2 text-sm text-gray-900" onSelect={(e) => { e.preventDefault(); onChange({ ...f, types: toggle(f.types, t.key) }) }}>
                <Checkbox checked={f.types.includes(t.key)} className={checkCls} tabIndex={-1} />{t.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Author */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={triggerCls(f.authors.length > 0)}><User size={15} className="text-gray-500" />Author</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 w-64">
            {authors.length === 0 && <p className="px-2 py-2 text-sm text-gray-500">No authors</p>}
            {authors.map((a) => (
              <DropdownMenuItem key={a.name} className="gap-2.5 py-2 text-sm text-gray-900" onSelect={(e) => { e.preventDefault(); onChange({ ...f, authors: toggle(f.authors, a.name) }) }}>
                <Checkbox checked={f.authors.includes(a.name)} className={checkCls} tabIndex={-1} />
                <span className="shrink-0"><PmAvatar name={a.name} src={a.photo} size={20} /></span>
                <span className="min-w-0 truncate">{a.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date */}
        <DateFilter value={f.date} onChange={(date) => onChange({ ...f, date })} />

        {isFiltered(f) && (
          <button type="button" className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onChange(emptyFilter)}>
            <X size={15} />Clear filter
          </button>
        )}
      </div>

      {/* Chips: what's filtered, each removable */}
      {isFiltered(f) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {f.types.length > 0 && (
            <ChipGroup label="Type" items={f.types.map((t) => ({ key: t, label: noteTypeLabel(t) }))} onRemove={(k) => onChange({ ...f, types: f.types.filter((t) => t !== (k as NoteType)) })} />
          )}
          {f.authors.length > 0 && (
            <ChipGroup label="Author" items={f.authors.map((a) => ({ key: a, label: a }))} onRemove={(k) => onChange({ ...f, authors: f.authors.filter((a) => a !== k) })} />
          )}
          {f.date && <ChipGroup label="Date" items={[{ key: 'date', label: dateLabel(f.date) }]} onRemove={() => onChange({ ...f, date: null })} />}
        </div>
      )}
    </div>
  )
}

// "Type: Sales × Screening × +1" — first 2 chips; hovering "+N" shows the rest in a small card, each removable
function ChipGroup({ label, items, onRemove }: { label: string; items: { key: string; label: string }[]; onRemove: (key: string) => void }) {
  const shown = items.slice(0, 2)
  const rest = items.slice(2)
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-xs">
      <span className="shrink-0 text-gray-500">{label}:</span>
      {shown.map((c) => <Chip key={c.key} label={c.label} onRemove={() => onRemove(c.key)} />)}
      {rest.length > 0 && (
        <HoverCard openDelay={100} closeDelay={150}>
          <HoverCardTrigger asChild>
            <button type="button" className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-gray-700 hover:bg-gray-200">+{rest.length}</button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="flex w-auto max-w-[320px] flex-wrap gap-1.5 p-2 text-xs">
            {rest.map((c) => <Chip key={c.key} label={c.label} onRemove={() => onRemove(c.key)} />)}
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex min-w-0 max-w-[180px] items-center gap-1 rounded-md bg-gray-100 py-0.5 pl-2 pr-1 text-gray-700">
      <span className="truncate">{label}</span>
      <button type="button" className="flex size-4 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700" title={`Remove ${label}`} onClick={onRemove}><X size={12} /></button>
    </span>
  )
}

// Date: quick presets on the left, a two-month range calendar on the right
function DateFilter({ value, onChange }: { value: NotesFilter['date']; onChange: (d: NotesFilter['date']) => void }) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DayRange | undefined>()
  const selected: DayRange | undefined = range ?? (value ? { from: fromYmd(value.from), to: fromYmd(value.to) } : undefined)
  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setRange(undefined) }}>
      <PopoverTrigger asChild>
        <button type="button" className={triggerCls(!!value)}>
          <CalendarDays size={15} className="text-gray-500" />
          <span className="max-w-[200px] truncate">{value ? dateLabel(value) : 'Date'}</span>
          
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-auto flex-row gap-0 p-0">
        <div className="flex w-40 shrink-0 flex-col gap-0.5 border-r border-gray-200 p-2">
          {DATE_PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              className={cx('rounded-md px-2 py-1.5 text-left text-sm', value?.preset === p.key ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700 hover:bg-gray-50')}
              onClick={() => { onChange(presetRange(p.key)); setOpen(false) }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          <Calendar
            mode="range"
            numberOfMonths={2}
            weekStartsOn={1}
            defaultMonth={selected?.from ?? new Date(new Date().getFullYear(), new Date().getMonth() - 1)}
            selected={selected}
            onSelect={setRange}
            disabled={{ after: new Date() }}
            // Start and end days stay as they are (yellow); the days in between get a gray-100 band
            classNames={{
              range_start: 'relative isolate z-0 rounded-l-(--cell-radius) bg-gray-100 after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-gray-100',
              range_middle: 'rounded-none [&_button]:bg-gray-100!',
              range_end: 'relative isolate z-0 rounded-r-(--cell-radius) bg-gray-100 after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-gray-100',
            }}
          />
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-3 py-2">
            <button type="button" className="h-8 rounded-lg px-3 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setOpen(false); setRange(undefined) }}>Cancel</button>
            <button
              type="button"
              disabled={!range?.from}
              className="h-8 rounded-lg bg-brand px-3 text-sm font-medium text-gray-900 hover:bg-brand-dark disabled:bg-gray-100 disabled:text-gray-400"
              onClick={() => { if (range?.from) { onChange({ from: ymd(range.from), to: ymd(range.to ?? range.from) }); setOpen(false); setRange(undefined) } }}
            >
              Apply
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
