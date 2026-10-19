import { assetUrl } from '../../utils/assetUrl'
import { useEffect, useRef, useState } from 'react'
import { contacts, cvUrl } from '../../data/contacts'
import { sectionIds } from '../../data/navigation'
const labels = ['MAIN', 'EXPERIENCE', 'DESIGN CASES', 'SIDE QUESTS', 'CONTACTS']
export function Navigation({ active, navigate }: { active: number; navigate: (index: number) => void }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null), menu = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    menu.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() } }
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) setOpen(false) }
    window.addEventListener('keydown', close); window.addEventListener('pointerdown', outside)
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('pointerdown', outside) }
  }, [open])
  return <header className="site-header">
    <div className="social-links"><img src={assetUrl("/assets/627a4.svg")} alt="" />{[contacts[0], contacts[2], contacts[1]].map((contact) => <a key={contact.id} aria-label={contact.title} href={contact.url} target="_blank" rel="noreferrer" />)}</div>
    <button className="menu-toggle" ref={toggle} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? '×' : <img src={assetUrl("/assets/278c2.svg")} alt="" />}</button>
    <nav id="main-navigation" ref={menu} className={open ? 'is-open' : ''} aria-label="Main navigation">
      {sectionIds.map((id, index) => <button key={id} aria-current={active === index ? 'location' : undefined} onClick={() => { navigate(index); setOpen(false); if (open) toggle.current?.focus() }}>{labels[index]}</button>)}
      {cvUrl ? <a className="cv-link" href={cvUrl} download><img src={assetUrl("/assets/d527f.svg")} alt="" />CV</a> : <span className="cv-link unavailable" title="CV file has not been supplied"><img src={assetUrl("/assets/d527f.svg")} alt="" />CV</span>}
    </nav>
  </header>
}
