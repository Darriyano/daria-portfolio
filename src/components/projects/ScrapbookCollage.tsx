import { scrapbookAsset } from '../../data/scrapbook'
import { PaperSticker } from '../decorations/PaperSticker'

export function ScrapbookCollage({ name, title }: { name: string; title: string }) {
  return <div className="scrapbook-collage" data-project={name} aria-label={`${title} project images`}>
    <img className="scrapbook-photo photo-a" src={scrapbookAsset(name === 'matematch' ? 'matematch-a-current.png' : `${name}-a.webp`)} alt={`${title} — project photograph A`} loading="eager" decoding="async" />
    {['allforms', 'vita', 'matematch'].includes(name) ? <figure className={`scrapbook-photo photo-b assembled-photo ${name}`}>
      <img className="photo-mount" src={scrapbookAsset('photo-paper.webp')} alt="" aria-hidden="true" />
      <div className="photo-viewport">{name === 'allforms' ? <><img className="mobile-example example-a" src={scrapbookAsset('allforms-mobile-a.webp')} alt="AllForms mobile poll example" loading="lazy" /><img className="mobile-example example-b" src={scrapbookAsset('allforms-mobile-b.webp')} alt="AllForms mobile question example" loading="lazy" /></> : name === 'matematch' ? <img className="matematch-mobile-example" src={scrapbookAsset('matematch-mobile-b-current.png')} alt="MateMatch profile and matching screens" loading="lazy" /> : <img className="vita-mobile-example" src={scrapbookAsset('vita-mobile-b.webp')} alt="Vita mobile tracking interface" loading="lazy" />}</div>
      <figcaption>{name === 'allforms' ? 'Mobile examples' : name === 'matematch' ? 'Mockups' : 'One more example'}</figcaption><span className="photo-tape" aria-hidden="true" />
    </figure> : <img className="scrapbook-photo photo-b" src={scrapbookAsset(`${name}-b.webp`)} alt={`${title} — project photograph B`} loading="lazy" decoding="async" />}
    {/* MateMatch has only the upper flower in its current Figma composition. */}
    {name !== 'matematch' && <PaperSticker kind={name === 'dju' ? 'heart' : ['vk-hackathon', 'piterux-2025'].includes(name) ? 'flower' : 'star'} className="collage-sticker" />}
    {/* VK Photo A already contains a star here; keep that export intact. */}
    {['matematch', 'piterux-2025'].includes(name) && <PaperSticker kind="flower" className="collage-top-sticker" />}
  </div>
}
