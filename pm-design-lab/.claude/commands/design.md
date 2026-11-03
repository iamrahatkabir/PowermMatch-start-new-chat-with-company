---
description: Create a new design with N variants (e.g. /design job-detail 3 — Job detail page; test sticky apply CTA vs inline)
argument-hint: <slug> [count] — <brief>
---
Create a new design in the PowerMatch Design Lab: $ARGUMENTS

1. Run `npm run new <slug> <count>`. Count is 1 unless the user explicitly asked for several versions.
2. Fill in `meta.js`: title, the question being explored, and a short label per variant.
3. If there are several variants, build each as a meaningfully different approach to the same question (layout, hierarchy or interaction — not just color tweaks). Use only the Pm* components, tokens and mock data listed in CLAUDE.md; add missing mock data to `src/mock/index.js`.
4. Run `npm run build` once at the end. Then reply with a one-line summary per variant and the review link `/d/<slug>`.
