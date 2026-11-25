// npm run dev: generates the design registry, keeps it up to date, and starts Next.js on port 3000 (the Vue lab keeps 5173).
import { spawn } from 'node:child_process'

spawn(process.execPath, ['scripts/registry.mjs', '--watch'], { stdio: 'inherit' })
const next = spawn('npx', ['next', 'dev', '--port', '3000', ...process.argv.slice(2)], { stdio: 'inherit' })
next.on('exit', (code) => process.exit(code ?? 0))
