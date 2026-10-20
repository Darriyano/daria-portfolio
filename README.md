# Daria Stepanova — Portfolio

React + TypeScript + Vite, with plain CSS and no additional runtime dependencies.

Run `npm install` and `npm run dev` for local development. `npm run build` runs strict TypeScript checks and creates `dist/`; `npm run lint` checks source code.

## Project galleries and dedicated URLs

The current gallery, project metadata, chapter configuration, static routing, local previews and checks are documented in [docs/project-pages.md](docs/project-pages.md). Its instructions supersede the legacy carousel editing and verification notes below.

## Editing portfolio content

1. Add a Design Case to `src/data/designCases.ts` or a Side Quest to `src/data/sideQuests.ts`. Each entry needs a unique `id`, `title`, `category`, `contributions`, `media`, and `presentationVariant`.
2. Put images/videos in `public/assets/` and reference them as `/assets/filename.ext`. Use `type: 'image'` or `type: 'video'`, with descriptive `alt` text. Multiple media items can be browsed horizontally. Empty media and descriptions are supported.
3. Set `externalLink: { label: 'View project', url: 'https://…' }` when a real URL is available. Omit the field to hide the link.
4. Reorder objects in the array to reorder slides. Counters and navigation derive from the array length; no React changes are needed. A single entry disables both arrows, and an empty array displays an empty state.
5. Choose `mobile-mockups` (two phones), `single-mobile-mockup`, `desktop-mockup`, `game-showcase` (wide paper preview), or `creative-showcase` (portrait paper preview). The same data powers desktop and mobile compositions. The phone variants support existing exported mockups; use `phoneScreens: true` for screen artwork composed with the reusable hardware.
6. Edit contact details in `src/data/contacts.ts`; set `cvUrl` there when a PDF is available. Edit milestones and their verified notes in `src/data/experience.ts`.

`titleArtwork` optionally supplies outlined Figma lettering. Omit it for new titles rendered as text. Existing headings retain the actual Chalkduster outlines across platforms; dynamic counters/new titles use locally installed Chalkduster with a fallback. For exact typography on all devices, add a licensed Chalkduster webfont and update `--chalk` in `src/index.css`. The open-source Rethink Sans, Archivo Black, and IBM Plex Mono fonts are hosted locally.

## Navigation and motion

The five main sections are Introduction, Experience, Design Cases, Side Quests, and Contacts. At desktop sizes, wheel gestures advance one section at a time, with native scrolling retained for oversized content. ArrowUp/Down, PageUp/Down, Home, and End work when focus is outside interactive controls. Smaller screens scroll naturally. The fixed top bar tracks main sections only.

Each carousel keeps its own selection when navigating away. Buttons, Left/Right keys on the focused carousel, and horizontal swipes wrap continuously between the first and last slides. There is no autoplay. Single-slide carousels disable both arrows. Media galleries have their own native horizontal scroll.

The desktop constellation follows measured SVG path length once per page visit. The mobile path reveals according to scroll visibility and retains completed segments. Milestone buttons open notes; Escape, the close button, or a pointer/touch outside dismisses them. Inside interactions keep the note open, and selecting another star switches notes. The hero selection repeats on a nine-second cycle and pauses outside the active hero section. Reduced motion shows completed decorative states immediately.

Milestone notes hug their content, are anchored near the selected star, and reposition on resize or scroll. Desktop constellation and carousel layouts account for available viewport height. Below 600px window height, Experience retains enough vertical space for readable labels and uses natural scrolling. DJU and the two PiterUX paper CTAs are full-area external anchors with separate verified destinations, opened with `noopener noreferrer`. Side Quests use an increased header gap; the portrait composition uses more of the right column and extends alongside the controls. Landscape previews retain their prior dimensions. Project descriptions render in full.

## Figma mapping and content gaps

Current Figma file: `kq0VeiA59FR7GkRbM5R2lg`. Desktop section `160:3224` supplies content; mobile `160:4343` and tablet `233:12979` supply layout patterns only. Every viewport uses the same typed slide arrays.

| Order | Current desktop content | Source node |
| --- | --- | --- |
| 03.1 | AllForms (2026) | 160:2746 |
| 03.2 | MiniGarden (2025) | 160:2554 |
| 03.3 | VK HACKATHON (2025) | 224:921 |
| 03.4 | MateMatch (2024) | 224:813 |
| 03.5 | Vita (2024) | 224:985 |
| 04.1 | PiterUX Speaker 2026 | 221:636 |
| 04.2 | PiterUX Speaker 2025 | 160:2999 |
| 04.3 | DJU | 160:2926 |
| 04.4 | Moloch | 221:677 |

Frame numbers define order even where legacy frame names still say GARDENER or DJU. `id` identifies the slide; `projectId` identifies its project. `sourceNodeId` and `slideOrder` preserve provenance. `presentationVariant` and `responsivePresentation` document shared media compositions. Phone screens use current Figma artwork in the reusable hardware mockup; laptops compose current screen artwork with the existing laptop asset.

The nine milestone headings and descriptions are transcribed verbatim from `233:13455`; the additional Future note comes from its adjacent desktop frame `236:745`. Four standalone white star buttons open the secondary notes. They add no connections to the original animated pink path.

The user supplied verified destinations for both PiterUX announcement years and DJU’s Steam action; these are stored in each slide’s `previewLink`. Moloch retains “COMING SOON ON STEAM”. The CV file is still unavailable. Contacts and their working links are preserved.

This workspace was not a Git repository when synchronization started. A source/assets checkpoint was saved at `/tmp/daria-portfolio-before-figma-sync-20261019.tar.gz` (excluding generated output and dependencies). Initialize Git and commit the reviewed source to keep a durable checkpoint.

## Browser verification

`scripts/browser-qa.mjs` uses Playwright with an installed Chrome browser. Install Playwright in a temporary folder or as a development tool, then run it while Vite is serving:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/browser-qa.mjs
```

Set `PORTFOLIO_URL` if using a different preview address. Checks cover the eight specification widths (320, 375, 390, 430, 768, 1024, 1440, and 1512), loaded assets, page overflow, section progress, wheel/keyboard navigation, independent carousel state, mobile menu, constellation persistence, reduced motion, and runtime errors. Screenshot comparisons still require a visual review.

`scripts/visual-refinement-qa.mjs` additionally checks 1280×720, 1440×900, 1512×982, 1920×1080, and reduced desktop heights. It verifies visible controls, contained laptop media, milestone card positioning and resize behavior, preserved paper decorations, and Contacts heading bounds. Run it with the same `PLAYWRIGHT_MODULE` environment variable while the local Vite server is serving.

The downloaded source assets are retained in `public/assets/`. `scripts/figma-assets.json` records their original source nodes. To refresh assets, obtain fresh Figma export URLs, write a temporary JSON array of `{ file, url }` objects, then pass its path to `scripts/download-figma-assets.mjs`. Temporary export URLs are not kept in the project and are never referenced at runtime.

`scripts/design-sync-qa.mjs` checks all nine slides at 390×844, 768×1024, 900×1000, 1024×768, 1280×720, 1512×982 and 1920×1080. It verifies Figma order, counts, decoded assets, control geometry, standalone white stars, and viewport containment of all milestone notes. Screenshots are written to `/tmp/portfolio-sync-qa/`. Run with the same `PLAYWRIGHT_MODULE` variable.

`scripts/targeted-fixes-qa.mjs` checks circular controls, keyboard and swipe wrapping, independent state, header spacing, year-specific links, full CTA hit areas, and note dismissal/switching at the six requested viewports. It also compares portrait growth and unchanged landscape dimensions when pre-change geometry is available at `PORTFOLIO_LAYOUT_BASELINE` (default `/tmp/portfolio-layout-before.json`). Screenshots are saved to `/tmp/portfolio-targeted-qa/`.

## Original Vite template reference

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` builds with Node.js 24 and
`npm ci`, checks lint and TypeScript, and deploys `dist` on pushes to `main`.
In repository Settings → Pages, select **GitHub Actions** as the source.

Temporary URL: https://darriyano.github.io/daria-portfolio/

The workflow sets `DEPLOY_BASE_PATH=/daria-portfolio/`. Public asset strings
use `assetUrl()`; Vite rewrites CSS and HTML asset references. Development
continues to use `/`. To preview a project-path build locally:

```sh
DEPLOY_BASE_PATH=/daria-portfolio/ npm run build
DEPLOY_BASE_PATH=/daria-portfolio/ npm run preview
```

No custom domain is configured. After purchasing and verifying ownership of
darriyano.xyz, change the workflow's `DEPLOY_BASE_PATH` to `/`, configure the
domain in GitHub Pages settings, add the verified DNS records at the registrar,
and enable HTTPS when GitHub makes it available.

To publish later updates once origin is connected:

```sh
git add .
git diff --cached
git commit -m "Describe your update"
git push origin main
```
