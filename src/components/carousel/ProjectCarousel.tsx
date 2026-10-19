import { assetUrl } from '../../utils/assetUrl'
import { useEffect, useRef, useState } from 'react'
import type { PortfolioProject, ProjectMedia } from '../../types/portfolio'
import { CarouselControls } from './CarouselControls'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { projectDecorations } from '../../data/projectDecorations'
import { getProjectPreview } from './projectPreview'

function externalProjectUrl(value: string | undefined) {
  try {
    const url = new URL(value ?? '')
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch { return undefined }
}

function Media({ media }: { media: ProjectMedia }) {
  return media.type === 'video' ? <video src={media.src} controls preload="metadata" aria-label={media.alt} /> : <img src={media.src} alt={media.alt} loading="lazy" />
}
function PhoneMockup({ media }: { media: ProjectMedia }) {
  return <div className="phone-hardware"><Media media={media} /><span className="dynamic-island" aria-hidden="true" /><span className="phone-speaker" aria-hidden="true" /></div>
}
function MediaGallery({ items }: { items: ProjectMedia[] }) {
  return <div className={`media-gallery ${items.length > 1 ? 'multiple-media' : ''}`} tabIndex={items.length > 1 ? 0 : undefined} aria-label={items.length > 1 ? 'Project media — scroll horizontally to browse' : undefined}>
    {items.map((item, index) => <figure key={`${item.src}-${index}`}><Media media={item} /></figure>)}
  </div>
}
function ProjectPresentation({ project }: { project: PortfolioProject }) {
  const { media } = getProjectPreview(project)
  const { presentationVariant: variant } = project
  if (variant === 'mobile-mockups' || variant === 'single-mobile-mockup') return <div className={`project-media phones ${variant}${project.phoneScreens ? ' composed-mockups' : ''}`}>
    {media[0] && <div className="phone phone-one">{project.phoneScreens ? <PhoneMockup media={media[0]} /> : <Media media={media[0]} />}</div>}
    {variant === 'mobile-mockups' && media[0] && <div className="phone phone-two">{project.phoneScreens ? <PhoneMockup media={media[1] ?? media[0]} /> : <Media media={media[1] ?? media[0]} />}</div>}
    {media.length > (variant === 'mobile-mockups' ? 2 : 1) && <div className="extra-media"><MediaGallery items={media.slice(variant === 'mobile-mockups' ? 2 : 1)} /></div>}
  </div>
  if (variant === 'desktop-mockup' && project.laptopScreen) return <div className="project-media laptop"><div className="laptop-composite"><img className="laptop-screen" src={project.laptopScreen} alt={`${project.title} interface`} loading="lazy" /><Media media={media[0]} /></div></div>
  if (variant === 'desktop-mockup') return <div className="project-media laptop"><MediaGallery items={media} /></div>
  return <div className={`project-media paper-showcase ${variant}`}>
    <img className="paper-back" src={project.paperArtwork ?? (variant === 'creative-showcase' ? assetUrl('/assets/37818.svg') : assetUrl('/assets/a4d31.svg'))} alt="" />
    <div className="paper-media">{media.length ? <MediaGallery items={media} /> : <div className="media-placeholder" aria-label="Project image not supplied" />}</div>
    <img className="showcase-sticker" src={variant === 'creative-showcase' ? assetUrl('/assets/63f31.svg') : assetUrl('/assets/ed5d2.svg')} alt="" />
  </div>
}
export function ProjectCarousel({ projects, variant }: { projects: PortfolioProject[]; variant: 'design' | 'side-quest' }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id)
  const article = useRef<HTMLElement>(null)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const touch = useRef<{ x: number; y: number } | null>(null)
  const index = Math.max(0, projects.findIndex((project) => project.id === selectedId))
  const project = projects[index]
  const decoration = project && (project.actionLabel ? { label: project.actionLabel, circle: project.actionCircle } : projectDecorations[project.id])
  const preview = project && getProjectPreview(project)
  const externalUrl = externalProjectUrl(preview?.link?.url)
  useEffect(() => {
    // Keep controls mounted so keyboard focus survives a project change.
    if (reduced || !article.current?.animate) return
    const animation = article.current.animate([{ opacity: 0, transform: 'translateX(24px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 400, easing: 'ease-out' })
    return () => animation.cancel()
  }, [article, project?.id, reduced])
  const change = (next: number) => {
    if (!projects.length) return
    setSelectedId(projects[((next % projects.length) + projects.length) % projects.length].id)
  }
  const Action = externalUrl ? 'a' : 'div'
  if (!project || !preview) return <p className="empty-projects">Projects will appear here.</p>
  return <div className={`project-carousel ${variant}`} tabIndex={0} role="region" aria-roledescription="carousel" aria-label={variant === 'design' ? 'Design cases' : 'Side quests'}
    onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); change(index + (event.key === 'ArrowRight' ? 1 : -1)) } }}
    onTouchStart={(event) => { touch.current = null; if ((event.target as HTMLElement).closest('button,a,video,.multiple-media')) return; touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
    onTouchEnd={(event) => { if (!touch.current) return; const dx = event.changedTouches[0].clientX - touch.current.x; const dy = event.changedTouches[0].clientY - touch.current.y; touch.current = null; if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) change(index + (dx < 0 ? 1 : -1)) }}>
    <article ref={article} data-source-node={project.sourceNodeId} data-slide-order={project.slideOrder} className={`project-content ${project.presentationVariant}`}>
      <h2 aria-label={project.title}>{project.titleArtwork ? <><img className="title-artwork" src={project.titleArtwork} alt="" /><span className="sr-only">{project.title}</span></> : <span className="project-title-text">{preview.title}</span>}</h2>
      <div className="project-copy">
        {preview.description.length > 0 && <div className="project-description-group">{preview.description.map((text, index) => <p className="project-description" key={index}>{text}</p>)}</div>}
        <div className="contributions">{preview.contributions.map((item, index) => <div className="contribution" key={index}>
          <img src={assetUrl("/assets/840f7.svg")} alt="" /><div><p>{item.label}</p><strong>{item.text}</strong></div>
        </div>)}</div>
      </div>
        {(externalUrl || decoration) && <Action className={`paper-action${!decoration?.circle ? ' without-circle' : ''}`} href={externalUrl} target={externalUrl ? '_blank' : undefined} rel={externalUrl ? 'noopener noreferrer' : undefined}>
          <img className="paper-action-background" src={assetUrl("/assets/e8248.svg")} alt="" />
          {decoration?.circle && <img className="paper-action-circle" src={decoration.circle} alt="" />}
          {externalUrl ? <span className="paper-action-label">{decoration?.label ?? preview.link?.label} ↗</span>
            : <span className="paper-action-label" role={decoration?.circle ? 'link' : undefined} aria-disabled={decoration?.circle ? true : undefined} title="Project URL has not been supplied">{decoration?.label}{decoration?.circle ? ' ↗' : ''}</span>}
        </Action>}
      <CarouselControls index={index} total={projects.length} onChange={change} />
      <ProjectPresentation project={project} />
    </article>
  </div>
}
