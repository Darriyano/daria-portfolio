import { assetUrl } from '../utils/assetUrl'
import type { Contact } from '../types/portfolio'
// Accounts transcribed from the desktop contact frame.
export const contacts: Contact[] = [
  { id: 'telegram', title: 'TELEGRAM', account: '@DARRIYANO', url: 'https://t.me/darriyano', paper: assetUrl('/assets/8c03a.svg'), sticker: assetUrl('/assets/63f31.svg') },
  { id: 'email', title: 'EMAIL', account: 'DARRI.KEKA@GMAIL.COM', url: 'mailto:darri.keka@gmail.com', paper: assetUrl('/assets/13c44.svg'), sticker: assetUrl('/assets/ed5d2.svg') },
  { id: 'instagram', title: 'INSTA', account: '@DARRIYANO_KEK', url: 'https://www.instagram.com/darriyano_kek/', paper: assetUrl('/assets/dc219.svg'), sticker: assetUrl('/assets/998ed.svg') },
]
export const cvUrl: string | undefined = undefined // Set a local PDF path when available.
