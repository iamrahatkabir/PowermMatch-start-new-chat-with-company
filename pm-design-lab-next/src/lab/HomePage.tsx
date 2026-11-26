'use client'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PmLogo } from '@/ds'
import { designs } from './registry'

// Gallery: one row per design (name only); click opens its first version.
export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="mb-8 flex items-center gap-3">
        <PmLogo />
        <span className="text-sm font-medium text-gray-500">Design Lab</span>
      </div>
      {!designs.length && <p className="text-sm text-gray-500">No designs yet. Run <code>npm run new &lt;slug&gt;</code>.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {designs.map((d) => (
          // Just the name; the versions are in the toolbar once the design is open (starts on the first one)
          <Link key={d.slug} href={`/d/${d.slug}?v=${d.keys[0] ?? 'A'}`} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 hover:bg-gray-50">
            <span className="min-w-0 flex-1 truncate text-base font-semibold text-gray-900">{d.title}</span>
            <ChevronRight size={18} className="shrink-0 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  )
}
