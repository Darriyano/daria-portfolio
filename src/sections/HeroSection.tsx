import { assetUrl } from '../utils/assetUrl'
import { HeroSelectionAnimation } from '../components/decorations/HeroSelectionAnimation'
import { sectionIds } from '../data/navigation'
export function HeroSection({ active, navigate }: { active: boolean; navigate: (index: number) => void }) {
  return <div className="hero-layout">
    <div className="hero-copy">
      <p className="intro-name">I AM DARIA STEPANOVA</p>
      <h1 className="hero-title"><span className="product" aria-hidden="true">PRODUCT</span><span className="designer" aria-hidden="true"><span>DE</span><span className="sign"><img src={assetUrl("/assets/lettering-sign.svg")} alt="" /></span><span className="er">ER</span></span><span className="sr-only">Product designer</span><HeroSelectionAnimation active={active} /></h1>
      <p className="hero-description">... and gamedev artist<br />Computer Science & AI background<br /> From frontend to design, research<br className="desktop-break" /> and game development</p>
      <div className="hero-actions"><a className="primary-button" href={`#${sectionIds[2]}`} onClick={(event) => { event.preventDefault(); navigate(2) }}>VIEW CASES</a><a href={`#${sectionIds[4]}`} onClick={(event) => { event.preventDefault(); navigate(4) }}>MESSAGE ME</a></div>
    </div>
    <div className="portrait-composition"><picture><source media="(max-width:1023px)" srcSet={assetUrl("/assets/portrait-mobile.svg")} /><img className="portrait" src={assetUrl("/assets/portrait-desktop.svg")} alt="Daria Stepanova, product designer and gamedev artist" fetchPriority="high" /></picture><img className="portrait-star" src={assetUrl("/assets/ed5d2.svg")} alt="" /><img className="portrait-heart" src={assetUrl("/assets/63f31.svg")} alt="" /></div>
  </div>
}
