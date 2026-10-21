import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigation } from './components/navigation/Navigation'
import { sectionIds } from './data/navigation'
import { ProjectGallery } from './components/projects/ProjectGallery'
import { projects, projectPath, projectLabel } from './data/projectCatalog'
import { navigateTo, relativePath, siteUrl, useLocation } from './routing/navigation'
import { InternalLink } from './components/projects/InternalLink'
import { HeroSection } from './sections/HeroSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { ContactsSection } from './sections/ContactsSection'
import { useMediaQuery } from './hooks/useMediaQuery'
import './App.css'
import './design-sync.css'
import './portrait-tablet.css'
import './projects.css'
const ProjectDetailPage = lazy(() => import('./components/projects/ProjectDetailPage'))
function App() {
  const currentLocation = useLocation()
  const path = relativePath()
  const project = projects.find(item => projectPath(item).replace(/\/$/, '') === path)
  const home = path === '' || path === 'index.html'
  const originalTitle = useRef('Darriyano')
  useLayoutEffect(() => {
    history.scrollRestoration = 'manual'
    document.title = project ? `${projectLabel(project)} — Daria` : originalTitle.current
    if (home) {
      const saved = history.state?.portfolioPosition
      const target = document.getElementById(location.hash.slice(1))
      if (saved) { window.scrollTo({ top: saved.y, behavior: 'instant' }); if (saved.focus) document.getElementById(saved.focus)?.focus({ preventScroll: true }) }
      else if (target) target.scrollIntoView({ behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    } else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [currentLocation, home, project])
  const [active, setActive] = useState(0)
  const sections = useRef<(HTMLElement | null)[]>([])
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const navigate = (index: number) => { if (!home) { navigateTo(siteUrl(`#${sectionIds[index]}`)); return }; sections.current[Math.max(0, Math.min(4, index))]?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }) }
  useEffect(() => {
    let frame = 0
    const update = () => { if (!home) return; const marker = innerHeight * .35; let next = 0; sections.current.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= marker) next = index }); setActive(next) }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
    update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [home])
  const highlighted = project ? (project.category === 'case' ? 2 : 3) : active
  return <><a className="skip-link" href={home ? "#main" : "#project-detail"}>Skip to content</a><div className="progress" role="progressbar" aria-label="Portfolio section" aria-valuemin={0} aria-valuemax={100} aria-valuenow={(highlighted + 1) * 20} aria-valuetext={`Section ${highlighted + 1} of 5`}><span style={{ transform: `scaleX(${(highlighted + 1) / 5})` }} /></div><Navigation home={home} active={highlighted} navigate={navigate} />
    <div className="portfolio-home" hidden={!home}><main>{sectionIds.map((id, index) => <section key={id} id={id} ref={(node) => { sections.current[index] = node }} className={`presentation-section section-${id}`} aria-label={['Introduction', 'Life experience', 'Design cases', 'Side quests', 'Contacts'][index]}><div className="section-inner">{index === 0 ? <HeroSection active={home && active === 0} navigate={navigate} /> : index === 1 ? <ExperienceSection active={home && active === 1} /> : index === 2 ? <ProjectGallery projects={projects.filter(item => item.category === 'case')} title="DESIGN CASES" /> : index === 3 ? <ProjectGallery projects={projects.filter(item => item.category === 'quest')} title="SIDE QUESTS" /> : <ContactsSection />}</div></section>)}</main></div>
    {project ? <Suspense fallback={<main className="project-loading" aria-busy="true">Loading project…</main>}><ProjectDetailPage key={project.id} project={project} /></Suspense> : !home ? <main className="project-loading"><h1>Project not found</h1><InternalLink href={siteUrl('#design-cases')}>Back to Design Cases</InternalLink></main> : null}
  </>
}
export default App
