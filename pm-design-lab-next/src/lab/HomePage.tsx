'use client'
import Link from 'next/link'
import { PmCard, PmLogo } from '@/ds'
import { designs } from './registry'

// Gallery: every design with links to its variants.
export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="mb-8 flex items-center gap-3">
        <PmLogo />
        <span className="text-sm font-medium text-gray-500">Design Lab</span>
      </div>
      {!designs.length && <p className="text-sm text-gray-500">No designs yet. Run <code>npm run new &lt;slug&gt;</code>.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {designs.map((d) => (
          <PmCard key={d.slug} padding="p-6" className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{d.title}</h2>
              {d.question && <p className="mt-1 text-sm text-gray-600">{d.question}</p>}
            </div>
            <ul className="flex flex-col gap-2">
              {d.keys.map((k) => (
                <li key={k}>
                  <Link href={`/d/${d.slug}?v=${k}`} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                    <span className="flex size-6 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold">{k}</span>
                    {d.variants?.[k] ?? `Variant ${k}`}
                  </Link>
                </li>
              ))}
            </ul>
          </PmCard>
        ))}
      </div>
    </div>
  )
}
