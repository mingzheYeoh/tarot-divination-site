# App Scaffold — Design Spec

Date: 2026-07-19
Status: Approved (pending user review of this doc)

## Context

The project now has full design coverage (17 Stitch-exported screens under
`design/stitch-exports/`, each a static HTML+Tailwind mockup, plus `design/DESIGN.md`
with design tokens) and a complete Major Arcana content dataset
(`content/cards-major.json` + `content/cards-major.zh.json`). No application code exists
yet.

This is the first of several sub-projects needed to build the actual site (see the
decomposition agreed during brainstorming): app scaffold → single-card draw flow →
multi-card spreads → Supabase auth/persistence → encyclopedia/about → animation polish.
This spec covers only the scaffold.

## Goal

Stand up a working Vite + React + TypeScript + Tailwind app with the design system
wired in from `DESIGN.md`/the Stitch exports, a routing skeleton covering every page in
the site (real or stubbed), and the Home page fully converted to a real component — proof
that the "static Stitch HTML → React component" pipeline works end to end before applying
it to every other page in later sub-projects.

## Tech Stack

- **Build tool**: Vite
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS, theme merged from the 17 Stitch exports' `tailwind.config`
  blocks (color/spacing/font tokens are value-identical across all of them — verified via
  diff, only object key order differs)
- **Routing**: React Router v6
- **State management**: React Context (auth session, active reading, motion/audio prefs
  — scope is modest enough that Context is sufficient, per the brief's own options)
- **Package manager**: npm
- **Linting**: ESLint + Prettier (standard defaults, not separately discussed with the
  user — low-stakes, reversible tooling choice)

## Fonts

Loaded via Google Fonts `<link>` tags in `index.html`, matching every Stitch export:
Cinzel (400/600/700), Inter (300/400/500/600), Playfair Display (italic 400), Material
Symbols Outlined (variable weight/fill, used for the header's settings/account icons and
the audio toggle icon).

## Folder Structure

```
tarot-site/
  index.html
  tailwind.config.ts
  src/
    main.tsx
    App.tsx                  # RouterProvider setup
    components/
      Nav.tsx                # extracted from identical header markup in all 17 exports
      Footer.tsx              # extracted from identical footer markup
      AtmosphereLayer.tsx     # starfield gradient + film-grain overlay + audio toggle
    layouts/
      RootLayout.tsx          # renders AtmosphereLayer + Nav + <Outlet/> + Footer
    pages/
      HomePage.tsx             # real, converted from design/stitch-exports/01-home
      DrawPage.tsx              # stub
      EncyclopediaPage.tsx      # stub
      AboutPage.tsx              # stub
      LoginPage.tsx               # stub
      RegisterPage.tsx             # stub
      ProfilePage.tsx                # stub
    data/
      cards-major.json          # moved from /content
      cards-major.zh.json        # moved from /content
    context/
      AuthContext.tsx           # empty/placeholder provider, no Supabase wiring yet
      ReadingSessionContext.tsx  # empty/placeholder provider
    lib/
      supabaseClient.ts          # stub file, not connected to a real Supabase project yet
    styles/
      global.css                # @font-face/import, .starfield/.film-grain/.gold-shimmer
                                  # and other CSS classes lifted verbatim from Stitch exports
  package.json
  tsconfig.json
  vite.config.ts
```

`content/` and `design/` at the repo root are left as-is (source material / reference),
not deleted — `src/data/` gets copies wired into the actual app.

## Tailwind Theme

`tailwind.config.ts` `theme.extend` is built by merging the `colors`, `borderRadius`,
`spacing`, `fontFamily`, and `fontSize` objects that appear (value-identical) in every
Stitch export's inline `tailwind.config` script block — e.g. `primary: '#ebc166'`,
`background-void: '#0B0714'`, `display-lg: ['Cinzel', ...]`, etc. This means class names
already used throughout the Stitch-generated HTML (`text-primary`, `bg-surface-container`,
`font-display-lg`, `text-body-md`, `rounded-xl`, `px-gutter`, ...) work unchanged when that
markup is ported into JSX.

## Shared Layout Components

Header/footer markup is *thematically* consistent across the 17 Stitch exports but not
byte-identical — Stitch regenerated slightly different structure each time (e.g. Home's
footer omits the large "MIDNIGHT ORACLE" wordmark that most other pages include; the nav
wrapper element differs between pages). Rather than picking one page's version
arbitrarily, the shared components below normalize to one canonical implementation
(using the more common footer pattern with the wordmark, and semantic `<header>` +
`<nav>` markup), which every page — including Home — will use going forward:

- **`Nav`**: "MIDNIGHT ORACLE" wordmark + 首页/抽牌占卜/牌意图鉴/关于 links (active-route
  styling) + settings/account Material Symbol icons, fixed top bar with blur backdrop
- **`Footer`**: wordmark + 隐私政策/服务条款/联系我们 links + copyright line
- **`AtmosphereLayer`**: fixed starfield radial-gradient background + film-grain noise
  overlay (both `z-index`-layered behind content) + the fixed bottom-right
  audio mute/unmute toggle button

`RootLayout` composes these three around a React Router `<Outlet/>`, and every route
renders inside it.

## Routing Skeleton

| Path | Page | Status |
|---|---|---|
| `/` | HomePage | **Real** — full conversion of `01-home/code.html` |
| `/draw` | DrawPage | Stub (placeholder text) |
| `/encyclopedia` | EncyclopediaPage | Stub |
| `/about` | AboutPage | Stub |
| `/login` | LoginPage | Stub |
| `/register` | RegisterPage | Stub |
| `/profile` | ProfilePage | Stub |

Finer-grained routing for the draw ritual's internal steps (intention/shuffle/select/
reveal), the three spread types, and the register ritual's three steps is explicitly
deferred to their own later sub-project specs — this scaffold only proves the top-level
skeleton works.

## Home Page Conversion

`design/stitch-exports/01-home/code.html` is ported to `HomePage.tsx`: the static HTML
structure becomes JSX, inline Tailwind classes carry over unchanged (per the merged
theme above), and the shared `Nav`/`Footer`/`AtmosphereLayer` are removed from the page
itself since `RootLayout` now provides them. No new interactivity is added yet — the
"开始占卜" button links to `/draw` (currently a stub) via React Router `<Link>`.

## Validation

- `npm run build` completes without errors
- `npm run dev` serves the app locally
- Home page visually compared against `design/stitch-exports/01-home/screen.png` in the
  browser preview (colors, fonts, layout, spacing should match)
- Navigating to each stub route renders without crashing

## Out of Scope (deferred to later sub-project specs)

- Draw ritual interactivity and state machine (intention → shuffle → select → reveal)
- Multi-card spread logic (3-card, Celtic Cross)
- Supabase project creation, schema, and auth wiring (the identity-ritual register flow,
  login, session persistence)
- Encyclopedia and About page real content
- GSAP shuffle/flip choreography, tsParticles starfield (static CSS gradient stands in
  for now), background audio
- Reduced-motion accessibility handling
