import type { PortfolioProject, ProjectText } from '../../types/portfolio'

export function paragraphs(text: ProjectText | undefined): string[] {
  return typeof text === 'string' ? [text] : text ?? []
}

export function getProjectPreview(project: PortfolioProject) {
  return {
    title: project.previewTitle ?? project.title,
    description: paragraphs(project.fullDescription ?? project.description ?? project.previewDescription),
    contributions: project.previewContributions ?? project.contributions ?? [],
    media: project.previewMedia ?? project.media ?? [],
    link: project.previewLink ?? project.externalLink,
  }
}
