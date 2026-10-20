import catalog from './projectCatalog.json'
import type { PortfolioProject, ProjectLink } from '../types/portfolio'

export interface ProjectChapter {
  id: string
  title: string
  sourceNodeId: string
}
export interface GalleryProject {
  id: string
  slug: string
  category: 'case' | 'quest'
  title: string
  year: string
  detailTitle: string
  tags: string[]
  preview: string
  previewAlt: string
  galleryNodeId: string
  previewNodeId: string
  previewLayer: string
  status: 'ongoing' | 'available'
  chapters: ProjectChapter[]
  externalLinks: ProjectLink[]
}
export interface DetailChapter extends ProjectChapter {
  presentation: PortfolioProject
}
export const projects = catalog as GalleryProject[]
export const projectPath = (project: Pick<GalleryProject, 'category' | 'slug'>) => `${project.category === 'case' ? 'cases' : 'quests'}/${project.slug}/`
export const galleryId = (project: Pick<GalleryProject, 'category'>) => project.category === 'case' ? 'design-cases' : 'side-quests'
export const projectLabel = (project: GalleryProject) => `${project.title} (${project.year})`
