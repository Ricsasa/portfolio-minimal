# Portfolio - Ricardo Sanchez Saldivar

Personal portfolio built with [Astro](https://astro.build). It is a static, bilingual
(Spanish / English) one-page site that presents a professional summary, selected work,
professional experience, skills, and education.

Production site: https://ricsasa.work

## Highlights

- Static output, no runtime server required.
- Bilingual content (`es-MX` default, `en-US`) driven entirely by JSON files under `public/locales/`.
- One-page layout composed from five independent, individually routable sections.
- Scroll-spy navigation that highlights the current section and swaps the header accent color.
- GSAP scroll reveal animations, disabled automatically when `prefers-reduced-motion` is set.
- Self-contained image carousel with scroll snapping, keyboard controls, and a full-size dialog.
- Google fonts served through Astro's built-in font pipeline (self-hosted, preloaded).

## Requirements

- Node.js `>= 22.12.0`
- npm

## Getting started

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Commands

All commands are run from the root of the project.

| Command           | Action                                            |
| :---------------- | :------------------------------------------------ |
| `npm install`     | Install dependencies                              |
| `npm run dev`     | Start the local dev server at `localhost:4321`    |
| `npm run build`   | Build the production site to `./dist/`            |
| `npm run preview` | Preview the production build locally              |
| `npm run astro`   | Run Astro CLI commands (`astro add`, `astro check`) |

## Tech stack

| Area          | Choice                                                      |
| :------------ | :---------------------------------------------------------- |
| Framework     | Astro 7 (static output)                                     |
| UI islands    | React 19 via `@astrojs/react`                               |
| Styling       | Tailwind CSS 4 (Vite plugin) + daisyUI                      |
| Icons         | `@heroicons/react`, Iconify Tabler via `@iconify/tailwind4` |
| Animation     | GSAP + ScrollTrigger                                        |
| i18n          | `astro-react-i18next` (i18next)                             |
| Extras        | `@astrojs/sitemap`, `@astrojs/partytown`                    |

## Project structure

```text
/
├── public/
│   ├── locales/                 All translated content (see "Content")
│   │   ├── en-US/
│   │   └── es-MX/
│   ├── projects/                Project screenshots (AVIF)
│   ├── resume/                  Downloadable CV (PDF)
│   └── favicon.svg | favicon.ico
├── src/
│   ├── assets/                  Images processed by Astro (profile photo)
│   ├── components/              Astro components (header, menu, sections, carousel, ...)
│   ├── config/sections.ts       Section registry: ids, labels, colors
│   ├── layouts/Layout.astro     Document shell, fonts, header/footer, client scripts
│   ├── pages/[...locale]/       Localized routes, one file per section
│   ├── scripts/                 Client-side behavior (animations, scroll spy, mobile menu)
│   ├── styles/global.css        Tailwind entry point and design tokens
│   └── utils/markdown.ts        Minimal Markdown renderer for locale strings
├── astro.config.mjs
└── package.json
```

## Architecture

### Routing and composition

Every page lives under `src/pages/[...locale]/` and exports `getStaticPaths()` from
`buildStaticPaths()`, so each route is generated once per locale. The default locale
(`es-MX`) is served unprefixed; `en-US` is served under `/en-US/`.

`index.astro` imports the five section pages and renders them in order, producing the
single-page experience. Each section also remains reachable as its own route
(`/skills`, `/selected-work`, and so on), which keeps the sections independent and
individually testable.

### Section registry

`src/config/sections.ts` is the single source of truth for navigable sections. Each entry
declares its anchor id, i18n label key, band background, and accent color:

```ts
{
  id: "selected-work",
  labelKey: "common:pages.selected_work",
  bgColor: "bg-custom-green-100",
  accentColor: "custom-green-300",
}
```

`menu.astro` builds the navigation from this list, and `section.astro` looks up its own
config by id, so adding a section to the menu is a matter of adding one entry plus the
matching page.

### Client scripts

Loaded once from `Layout.astro`:

- `scripts/cardAnimation.ts` - GSAP reveal for elements marked `.gsap-reveal-card`.
  When `prefers-reduced-motion: reduce` is set, elements are shown immediately without animation.
- `scripts/menuScrollSpy.ts` - tracks `[data-section]` bands, marks the matching menu link
  active, writes the section accent into the `--header-accent` custom property, and updates
  the URL hash with `history.replaceState` so scrolling never pollutes browser history.
- `scripts/mobileMenu.ts` - mobile-only disclosure for the header panel, closing on link
  click, `Escape`, or an outside click. At `md` and above the panel is always visible via CSS.

### Styling

Tailwind 4 is configured in CSS, not JavaScript. `src/styles/global.css` defines the
design tokens inside `@theme`: the custom palette (`custom-yellow`, `custom-green`,
`custom-blue`, `custom-purple`, `custom-coral`, each with `100`/`300` steps), the text
colors, and extra container widths. Font family variables map to the fonts declared in
`astro.config.mjs`.

Accent classes are composed at runtime from section config, so Tailwind's scanner cannot
find them. They are declared explicitly with `@source inline(...)` in the same file. If a
new color family is added to the palette, extend those two `@source inline` patterns as well.

The site is light-only: `color-scheme: light` is forced in `:root`.

Note: `tailwind.config.mjs` is a leftover from a Tailwind 3 setup. It is not referenced by
the build (no `@config` directive is present, and `@material-tailwind/react` is not a
dependency), and can be removed.

## Content

No copy is hardcoded in components. Content is authored per locale in
`public/locales/<locale>/`, across three i18next namespaces:

| File                            | Contents                                                                    |
| :------------------------------ | :-------------------------------------------------------------------------- |
| `common.json`                   | Menu and page labels, section headings, education items, languages, footer  |
| `projects.json`                 | Selected work entries                                                       |
| `professional-experiences.json` | Work history, keyed by employer (`sabbatical`, `salesloft`, `tiempo`, `epam`) |

Locales and namespaces are registered in `astro.config.mjs` under the `reactI18next`
integration. Both locale directories must stay structurally in sync.

### Adding a project

Append an entry to the `projects` array in **both** `en-US/projects.json` and
`es-MX/projects.json`:

```json
{
  "title": "Project name",
  "brief_description": "One-line summary.",
  "full_description": "Markdown supported. See below.",
  "category": "Informational site",
  "year": "2026",
  "href": "https://example.com",
  "cta": "Visit site",
  "technologies": ["Astro", "React", "Tailwind"],
  "screenshots": ["/projects/my-project/1.avif"]
}
```

`href`, `cta`, `full_description`, `technologies`, and `screenshots` are optional.
Screenshot paths are relative to `public/`; images may have different aspect ratios, since
the carousel centers each one inside a fixed-height stage.

### Adding a work experience

Add a new top-level key to both `professional-experiences.json` files, then add that key to
the list in `src/pages/[...locale]/professional-experience.astro`. Order in that array
determines display order.

### Markdown in translations

i18next returns plain strings, so rich copy (currently project descriptions) is authored as
Markdown inside the JSON and rendered by `src/utils/markdown.ts`. The renderer intentionally
supports only the subset in use: headings (`#` to `###`), paragraphs, unordered and ordered
lists, and the inline marks `**bold**`, `_italic_`, `` `code` ``, and `[text](url)`. HTML in
the source is escaped; links open in a new tab. Anything outside that subset renders literally.

### Adding a language

1. Add the locale code to `locales` in `astro.config.mjs`.
2. Create `public/locales/<locale>/` with all three namespace files.
3. Add the short label for the switcher in `localeLabels` in `src/components/lang-selector.astro`.

## Deployment

`npm run build` emits a fully static site to `./dist/`, deployable to any static host.
`site` in `astro.config.mjs` is set to `https://ricsasa.work` and drives sitemap
generation; change it when deploying elsewhere.
