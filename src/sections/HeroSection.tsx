import { assetUrl } from '../utils/assetUrl'
import { HeroSelectionAnimation } from '../components/decorations/HeroSelectionAnimation'
import { sectionIds } from '../data/navigation'
import { scrapbookAsset } from '../data/scrapbook'
import { PaperSticker } from '../components/decorations/PaperSticker'
export function HeroSection({ active, navigate }: { active: boolean; navigate: (index: number) => void }) {
  return <div className="hero-layout">
    <div className="hero-copy">
      <p className="intro-name">I AM DARIA STEPANOVA</p>
      <h1 className="hero-title"><span className="product" aria-hidden="true">PRODUCT</span><span className="designer" aria-hidden="true"><span>DE</span><span className="sign"><img src={assetUrl("/assets/lettering-sign.svg")} alt="" /></span><span className="er">ER</span></span><span className="sr-only">Product designer</span><HeroSelectionAnimation active={active} /></h1>
      <p className="hero-description">... and gamedev artist<br />Computer Science & AI background<br /> From frontend to design, research<br className="desktop-break" /> and game development</p>
      <div className="hero-actions"><a className="primary-button" href={`#${sectionIds[2]}`} onClick={(event) => { event.preventDefault(); navigate(2) }}>VIEW CASES</a><a href={`#${sectionIds[4]}`} onClick={(event) => { event.preventDefault(); navigate(4) }}>MESSAGE ME</a></div>
    </div>
    <div className="portrait-composition" data-source-node="375:1279">
      <img className="portrait-paper" src={scrapbookAsset('portrait-paper.webp')} alt="" aria-hidden="true" />
      <div className="portrait-color"><img src={scrapbookAsset('portrait-backing.svg')} alt="" aria-hidden="true" /></div>
      <div className="portrait-crop"><img className="portrait" src={scrapbookAsset('portrait.webp')} alt="Daria Stepanova, product designer and gamedev artist" width={850} height={1280} fetchPriority="high" /></div>
      <PaperSticker kind="star" className="portrait-star" /><PaperSticker kind="heart" className="portrait-heart" />
    </div>
  </div>
}
