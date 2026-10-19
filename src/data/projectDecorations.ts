import { assetUrl } from '../utils/assetUrl'
// Presentation-only details verified in the DJU and PiterUX Figma frames.
// Keep these visible without fabricating links or changing project content.
export const projectDecorations: Record<string, { label: string; circle: string }> = {
  dju: { label: 'VIEW PROJECT AT STEAM', circle: assetUrl('/assets/4854c.svg') },
  piterux: { label: 'PREVIEW MEETUP VIDEO', circle: assetUrl('/assets/9e049.svg') },
}
