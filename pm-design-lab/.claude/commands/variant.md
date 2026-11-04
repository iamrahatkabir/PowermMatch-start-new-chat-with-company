---
description: Add one more variant to an existing design (e.g. /variant inbox — C but with recent contacts at the top)
argument-hint: <slug> — <what to change>
---
Add a variant to the design: $ARGUMENTS

1. Run `npm run new <slug> +` (this copies the last variant to the next letter).
2. Read only the new file and `meta.js`. If the brief builds on a specific variant, copy that one over the new file instead.
3. Make the change and add the variant's label to `meta.js`.
4. Run `npm run build` once. Reply with what changed and the link `/d/<slug>?v=<letter>`.
