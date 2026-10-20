import { assetUrl } from '../../utils/assetUrl'
import { projectLabel, projectPath, type GalleryProject } from '../../data/projectCatalog'
import { siteUrl } from '../../routing/navigation'
import { InternalLink } from './InternalLink'

export function ProjectPreviewCard({ project }: { project: GalleryProject }) {
  return <InternalLink id={`project-${project.id}`} className="project-preview-card" href={siteUrl(projectPath(project))} data-source-node={project.galleryNodeId}>
    <img className="preview-paper" src={assetUrl('/assets/10a21.svg')} alt="" aria-hidden="true" />
    <img className="preview-image" src={assetUrl(project.preview)} alt={project.previewAlt} width={1140} height={540} loading="lazy" decoding="async" data-source-node={project.previewNodeId} />
    <div className="preview-caption"><h3>{projectLabel(project)} <span aria-hidden="true">↗</span></h3>
      <ul className="preview-tags" aria-label="Categories">{project.tags.map(tag => <li key={tag}>#{tag}</li>)}</ul>
    </div>
  </InternalLink>
}
export function ProjectGallery({ projects, title }: { projects: GalleryProject[]; title: string }) {
  return <div className="project-gallery"><h2>{title}</h2><div className="project-gallery-grid">{projects.map(project => <ProjectPreviewCard key={project.id} project={project} />)}</div></div>
}
