import { assetUrl } from '../utils/assetUrl'
import { useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useCompositionCentering } from '../hooks/useCompositionCentering'
import { contacts } from '../data/contacts'
export function ContactsSection() {
  const collage = useRef<HTMLDivElement>(null)
  const mobile = useMediaQuery('(max-width: 1023px)')
  useCompositionCentering(collage, mobile, '.contact-card,.contact-sticker')
  return <div className="contacts-content"><h2><picture><source media="(max-width:1023px)" srcSet={assetUrl("/assets/lettering-contacts-mobile.svg")} /><img src={assetUrl("/assets/lettering-contacts.svg")} alt="" /></picture><span className="sr-only">Best ways to reach me</span></h2><div className="contact-stage"><div className="contact-collage" ref={collage}>
    {contacts.map((contact) => <a key={contact.id} className={`contact-card ${contact.id}`} href={contact.url} target={contact.id === 'email' ? undefined : '_blank'} rel="noreferrer">
      <img className="contact-paper" src={contact.paper} alt="" /><div className="contact-text"><strong>{contact.title} <span>↗</span></strong><span>{contact.account}</span></div><img className="contact-sticker" src={contact.sticker} alt="" />
    </a>)}
  </div></div><footer><span>LET’S BE FRIENDS!</span><span>Made by Darriyano, 2026</span></footer></div>
}
