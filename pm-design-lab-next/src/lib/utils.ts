// shadcn/ui helper: joins classes and lets later Tailwind classes win (cn('px-2', 'px-4') → 'px-4').
// shadcn components import it from the "cn" package directly; elsewhere keep using cx() from '@/lib/cx'.
export { cn } from 'cn'
