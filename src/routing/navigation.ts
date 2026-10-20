import { useSyncExternalStore } from 'react'

export const basePath = import.meta.env.BASE_URL
export const siteUrl = (path = '') => basePath + path.replace(/^\//, '')
const galleryPositions = new Map<string, { y: number; focus: string }>()
const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}
export function useLocation() {
  return useSyncExternalStore(subscribe, () => location.pathname + location.search + location.hash)
}
export function relativePath() {
  const pathname = location.pathname
  return pathname.startsWith(basePath) ? pathname.slice(basePath.length).replace(/\/$/, '') : '__not-found__'
}
export function navigateTo(href: string) {
  const target = new URL(href, location.href)
  if (target.origin !== location.origin) return
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const focus = focused?.id ?? ''
  const position = { y: scrollY, focus }
  history.replaceState({ ...history.state, portfolioPosition: position }, '')
  if (relativePath() === '' || relativePath() === 'index.html') {
    const section = focused?.closest('section')?.id
    if (section) galleryPositions.set(`#${section}`, position)
  }
  const saved = target.pathname === basePath ? galleryPositions.get(target.hash) : undefined
  history.pushState(saved ? { portfolioPosition: saved } : {}, '', target.pathname + target.search + target.hash)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
