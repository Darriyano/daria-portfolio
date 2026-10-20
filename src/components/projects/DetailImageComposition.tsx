import { useLayoutEffect, useRef } from 'react'
import { ProjectPresentation } from '../carousel/ProjectCarousel'
import type { PortfolioProject } from '../../types/portfolio'

/** Fit the authored paper, photo and sticker together, only on desktop. */
export function DetailImageComposition({ project }: { project: PortfolioProject }) {
  const slot = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const element = slot.current
    if (!element) return
    const desktop = matchMedia('(min-width:1200px)')
    const fit = () => {
      if (!desktop.matches) {
        element.style.removeProperty('--composition-scale')
        element.style.removeProperty('--composition-height')
        element.style.removeProperty('--composition-offset')
        element.style.removeProperty('--composition-left')
        return
      }
      const media = element.querySelector<HTMLElement>('.project-media')
      if (!media) return
      const origin = element.getBoundingClientRect()
      const previous = Number(element.style.getPropertyValue('--composition-scale')) || 1
      const offset = Number(element.style.getPropertyValue('--composition-offset').replace('px', '')) || 0
      const horizontalOffset = Number(element.style.getPropertyValue('--composition-left').replace('px', '')) || 0
      const parts = [media, ...media.querySelectorAll<HTMLElement>('.paper-back, .paper-media, .showcase-sticker')]
      // Undo only our uniform scale to measure the original authored bounds,
      // including the rotated sticker and photos extending beyond the paper.
      const bottom = Math.max(...parts.map(part => (part.getBoundingClientRect().bottom - origin.top - offset) / previous))
      const right = Math.max(...parts.map(part => (part.getBoundingClientRect().right - origin.left - horizontalOffset) / previous))
      if (bottom <= 0 || right <= 0) return
      const availableHeight = Math.max(300, innerHeight - origin.top - scrollY)
      const contentRight = element.closest('article')?.getBoundingClientRect().right ?? origin.right
      // Wide game artwork must also fit its own column, so aligning it to the
      // content edge cannot push its paper beneath the unchanged text column.
      const widthLimit = project.presentationVariant === 'game-showcase'
        ? contentRight - origin.left
        : innerWidth - origin.left - 12
      const scale = Math.min(availableHeight / bottom, widthLimit / right)
      element.style.setProperty('--composition-scale', String(scale))
      element.style.setProperty('--composition-left', `${contentRight - origin.left - right * scale}px`)
      // Width can be the limiting dimension on tall screens. Align the
      // complete composition to the bottom of its available grid area.
      element.style.setProperty('--composition-offset', `${availableHeight - bottom * scale}px`)
      element.style.setProperty('--composition-height', `${availableHeight}px`)
    }
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    const article = element.closest('article')
    if (article) observer.observe(article)
    desktop.addEventListener('change', fit)
    window.addEventListener('resize', fit)
    document.fonts.ready.then(fit)
    fit()
    return () => {
      observer.disconnect()
      desktop.removeEventListener('change', fit)
      window.removeEventListener('resize', fit)
    }
  }, [project])
  return <div className="detail-image-slot" ref={slot}><ProjectPresentation project={project} /></div>
}
