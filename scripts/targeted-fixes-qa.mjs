import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const browser = await chromium.launch({channel:'chrome',headless:true})
const page = await browser.newPage({reducedMotion:'reduce',hasTouch:true})
const errors=[]
page.on('pageerror',error=>errors.push(error.message))
// Optional measurements captured before this change enable exact size comparisons.
const baseline=JSON.parse(await readFile(process.env.PORTFOLIO_LAYOUT_BASELINE ?? '/tmp/portfolio-layout-before.json','utf8').catch(error=>{if(error.code==='ENOENT')return '[]';throw error}))
const links={
  '221:636':'https://piterjs.org/#!meetup=qw0wg0_et0kmq/speech=1ez9nz_4omv0y',
  '160:2999':'https://piterjs.org/#!meetup=v8gjsg_jet70w/speech=3vfijv_osr98s',
  '160:2926':'https://store.steampowered.com/app/5259310/Dju/',
}
const jump=async id=>{await page.locator(`#${id}`).evaluate(n=>n.scrollIntoView({behavior:'instant'}));await page.waitForTimeout(50)}
const swipe=async(region,direction)=>region.evaluate((node,direction)=>{
  const startX=direction==='next'?250:100,endX=direction==='next'?100:250
  const start=new Touch({identifier:1,target:node,clientX:startX,clientY:400})
  const end=new Touch({identifier:1,target:node,clientX:endX,clientY:400})
  node.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[start]}))
  node.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[end]}))
},direction)
await mkdir('/tmp/portfolio-targeted-qa',{recursive:true})
try {
  for(const [width,height] of [[390,844],[768,1024],[1024,768],[1280,720],[1512,982],[1920,1080]]) {
    await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:5173/')
    await page.evaluate(()=>document.fonts.ready)
    for(const [id,total] of [['design-cases',5],['side-quests',4]]) {
      await jump(id)
      const region=page.locator(`#${id}`),counter=region.locator('output')
      const previous=region.getByRole('button',{name:'Previous project'}),next=region.getByRole('button',{name:'Next project'})
      assert(await previous.isEnabled() && await next.isEnabled())
      await previous.click();assert.equal(await counter.textContent(),`${total}/${total}`)
      await next.click();assert.equal(await counter.textContent(),`1/${total}`)
      const carousel=region.locator('.project-carousel')
      await carousel.focus();await page.keyboard.press('ArrowLeft');assert.equal(await counter.textContent(),`${total}/${total}`)
      await page.keyboard.press('ArrowRight');assert.equal(await counter.textContent(),`1/${total}`)
      await swipe(carousel,'previous');await counter.filter({hasText:`${total}/${total}`}).waitFor()
      await swipe(carousel,'next');await counter.filter({hasText:`1/${total}`}).waitFor()
    }
    const quests=page.locator('#side-quests')
    for(let i=0;i<4;i++) {
      await jump('side-quests')
      await quests.locator('.paper-media img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())))
      const current=await quests.evaluate(node=>{
        const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}}
        const image=node.querySelector('.paper-media img'),r=image.getBoundingClientRect()
        const scale=Math.min(r.width/image.naturalWidth,r.height/image.naturalHeight)
        return {id:node.querySelector('article').dataset.sourceNode,heading:box(node.querySelector('h2')),action:box(node.querySelector('.paper-action')),copy:box(node.querySelector('.project-copy')),media:box(node.querySelector('.project-media')),controls:box(node.querySelector('.carousel-controls')),paintedPhoto:{width:image.naturalWidth*scale,height:image.naturalHeight*scale},fit:getComputedStyle(image).objectFit}
      })
      const before=baseline.find(r=>r.width===width && r.id===current.id)
      if(width>=1024) {
        const gap=current.copy.y-Math.max(current.heading.bottom,current.action.bottom)
        assert(gap>=32,`${width} ${current.id}: header spacing is too small`)
        if(before) {
          const previousGap=before.copy.y-Math.max(before.heading.bottom,before.action.bottom)
          assert(gap>=previousGap+20,`${width} ${current.id}: header spacing ${previousGap} → ${gap}`)
        }
        assert(current.controls.bottom<=height+2,`${width}: controls offscreen`)
        if(i<2) {
          assert.equal(current.fit,'contain')
          if(before) {
            assert(current.paintedPhoto.width>=before.paintedPhoto.width*1.15,`${width} ${current.id}: portrait must grow substantially: ${before.paintedPhoto.width} → ${current.paintedPhoto.width}`)
            assert(current.paintedPhoto.height>=before.paintedPhoto.height*1.15)
          }
        } else if(before) {
          assert(Math.abs(current.paintedPhoto.width-before.paintedPhoto.width)<1,`${width} ${current.id}: landscape width changed`)
          assert(Math.abs(current.paintedPhoto.height-before.paintedPhoto.height)<1,`${width} ${current.id}: landscape height changed`)
        }
      } else {
        assert(current.copy.y-current.action.bottom>=27,`${width} ${current.id}: header/content gap ${current.copy.y-current.action.bottom}; ${JSON.stringify(current)}`)
        if(before) {
          assert(Math.abs(current.media.width-before.media.width)<1,'Responsive media width preserved')
          assert(Math.abs(current.media.height-before.media.height)<1,'Responsive media height preserved')
        }
      }
      assert(current.copy.bottom<=current.controls.y+2,'Copy clear of carousel controls')
      const action=quests.locator('.paper-action')
      if(links[current.id]) {
        assert.equal(await action.getAttribute('href'),links[current.id])
        assert.equal(await action.getAttribute('target'),'_blank')
        assert.equal(await action.getAttribute('rel'),'noopener noreferrer')
        await action.scrollIntoViewIfNeeded()
        assert(await action.evaluate(node=>{const r=node.getBoundingClientRect();return document.elementFromPoint(r.left+8,r.top+r.height/2)?.closest('a')===node}),'Paper CTA edge is clickable')
      } else assert.equal(await action.getAttribute('href'),null)
      await page.screenshot({path:`/tmp/portfolio-targeted-qa/${width}-side-quest-${i+1}.png`})
      await quests.getByRole('button',{name:'Next project'}).click()
    }
    assert.equal(await quests.locator('output').textContent(),'1/4')
    await quests.getByRole('button',{name:'Previous project'}).click()
    await jump('design-cases');assert.equal(await page.locator('#design-cases output').textContent(),'1/5')
    await page.locator('#design-cases').getByRole('button',{name:'Previous project'}).click()
    await jump('side-quests');assert.equal(await quests.locator('output').textContent(),'4/4')
    await jump('experience')
    const pink=page.locator('.milestone-school .milestone-marker'),white=page.locator('.annotation-speaker .secondary-star')
    const note=page.locator('#experience-note')
    await pink.click();await note.waitFor({state:'visible'})
    await note.locator('.milestone-note-body').click();assert(await note.isVisible(),'Inside click keeps note open')
    // A star click dispatches after outside pointerdown, and must switch notes.
    await white.evaluate(node=>{node.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));node.click()})
    await page.getByRole('heading',{name:'PITERUX REGULAR SPEAKER'}).waitFor()
    await page.keyboard.press('Escape');assert.equal(await note.count(),0)
    await pink.click();await note.waitFor({state:'visible'})
    await page.locator('#experience h2').tap();assert.equal(await note.count(),0,'Touch outside closes note')
    await pink.click();await note.waitFor({state:'visible'})
    await page.locator('.constellation-line').dispatchEvent('pointerdown',{pointerType:'mouse',bubbles:true})
    assert.equal(await note.count(),0,'Constellation background closes note')
    await pink.click();await note.waitFor({state:'visible'})
    await note.getByRole('button',{name:'Close milestone details'}).click();assert.equal(await note.count(),0)
    assert.equal(await page.locator('.constellation-line path').count(),1)
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
    console.log(`PASS ${width}×${height}: circular buttons/keyboard/swipes, independent counters, header spacing, portraits, unchanged landscape sizing, verified CTA links and hit area, outside/inside/switch/X/Escape notes`)
  }
  assert.deepEqual(errors,[])
} finally {await browser.close()}
