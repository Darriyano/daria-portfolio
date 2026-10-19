import { useLayoutEffect, type RefObject } from 'react'

/** Include painted text rather than the empty width of its positioning box. */
export function centerComposition(element: HTMLElement, selector: string) {
  const rects = Array.from(element.querySelectorAll<HTMLElement>(selector)).flatMap(node => {
    if (node.matches('.milestone-label,.secondary-label')) {
      const range = document.createRange()
      range.selectNodeContents(node)
      return Array.from(range.getClientRects())
    }
    return [node.getBoundingClientRect()]
  }).filter(rect => rect.width || rect.height)
  if (!rects.length) return
  const area = element.closest('.section-inner')!.getBoundingClientRect()
  const left = Math.min(...rects.map(rect => rect.left)), right = Math.max(...rects.map(rect => rect.right))
  const current = Number.parseFloat(element.style.left) || 0
  // Move the containing block, preserving child offsets and click targets.
  element.style.left = `${current + (area.left + area.right - left - right) / 2}px`
}

export function useCompositionCentering(ref: RefObject<HTMLDivElement | null>, mobile: boolean, selector: string) {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    let frame = 0, disposed = false
    const layout = () => {
      element.style.left = ''
      if (!mobile) centerComposition(element, selector)
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(layout) }
    layout()
    const observer = new ResizeObserver(schedule)
    observer.observe(element)
    element.querySelectorAll(selector).forEach(node => observer.observe(node))
    window.addEventListener('resize', schedule)
    document.fonts.ready.then(() => { if (!disposed) schedule() })
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', schedule) }
  }, [ref, mobile, selector])
}
