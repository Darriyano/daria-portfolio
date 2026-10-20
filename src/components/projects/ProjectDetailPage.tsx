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

export function BackToGallery({ project }: { project: GalleryProject }) {
  const id = galleryId(project)
  return <InternalLink className="back-to-gallery" href={siteUrl(`#${id}`)} aria-label={`Back to ${project.category === 'case' ? 'Design Cases' : 'Side Quests'}`}>‹</InternalLink>
}
export default function ProjectDetailPage({ project }: { project: GalleryProject }) {
  const chapters = getProjectChapters(project)
  const selected = new URLSearchParams(location.search).get('chapter')
  const index = Math.max(0, chapters.findIndex(chapter => chapter.id === selected))
  const chapter = chapters[index]
  const preview = getProjectPreview(chapter.presentation)
  const heading = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => { heading.current?.focus({ preventScroll: true }) }, [project.id, chapter.id])
  const change = (next: number) => {
    if (next < 0 || next >= chapters.length) return
    const url = new URL(location.href)
    if (next === 0) url.searchParams.delete('chapter')
    else url.searchParams.set('chapter', chapters[next].id)
    navigateTo(url.href)
  }
  return <main id="project-detail" className={`project-detail ${project.category === 'case' ? 'design' : 'side-quest'}`}>
    <article className={`project-content ${chapter.presentation.presentationVariant}`} data-source-node={chapter.sourceNodeId}>
      <div className="detail-heading"><BackToGallery project={project} /><h1 tabIndex={-1} ref={heading}>{chapter.presentation.titleArtwork ? <><img className="title-artwork" src={chapter.presentation.titleArtwork} alt="" /><span className="sr-only">{preview.title}</span></> : preview.title}</h1></div>
      {project.externalLinks.length > 0 && <div className="detail-actions">{project.externalLinks.map(link => <a className="paper-action" href={link.url} key={link.url} target="_blank" rel="noopener noreferrer">
        <img className="paper-action-background" src={assetUrl('/assets/e8248.svg')} alt="" />
        <img className="paper-action-circle" src={assetUrl('/assets/3db81.svg')} alt="" />
        <span className="paper-action-label">{link.label} ↗</span>
      </a>)}</div>}
      {project.id === 'novel' && <div className="detail-coming-soon"><img src={assetUrl('/assets/e8248.svg')} alt="" /><span>Coming soon on Steam</span></div>}
      <div className="project-copy">
        {project.status === 'ongoing' && <p className="project-status">Ongoing research · 2026–27</p>}
        {preview.description.length > 0 && <div className="project-description-group">{preview.description.map((text, i) => <p className="project-description" key={i}>{text}</p>)}</div>}
        <div className="contributions">{preview.contributions.map((item, i) => <div className="contribution" key={i}><img src={assetUrl('/assets/840f7.svg')} alt="" /><div><p>{item.label}</p><strong>{item.text}</strong></div></div>)}</div>
      </div>
      {project.category === 'quest' ? <DetailImageComposition project={chapter.presentation} /> : <ProjectPresentation project={chapter.presentation} />}
      <ProjectChapterNavigation index={index} total={chapters.length} onChange={change} />
    </article>
  </main>
}
