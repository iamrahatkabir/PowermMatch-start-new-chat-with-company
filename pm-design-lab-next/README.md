# PowerMatch Design Lab

A place to design PowerMatch screens in several versions and compare them. Frontend only, sample data, no backend.

## Run it
```bash
npm install
npm run dev
```
Open http://localhost:3000. If port 3000 is busy, use `PORT=3001 npm run dev`.

## Use it
- `/` lists every design and its versions.
- `/d/<design>?v=A` opens one version. Toolbar at the bottom: click a letter, or press 1–9 / ← →. Press **H** to hide it; drag its grip to move it.

## Designs
| Design | Link | Versions |
|---|---|---|
| Admin Settings | `/d/settings` | A |
| Dialer 2.0 | `/d/dialer-2` | A |
| Emails | `/d/emails` | A–G |
| Inbox | `/d/inbox` | A–D |
| Notes in inbox | `/d/notes-inbox` | A (placeholder) |
| Notes in profile | `/d/notes-profile` | A (placeholder) |

Each design folder (`src/designs/<design>/`) has its own `README.md`: which file is which version, props and behaviour.

## Add a design
```bash
npm run new my-design
```
Then edit `src/designs/my-design/A.jsx` and `meta.js`. `npm run new my-design +` adds the next version.

## Stack
Next.js 16, React 19, Tailwind CSS v4, Lucide icons. Plain JavaScript.

## Docs
- `CLAUDE.md`: rules and structure for Claude (reply style, tokens, components).
- `CHANGELOG.md`: every change, newest first.
