import { useEffect, useRef, useState } from 'react'
import { desktopPath, mobilePath, milestones, experienceAnnotations, experienceNotes } from '../data/experience'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MilestoneNote } from '../components/decorations/MilestoneNote'
import { useAnnotationSpacing } from '../hooks/useAnnotationSpacing'
export function ExperienceSection({ active }: { active: boolean }) {
  const mobile = useMediaQuery('(max-width: 1023px)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const chart = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  useAnnotationSpacing(chart, path, mobile)
  const progress = useRef({ desktop: 0, mobile: 0 })
  const [note, setNote] = useState<string | null>(null)
  const markers = useRef<Record<string, HTMLButtonElement | undefined>>({})
  const pinnedNote = useRef<string | null>(null)
  useEffect(() => {
    const element = chart.current, line = path.current
    if (!element || !line) return
    const length = line.getTotalLength(), key = mobile ? 'mobile' : 'desktop'
    const samples = Array.from({ length: 601 }, (_, index) => ({ distance: length * index / 600, point: line.getPointAtLength(length * index / 600) }))
    const thresholds = milestones.map((milestone) => {
      const [x, y] = mobile ? milestone.mobile : milestone.desktop
      let closest = samples[0], distance = Infinity
      for (const sample of samples) { const delta = Math.hypot(sample.point.x - x, sample.point.y + (mobile ? 0 : 136) - y); if (delta < distance) { closest = sample; distance = delta } }
      return closest.distance / length
    })
    const annotationThresholds = experienceAnnotations.map((item) => {
      const target = mobile ? item.mobile : item.desktop
      let nearest = samples[0], delta = Infinity
      for (const sample of samples) { const distance = mobile ? Math.abs(sample.point.y - target[1]) : Math.abs(sample.point.x - target[0]); if (distance < delta) { nearest = sample; delta = distance } }
      return nearest.distance / length
    })
    const paint = (value: number) => {
      progress.current[key] = Math.max(progress.current[key], value)
      const current = progress.current[key]
      line.style.strokeDasharray = `${length}`; line.style.strokeDashoffset = `${length * (1 - current)}`
      element.querySelectorAll<HTMLElement>('[data-milestone]').forEach((node, index) => { node.dataset.revealed = String(current >= thresholds[index] - .005) })
      element.querySelectorAll<HTMLElement>('[data-annotation]').forEach((node, index) => { node.dataset.revealed = String(current >= annotationThresholds[index]) })
    }
    paint(reduced ? 1 : progress.current[key])
    if (reduced) return
    let frame = 0
    if (mobile) {
      const update = () => { const bounds = element.getBoundingClientRect(); const y = Math.max(0, (innerHeight * .82 - bounds.top) / bounds.height * 1428); const sample = samples.find((item) => item.point.y >= y) ?? samples[samples.length - 1]; paint(y <= 10 ? 0 : sample.distance / length) }
      const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
      update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule)
      return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
    }
    if (!active || progress.current.desktop >= 1) return
    const initial = progress.current.desktop, start = performance.now()
    const tick = (now: number) => { const value = Math.min(1, initial + (now - start) / 3200); paint(value); if (value < 1) frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, mobile, reduced])
  const selectedMarker = [...milestones, ...experienceAnnotations].find((item) => item.id === note)
  const selected = selectedMarker && { ...selectedMarker, ...experienceNotes[selectedMarker.id] }
  return <div className="experience-content"><h2><span><img src="/assets/lettering-experience.svg" alt="" /><span className="sr-only">Experience</span></span></h2>
    <div className="constellation" ref={chart} onKeyDown={(event) => { if (event.key === 'Escape') setNote(null) }}>
      <svg viewBox={mobile ? '0 0 326 1428' : '0 0 1384 564'} aria-hidden="true" className="constellation-line"><path ref={path} d={mobile ? mobilePath : desktopPath} transform={mobile ? undefined : 'translate(0 136)'} fill="none" stroke="#d6576e" strokeWidth={mobile ? 1.5 : 2} /></svg>
      {milestones.map((milestone, index) => { const [x, y] = mobile ? milestone.mobile : milestone.desktop; return <div key={milestone.id} className={`milestone ${milestone.side} milestone-${milestone.id}`} data-milestone={index} style={{ left: `${x / (mobile ? 326 : 1384) * 100}%`, top: `${y / (mobile ? 1428 : 564) * 100}%` }}>
        <button ref={(element) => { markers.current[milestone.id] = element ?? undefined }} className="milestone-marker" aria-label={`Read ${milestone.title.replace('\n', ' ')}`} aria-expanded={note === milestone.id} aria-controls={note === milestone.id ? 'experience-note' : undefined} onMouseEnter={() => { if (!mobile && experienceNotes[milestone.id] && !pinnedNote.current) setNote(milestone.id) }} onClick={() => { pinnedNote.current = pinnedNote.current === milestone.id ? null : milestone.id; setNote(pinnedNote.current) }}><img src={milestone.id === 'future' ? '/assets/840f7.svg' : '/assets/5cc1f.svg'} alt="" /></button>
        <span className="milestone-label">{milestone.title}</span>
      </div> })}
      {experienceAnnotations.map((item, index) => { const [x, y] = mobile ? item.mobile : item.desktop; return <div key={item.id} className={`experience-annotation annotation-${item.id}`} data-annotation={index} style={{ left: `${x / (mobile ? 326 : 1384) * 100}%`, top: `${y / (mobile ? 1428 : 564) * 100}%` }}>
        <button ref={(element) => { markers.current[item.id] = element ?? undefined }} className="secondary-star" aria-label={`Read ${item.title.replaceAll('\n', ' ')}`} aria-expanded={note === item.id} aria-controls={note === item.id ? 'experience-note' : undefined} onMouseEnter={() => { if (!mobile && !pinnedNote.current) setNote(item.id) }} onClick={() => { pinnedNote.current = pinnedNote.current === item.id ? null : item.id; setNote(pinnedNote.current) }}><img src="/assets/5cc1f.svg" alt="" /></button>
        <span className="secondary-label">{item.title}</span>
      </div> })}
      {selected && active && <MilestoneNote milestone={selected} getAnchor={() => markers.current[selected.id]} onClose={() => { pinnedNote.current = null; setNote(null) }} />}
    </div>
  </div>
}
