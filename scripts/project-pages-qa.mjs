import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const catalog = JSON.parse(await readFile(new URL('../src/data/projectCatalog.json', import.meta.url)))
const origin = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4173/'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1512, height: 982 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
const path = project => `${project.category === 'case' ? 'cases' : 'quests'}/${project.slug}/`
const ready = async () => {
  await page.evaluate(() => document.fonts.ready)
  await page.locator('img:visible').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode().catch(() => {}) })))
}
const images = async () => {
  const broken = await page.locator('img:visible').evaluateAll(images => images.filter(image => !image.naturalWidth).map(image => image.src))
  assert.deepEqual(broken, [], 'Visible assets load')
}
const highlight = async label => {
  await page.waitForFunction(label => document.querySelector('nav[aria-label="Main navigation"] [aria-current]')?.textContent === label, label)
  assert.equal(await page.locator('nav[aria-label="Main navigation"] [aria-current]').textContent(), label)
}
try {
  await page.goto(origin + '#design-cases'); await ready()
  assert.equal(await page.locator('#design-cases .project-preview-card').count(), 6)
  assert.equal(await page.locator('#side-quests .project-preview-card').count(), 5)
  assert.deepEqual(await page.locator('#design-cases .project-preview-card').evaluateAll(cards => cards.map(card => card.id)), ['allforms','bachelor-thesis','minigarden','matematch','vk-hackathon','vita'].map(id => 'project-' + id))
  await highlight('DESIGN CASES')
  const token = await page.evaluate(() => window.__qaPageToken = Math.random())
  await page.locator('#project-allforms').focus()
  const galleryY = await page.evaluate(() => scrollY)
  await page.locator('#project-allforms').press('Enter'); await page.locator('#project-detail h1').waitFor()
  assert.equal(await page.evaluate(() => window.__qaPageToken), token, 'Internal links retain the document')
  assert.equal(new URL(page.url()).pathname, new URL(origin + 'cases/allforms/').pathname)
  await highlight('DESIGN CASES')
  await page.goBack(); await page.locator('#design-cases').waitFor()
  assert(Math.abs(await page.evaluate(() => scrollY) - galleryY) < 3, 'Browser Back restores scroll')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'project-allforms', 'Browser Back restores card focus')
  await page.goForward(); await page.locator('#project-detail h1').waitFor()
  await page.getByRole('link', { name: 'Back to Design Cases' }).click()
  assert(Math.abs(await page.evaluate(() => scrollY) - galleryY) < 3, 'Return link restores gallery position')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'project-allforms')
  for (const project of catalog) {
    const response = await page.goto(origin + path(project))
    assert.equal(response.status(), 200, `${path(project)} is a real static entry`)
    const slashless = await page.request.get(origin + path(project).replace(/\/$/, ''), { maxRedirects: 0 })
    assert.equal(slashless.status(), 301, 'Static host normalizes directory routes')
    await page.locator('#project-detail h1').waitFor(); await ready(); await images()
    await highlight(project.category === 'case' ? 'DESIGN CASES' : 'SIDE QUESTS')
    assert.equal(await page.locator('.project-chapter-navigation').count(), 0, 'Single-chapter navigation is hidden')
    assert((await page.locator('#project-detail h1').textContent()).includes(project.title))
    const refreshed = await page.reload(); assert.equal(refreshed.status(), 200); await page.locator('#project-detail h1').waitFor()
    for (const link of project.externalLinks) assert.equal(await page.locator('#project-detail a[target="_blank"]').getAttribute('href'), link.url)
    await page.getByRole('link', { name: /Back to (Design Cases|Side Quests)/ }).click()
    assert.equal(new URL(page.url()).hash, project.category === 'case' ? '#design-cases' : '#side-quests')
    if (project.id === 'bachelor-thesis') { await page.goto(origin + path(project)); await page.locator('.project-status').waitFor(); assert.match(await page.locator('#project-detail').textContent(), /publication is planned/) }
  }
  for (const [width,height] of [[320,740],[390,844],[600,900],[768,1024],[1024,1366],[1180,820],[1440,900],[1512,982],[844,390],[1280,600]]) {
    await page.setViewportSize({ width,height })
    for (const section of ['design-cases','side-quests']) {
      await page.goto(origin + '#' + section); await ready(); await images()
      const columns = await page.locator(`#${section} .project-gallery-grid`).evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)
      assert.equal(columns, width <= 600 ? 1 : width < 1200 ? 2 : 3)
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}×${height}: gallery overflow`)
    }
    for (const project of catalog) {
      await page.goto(origin + path(project)); await page.locator('#project-detail h1').waitFor(); await ready(); await images()
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}×${height}: ${project.id} overflow`)
      const hiddenControls = await page.locator('#project-detail a, #project-detail button').evaluateAll(elements => elements.filter(el => { const r = el.getBoundingClientRect(); return r.x < 0 || r.right > innerWidth + 1 }).map(el => el.textContent))
      assert.deepEqual(hiddenControls, [], `${width}×${height}: ${project.id} clipped controls`)
    }
    console.log(`PASS ${width}×${height}: both galleries and 11 detail layouts`)
  }
  await page.setViewportSize({width:390,height:844}); await page.goto(origin)
  await page.getByRole('button', {name:'Open navigation'}).click(); await page.getByRole('button', {name:'SIDE QUESTS',exact:true}).click(); await highlight('SIDE QUESTS')
  await page.getByRole('button', {name:'Open navigation'}).click(); await page.keyboard.press('Escape'); assert.equal(await page.locator('nav.is-open').count(),0)
  await page.setViewportSize({width:1512,height:982}); await page.goto(origin+'#experience'); await highlight('EXPERIENCE')
  await page.getByRole('button', {name:/Read INDUSTRIAL EXPERIENCE/}).hover(); await page.locator('#experience-note').waitFor({state:'visible'}); await page.keyboard.press('Escape'); await page.locator('#experience-note').waitFor({state:'hidden'})
  await page.goto(origin+'#contacts'); assert(await page.locator('#contacts .contact-card').count()===3)
  const missing = await page.goto(origin+'cases/not-a-project/'); assert.equal(missing.status(),404); await page.getByRole('heading',{name:'Project not found'}).waitFor()
  assert.deepEqual(errors, [])
  console.log('PASS: static direct loads, refresh, client navigation, history, focus, return links, external destinations, existing navigation/notes/contacts; no browser errors')
} finally { await browser.close() }
