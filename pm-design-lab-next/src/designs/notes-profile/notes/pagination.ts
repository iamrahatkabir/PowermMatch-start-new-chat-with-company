// Which page buttons to show: first, last, current ±1, with gaps ("…") in between.
// pageItems(1, 25) → [1, 2, 'gap', 25] · pageItems(12, 25) → [1, 'gap', 11, 12, 13, 'gap', 25]
export type PageItem = number | 'gap'

export function pageItems(current: number, count: number): PageItem[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const pages = new Set([1, count, current - 1, current, current + 1].filter((p) => p >= 1 && p <= count))
  // Near the start or end, show a few more so the row keeps the same length
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (current >= count - 2) [count - 3, count - 2, count - 1].forEach((p) => pages.add(p))
  const sorted = [...pages].sort((a, b) => a - b)
  const out: PageItem[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap')
    out.push(p)
  })
  return out
}

export const pageCountOf = (total: number, pageSize: number) => Math.max(1, Math.ceil(total / pageSize))
