'use client'
// Pager under the notes list: "Showing 9–16 of 110" on the left, Previous · 1 … 4 5 6 … 25 · Next on the right.
// Hidden when everything fits on one page. Uses shadcn Pagination, PowerMatch colors.
import { cx } from '@/lib/cx'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { pageCountOf, pageItems } from './pagination'

type Props = {
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

const off = 'pointer-events-none opacity-40'

export function NotesPagination({ page, total, pageSize, onPageChange }: Props) {
  const count = pageCountOf(total, pageSize)
  if (count <= 1) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)
  const go = (p: number) => (e: React.MouseEvent) => { e.preventDefault(); if (p >= 1 && p <= count && p !== page) onPageChange(p) }
  return (
    <div className="flex items-center gap-4">
      <span className="shrink-0 whitespace-nowrap text-xs text-gray-500">Showing {from}–{to} of {total}</span>
      <Pagination className="mx-0 ml-auto w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={go(page - 1)} aria-disabled={page === 1} className={cx('text-gray-700', page === 1 && off)} />
          </PaginationItem>
          {pageItems(page, count).map((p, i) => (
            <PaginationItem key={p === 'gap' ? `gap-${i}` : p}>
              {p === 'gap' ? (
                <PaginationEllipsis className="text-gray-500" />
              ) : (
                <PaginationLink href="#" isActive={p === page} onClick={go(p)} className={cx('text-xs tabular-nums', p === page ? 'border-gray-300 font-semibold text-gray-900' : 'text-gray-600')}>
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={go(page + 1)} aria-disabled={page === count} className={cx('text-gray-700', page === count && off)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
