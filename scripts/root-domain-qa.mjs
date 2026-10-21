import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const catalog = JSON.parse(await readFile(new URL('../src/data/projectCatalog.json', import.meta.url)))
const origin = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4177/'
assert.equal(new URL(origin).pathname, '/', 'Use a root-domain static preview, without SPA fallback')

for (const engine of [chromium, webkit]) {
  const browser = await engine.launch(engine === chromium ? { channel: 'chrome' } : {})
  try {
    const page = await browser.newPage({ viewport: { width: 1512, height: 982 }, reducedMotion: 'reduce' })
    const failures = [], errors = [], internalLinks = new Set(), resources = new Set()
    page.on('pageerror', error => errors.push(error.message))
    page.on('requestfailed', request => failures.push(request.url()))
    page.on('response', response => {
      resources.add(response.url())
      if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`)
    })
    const check = async () => {
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => Promise.all([...document.fonts].map(font => font.load())))
      await page.locator('img:visible').evaluateAll(images => Promise.all(images.map(async image => {
        image.loading = 'eager'
        await image.decode()
      })))
      const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.href))
      for (const href of links) {
        const url = new URL(href)
        if (url.origin === new URL(origin).origin) {
          assert(!url.pathname.startsWith('/daria-portfolio/'), href)
          internalLinks.add(url.pathname)
          if (url.hash) assert(await page.locator(`[id="${url.hash.slice(1)}"]`).count(), `Anchor exists: ${href}`)
        }
      }
      assert(await page.evaluate(() => [...document.fonts].every(font => font.status === 'loaded')), 'Fonts loaded')
    }
    assert.equal((await page.goto(origin)).status(), 200)
    await check()
    for (const id of ['main', 'experience', 'design-cases', 'side-quests', 'contacts']) {
      await page.locator(`#${id}`).evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
      await check()
    }
    for (const project of catalog) {
      const path = `${project.category === 'case' ? 'cases' : 'quests'}/${project.slug}/`
      const html = await readFile(new URL(`../dist/${path}index.html`, import.meta.url), 'utf8')
      assert(html.includes(project.title.replaceAll('&', '&amp;')), `${path}: generated title`)
      assert(!html.includes('/daria-portfolio/'), `${path}: root asset URLs`)
      assert.equal((await page.goto(origin + path)).status(), 200, `${path}: direct visit`)
      await page.locator('#project-detail h1').waitFor()
      await check()
      assert((await page.locator('#project-detail h1').textContent()).includes(project.title))
      assert.equal((await page.reload()).status(), 200, `${path}: refresh`)
      await page.locator('#project-detail h1').waitFor()
      await check()
      const redirect = await page.request.get(origin + path.slice(0, -1), { maxRedirects: 0 })
      assert.equal(redirect.status(), 301, `${path}: slashless redirect`)
      await page.getByRole('link', { name: /Back to (Design Cases|Side Quests)/ }).click()
      assert.equal(new URL(page.url()).pathname, '/')
      console.log(`PASS ${engine.name()} ${path}: direct visit, refresh, assets, return link`)
    }
    for (const path of internalLinks) assert.equal((await page.request.get(new URL(path, origin).href)).status(), 200, `Internal link: ${path}`)
    for (const url of resources) assert(!new URL(url).pathname.startsWith('/daria-portfolio/'), `Old resource prefix: ${url}`)
    assert([...resources].some(url => url.endsWith('.css')), 'Styles requested')
    assert([...resources].some(url => url.endsWith('.js')), 'Scripts requested')
    assert([...resources].some(url => /\.ttf$/.test(url)), 'Fonts requested')
    assert.deepEqual(failures, [], 'No failed resource requests')
    assert.deepEqual(errors, [], 'No runtime errors')
    console.log(`PASS ${engine.name()}: root homepage, fonts/styles/scripts/images, ${internalLinks.size} internal URLs, all 11 static project routes`)
  } finally { await browser.close() }
}
