export type ProjectCategory = 'product-design' | 'game-project' | 'personal-development' | 'creative-experiment'
export type PresentationVariant = 'mobile-mockups' | 'single-mobile-mockup' | 'desktop-mockup' | 'game-showcase' | 'creative-showcase'
export interface ProjectMedia { src: string; alt: string; type: 'image' | 'video' }
export interface Contribution { label: string; text: string }
export interface ProjectLink { label: string; url: string }
export type ProjectText = string | string[]
export type ProjectDetailSection =
  | { type: 'text'; heading?: string; paragraphs: string[] }
  | { type: 'media'; heading?: string; items: ProjectMedia[] }
  | { type: 'links'; heading?: string; items: ProjectLink[] }
export interface ProjectDetails { sections: ProjectDetailSection[] }
export interface PortfolioProject {
  id: string
  projectId?: string
  sourceNodeId?: string
  slideOrder?: string
  /** Compose the Figma phone hardware with the supplied app screen artwork. */
  phoneScreens?: boolean
  laptopScreen?: string
  paperArtwork?: string
  actionLabel?: string
  actionCircle?: string
  responsivePresentation?: { tablet: PresentationVariant; mobile: PresentationVariant }
  title: string
  titleArtwork?: string
  category: ProjectCategory
  previewTitle?: string
  previewDescription?: ProjectText
  previewContributions?: Contribution[]
  previewMedia?: ProjectMedia[]
  previewLink?: ProjectLink
  contributions?: Contribution[]
  fullDescription?: ProjectText
  media?: ProjectMedia[]
  externalLinks?: ProjectLink[]
  details?: ProjectDetails
  /** @deprecated Use previewDescription. Retained for existing data compatibility. */
  description?: string
  /** @deprecated Use previewLink. Retained for existing data compatibility. */
  externalLink?: ProjectLink
  presentationVariant: PresentationVariant
}
export interface Contact { id: string; title: string; account: string; url: string; paper: string; sticker: string }
