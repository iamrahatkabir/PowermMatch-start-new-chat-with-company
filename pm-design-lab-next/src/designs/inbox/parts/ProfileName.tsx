'use client'
import { ArrowUpRight } from 'lucide-react'

// The name at the top of the context bar. With href: hovering underlines it and shows ↗; click opens the profile.
export function ProfileName({ name, href }: { name: string; href?: string }) {
  if (!href) return <div className="text-base font-semibold text-gray-900">{name}</div>
  return (
    <a href={href} title={`Open ${name}'s profile`} className="group flex max-w-full items-center gap-1 text-base font-semibold text-gray-900 hover:underline hover:underline-offset-4">
      <span className="min-w-0 break-words">{name}</span>
      <ArrowUpRight size={16} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
    </a>
  )
}
