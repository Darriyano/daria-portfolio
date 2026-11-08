import { assetUrl } from '../../utils/assetUrl'
import { projectPath, type GalleryProject } from '../../data/projectCatalog'
import { siteUrl } from '../../routing/navigation'
import { InternalLink } from './InternalLink'
import { scrapbookAsset, scrapbookProjects } from '../../data/scrapbook'

export function ProjectPreviewCard({ project }: { project: GalleryProject }) {
  const art = scrapbookProjects[project.id]
  return <InternalLink id={`project-${project.id}`} className={`project-preview-card paper-${art?.paper ?? 'graph'} ${project.category === 'case' ? 'case-preview' : 'quest-preview'}`} href={siteUrl(projectPath(project))} data-source-node={project.galleryNodeId}>
    <img className="preview-paper" src={scrapbookAsset(`paper-${art?.paper ?? 'graph'}.webp`)} alt="" aria-hidden="true" />
    <img className="preview-image" src={art ? scrapbookAsset(`${art.image}-thumbnail.webp`) : assetUrl(project.preview)} alt={project.previewAlt} width={2280} height={1080} loading="lazy" decoding="async" data-source-node={art?.node ?? project.previewNodeId} />
    <div className="preview-caption"><h3>{project.title} <span className="preview-arrow" aria-hidden="true">↗</span></h3>
    </div>
    <img className="preview-tape" src={scrapbookAsset('tape.svg')} alt="" aria-hidden="true" />
    {art?.paper === 'folded' && <img className="preview-tape tape-second" src={scrapbookAsset('tape.svg')} alt="" aria-hidden="true" />}
  </InternalLink>
}
export function ProjectGallery({ projects, title }: { projects: GalleryProject[]; title: string }) {
  return <div className="project-gallery"><h2>{title}</h2><div className="project-gallery-grid">{projects.map(project => <ProjectPreviewCard key={project.id} project={project} />)}</div></div>
}
