import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')
const browser = await chromium.launch({channel:'chrome',headless:true})
const page = await browser.newPage({reducedMotion:'reduce'})
const record=process.argv.includes('--record-baseline')
const baselinePath='/tmp/portfolio-before-oversized.json'
const baseline=record?[]:JSON.parse(await readFile(baselinePath,'utf8').catch(error=>{if(error.code==='ENOENT')return '[]';throw error}))
const results=[],errors=[]
page.on('pageerror',error=>errors.push(error.message))
await mkdir('/tmp/portfolio-mockup-qa',{recursive:true})
try {
  for(const [width,height] of [[390,844],[768,1024],[900,1000],[1024,768],[1280,720],[1512,982],[1920,1080],[1440,540]]) {
    await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:5173/')
    await page.evaluate(()=>document.fonts.ready)
    for(const [section,total] of [['design-cases',5],['side-quests',4]]) {
      const region=page.locator(`#${section}`)
      for(let slide=0;slide<total;slide++) {
        await region.evaluate(n=>n.scrollIntoView({behavior:'instant'}))
        await region.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())))
        const result=await region.evaluate((node,context)=>{
          const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}}
          const text=node.querySelector('.project-copy'),controls=node.querySelector('.carousel-controls')
          const phones=[...node.querySelectorAll('.phone')]
          return {...context,copy:box(text),heading:box(node.querySelector('h2')),controls:box(controls),media:box(node.querySelector('.project-media')),phones:phones.map(box),phoneWidths:phones.map(n=>n.offsetWidth),laptop:node.querySelector('.laptop-composite')?box(node.querySelector('.laptop-composite')):null,assets:[...node.querySelectorAll('.project-media img')].map(n=>({src:n.getAttribute('src'),...box(n)}))}
        },{width,height,section,slide})
        results.push(result)
        if(!record) {
          const before=baseline.find(b=>b.width===width&&b.section===section&&b.slide===slide)
          if(section==='side-quests' && before) assert.deepEqual(result,before,`${width} Side Quest ${slide}: geometry changed`)
          if(section==='design-cases') {
            if(before) {
              assert.deepEqual(result.copy,before.copy,`${width}: text geometry changed`)
              assert.deepEqual(result.heading,before.heading,`${width}: heading geometry changed`)
              assert.deepEqual(result.controls,before.controls,`${width}: controls moved`)
            }
            if(result.phones.length) {
              if(before) assert(result.phoneWidths[0]>=before.phoneWidths[0]*1.15,`${width}: phones must be substantially larger`)
              const gap=await region.locator('.phone').evaluateAll(nodes=>{
                const [a,b]=nodes.map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n),m=new DOMMatrixReadOnly(s.transform);return{x:r.x+r.width/2,y:r.y+r.height/2,width:parseFloat(s.width),cos:m.a,sin:m.b}})
                return (b.x-a.x)*a.cos+(b.y-a.y)*a.sin-(a.width+b.width)/2
              })
              // Measure across the rotated body edges, not axis-aligned bounds.
              assert(gap>=8&&gap<=19,`${width}: phone silhouette gap is ${gap}px`)
              assert(result.phones.some(p=>p.right>width||p.bottom>height),`${width}: preserve oversized phone composition`)
            } else {
              if(before) assert(result.laptop.width>=before.laptop.width*1.15,`${width}: laptop must be substantially larger`)
              if(width<=1512) assert(result.laptop.right>width,`${width}: laptop should extend beyond the right edge`)
            }
            await region.locator('.carousel-controls').scrollIntoViewIfNeeded()
            for(const button of await region.locator('.carousel-controls button').all()) {
              assert(await button.evaluate(node=>{const r=node.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===node||node.contains(hit)}),'Media must not cover a control')
            }
            assert.equal(await region.locator('output').textContent(),`${slide+1}/${total}`)
            await page.screenshot({path:`/tmp/portfolio-mockup-qa/${width}-design-${slide+1}.png`})
          }
          assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No horizontal page scrolling')
        }
        if(slide<total-1)await region.getByRole('button',{name:'Next project'}).click()
      }
    }
    if(!record) console.log(`PASS ${width}×${height}: oversized devices, close phone pair, accessible controls, loaded assets${baseline.length?', unchanged text/controls/Side Quests':''}`)
  }
  if(record) {await writeFile(baselinePath,JSON.stringify(results,null,2));console.log('Saved current geometry before mockup sizing changes')}
  assert.deepEqual(errors,[])
}finally{await browser.close()}
