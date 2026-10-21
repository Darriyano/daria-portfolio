# Project galleries and pages

Implemented locally on `feature/project-pages`. No push or deployment is included.

## Preview

Run `npm run dev`, then open http://localhost:5173/#design-cases or http://localhost:5173/#side-quests. Each card links to its internal page. A direct example is http://localhost:5173/cases/bachelor-thesis/.

For a production-style preview with no SPA fallback:

```sh
npm run build
node scripts/project-pages-server.mjs dist / 4173
```

To test the production root-domain build:

```sh
DEPLOY_BASE_PATH=/ npm run build
node scripts/project-pages-server.mjs dist / 4174
```

Open http://localhost:4174/. Stop the server with Ctrl+C. Production uses https://darriyano.lol/ with the same `/` base. The custom domain remains configured in GitHub Pages settings; the workflow verifies it after deployment.

## Content and chapters

`src/data/projectCatalog.json` defines gallery order, routes, visible names, years, tags, preview assets, Figma node mappings, external links and chapter lists. It is shared with the Vite build plugin, so new project routes automatically produce static HTML entries. The VK Hackathon year is 2024, confirmed by the owner during implementation. Moloch uses `/quests/novel/`. Bachelor Thesis (2026–27) is ongoing; its copy does not claim completed research or publication.

`src/data/projectDetails.ts` composes approved detail presentations. Existing source copy and media from `designCases.ts` and `sideQuests.ts` are reused. Gallery previews are separate exports from the confirmed Figma image library; the two hackathon previews have separate source IDs. The gallery JPEGs are 1140×540 (three times the desktop image slot), quality 88; the paper frame remains SVG. Original detailed PNGs retain transparency and sharp UI artwork.

To add a chapter:

1. Add its stable `id`, label and Figma source ID to the project's catalog `chapters` array.
2. Add the approved presentation to `presentations[projectId][chapterId]` in `projectDetails.ts` using an existing composition or a new reusable composition primitive.
3. Navigation appears automatically for two or more chapters. It updates the `?chapter=` query, presentation content and source frame together. Endpoints are disabled; it never loops or changes projects. Single-chapter pages render neither arrows nor counter.

All 11 current projects have one confirmed chapter. Future research/process/results chapters have not been fabricated. External links exist only for DJU and the two PiterUX talks; Moloch's Steam notice is text, not an invented link.

## Routing and history

The build emits `cases/<slug>/index.html` and `quests/<slug>/index.html` for all catalog entries. They share the app bundle and have project-specific HTML titles. Pages can serve direct visits and refreshes as ordinary static files with HTTP 200. Directory URLs use a trailing slash; a static host redirects a slashless directory request to it. Unknown routes retain HTTP 404 and show the in-app not-found view. No redirect-based SPA fallback or hash routing is used.

The app resolves paths relative to Vite's `BASE_URL`. Internal semantic links use browser history without reloading; modified clicks retain normal browser behavior. Back/Forward restores the gallery scroll position and card focus. Explicit back-to-gallery links reuse the previous position during the current app session, and otherwise work using the section hash. The homepage stays mounted behind detail pages to preserve existing local interaction state. Detail code and media are loaded separately from the overview.

## Checks

Run `npm run lint` and `npm run build`. Browser checks require Playwright and an installed Chrome browser; they do not add a runtime dependency:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/project-pages-qa.mjs
PORTFOLIO_URL=http://localhost:4174/ PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/project-pages-qa.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/project-chapters-qa.mjs
```

For the root-domain migration check in Chromium and WebKit, serve the root build
on port 4177 with `node scripts/project-pages-server.mjs dist / 4177`, then run:

```sh
PORTFOLIO_URL=http://127.0.0.1:4177/ PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/root-domain-qa.mjs
```

This checks all 11 generated entries, direct visits, refreshes, directory
redirects, return links, all configured fonts, visible images, scripts and styles,
and the absence of the old `/daria-portfolio/` resource prefix. The workflow
checks the Pages custom-domain setting after deployment. GitHub Actions uses
the repository setting rather than a `CNAME` file; see
[GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

The main check defaults to http://127.0.0.1:4173/ and requires the static server above. It covers 11 direct routes and refreshes, slashless redirects, gallery order/counts, correct navigation highlights, client navigation, history, gallery restoration, external destinations, hidden single-chapter controls, loaded assets and 10 portrait/landscape viewports (320×740 through 1512×982, including 844×390 and 1280×600). It also checks the existing mobile menu, Experience hover notes and Contacts. The chapter check uses the Vite server on port 5173 and a dev-only fixture for keyboard controls, counts and bounded endpoints. Fixture content never enters the production catalog or bundle.

Legacy carousel scripts remain as references for the previous layout; their project-count/wrapping assertions no longer describe the new galleries. Public GitHub Pages responses can only be verified after an approved deployment; the local checks emulate static file serving at both bases.

## Existing local edits

The starting workspace already had uncommitted changes in App, Hero, Experience, notes, case copy and styles. Those changes were preserved. This task modifies App to add routing and galleries, exports the existing presentation primitive from ProjectCarousel, adds project-only styles/components/assets/data/test scripts, and adds static route generation to Vite. No changes are staged or committed. Do not commit all working-tree differences blindly: unrelated starting edits still belong to the owner.
