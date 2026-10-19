// Browser-only QA fixture; excluded from the production application.
import { createRoot, type Root } from 'react-dom/client'
import { ProjectCarousel } from '../src/components/carousel/ProjectCarousel'
import type { PortfolioProject } from '../src/types/portfolio'
let root: Root | undefined
let container: HTMLDivElement | undefined
export function renderProjects(projects: PortfolioProject[]) {
  if (!container) {
    container = document.createElement('div')
    container.id = 'carousel-fixture'
    container.style.cssText = 'position:fixed;inset:0;padding:40px;background:#121212;z-index:200;overflow:auto'
    document.body.append(container)
    root = createRoot(container)
  }
  root?.render(<ProjectCarousel projects={projects} variant="side-quest" />)
}
export function cleanup() { root?.unmount(); container?.remove(); root = undefined; container = undefined }
