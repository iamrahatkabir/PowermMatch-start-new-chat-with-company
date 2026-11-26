import type { ComponentType } from 'react'

/** A design's meta.ts: gallery title, the question it explores, and a label per version letter. */
export type DesignMeta = {
  title: string
  question: string
  variants: Record<string, string>
  /** Gallery position: lower comes first. Designs without it follow, A–Z by slug. */
  order?: number
}

/** One entry of the generated registry (scripts/registry.mjs). */
export type DesignEntry = {
  slug: string
  meta: DesignMeta
  keys: string[]
  variants: Record<string, ComponentType>
}

/** A design as the lab uses it: meta fields + version letters + their components. */
export type Design = DesignMeta & {
  slug: string
  keys: string[]
  components: Record<string, ComponentType>
}
