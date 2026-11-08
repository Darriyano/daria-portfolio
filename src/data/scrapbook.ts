import { assetUrl } from '../utils/assetUrl'

export const scrapbookAsset = (name: string) => assetUrl(`/assets/scrapbook/${name}`)

// Presentation assets only. Project copy, metadata and destinations live in the catalog.
export const scrapbookProjects: Record<string, { image: string; paper: string; node: string; photos: string; reverse?: boolean }> = {
  allforms: { image: 'allforms', paper: 'graph', node: '424:21041', photos: 'allforms' },
  minigarden: { image: 'minigarden', paper: 'folded', node: '424:21038', photos: 'minigarden' },
  matematch: { image: 'matematch', paper: 'notched', node: '424:21039', photos: 'matematch', reverse: true },
  vita: { image: 'vita', paper: 'torn', node: '424:21040', photos: 'vita' },
  'vk-hackathon': { image: 'vk-hackathon', paper: 'torn', node: '424:21042', photos: 'vk-hackathon', reverse: true },
  'piterux-2026': { image: 'piterux-2026', paper: 'torn', node: '424:21048', photos: 'piterux-2026' },
  dju: { image: 'dju', paper: 'folded', node: '424:21044', photos: 'dju' },
  novel: { image: 'moloch', paper: 'notched', node: '424:21046', photos: 'moloch', reverse: true },
  'piterux-2025': { image: 'piterux-2025', paper: 'graph', node: '424:21047', photos: 'piterux-2025', reverse: true },
  hackathon: { image: 'hackathons', paper: 'torn', node: '424:21045', photos: 'hackathons' },
}
