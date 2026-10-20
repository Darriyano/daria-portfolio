import { designCases } from './designCases'
import { sideQuests } from './sideQuests'
import { assetUrl } from '../utils/assetUrl'
import { type DetailChapter, type GalleryProject } from './projectCatalog'
import type { PortfolioProject } from '../types/portfolio'

const thesis: PortfolioProject = {
  id: 'bachelor-thesis', title: 'Bachelor Thesis (2026–27)', category: 'product-design',
  presentationVariant: 'desktop-mockup', sourceNodeId: '276:4252',
  contributions: [
    { label: 'The brief', text: 'A research project exploring ethical questions in virtual environments and how people make decisions within them' },
    { label: 'My approach', text: 'I am designing an experimental game as a research instrument to collect behavioural data from participants in a controlled interactive environment' },
    { label: 'Work in progress', text: 'Research design, literature review and an experimental prototype are in progress. The thesis is being written in English; journal publication is planned.' },
  ],
  previewMedia: [{ src: assetUrl('/assets/92b2c.png'), alt: 'Work in progress: Bachelor Thesis manuscript and literature review on a laptop', type: 'image' }],
}
const hackathons: PortfolioProject = {
  id: 'hackathon', title: 'Hackathons (2023–24)', category: 'creative-experiment',
  presentationVariant: 'game-showcase', sourceNodeId: '264:2136',
  previewDescription: [
    'In 2023 and 2024, I took part in international hackathons, creating products for major technology companies with my team. (InnoGlobalHack, T1, Sberhack)',
    'My work spanned product design and analysis, React development and API integration — connecting interface design with technical implementation. We then presented our solutions at the hackathon.',
  ],
  contributions: [{ label: 'My role', text: 'React developer, UX/UI designer' }],
  previewMedia: [{ src: assetUrl('/assets/85380.png'), alt: 'InnoGlobalHack 2024 diploma awarded to Daria for third place', type: 'image' }],
  paperArtwork: assetUrl('/assets/1413e.svg'),
}
const existing: PortfolioProject[] = [...designCases, ...sideQuests, thesis, hackathons]
// Add approved chapter presentations here, keyed by project ID and chapter ID.
// Gallery assets never double as detail content; details load only on a project route.
const presentations: Record<string, Record<string, PortfolioProject>> = Object.fromEntries(existing.map(project => [project.id === 'moloch' ? 'novel' : project.id, { overview: project }]))
export function getProjectChapters(project: GalleryProject): DetailChapter[] {
  return project.chapters.map(chapter => {
    const source = presentations[project.id]?.[chapter.id]
    if (!source) throw new Error(`Missing approved presentation: ${project.id}/${chapter.id}`)
    const presentation: PortfolioProject = { ...source, title: project.detailTitle }
    // Years are confirmed in the catalog. Existing source copy and artwork remain intact.
    if (project.id.startsWith('piterux-')) {
      const paragraphs = Array.isArray(source.previewDescription) ? source.previewDescription : []
      presentation.previewDescription = [paragraphs[1], `(${paragraphs[0]})`]
    }
    return { ...chapter, presentation }
  })
}
