import { scrapbookAsset } from '../../data/scrapbook'

export function PaperSticker({ kind, className = '' }: { kind: 'heart' | 'star' | 'flower'; className?: string }) {
  return <span className={`paper-sticker sticker-${kind} ${className}`} aria-hidden="true"><img src={scrapbookAsset(kind === 'flower' ? 'flower.webp' : 'heart-star.webp')} alt="" /></span>
}
