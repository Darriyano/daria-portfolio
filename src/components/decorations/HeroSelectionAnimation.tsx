import { assetUrl } from '../../utils/assetUrl'
export function HeroSelectionAnimation({ active }: { active: boolean }) {
  return <div className={`selection-overlay ${active ? 'is-playing' : ''}`} aria-hidden="true">
    <div className="selection-frame">{Array.from({ length: 8 }, (_, index) => <i key={index} className={`handle handle-${index}`} />)}</div>
    <img className="selection-cursor" src={assetUrl("/assets/e7070.svg")} alt="" />
  </div>
}
