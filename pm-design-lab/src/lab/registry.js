// Auto-discovers designs: src/designs/<slug>/meta.js + one <Letter>.vue per variant.
// Adding a design or variant needs no registration anywhere.
const metas = import.meta.glob('../designs/*/meta.js', { eager: true, import: 'default' })
const variants = import.meta.glob('../designs/*/[A-Z].vue')

export const designs = Object.entries(metas)
  .map(([path, meta]) => {
    const slug = path.split('/')[2]
    const keys = Object.keys(variants)
      .filter((p) => p.split('/')[2] === slug)
      .map((p) => p.match(/\/([A-Z])\.vue$/)[1])
      .sort()
    return { slug, ...meta, keys }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

export const getDesign = (slug) => designs.find((d) => d.slug === slug)
export const loadVariant = (slug, key) => variants[`../designs/${slug}/${key}.vue`]?.()
