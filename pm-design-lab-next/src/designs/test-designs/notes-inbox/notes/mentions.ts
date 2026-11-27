// Plain logic for @mentions in notes (no React).

export type TextPart = { text: string; mention: boolean }

/** Split note text into plain parts and mention parts. "@Name" becomes a mention part "Name". */
export function splitMentions(text: string, names: string[]): TextPart[] {
  if (!names.length) return [{ text, mention: false }]
  const escaped = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`@(${escaped.join('|')})`, 'g')
  const parts: TextPart[] = []
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), mention: false })
    parts.push({ text: m[1], mention: true })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last), mention: false })
  return parts
}

/** The "@word" being typed right before the cursor, or null. */
export function mentionQuery(text: string, cursor: number): { start: number; query: string } | null {
  const m = /(^|\s)@([^\s@]*)$/.exec(text.slice(0, cursor))
  return m ? { start: cursor - m[2].length - 1, query: m[2] } : null
}

/** Text without its @mentions (for quotes): '@Rahat Kabir Ifty I talked…' → 'I talked…'. */
export function withoutMentions(text: string, names: string[] = []): string {
  return names.reduce((t, n) => t.split(`@${n}`).join(''), text).replace(/\s+/g, ' ').trim()
}

/** Names from `names` that appear as "@Name" in the text. */
export function mentionsIn(text: string, names: string[]): string[] {
  return names.filter((n) => text.includes(`@${n}`))
}

/** Position (px, relative to the textarea's parent) of the character at `index`, using a hidden mirror element. */
export function caretPosition(el: HTMLTextAreaElement, index: number): { left: number; top: number } {
  const style = getComputedStyle(el)
  const mirror = document.createElement('div')
  for (const prop of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderLeftWidth', 'boxSizing'] as const) {
    mirror.style[prop] = style[prop]
  }
  Object.assign(mirror.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word', width: `${el.offsetWidth}px` })
  mirror.textContent = el.value.slice(0, index)
  const marker = document.createElement('span')
  marker.textContent = '@'
  mirror.appendChild(marker)
  el.parentElement?.appendChild(mirror)
  const left = el.offsetLeft + marker.offsetLeft
  const top = el.offsetTop + marker.offsetTop - el.scrollTop
  mirror.remove()
  return { left, top }
}

/** Note/reply time label: '26 Nov 14:32' (the replies row shows only the HH:MM part). */
export function noteTime(d: Date = new Date()): string {
  const month = d.toLocaleString('en-GB', { month: 'short' })
  const hm = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${d.getDate()} ${month} ${hm}`
}
