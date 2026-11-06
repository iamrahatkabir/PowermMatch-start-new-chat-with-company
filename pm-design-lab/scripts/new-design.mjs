// npm run new <slug> [count]   → new design with variants A..(count, default 1)
// npm run new <slug> +         → add the next variant to an existing design (copies the last one)
import { existsSync, mkdirSync, readdirSync, copyFileSync, writeFileSync } from 'node:fs'

const [slug, arg = '1'] = process.argv.slice(2)
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run new <kebab-slug> [count | +]')
  process.exit(1)
}
const dir = `src/designs/${slug}`
const letters = 'ABCDEFGHIJ'

if (arg === '+') {
  if (!existsSync(dir)) throw new Error(`${dir} does not exist`)
  const have = readdirSync(dir).filter((f) => /^[A-Z]\.vue$/.test(f)).sort()
  const next = letters[have.length]
  copyFileSync(`${dir}/${have.at(-1)}`, `${dir}/${next}.vue`)
  console.log(`Created ${dir}/${next}.vue (copy of ${have.at(-1)}) — add it to meta.js variants`)
  process.exit(0)
}

if (existsSync(dir)) throw new Error(`${dir} already exists — use "npm run new ${slug} +" to add a variant`)
mkdirSync(dir, { recursive: true })
const keys = letters.slice(0, Number(arg)).split('')
const title = slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())

writeFileSync(`${dir}/meta.js`, `export default {
  title: '${title}',
  question: '',
  variants: {
${keys.map((k) => `    ${k}: '',`).join('\n')}
  },
}
`)
for (const k of keys) {
  writeFileSync(`${dir}/${k}.vue`, `<template>
  <PmAppShell title="${title}" active="overview">
    <PmCard>Variant ${k}</PmCard>
  </PmAppShell>
</template>
`)
}
console.log(`Created ${dir} with variants ${keys.join(', ')}`)
