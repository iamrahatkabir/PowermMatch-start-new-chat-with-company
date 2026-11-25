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

/** Names from `names` that appear as "@Name" in the text. */
export function mentionsIn(text: string, names: string[]): string[] {
  return names.filter((n) => text.includes(`@${n}`))
}
