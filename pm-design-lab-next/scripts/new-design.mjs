// npm run new <slug> [count]   → new design with variants A..(count, default 1)
// npm run new <slug> +         → add the next variant to an existing design (copies the last one)
import { existsSync, mkdirSync, readdirSync, copyFileSync, writeFileSync } from 'node:fs'
import { generate } from './registry.mjs'

const [slug, arg = '1'] = process.argv.slice(2)
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run new <kebab-slug> [count | +]')
  process.exit(1)
}
const dir = `src/designs/${slug}`
const letters = 'ABCDEFGHIJ'

if (arg === '+') {
  if (!existsSync(dir)) throw new Error(`${dir} does not exist`)
  const have = readdirSync(dir).filter((f) => /^[A-Z]\.tsx$/.test(f)).sort()
  const next = letters[have.length]
  copyFileSync(`${dir}/${have.at(-1)}`, `${dir}/${next}.tsx`)
  generate()
  console.log(`Created ${dir}/${next}.tsx (copy of ${have.at(-1)}) — add it to meta.js variants`)
  process.exit(0)
}

if (existsSync(dir)) throw new Error(`${dir} already exists — use "npm run new ${slug} +" to add a variant`)
mkdirSync(dir, { recursive: true })
const keys = letters.slice(0, Number(arg)).split('')
const title = slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())

writeFileSync(`${dir}/meta.ts`, `import type { DesignMeta } from '@/lab/types'

const meta: DesignMeta = {
  title: '${title}',
  question: '',
  variants: {
${keys.map((k) => `    ${k}: '',`).join('\n')}
  },
}

export default meta
`)
for (const k of keys) {
  writeFileSync(`${dir}/${k}.tsx`, `import { PmAppShell, PmCard } from '@/ds'

export default function Variant${k}() {
  return (
    <PmAppShell title="${title}" active="overview">
      <PmCard>Variant ${k}</PmCard>
    </PmAppShell>
  )
}
`)
}
generate()
console.log(`Created ${dir} with variants ${keys.join(', ')}`)
