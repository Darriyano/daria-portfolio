import { useEffect, useRef, useState } from 'react'
import { Navigation } from './components/navigation/Navigation'
import { sectionIds } from './data/navigation'
import { ProjectCarousel } from './components/carousel/ProjectCarousel'
import { HeroSection } from './sections/HeroSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { ContactsSection } from './sections/ContactsSection'
import { designCases } from './data/designCases'
import { sideQuests } from './data/sideQuests'
import { useMediaQuery } from './hooks/useMediaQuery'
import './App.css'
import './design-sync.css'
import './portrait-tablet.css'
function App() {
  const [active, setActive] = useState(0)
  const activeRef = useRef(0), sections = useRef<(HTMLElement | null)[]>([])
  // Portrait tablets scroll naturally while individual sections choose their layout.
  const desktop = useMediaQuery('(min-width: 1024px) and (min-height: 600px) and ((min-width: 1200px) or (orientation: landscape))')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const navigate = (index: number) => { sections.current[Math.max(0, Math.min(4, index))]?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }) }
  useEffect(() => {
    let frame = 0
    const update = () => { const marker = innerHeight * .35; let next = 0; sections.current.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= marker) next = index }); activeRef.current = next; setActive(next) }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
    update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])
  useEffect(() => {
    if (!desktop) return
    let lastWheel = 0, lastMove = -Infinity, accumulated = 0, gestureConsumed = false
    const go = (index: number) => { if (index >= 0 && index <= 4) sections.current[index]?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }) }
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || (event.target as HTMLElement).closest('video,nav.is-open')) return
      const now = performance.now(), idle = now - lastWheel
      lastWheel = now
      if (idle > 180) { accumulated = 0; gestureConsumed = false }
      // Momentum from the gesture that changed slides must never enter the next one.
      if (now - lastMove < 800 || gestureConsumed) { event.preventDefault(); return }
      // Let taller content scroll normally before advancing the presentation.
      const bounds = sections.current[activeRef.current]?.getBoundingClientRect()
      if (bounds && bounds.height > innerHeight + 8 && ((event.deltaY > 0 && bounds.bottom > innerHeight + 2) || (event.deltaY < 0 && bounds.top < -2))) return
      event.preventDefault()
      accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
      if (Math.abs(accumulated) < 35) return
      go(activeRef.current + Math.sign(accumulated)); lastMove = now; accumulated = 0; gestureConsumed = true
    }
    const keys = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest('button,a,input,textarea,select,video,[contenteditable="true"],[role="region"]')) return
      const next = ({ ArrowDown: activeRef.current + 1, PageDown: activeRef.current + 1, ArrowUp: activeRef.current - 1, PageUp: activeRef.current - 1, Home: 0, End: 4 } as Record<string, number>)[event.key]
      if (next !== undefined) { event.preventDefault(); go(next) }
    }
    window.addEventListener('wheel', wheel, { passive: false }); window.addEventListener('keydown', keys)
    return () => { window.removeEventListener('wheel', wheel); window.removeEventListener('keydown', keys) }
  }, [desktop, reduced])
  return <><a className="skip-link" href="#main">Skip to content</a><div className="progress" role="progressbar" aria-label="Portfolio section" aria-valuemin={0} aria-valuemax={100} aria-valuenow={(active + 1) * 20} aria-valuetext={`Section ${active + 1} of 5`}><span style={{ transform: `scaleX(${(active + 1) / 5})` }} /></div><Navigation active={active} navigate={navigate} />
    <main>{sectionIds.map((id, index) => <section key={id} id={id} ref={(node) => { sections.current[index] = node }} className={`presentation-section section-${id}`} aria-label={['Introduction', 'Life experience', 'Design cases', 'Side quests', 'Contacts'][index]}><div className="section-inner">{index === 0 ? <HeroSection active={active === 0} navigate={navigate} /> : index === 1 ? <ExperienceSection active={active === 1} /> : index === 2 ? <ProjectCarousel projects={designCases} variant="design" /> : index === 3 ? <ProjectCarousel projects={sideQuests} variant="side-quest" /> : <ContactsSection />}</div></section>)}</main>
  </>
}
export default App
