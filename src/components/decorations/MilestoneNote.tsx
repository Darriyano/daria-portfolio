import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Milestone } from '../../data/experience'

export function MilestoneNote({ milestone, getAnchor, onClose }: { milestone: Milestone; getAnchor: () => HTMLButtonElement | undefined; onClose: () => void }) {
  const card = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const element = card.current
    const anchor = getAnchor()
    if (!element || !anchor) return
    const position = () => {
      const star = anchor.getBoundingClientRect()
      const { width, height } = element.getBoundingClientRect()
      const margin = 20, gap = 8
      let left = star.left + star.width / 2 - width / 2
      let top = star.top - height - gap
      let placement = 'above'
      if (top < margin) {
        if (star.bottom + gap + height <= innerHeight - margin) { top = star.bottom + gap; placement = 'below' }
        else { top = star.top + star.height / 2 - height / 2; left = star.right + gap + width <= innerWidth - margin ? star.right + gap : star.left - width - gap; placement = 'beside' }
      }
      element.style.left = `${Math.max(margin, Math.min(left, innerWidth - width - margin))}px`
      element.style.top = `${Math.max(margin, Math.min(top, innerHeight - height - margin))}px`
      element.dataset.placement = placement
      element.style.visibility = 'visible'
    }
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); anchor.focus({ preventScroll: true }) } }
    const outside = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node) || element.contains(target)) return
      // Clicking a hovered star or label must not dismiss its hover note.
      if (target instanceof Element && target.closest('.milestone,.experience-annotation')) return
      onClose()
    }
    position()
    const observer = new ResizeObserver(position)
    observer.observe(element); observer.observe(anchor)
    // Detached star pairs can move during responsive collision resolution.
    const anchorPosition = new MutationObserver(position)
    if (anchor.parentElement) anchorPosition.observe(anchor.parentElement, { attributes: true, attributeFilter: ['style', 'data-star-side'] })
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    window.addEventListener('keydown', close)
    window.addEventListener('pointerdown', outside, true)
    return () => { observer.disconnect(); anchorPosition.disconnect(); window.removeEventListener('resize', position); window.removeEventListener('scroll', position, true); window.removeEventListener('keydown', close); window.removeEventListener('pointerdown', outside, true) }
  }, [getAnchor, milestone.id, onClose])
  return createPortal(<aside ref={card} className="experience-note floating-note" id="experience-note" role="dialog" aria-label={`${milestone.title.replaceAll('\n', ' ')} details`}>
    <button aria-label="Close milestone details" onClick={() => { onClose(); getAnchor()?.focus({ preventScroll: true }) }}>×</button>
    <div className="milestone-note-body" tabIndex={0} aria-label="Milestone note content">{milestone.noteHeading && <h3>{milestone.noteHeading}</h3>}<p>{milestone.details ?? milestone.title}</p></div>
  </aside>, document.body)
}
