import assert from 'node:assert/strict'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
const failures = []
const check = (condition, message) => { if (!condition) failures.push(message) }
const jump = async id => { await page.evaluate(id => document.getElementById(id).scrollIntoView({ behavior: 'instant' }), id); await page.waitForTimeout(100) }
try {
  for (const [width, height] of [[320,844],[390,844],[768,1024],[1024,768],[1280,720],[1440,900],[1512,982],[1920,1080],[1280,600],[1440,540],[1920,480]]) {
    await page.setViewportSize({ width, height })
    await page.goto('http://127.0.0.1:5173/'); await page.evaluate(() => document.fonts.ready)
    await jump('experience')
    for (const marker of await page.locator('.milestone-marker').all()) {
      await marker.click({ force: true }); await page.waitForTimeout(30)
      const card = await page.locator('#experience-note').boundingBox()
      check(card && card.x >= 16 && card.y >= 16 && card.x + card.width <= width - 16 && card.y + card.height <= height - 16, `${width}×${height}: floating note leaves viewport`)
      await page.keyboard.press('Escape')
    }
    if (width >= 1024) {
      await jump('experience')
      const section = await page.locator('#experience').boundingBox()
      const rectangles = await page.locator('.milestone-marker,.milestone-label,.experience-annotation').evaluateAll(nodes => nodes.map(node => ({ text: node.textContent || node.getAttribute('aria-label'), rect: node.getBoundingClientRect().toJSON() })))
      for (const { text, rect } of rectangles) check(rect.top >= 90 && rect.bottom <= (height >= 600 ? height : section.height) - 10 && rect.left >= 8 && rect.right <= width - 8, `${width}×${height}: constellation clips ${text}`)
      if (height >= 600) check(section.height <= height + 2, `${width}×${height}: experience exceeds section viewport (${section.height})`)
    }
    await jump('design-cases')
    for (let index = 0; index < 5; index++) {
      const controls = await page.locator('#design-cases .carousel-controls').boundingBox()
      const copy = await page.locator('#design-cases .project-copy').boundingBox()
      const projectSection = await page.locator('#design-cases').boundingBox()
      check(controls.y >= projectSection.y && controls.y + controls.height <= projectSection.y + projectSection.height - 12, `${width}×${height}: design controls clipped on state ${index}`)
      if (width >= 1024) {
        check(copy.y + copy.height <= controls.y + 2, `${width}×${height}: copy overlaps controls on state ${index}`)
        const section = await page.locator('#design-cases').boundingBox()
        if (height >= 600) check(section.height <= height + 2, `${width}×${height}: project section exceeds viewport (${section.height})`)
        if (index === 0 || index === 2) {
          const media = await page.locator('#design-cases .laptop-composite').boundingBox()
          // Short windows scroll naturally, and the right-side laptop can share
          // vertical space with left-side controls without obscuring them.
          const overlaps = media.x < controls.x + controls.width && media.x + media.width > controls.x && media.y < controls.y + controls.height && media.y + media.height > controls.y
          check(media.y >= section.y + 90 && !overlaps, `${width}×${height}: oversized laptop obscures heading or controls`)
        }
      }
      if (index < 4) await page.locator('#design-cases').getByRole('button',{name:'Next project'}).click()
      await page.locator('#design-cases .project-media img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
    }
    await jump('side-quests')
    for (let index = 0; index < 2; index++) {
      const controls = await page.locator('#side-quests .carousel-controls').boundingBox()
      const section = await page.locator('#side-quests').boundingBox()
      check(controls.y + controls.height <= section.y + section.height - 12, `${width}×${height}: side quest controls clipped`)
      check(await page.locator('#side-quests .paper-action-background').count() === 1, `${width}×${height}: missing paper action`)
      check(await page.locator('#side-quests .paper-action-circle').count() === 1, `${width}×${height}: missing drawn circle`)
      const action = page.locator('#side-quests .paper-action')
      const expectedLink = index === 0 ? 'https://piterjs.org/#!meetup=qw0wg0_et0kmq/speech=1ez9nz_4omv0y' : 'https://piterjs.org/#!meetup=v8gjsg_jet70w/speech=3vfijv_osr98s'
      check(await action.getAttribute('href') === expectedLink && await action.getAttribute('rel') === 'noopener noreferrer', `${width}×${height}: verified announcement link missing`)
      if (index === 0) await page.locator('#side-quests').getByRole('button',{name:'Next project'}).click()
    }
    await jump('contacts')
    const heading = await page.locator('#contacts h2 img').boundingBox()
    check(heading.x >= 0 && heading.x + heading.width <= width, `${width}×${height}: contact heading overflow`)
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}×${height}: page overflow`)
    console.log(`Checked ${width}×${height}`)
  }
  await page.setViewportSize({width:1280,height:720}); await page.goto('http://127.0.0.1:5173/'); await jump('experience')
  await page.getByRole('button',{name:/Read INDUSTRIAL EXPERIENCE/}).click({force:true})
  await page.setViewportSize({width:1024,height:600}); await page.waitForTimeout(100)
  const resized = await page.locator('#experience-note').boundingBox()
  check(resized && resized.x >= 16 && resized.y >= 16 && resized.x + resized.width <= 1008 && resized.y + resized.height <= 584, 'Note repositioning fails after resize')
  check(errors.length === 0, `Runtime errors: ${errors.join(', ')}`)
  if (failures.length) console.log(failures.join('\n'))
  assert.deepEqual(failures, [])
  console.log('PASS all visual refinement checks')
} finally { await browser.close() }
