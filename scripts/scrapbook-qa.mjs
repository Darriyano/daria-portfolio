import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const catalog = JSON.parse(await readFile(new URL('../src/data/projectCatalog.json', import.meta.url)))
const origin = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:5173/'
const output = process.env.QA_OUTPUT ?? '/tmp/scrapbook-qa'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
const ready = async () => {
  await page.evaluate(() => document.fonts.ready)
  await page.locator('img:visible').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode().catch(() => {}) })))
  await page.waitForTimeout(120)
  assert.deepEqual(await page.locator('img:visible').evaluateAll(images => images.filter(image => !image.naturalWidth).map(image => image.src)), [], 'All assets load')
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal page overflow')
}
try {
  for (const [width, height] of [[320,740],[390,844],[768,1024],[1024,1366],[1512,982]]) {
    await page.setViewportSize({ width, height })
    await page.goto(origin); await ready()
    for (const section of ['main','experience','design-cases','side-quests','contacts']) {
      await page.evaluate(id => document.getElementById(id).scrollIntoView({ behavior: 'instant' }), section)
      await ready()
      if (['design-cases','side-quests'].includes(section)) {
        const cards = page.locator(`#${section} .project-preview-card`)
        const projects = catalog.filter(project => project.category === (section === 'design-cases' ? 'case' : 'quest'))
        assert.equal(await cards.count(), projects.length)
        for (const project of projects) {
          const card = page.locator(`#project-${project.id}`)
          assert.equal(await card.locator('h3').textContent(), `${project.title} ↗`)
          assert.equal(await card.locator('.preview-tags').count(), 0)
          assert.match(await card.locator('.preview-image').getAttribute('src'), /scrapbook\/.+-thumbnail\.webp$/)
        }
      }
      if ([390,768,1512].includes(width)) await page.locator(`#${section}`).screenshot({path:`${output}/${width}-${section}.png`})
    }
    for (const project of catalog) {
      await page.goto(origin + `${project.category === 'case' ? 'cases' : 'quests'}/${project.slug}/`)
      await page.locator('#project-detail h1').waitFor(); await ready()
      assert.equal(await page.locator('.site-header').count(), 0, 'Project pages omit global navigation')
      assert.equal(await page.locator('#project-detail h1').textContent(), project.detailTitle)
      const intro = await page.locator('#project-detail').evaluate(detail => {
        const bounds = selector => {
          const rect = detail.querySelector(selector).getBoundingClientRect()
          return { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
        }
        return { back: bounds('.back-to-gallery'), title: bounds('h1'), text: bounds('h1 > span'), copy: bounds('.project-copy') }
      })
      assert.equal(intro.back.top, width <= 600 ? 24 : 40, 'No obsolete header offset')
      assert(intro.title.width <= 587 && intro.title.height < 270, 'Title stays compact in its column')
      assert(intro.text.top >= intro.title.top && intro.text.bottom <= intro.title.bottom, 'Title text fits the paper')
      assert(intro.copy.top - intro.title.bottom < 40, 'Description follows title without wasted space')
      const clipped = await page.locator('#project-detail a, #project-detail button').evaluateAll(elements => elements.filter(el => {const r=el.getBoundingClientRect();return r.left<0 || r.right>innerWidth+1}).map(el=>el.textContent))
      assert.deepEqual(clipped, [], 'Project actions fit the viewport')
      assert.equal(await page.locator('.photo-a').count(), 1)
      if ([390,1512].includes(width) && ['allforms','matematch','vita','novel'].includes(project.id)) await page.screenshot({ path:`${output}/${width}-${project.id}.png`, fullPage:true })
    }
    console.log(`PASS ${width}×${height}: five sections, ten routes, gallery copy/tags, all images, no overflow or clipped actions`)
  }
  await page.setViewportSize({width:390,height:844}); await page.goto(origin); await ready()
  await page.getByRole('button',{name:'Open navigation'}).click()
  await page.getByRole('button',{name:'SIDE QUESTS',exact:true}).click()
  await page.waitForFunction(()=>document.querySelector('nav [aria-current]')?.textContent==='SIDE QUESTS')
  assert.equal(await page.locator('nav.is-open').count(),0)
  await page.getByRole('button',{name:'Open navigation'}).click();await page.keyboard.press('Escape')
  assert.equal(await page.locator('nav.is-open').count(),0)
  await page.setViewportSize({width:1512,height:982});await page.goto(origin+'#experience');await ready()
  await page.locator('.site-header.is-floating').waitFor()
  const headerStyle = await page.locator('.site-header').evaluate(header => {
    const style = getComputedStyle(header)
    return { background: style.backgroundColor, blur: style.backdropFilter, zIndex: Number(style.zIndex) }
  })
  assert.notEqual(headerStyle.background, 'rgba(0, 0, 0, 0)', 'Floating navigation has a visible background')
  assert.match(headerStyle.blur, /blur\(/, 'Floating navigation blurs the backdrop')
  const constellationLayers = await page.locator('.constellation [class]').evaluateAll(elements => elements.map(element => Number(getComputedStyle(element).zIndex)).filter(Number.isFinite))
  assert(constellationLayers.every(layer => layer < headerStyle.zIndex), 'Constellation layers stay below navigation')
  const marker=page.locator('.milestone-marker[aria-label^="Read INDUSTRIAL EXPERIENCE"]')
  await marker.click();await page.locator('#experience-note').waitFor({state:'visible'})
  await page.keyboard.press('Escape');await page.locator('#experience-note').waitFor({state:'hidden'})
  await marker.click();await page.locator('#experience-note').waitFor({state:'visible'})
  await page.mouse.click(10,150);await page.locator('#experience-note').waitFor({state:'hidden'})
  await page.goto(origin+'#design-cases');await ready()
  const card=page.locator('#project-allforms');await card.focus();const y=await page.evaluate(()=>scrollY)
  await card.press('Enter');await page.locator('#project-detail h1').waitFor()
  await page.getByRole('link',{name:'Back to Design Cases'}).click();await ready()
  assert(Math.abs(await page.evaluate(()=>scrollY)-y)<3)
  assert.equal(await page.evaluate(()=>document.activeElement.id),'project-allforms')
  assert.deepEqual(errors,[])
  await page.goto(origin + 'cases/bachelor-thesis/')
  await page.getByRole('heading', { name: 'Project not found' }).waitFor()
  console.log('PASS mobile navigation, Experience click/Escape/outside, return scroll/focus, no runtime errors')
} finally { await browser.close() }
