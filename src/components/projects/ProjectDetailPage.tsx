import { useLayoutEffect, useRef } from 'react'
import { ProjectPresentation } from '../carousel/ProjectCarousel'
import { getProjectPreview } from '../carousel/projectPreview'
import { galleryId, type GalleryProject } from '../../data/projectCatalog'
import { getProjectChapters } from '../../data/projectDetails'
import { assetUrl } from '../../utils/assetUrl'
import { navigateTo, siteUrl } from '../../routing/navigation'
import { InternalLink } from './InternalLink'
import { ProjectChapterNavigation } from './ProjectChapterNavigation'
import { DetailImageComposition } from './DetailImageComposition'
import { scrapbookAsset, scrapbookProjects } from '../../data/scrapbook'
import { ScrapbookCollage } from './ScrapbookCollage'

export function BackToGallery({ project }: { project: GalleryProject }) {
  const id = galleryId(project)
  return <InternalLink className="back-to-gallery" href={siteUrl(`#${id}`)} aria-label={`Back to ${project.category === 'case' ? 'Design Cases' : 'Side Quests'}`}><span aria-hidden="true">‹</span><span className="back-label">BACK TO {project.category === 'case' ? 'CASES' : 'QUESTS'}</span></InternalLink>
}
export default function ProjectDetailPage({ project }: { project: GalleryProject }) {
  const chapters = getProjectChapters(project)
  const selected = new URLSearchParams(location.search).get('chapter')
  const index = Math.max(0, chapters.findIndex(chapter => chapter.id === selected))
  const chapter = chapters[index]
  const preview = getProjectPreview(chapter.presentation)
  const heading = useRef<HTMLHeadingElement>(null)
  const art = scrapbookProjects[project.id]
  useLayoutEffect(() => { heading.current?.focus({ preventScroll: true }) }, [project.id, chapter.id])
  const change = (next: number) => {
    if (next < 0 || next >= chapters.length) return
    const url = new URL(location.href)
    if (next === 0) url.searchParams.delete('chapter')
    else url.searchParams.set('chapter', chapters[next].id)
    navigateTo(url.href)
  }
  return <main id="project-detail" data-layout={art?.reverse ? 'media-left' : 'text-left'} className={`project-detail scrapbook-detail ${art?.reverse ? 'collage-first' : ''} ${project.category === 'case' ? 'design' : 'side-quest'}`}>
    <article className={`project-content ${chapter.presentation.presentationVariant}`} data-source-node={chapter.sourceNodeId}>
      <BackToGallery project={project} />
      <div className="project-intro">
        <div className="project-summary">
          <div className="detail-heading"><h1 tabIndex={-1} ref={heading}><img className="detail-title-paper" src={scrapbookAsset('paper-torn.webp')} alt="" aria-hidden="true" /><span>{preview.title}</span></h1></div>
          {project.externalLinks.length > 0 && <div className="detail-actions">{project.externalLinks.map(link => <a className="paper-action" href={link.url} key={link.url} target="_blank" rel="noopener noreferrer">
            <img className="paper-action-background" src={assetUrl('/assets/e8248.svg')} alt="" />
            <img className="paper-action-circle" src={assetUrl('/assets/3db81.svg')} alt="" />
            <span className="paper-action-label scrapbook-cta-label"><span>{link.label}</span>{' '}<span className="scrapbook-cta-arrow" aria-hidden="true">↗</span></span>
          </a>)}</div>}
          {project.id === 'novel' && <div className="detail-coming-soon"><img src={assetUrl('/assets/e8248.svg')} alt="" /><span className="scrapbook-cta-label">Coming soon on Steam</span></div>}
          <div className="project-copy">
            {[...preview.description, ...preview.contributions.map(item => item.text)].map((text, i) => <p className="project-description" key={i}>{text}</p>)}
          </div>
        </div>
        {art?.photos ? <ScrapbookCollage name={art.photos} title={project.title} /> : project.category === 'quest' ? <DetailImageComposition project={chapter.presentation} /> : <ProjectPresentation project={chapter.presentation} />}
      </div>
      <ProjectChapterNavigation index={index} total={chapters.length} onChange={change} />
    </article>
  </main>
}
