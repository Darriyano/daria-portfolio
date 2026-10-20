import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

// Deliberately no SPA fallback: this checks the files GitHub Pages will serve.
const root = resolve(process.argv[2] ?? 'dist')
const base = process.argv[3] ?? '/'
const port = Number(process.argv[4] ?? 4173)
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' }
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost')
    if (!url.pathname.startsWith(base)) { response.writeHead(404).end(); return }
    const pathname = decodeURIComponent(url.pathname.slice(base.length))
    let file = resolve(root, pathname || '.')
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return }
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: url.pathname + '/' + url.search }).end(); return }
      file = resolve(file, 'index.html')
    }
    const content = await readFile(file)
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(content)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html' }).end(await readFile(resolve(root, '404.html')).catch(() => 'Not found'))
  }
}).listen(port, '127.0.0.1', () => console.log(`Static preview: http://127.0.0.1:${port}${base}`))
