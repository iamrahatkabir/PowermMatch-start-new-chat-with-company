'use client'
// Test designs — version A: empty canvas in the app shell. Build a quick experiment here; when it's final, move it to
// the design it belongs to and clear this again.
import { PmAppShell } from '@/ds'

export default function VariantA() {
  return (
    <PmAppShell active="overview">
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-500">
        Empty canvas for test designs
      </div>
    </PmAppShell>
  )
}
