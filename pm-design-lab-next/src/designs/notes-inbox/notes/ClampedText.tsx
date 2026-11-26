'use client'
// Note text cut to a few lines (default 2) ending in "… See more"; the last line is filled up to the link (cut mid-word if needed);
// open, "See less" follows the text. The link only shows when the text is longer than the limit.
// How: a hidden copy with the same width and classes is filled with shorter and shorter text
// (binary search) until "text… See more" fits in the line limit; the visible text is cut there.
import { useLayoutEffect, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { MentionText, mentionClass } from './MentionText'
import { splitMentions } from './mentions'

type Props = {
  text: string
  /** Names written as "@Name" in the text, shown as chips */
  mentions?: string[]
  /** Lines shown while folded */
  lines?: number
  className?: string
}

const link = 'whitespace-nowrap text-[13px] font-medium text-info-500 hover:text-info-700'
// Text up to n characters, without trailing spaces or punctuation (so it never reads "tools.…")
const cutAt = (text: string, n: number) => text.slice(0, n).replace(/[\s.,;:!?–-]+$/, '')

export function ClampedText({ text, mentions = [], lines = 2, className }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const measure = useRef<HTMLParagraphElement>(null)
  const [open, setOpen] = useState(false)
  const [cut, setCut] = useState<number | null>(null) // null = the whole text fits
  const [width, setWidth] = useState(0)
  const mentionKey = mentions.join('|') // stable dependency (a new [] each render would re-measure every time)

  // Re-measure when the column width changes
  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    const box = measure.current
    if (!box || open) return
    const max = parseFloat(getComputedStyle(box).lineHeight) * lines + 1
    const fill = (n: number | null) => {
      box.replaceChildren()
      for (const part of splitMentions(n === null ? text : cutAt(text, n), mentions)) {
        const span = document.createElement('span')
        if (part.mention) span.className = mentionClass
        span.textContent = part.text
        box.append(span)
      }
      if (n !== null) {
        box.append('… ')
        const more = document.createElement('span')
        more.className = link
        more.textContent = 'See more'
        box.append(more)
      }
      return box.offsetHeight <= max
    }
    if (fill(null)) { setCut(null); return }
    let lo = 0
    let hi = text.length
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2)
      if (fill(mid)) lo = mid
      else hi = mid - 1
    }
    // Cut mid-word if needed so line 2 is filled up to "See more"
    setCut(lo)
  }, [text, mentionKey, lines, open, width]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrap} className="relative">
      <p className={className}>
        {open || cut === null ? <MentionText text={text} mentions={mentions} /> : <MentionText text={cutAt(text, cut)} mentions={mentions} />}
        {cut !== null && !open && <>… <button type="button" className={link} onClick={() => setOpen(true)}>See more</button></>}
        {open && cut !== null && <> <button type="button" className={link} onClick={() => setOpen(false)}>See less</button></>}
      </p>
      {/* Hidden copy used only for measuring */}
      <p ref={measure} aria-hidden className={cx(className, 'pointer-events-none invisible absolute inset-x-0 top-0')} />
    </div>
  )
}
