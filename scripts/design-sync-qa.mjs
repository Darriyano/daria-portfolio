import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
const sizes = [[390,844],[768,1024],[900,1000],[1024,768],[1280,720],[1512,982],[1920,1080],[1440,540],[1920,480]]
const expected = {
  'design-cases': ['160:2746','160:2554','224:921','224:813','224:985'],
  'side-quests': ['221:636','160:2999','160:2926','221:677'],
}
await mkdir('/tmp/portfolio-sync-qa', { recursive: true })
try {
  for (const [width,height] of sizes) {
    await page.setViewportSize({width,height})
    await page.emulateMedia({reducedMotion:'reduce'})
    await page.goto('http://127.0.0.1:5173/')
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true)
    for (const [section, ids] of Object.entries(expected)) {
      const region=page.locator(`#${section}`)
      await region.evaluate(node => node.scrollIntoView({behavior:'instant'}))
      for(let i=0;i<ids.length;i++) {
        assert.equal(await region.locator('article').getAttribute('data-source-node'),ids[i])
        assert.equal(await region.locator('output').textContent(),`${i+1}/${ids.length}`)
        await region.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
        const geometry=await region.evaluate(node => {
          const box=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}}
          return {section:box(node),controls:box(node.querySelector('.carousel-controls')),copy:box(node.querySelector('.project-copy')),media:box(node.querySelector('.project-media')),heading:box(node.querySelector('h2'))}
        })
        assert(geometry.controls.x>=0 && geometry.controls.right<=width,`${width} ${section} ${i}: controls width`)
        assert(geometry.controls.bottom<=geometry.section.bottom,`${width} ${section} ${i}: controls clipped`)
        assert(geometry.copy.bottom<=geometry.controls.y+2,`${width} ${section} ${i}: copy overlaps controls`)
        if(width>=1024 && height>=600) assert(geometry.controls.bottom<=height+2,`${width} ${section} ${i}: controls offscreen`)
        assert(geometry.media.width>0 && geometry.media.height>0)
        // Devices intentionally extend beyond the stage; controls must remain
        // accessible while the section edge crops the decorative composition.
        await page.screenshot({path:`/tmp/portfolio-sync-qa/${width}-${section}-${i+1}.png`})
        if(i<ids.length-1) await region.getByRole('button',{name:'Next project'}).click()
      }
    }
    const experience=page.locator('#experience')
    await experience.evaluate(node=>node.scrollIntoView({behavior:'instant'}))
    assert.equal(await page.locator('.secondary-star').count(),4)
    assert.equal(await page.locator('.constellation-line path').count(),1,'White markers add no connections')
    for (const marker of await experience.locator('.milestone-marker,.secondary-star').all()) {
      await marker.click()
      const note=page.locator('#experience-note')
      await note.waitFor({state:'visible'})
      const box=await note.boundingBox()
      assert(box.x>=19 && box.y>=19 && box.x+box.width<=width-19 && box.y+box.height<=height-19,'Note inside viewport')
      await page.keyboard.press('Escape')
      assert.equal(await note.count(),0)
    }
    await experience.evaluate(node=>node.scrollIntoView({behavior:'instant'}))
    await page.screenshot({path:`/tmp/portfolio-sync-qa/${width}-experience.png`})
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true)
    console.log(`PASS ${width}×${height}: 5 + 4 slides, exact order, loaded media, controls, 4 standalone stars, anchored notes`)
  }
  assert.deepEqual(errors,[])
} finally { await browser.close() }
