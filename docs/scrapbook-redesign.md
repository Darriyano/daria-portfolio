# Scrapbook redesign

Visual source: [desktop portfolio](https://www.figma.com/design/kq0VeiA59FR7GkRbM5R2lg/My-Portfolio?node-id=160-3224).
Textual source: the existing project catalog, chapter presentations, hero and contact data. These source files have not been rewritten. The five cases and five quests, route slugs and order are retained.

## Gallery asset mapping

The supplied direct link resolves to the section named **brief cases**, not `ASSETS / GALLERY THUMBNAILS`. All ten prepared 2280×1080 images were accessible. Local thumbnails are 1140×540 WebP, sufficient for approximately three device pixels per CSS pixel in a desktop card. Transparent paper and sticker assets retain their alpha channels.

| Project ID | Prepared Figma node | Local file in public/assets/scrapbook |
| --- | --- | --- |
| allforms | 424:21041 | allforms-thumbnail.webp |
| minigarden | 424:21038 | minigarden-thumbnail.webp |
| matematch | 424:21039 | matematch-thumbnail.webp |
| vita | 424:21040 | vita-thumbnail.webp |
| vk-hackathon | 424:21042 | vk-hackathon-thumbnail.webp |
| piterux-2026 | 424:21048 | piterux-2026-thumbnail.webp |
| dju | 424:21044 | dju-thumbnail.webp |
| novel | 424:21046 | moloch-thumbnail.webp |
| piterux-2025 | 424:21047 | piterux-2025-thumbnail.webp |
| hackathon | 424:21045 | hackathons-thumbnail.webp |

## Introduction photos

Each photo is a separate asset, rather than a screenshot of a screen. Exported prints preserve the authored crop, mount, tape, sticker, rotation and proportions. Project copy remains selectable HTML alongside the collage.

| Visual project | Photo A node | Photo B node | Local prefix |
| --- | --- | --- | --- |
| AllForms | 397:3451 | 397:3458 | allforms |
| MiniGarden | 414:16520 | 414:16529 | minigarden |
| MateMatch | 414:16495 | 398:3492 | matematch |
| Vita | 414:16588 | 414:16597 | vita |
| VK Hackathon | 414:16543 | 414:16551 | vk-hackathon |
| PiterUX 2026 | 402:3778 | 402:3784 | piterux-2026 |
| DJU | 402:3804 | 402:3808 | dju |
| Hackathons | 402:3830 | 402:3836 | hackathons |
| PiterUX 2025 | 402:3847 | 402:3851 | piterux-2025 |
| Moloch | 402:3874 | 402:3880 | moloch |

The MiniGarden and MateMatch photo-layer names in Figma are interchanged; the mapping follows the actual visible project screens and source pixels, not those stale names. The user explicitly approved using the current AllForms/Vita TODO photos B and the MateMatch REVIEW photo B on 2026-11-08.

Figma's download tool returned background-flattened exports for the three TODO/REVIEW photos B (AllForms, Vita and MateMatch). Those prints are therefore assembled from the actual Figma source images, paper texture and tape using the structured crop coordinates. The opaque exports are not shipped. No generated substitutes or polygon approximations are used.

Tags and the complete existing copy add height compared with the shorter experimental Figma copy; pages intentionally scroll instead of clipping content.

## Materials and components

- Hero: nodes 375:1279 / 375:1282; original transparent cutout portrait, graph-paper mount, raspberry cutout backing, cropped heart/star source and stitched paper CTA.
- Gallery: original graph, folded, notched and torn paper textures from the two gallery design contexts; original tape SVG. Shared presentation mapping lives in `src/data/scrapbook.ts`.
- Contacts: existing paper shapes and account/link data, with the original raster paper heart/star and flower source replacing the prior illustrations.
- Experience: only the heading's paper material and rotation change. Constellation source, coordinates, hooks, labels and event handlers are untouched.
- Existing outlined lettering remains for SIGN, Experience and Contacts. Dynamic titles use the existing `--chalk` font stack, including its existing system-font fallback when Chalkduster is unavailable; no licensed webfont was supplied.
- CV was already unavailable (`cvUrl` is undefined); the redesign does not invent a PDF or link.

## Validation

Run `npm run build` and `npm run lint`. `scripts/scrapbook-qa.mjs` checks all sections and ten routes at 320, 390, 768, 1024 and 1512 px, image availability, exact catalog labels/tags, overflow, action bounds, mobile navigation, Experience click/Escape/outside dismissal, and return scroll/focus. It saves screenshots to `/tmp/scrapbook-qa` by default.

The existing `scripts/project-pages-qa.mjs` verifies the built static directory routes, reloads and browser history. Use `scripts/project-pages-server.mjs` to serve `dist` without a SPA fallback. Set `PLAYWRIGHT_MODULE` if Playwright is installed outside the repository.

Deployment settings, domain, Vite routing entries and GitHub Pages workflow are unchanged. This task prepares local changes; it does not publish them.

## Detail layout correction

The contextual back control begins 40px from the desktop top (24px on mobile), followed by a 28–40px gap. Independent summary and collage columns prevent intrinsic photo height from stretching title rows. The layered title has a bounded width and the original paper aspect ratio; the existing transparent torn-paper texture follows the Figma title proportions above a contained pink backing. Desktop columns retain their project-specific order with 80–112px between them. Gallery captions show project names without years; detail metadata retains its dates.
