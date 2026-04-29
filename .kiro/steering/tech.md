# Tech Stack & Build System

## Project

"The Uncommon Engineer" (uncommonengineer.com) — a Docusaurus v3 digital garden with technical docs, essays, a changelog, and a newsletter. Dark mode only. Content is experiential documentation — show the journey, not just the answer. Changelog is a first-class feature; update it for any significant change. AI-assisted content must include the `🤖 AI Collaboration` admonition.

## Core Framework

- **Docusaurus v3** (`@docusaurus/core ^3.9.2`) — static site generator
- **React 18** — custom pages and components
- **MDX** — markdown with JSX support for docs and blog
- **Mermaid** — diagram rendering via `@docusaurus/theme-mermaid`

## Key Dependencies

- `@docusaurus/preset-classic` — docs, blog, pages, theme
- `@fortawesome/react-fontawesome` + icon packages — Font Awesome icons
- `prism-react-renderer` — code syntax highlighting (theme: `nightOwl`)
- `clsx` — conditional CSS class utility
- `@mdx-js/react` — MDX rendering

## Integrations

- **Algolia** — site search (appId: `9UFF3RBJQ9`)
- **Google Analytics** — via `@docusaurus/plugin-google-gtag` (tracking ID: `G-DMRNTVGLRC`, anonymizeIP enabled)
- **Beehiiv** — newsletter embed script
- **Metricool** — analytics tracking via static JS

## Custom Plugins

- `plugins/content-counts.js` — counts blog/docs markdown files, exposes latest blog post data via `setGlobalData`
- `plugins/docs-rss-feed.js` — RSS feed generation for docs

## Hosting

- GitHub Pages with custom domain (`www.uncommonengineer.com`)
- Deployed via `docusaurus deploy`

## Commands

All commands run from the `website/` directory:

```bash
npm run start     # Dev server with hot reload
npm run build     # Production build — run to verify before committing
npm run serve     # Serve production build locally
npm run deploy    # Deploy to GitHub Pages
npm run clear     # Clear Docusaurus cache
```

## Important Notes

- No test suite or linter is configured.
- `onBrokenLinks` and `onBrokenMarkdownLinks` are set to `'warn'` — builds won't fail on broken links, but warnings should be fixed.
- Prism additional languages: Ruby, HCL, Docker, YAML.
- Dark mode is forced (`disableSwitch: true`, `respectPrefersColorScheme: false`).
