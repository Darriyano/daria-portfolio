import { useLayoutEffect, type RefObject } from 'react'
import { experienceAnnotations } from '../data/experience'
import { centerComposition } from './useCompositionCentering'

interface Rect { left: number; top: number; right: number; bottom: number }
const overlaps = (a: Rect, b: Rect, gap: number) => a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap
const distance = (x: number, y: number, r: Rect) => Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom))

/** Position only the detached annotations; the animated path remains untouched. */
export function useAnnotationSpacing(chart: RefObject<HTMLDivElement | null>, path: RefObject<SVGPathElement | null>, mobile: boolean) {
  useLayoutEffect(() => {
    const element = chart.current, line = path.current
    if (!element || !line) return
    let frame = 0, disposed = false
    const layout = () => {
      element.style.removeProperty('left')
      const bounds = element.getBoundingClientRect(), matrix = line.getScreenCTM()
      if (!matrix || !bounds.width) return
      const length = line.getTotalLength()
      const points = Array.from({ length: 401 }, (_, i) => {
        const p = line.getPointAtLength(length * i / 400)
        return { x: matrix.a * p.x + matrix.c * p.y + matrix.e, y: matrix.b * p.x + matrix.d * p.y + matrix.f }
      })
      const heading = element.parentElement!.querySelector('h2')!.getBoundingClientRect()
      const section = element.closest('section')!.getBoundingClientRect()
      const inset = 24, minX = inset, maxX = document.documentElement.clientWidth - inset
      const minY = Math.max(heading.bottom + 24, bounds.top - 40), maxY = Math.min(section.bottom - inset, bounds.bottom + 40)
      const obstacles: Rect[] = Array.from(element.querySelectorAll<HTMLElement>('.milestone-marker,.milestone-label')).map(n => n.getBoundingClientRect())
      const placed: Rect[] = []
      element.querySelectorAll<HTMLElement>('[data-annotation]').forEach((node, index) => {
        const label = node.querySelector<HTMLElement>('.secondary-label')!, button = node.querySelector<HTMLButtonElement>('button')!
        const width = node.offsetWidth, height = node.offsetHeight, starWidth = button.offsetWidth, starHeight = button.offsetHeight
        const labelWidth = label.offsetWidth, labelHeight = label.offsetHeight
        const stacked = document.documentElement.clientWidth < 375
        const [px, py] = mobile ? experienceAnnotations[index].mobile : experienceAnnotations[index].desktop
        const preferredX = bounds.left + px / (mobile ? 326 : 1384) * bounds.width - starWidth - 12
        const preferredY = bounds.top + py / (mobile ? 1428 : 564) * bounds.height
        let best: { x: number; y: number; right: boolean; score: number } | undefined
        // Search near the authored composition, choosing the smallest safe move.
        const reach = mobile ? (maxX - minX < 300 ? 320 : 224) : 160
        for (let dy = -reach; dy <= reach; dy += 16) for (let dx = -160; dx <= 160; dx += 16) for (const right of stacked ? [false] : [false, true]) {
          const x = Math.max(minX, Math.min(preferredX + dx, maxX - width))
          const y = Math.max(minY, Math.min(preferredY + dy, maxY - height))
          const pair = { left: x, top: y, right: x + width, bottom: y + height }
          const starX = right ? x + width - starWidth : x
          const star = { left: starX, top: y, right: starX + starWidth, bottom: y + starHeight }
          const labelX = stacked || right ? x : x + starWidth + 12
          const labelY = stacked ? y + starHeight + 12 : y
          const text = { left: labelX, top: labelY, right: labelX + labelWidth, bottom: labelY + labelHeight }
          const starClearance = Math.min(...points.map(p => distance(p.x, p.y, star)))
          const textClearance = Math.min(...points.map(p => distance(p.x, p.y, text)))
          const collisions = obstacles.filter(r => overlaps(star, r, 16) || overlaps(text, r, 12)).length + placed.filter(r => overlaps(pair, r, 16)).length
          const penalty = Math.max(0, 24 - starClearance) * 1000 + Math.max(0, 8 - textClearance) * 1000 + collisions * 100000
          const score = penalty + Math.hypot(x - preferredX, y - preferredY) + (right ? 24 : 0)
          if (!best || score < best.score) best = { x, y, right, score }
        }
        if (!best) return
        node.style.left = `${best.x - bounds.left}px`
        node.style.top = `${best.y - bounds.top}px`
        node.dataset.starSide = best.right ? 'right' : 'left'
        placed.push({ left: best.x, top: best.y, right: best.x + width, bottom: best.y + height })
      })
      if (!mobile) centerComposition(element, '.constellation-line path,.milestone-marker,.milestone-label,.secondary-star,.secondary-label')
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(layout) }
    layout()
    const observer = new ResizeObserver(schedule)
    observer.observe(element)
    element.querySelectorAll<HTMLElement>('.experience-annotation,.milestone-label').forEach(n => observer.observe(n))
    window.addEventListener('resize', schedule)
    document.fonts.ready.then(() => { if (!disposed) schedule() })
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', schedule) }
  }, [chart, path, mobile])
}
