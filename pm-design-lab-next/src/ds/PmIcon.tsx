// Product icons live in /public/brand/icons (see CLAUDE.md for the list).
export function PmIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  return <img src={`/brand/icons/${name}.svg`} width={size} height={size} alt="" className={['shrink-0', className].filter(Boolean).join(' ')} />
}
