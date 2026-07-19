# App Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a working Vite + React + TypeScript + Tailwind app in `Tarot Divination Site/`, with the design system merged from the 17 Stitch exports, a routing skeleton covering every page (real or stubbed), and the Home page fully converted to a real component.

**Architecture:** Vite dev/build tooling, React 18 function components, React Router v6 data-router API, Tailwind CSS themed via a token module under `src/theme/`, React Context for cross-cutting state (unused by any consumer yet, wired for later sub-projects), Vitest + React Testing Library for component/unit tests.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS 3, React Router v6, Vitest, @testing-library/react, npm.

## Global Constraints

- All work happens inside `Tarot Divination Site/` (repo root for this project) — do not touch `content/`, `design/`, or `docs/` except where a task explicitly copies from them
- Content language for any user-facing stub/placeholder text is Chinese, matching the rest of the site (spec: existing site convention)
- No Supabase wiring, no draw-ritual interactivity, no GSAP/tsParticles — explicitly deferred (spec: Out of Scope)
- Color/spacing/font tokens must match the values actually used across the Stitch exports (verified against `design/stitch-exports/01-home/code.html` and `09-three-card-result/code.html`, which are token-identical), not `design/DESIGN.md`'s `rounded` section, which uses different numeric values than what Stitch actually generated (spec correction, 2026-07-19)

---

### Task 1: Project tooling scaffold (Vite + React + TypeScript + Tailwind + Vitest)

**Files:**
- Create: `Tarot Divination Site/package.json`
- Create: `Tarot Divination Site/vite.config.ts`
- Create: `Tarot Divination Site/tsconfig.json`
- Create: `Tarot Divination Site/tsconfig.app.json`
- Create: `Tarot Divination Site/tsconfig.node.json`
- Create: `Tarot Divination Site/postcss.config.js`
- Create: `Tarot Divination Site/tailwind.config.ts`
- Create: `Tarot Divination Site/index.html`
- Create: `Tarot Divination Site/src/setupTests.ts`
- Create: `Tarot Divination Site/src/styles/global.css`
- Create: `Tarot Divination Site/src/main.tsx`
- Create: `Tarot Divination Site/src/App.tsx`
- Test: `Tarot Divination Site/src/App.test.tsx`

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` / `npm test` toolchain that every later task builds on. `src/App.tsx` default-exports a component (replaced with real routing in Task 7).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "tarot-site",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4",
    "vite": "^5.3.5",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 4: Write `tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Write `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Write `tailwind.config.ts` (placeholder — Task 2 fills in the real theme)**

```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 8: Write `index.html`**

```html
<!doctype html>
<html lang="zh-CN" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Midnight Oracle | 夜语塔罗</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 9: Write `src/setupTests.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 10: Write `src/styles/global.css` (minimal — Task 2 adds atmosphere classes)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 11: Write `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 12: Run `npm install`**

Run (from `Tarot Divination Site/`): `npm install`
Expected: completes with no error output (an "added N packages" summary line is fine — exact count will vary).

- [ ] **Step 13: Write the failing test `src/App.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Midnight Oracle')).toBeInTheDocument()
  })
})
```

- [ ] **Step 14: Run the test and confirm it fails**

Run: `npm test -- App`
Expected: FAILS — Vitest reports it cannot resolve the `./App` module (`src/App.tsx` doesn't exist yet).

- [ ] **Step 15: Write `src/App.tsx` (placeholder — Task 7 replaces this with real routing)**

```tsx
export default function App() {
  return <div>Midnight Oracle</div>
}
```

- [ ] **Step 16: Run the test and confirm it passes**

Run: `npm test -- App`
Expected: PASS (1 test passed)

- [ ] **Step 17: Run the build to confirm the full toolchain works**

Run: `npm run build`
Expected: completes with no errors, producing a `dist/` folder.

- [ ] **Step 18: Commit**

```bash
git add package.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json postcss.config.js tailwind.config.ts index.html src/setupTests.ts src/styles/global.css src/main.tsx src/App.tsx src/App.test.tsx package-lock.json .gitignore
git commit -m "Scaffold Vite+React+TypeScript+Tailwind+Vitest project"
```

Note: `npm install` will also create/update `node_modules/` (already covered by the existing `.gitignore`'s `node_modules/` entry — do not add it) and `package-lock.json` (should be committed).

---

### Task 2: Design tokens merged from Stitch exports, wired into Tailwind + global CSS

**Files:**
- Create: `Tarot Divination Site/src/theme/tokens.ts`
- Test: `Tarot Divination Site/src/theme/tokens.test.ts`
- Modify: `Tarot Divination Site/tailwind.config.ts`
- Modify: `Tarot Divination Site/src/styles/global.css`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: `colors`, `borderRadius`, `spacing`, `fontFamily`, `fontSize` named exports from `src/theme/tokens.ts` (plain objects, `as const`), consumed by `tailwind.config.ts`. Global CSS classes `.starfield`, `.nebula`, `.film-grain`, `.animate-pulse-slow` available to any component (used by `AtmosphereLayer` in Task 5).

- [ ] **Step 1: Write the failing test `src/theme/tokens.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { colors, fontFamily, fontSize, borderRadius, spacing } from './tokens'

describe('design tokens', () => {
  it('has 53 color tokens matching the Stitch design system', () => {
    expect(Object.keys(colors)).toHaveLength(53)
    expect(colors.primary).toBe('#ebc166')
    expect(colors['background-void']).toBe('#0B0714')
    expect(colors['card-back']).toBe('#3D0C29')
    expect(colors['surface-container']).toBe('#221d2c')
  })

  it('defines the Cinzel/Playfair Display/Inter font families', () => {
    expect(fontFamily['display-lg']).toEqual(['Cinzel'])
    expect(fontFamily['tagline-italic']).toEqual(['Playfair Display'])
    expect(fontFamily['body-md']).toEqual(['Inter'])
  })

  it('defines display-lg at 48px with the documented letter-spacing', () => {
    const [size, opts] = fontSize['display-lg']
    expect(size).toBe('48px')
    expect(opts).toMatchObject({ letterSpacing: '0.05em', fontWeight: '700' })
  })

  it('matches the borderRadius and spacing scale used across the Stitch exports', () => {
    expect(borderRadius.lg).toBe('0.5rem')
    expect(spacing['section-padding']).toBe('80px')
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- tokens`
Expected: FAILS — Vitest cannot resolve `./tokens` (`src/theme/tokens.ts` doesn't exist yet).

- [ ] **Step 3: Write `src/theme/tokens.ts`**

```ts
export const colors = {
  'on-error-container': '#ffdad6',
  'on-tertiary-container': '#602a47',
  'on-primary': '#402d00',
  'primary-fixed-dim': '#ebc166',
  'card-back': '#3D0C29',
  'tertiary-fixed-dim': '#fcb0d4',
  'on-secondary': '#451078',
  'surface-variant': '#383241',
  'inverse-on-surface': '#332e3d',
  'secondary-fixed': '#efdbff',
  'outline-variant': '#4e4637',
  'on-error': '#690005',
  'on-secondary-container': '#cea2ff',
  tertiary: '#fcb0d4',
  'secondary-container': '#5c2d90',
  'glow-violet': '#2A1B3D',
  secondary: '#dab8ff',
  'on-secondary-fixed-variant': '#5c2d90',
  'tertiary-fixed': '#ffd8e8',
  'surface-container-low': '#1e1927',
  'on-primary-fixed': '#261a00',
  primary: '#ebc166',
  error: '#ffb4ab',
  background: '#16111f',
  'on-tertiary-fixed': '#380725',
  'surface-container-highest': '#383241',
  'primary-fixed': '#ffdf9e',
  'surface-container-high': '#2d2836',
  'on-primary-container': '#4f3900',
  'background-void': '#0B0714',
  'inverse-surface': '#e8dff3',
  surface: '#16111f',
  'on-surface': '#e8dff3',
  'on-primary-fixed-variant': '#5b4300',
  'on-surface-variant': '#d1c5b2',
  'tertiary-container': '#da92b4',
  'on-tertiary': '#521e3a',
  'surface-tint': '#ebc166',
  'inverse-primary': '#795902',
  'primary-container': '#c9a24b',
  'on-secondary-fixed': '#2b0053',
  'on-background': '#e8dff3',
  'accent-magenta': '#7B4397',
  'highlight-lavender': '#E8DFFF',
  'surface-dim': '#16111f',
  'surface-container-lowest': '#100c19',
  'surface-container': '#221d2c',
  'surface-bright': '#3c3746',
  'background-nebula': '#120C1F',
  'error-container': '#93000a',
  outline: '#9a8f7e',
  'on-tertiary-fixed-variant': '#6c3451',
  'secondary-fixed-dim': '#dab8ff',
} as const

export const borderRadius = {
  DEFAULT: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const

export const spacing = {
  'margin-mobile': '16px',
  'container-max': '1200px',
  'stack-md': '16px',
  'stack-sm': '8px',
  'stack-lg': '32px',
  gutter: '24px',
  'section-padding': '80px',
} as const

export const fontFamily = {
  'display-lg-mobile': ['Cinzel'],
  'tagline-italic': ['Playfair Display'],
  'display-lg': ['Cinzel'],
  'display-md': ['Cinzel'],
  'body-md': ['Inter'],
  'label-caps': ['Cinzel'],
  'body-lg': ['Inter'],
} as const

export const fontSize = {
  'display-lg-mobile': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
  'tagline-italic': ['20px', { lineHeight: '1.5', fontWeight: '400' }],
  'display-lg': ['48px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '700' }],
  'display-md': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
  'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
  'label-caps': ['14px', { lineHeight: '1.0', letterSpacing: '0.1em', fontWeight: '700' }],
  'body-lg': ['18px', { lineHeight: '1.8', fontWeight: '400' }],
} as const
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- tokens`
Expected: PASS (4 tests passed)

- [ ] **Step 5: Update `tailwind.config.ts` to use the tokens**

```ts
import type { Config } from 'tailwindcss'
import { colors, borderRadius, spacing, fontFamily, fontSize } from './src/theme/tokens'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      borderRadius,
      spacing,
      fontFamily,
      fontSize,
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 6: Update `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes stars {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 1000px 1000px;
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.starfield {
  background-image: radial-gradient(circle at 1px 1px, #ffffff22 1px, transparent 0);
  background-size: 40px 40px;
  animation: stars 200s linear infinite;
}

.nebula {
  background: radial-gradient(circle at 50% 50%, rgba(42, 27, 61, 0.8) 0%, transparent 70%);
}

/* External texture; consider self-hosting if the CDN becomes unreliable */
.film-grain {
  background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
  opacity: 0.05;
}

.animate-pulse-slow {
  animation: pulse-slow 4s infinite ease-in-out;
}
```

- [ ] **Step 7: Run the build to confirm Tailwind loads the cross-file TS config correctly**

Run: `npm run build`
Expected: completes with no errors (this specifically validates that `tailwind.config.ts` can import from `./src/theme/tokens` — Tailwind 3.4+ transpiles TS configs and their local imports on the fly).

- [ ] **Step 8: Commit**

```bash
git add src/theme/tokens.ts src/theme/tokens.test.ts tailwind.config.ts src/styles/global.css
git commit -m "Wire merged Stitch design tokens into Tailwind theme and global CSS"
```

---

### Task 3: Nav component

**Files:**
- Create: `Tarot Divination Site/src/components/Nav.tsx`
- Test: `Tarot Divination Site/src/components/Nav.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks (uses `react-router-dom`'s `NavLink`, requires a Router context from its parent when rendered)
- Produces: default export `Nav` (no props), used by `RootLayout` in Task 6

- [ ] **Step 1: Write the failing test `src/components/Nav.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Nav from './Nav'

describe('Nav', () => {
  it('renders the wordmark and all four nav links', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('MIDNIGHT ORACLE')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: '抽牌占卜' })).toHaveAttribute('href', '/draw')
    expect(screen.getByRole('link', { name: '牌意图鉴' })).toHaveAttribute('href', '/encyclopedia')
    expect(screen.getByRole('link', { name: '关于' })).toHaveAttribute('href', '/about')
  })

  it('marks the current route as active', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: '关于' }).className).toContain('text-primary')
    expect(screen.getByRole('link', { name: '首页' }).className).toContain('text-on-surface-variant')
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- Nav`
Expected: FAILS — Vitest cannot resolve `./Nav` (`src/components/Nav.tsx` doesn't exist yet).

- [ ] **Step 3: Write `src/components/Nav.tsx`**

```tsx
import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: '首页' },
  { to: '/draw', label: '抽牌占卜' },
  { to: '/encyclopedia', label: '牌意图鉴' },
  { to: '/about', label: '关于' },
]

export default function Nav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30 shadow-[0_4px_20px_rgba(42,27,61,0.5)]">
      <div className="flex justify-between items-center px-margin-mobile md:px-gutter max-w-container-max mx-auto h-20">
        <div className="font-display-md text-display-md text-primary tracking-widest cursor-pointer">
          MIDNIGHT ORACLE
        </div>
        <nav aria-label="主导航" className="hidden md:flex gap-stack-lg">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'font-label-caps text-label-caps text-primary border-b border-primary pb-1'
                  : 'font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-300'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-primary">
          <button
            type="button"
            className="material-symbols-outlined cursor-pointer hover:text-primary-fixed-dim transition-all duration-300 active:scale-95"
            aria-label="设置"
          >
            settings
          </button>
          <button
            type="button"
            className="material-symbols-outlined cursor-pointer hover:text-primary-fixed-dim transition-all duration-300 active:scale-95"
            aria-label="账户"
          >
            account_circle
          </button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- Nav`
Expected: PASS (2 tests passed)

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/Nav.test.tsx
git commit -m "Add shared Nav component"
```

---

### Task 4: Footer component

**Files:**
- Create: `Tarot Divination Site/src/components/Footer.tsx`
- Test: `Tarot Divination Site/src/components/Footer.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: default export `Footer` (no props), used by `RootLayout` in Task 6

- [ ] **Step 1: Write the failing test `src/components/Footer.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the wordmark, policy links, and copyright line', () => {
    render(<Footer />)
    expect(screen.getByText('Midnight Oracle')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '隐私政策' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '服务条款' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '联系我们' })).toBeInTheDocument()
    expect(screen.getByText(/愿星辰指引你的道路/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- Footer`
Expected: FAILS — Vitest cannot resolve `./Footer` (`src/components/Footer.tsx` doesn't exist yet).

- [ ] **Step 3: Write `src/components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="relative z-20 w-full py-section-padding bg-background-void border-t border-outline-variant/20">
      <div className="flex flex-col items-center gap-stack-lg max-w-container-max mx-auto text-center px-margin-mobile">
        <div className="font-display-lg text-display-lg text-primary">Midnight Oracle</div>
        <div className="flex gap-stack-lg">
          <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
            隐私政策
          </a>
          <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
            服务条款
          </a>
          <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
            联系我们
          </a>
        </div>
        <p className="font-body-md text-on-surface-variant/60 text-sm italic">
          © 2024 Midnight Oracle. 愿星辰指引你的道路。
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- Footer`
Expected: PASS (1 test passed)

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.test.tsx
git commit -m "Add shared Footer component"
```

---

### Task 5: AtmosphereLayer component

**Files:**
- Create: `Tarot Divination Site/src/components/AtmosphereLayer.tsx`
- Test: `Tarot Divination Site/src/components/AtmosphereLayer.test.tsx`

**Interfaces:**
- Consumes: `.starfield`, `.nebula`, `.film-grain`, `.animate-pulse-slow` CSS classes from `src/styles/global.css` (Task 2)
- Produces: default export `AtmosphereLayer` (no props), used by `RootLayout` in Task 6

- [ ] **Step 1: Write the failing test `src/components/AtmosphereLayer.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import AtmosphereLayer from './AtmosphereLayer'

describe('AtmosphereLayer', () => {
  it('renders the audio toggle in its default muted state', () => {
    render(<AtmosphereLayer />)
    const toggle = screen.getByRole('button', { name: '氛围音乐' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle).toHaveTextContent('brightness_3')
  })

  it('switches to playing state on click', async () => {
    render(<AtmosphereLayer />)
    const toggle = screen.getByRole('button', { name: '氛围音乐' })
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(toggle).toHaveTextContent('volume_up')
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- AtmosphereLayer`
Expected: FAILS — Vitest cannot resolve `./AtmosphereLayer` (doesn't exist yet).

- [ ] **Step 3: Write `src/components/AtmosphereLayer.tsx`**

```tsx
import { useState } from 'react'

export default function AtmosphereLayer() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <>
      <div className="fixed inset-0 z-0 bg-background-void pointer-events-none">
        <div className="absolute inset-0 starfield" />
        <div className="absolute inset-0 nebula" />
        <div className="absolute inset-0 film-grain" />
      </div>
      <button
        type="button"
        onClick={() => setIsPlaying((playing) => !playing)}
        aria-pressed={isPlaying}
        aria-label="氛围音乐"
        className="fixed bottom-8 right-8 z-50 bg-surface-container-lowest/50 backdrop-blur-xl border border-primary/40 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(235,193,102,0.3)] hover:scale-110 hover:shadow-[0_0_20px_rgba(235,193,102,0.5)] transition-all active:rotate-12 animate-pulse-slow"
      >
        <span className="material-symbols-outlined text-primary text-2xl">
          {isPlaying ? 'volume_up' : 'brightness_3'}
        </span>
      </button>
    </>
  )
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- AtmosphereLayer`
Expected: PASS (2 tests passed)

- [ ] **Step 5: Commit**

```bash
git add src/components/AtmosphereLayer.tsx src/components/AtmosphereLayer.test.tsx
git commit -m "Add shared AtmosphereLayer component (starfield/nebula/grain + audio toggle)"
```

---

### Task 6: RootLayout

**Files:**
- Create: `Tarot Divination Site/src/layouts/RootLayout.tsx`
- Test: `Tarot Divination Site/src/layouts/RootLayout.test.tsx`

**Interfaces:**
- Consumes: `Nav` (Task 3), `Footer` (Task 4), `AtmosphereLayer` (Task 5)
- Produces: default export `RootLayout` (no props, renders `<Outlet/>`), used as the root route element in Task 7

- [ ] **Step 1: Write the failing test `src/layouts/RootLayout.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import RootLayout from './RootLayout'

describe('RootLayout', () => {
  it('renders Nav, Footer, and the routed child content', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <RootLayout />,
          children: [{ index: true, element: <div>Page Content</div> }],
        },
      ],
      { initialEntries: ['/'] },
    )
    render(<RouterProvider router={router} />)
    expect(screen.getByText('MIDNIGHT ORACLE')).toBeInTheDocument()
    expect(screen.getByText('Midnight Oracle')).toBeInTheDocument()
    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- RootLayout`
Expected: FAILS — Vitest cannot resolve `./RootLayout` (doesn't exist yet).

- [ ] **Step 3: Write `src/layouts/RootLayout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import AtmosphereLayer from '../components/AtmosphereLayer'

export default function RootLayout() {
  return (
    <div className="relative min-h-screen bg-background text-on-surface font-body-md">
      <AtmosphereLayer />
      <Nav />
      <div className="relative z-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- RootLayout`
Expected: PASS (1 test passed)

- [ ] **Step 5: Commit**

```bash
git add src/layouts/RootLayout.tsx src/layouts/RootLayout.test.tsx
git commit -m "Add RootLayout composing Nav, Footer, and AtmosphereLayer"
```

---

### Task 7: Routing skeleton with stub pages

**Files:**
- Create: `Tarot Divination Site/src/components/StubPage.tsx`
- Test: `Tarot Divination Site/src/components/StubPage.test.tsx`
- Create: `Tarot Divination Site/src/pages/HomePage.tsx` (stub — Task 10 replaces with real content)
- Create: `Tarot Divination Site/src/pages/DrawPage.tsx`
- Create: `Tarot Divination Site/src/pages/EncyclopediaPage.tsx`
- Create: `Tarot Divination Site/src/pages/AboutPage.tsx`
- Create: `Tarot Divination Site/src/pages/LoginPage.tsx`
- Create: `Tarot Divination Site/src/pages/RegisterPage.tsx`
- Create: `Tarot Divination Site/src/pages/ProfilePage.tsx`
- Create: `Tarot Divination Site/src/routes.tsx`
- Test: `Tarot Divination Site/src/routes.test.tsx`
- Modify: `Tarot Divination Site/src/App.tsx`
- Delete: `Tarot Divination Site/src/App.test.tsx` (superseded by `src/routes.test.tsx`, which covers routing; App.tsx no longer renders standalone content to smoke-test)

**Interfaces:**
- Consumes: `RootLayout` (Task 6)
- Produces: `StubPage` (default export, props `{ message: string }`), reused by all 7 stub pages instead of duplicating their wrapper markup. `routes` (a `RouteObject[]` export from `src/routes.tsx`) consumed by `App.tsx` and by Task 10's update to `routes.test.tsx`. Each stub page default-exports a no-props component.

- [ ] **Step 1: Write the failing test `src/components/StubPage.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StubPage from './StubPage'

describe('StubPage', () => {
  it('renders the given message', () => {
    render(<StubPage message="首页正在筹备中……" />)
    expect(screen.getByText('首页正在筹备中……')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- StubPage`
Expected: FAILS — Vitest cannot resolve `./StubPage` (doesn't exist yet).

- [ ] **Step 3: Write `src/components/StubPage.tsx`**

```tsx
export default function StubPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-margin-mobile pt-32 pb-section-padding">
      <p className="font-tagline-italic text-tagline-italic text-on-surface-variant">{message}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- StubPage`
Expected: PASS (1 test passed)

- [ ] **Step 5: Write the 7 stub pages as thin `StubPage` wrappers**

`src/pages/HomePage.tsx` (stub for now — Task 10 replaces this file entirely):
```tsx
import StubPage from '../components/StubPage'

export default function HomePage() {
  return <StubPage message="首页正在筹备中……" />
}
```

`src/pages/DrawPage.tsx`:
```tsx
import StubPage from '../components/StubPage'

export default function DrawPage() {
  return <StubPage message="抽牌占卜页面正在筹备中……" />
}
```

`src/pages/EncyclopediaPage.tsx`:
```tsx
import StubPage from '../components/StubPage'

export default function EncyclopediaPage() {
  return <StubPage message="牌意图鉴页面正在筹备中……" />
}
```

`src/pages/AboutPage.tsx`:
```tsx
import StubPage from '../components/StubPage'

export default function AboutPage() {
  return <StubPage message="关于页面正在筹备中……" />
}
```

`src/pages/LoginPage.tsx`:
```tsx
import StubPage from '../components/StubPage'

export default function LoginPage() {
  return <StubPage message="登录页面正在筹备中……" />
}
```

`src/pages/RegisterPage.tsx`:
```tsx
import StubPage from '../components/StubPage'

export default function RegisterPage() {
  return <StubPage message="注册页面正在筹备中……" />
}
```

`src/pages/ProfilePage.tsx`:
```tsx
import StubPage from '../components/StubPage'

export default function ProfilePage() {
  return <StubPage message="占卜师主页正在筹备中……" />
}
```

- [ ] **Step 6: Write the failing test `src/routes.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { routes } from './routes'

function renderAtPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
}

describe('routes', () => {
  it('renders the home page at /', () => {
    renderAtPath('/')
    expect(screen.getByText(/首页正在筹备中/)).toBeInTheDocument()
  })

  it('renders the draw page at /draw', () => {
    renderAtPath('/draw')
    expect(screen.getByText(/抽牌占卜页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the encyclopedia page at /encyclopedia', () => {
    renderAtPath('/encyclopedia')
    expect(screen.getByText(/牌意图鉴页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the about page at /about', () => {
    renderAtPath('/about')
    expect(screen.getByText(/关于页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the login page at /login', () => {
    renderAtPath('/login')
    expect(screen.getByText(/登录页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the register page at /register', () => {
    renderAtPath('/register')
    expect(screen.getByText(/注册页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the profile page at /profile', () => {
    renderAtPath('/profile')
    expect(screen.getByText(/占卜师主页正在筹备中/)).toBeInTheDocument()
  })

  it('wraps every route in RootLayout (nav is present)', () => {
    renderAtPath('/about')
    expect(screen.getByText('MIDNIGHT ORACLE')).toBeInTheDocument()
  })
})
```

- [ ] **Step 7: Run the test and confirm it fails**

Run: `npm test -- routes`
Expected: FAILS — Vitest cannot resolve `./routes` (`src/routes.tsx` doesn't exist yet).

- [ ] **Step 8: Write `src/routes.tsx`**

```tsx
import type { RouteObject } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import DrawPage from './pages/DrawPage'
import EncyclopediaPage from './pages/EncyclopediaPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'draw', element: <DrawPage /> },
      { path: 'encyclopedia', element: <EncyclopediaPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]
```

- [ ] **Step 9: Update `src/App.tsx`**

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export default function App() {
  return <RouterProvider router={router} />
}
```

- [ ] **Step 10: Delete the now-obsolete `src/App.test.tsx`**

Its assertion (`Midnight Oracle` placeholder text) no longer applies now that `App` renders full routing — routing behavior is covered by `src/routes.test.tsx` instead.

- [ ] **Step 11: Run the test and confirm it passes**

Run: `npm test -- routes`
Expected: PASS (8 tests passed)

- [ ] **Step 12: Run the full test suite to confirm nothing else broke**

Run: `npm test`
Expected: all tests pass (no leftover reference to the deleted `App.test.tsx`).

- [ ] **Step 13: Commit**

```bash
git add src/components/StubPage.tsx src/components/StubPage.test.tsx src/pages src/routes.tsx src/routes.test.tsx src/App.tsx
git rm src/App.test.tsx
git commit -m "Add routing skeleton with stub pages for every site route"
```

---

### Task 8: Card content data moved into the app

**Files:**
- Create: `Tarot Divination Site/src/data/cards-major.json` (copy of `content/cards-major.json`)
- Create: `Tarot Divination Site/src/data/cards-major.zh.json` (copy of `content/cards-major.zh.json`)
- Test: `Tarot Divination Site/src/data/cards.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: `src/data/cards-major.json` (array of 22 `{ id, name, number, arcana, suit, element, image }`) and `src/data/cards-major.zh.json` (object keyed by `id`, each `{ name_local, keywords, upright_meaning, upright_advice, reversed_meaning, reversed_advice }`) — the real data source for the draw-flow sub-project

- [ ] **Step 1: Copy the data files**

Run (from `Tarot Divination Site/`):
```bash
mkdir -p src/data
cp content/cards-major.json src/data/cards-major.json
cp content/cards-major.zh.json src/data/cards-major.zh.json
```
Expected: both files now exist under `src/data/` (originals in `content/` remain untouched as the reference source).

- [ ] **Step 2: Write the failing test `src/data/cards.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import structure from './cards-major.json'
import content from './cards-major.zh.json'

interface CardStructure {
  id: string
  name: string
  number: number
  arcana: string
  suit: string | null
  element: string | null
  image: string
}

interface CardContent {
  name_local: string
  keywords: string[]
  upright_meaning: string
  upright_advice: string
  reversed_meaning: string
  reversed_advice: string
}

describe('Major Arcana card data', () => {
  const cards = structure as unknown as CardStructure[]
  const localized = content as unknown as Record<string, CardContent>

  it('has exactly 22 structural entries numbered 0-21', () => {
    expect(cards).toHaveLength(22)
    const ids = cards.map((c) => c.id).sort()
    const expected = Array.from({ length: 22 }, (_, i) => `major_${String(i).padStart(2, '0')}`).sort()
    expect(ids).toEqual(expected)
  })

  it('has matching Chinese content for every structural entry', () => {
    for (const card of cards) {
      const entry = localized[card.id]
      expect(entry, `missing content for ${card.id}`).toBeDefined()
      expect(entry.name_local).toBeTruthy()
      expect(entry.keywords).toHaveLength(3)
      expect(entry.upright_meaning).toBeTruthy()
      expect(entry.upright_advice).toBeTruthy()
      expect(entry.reversed_meaning).toBeTruthy()
      expect(entry.reversed_advice).toBeTruthy()
    }
  })
})
```

This test necessarily fails before Step 1 copies the files in (no `.ts` implementation step here — the "implementation" is the data files themselves, already authored in the content sub-project). Since Step 1 already ran, skip straight to running it.

- [ ] **Step 3: Run the test and confirm it passes**

Run: `npm test -- cards`
Expected: PASS (2 tests passed)

- [ ] **Step 4: Commit**

```bash
git add src/data/cards-major.json src/data/cards-major.zh.json src/data/cards.test.ts
git commit -m "Copy Major Arcana card data into the app under src/data"
```

---

### Task 9: Context stubs and Supabase client placeholder

**Files:**
- Create: `Tarot Divination Site/src/context/AuthContext.tsx`
- Test: `Tarot Divination Site/src/context/AuthContext.test.tsx`
- Create: `Tarot Divination Site/src/context/ReadingSessionContext.tsx`
- Test: `Tarot Divination Site/src/context/ReadingSessionContext.test.tsx`
- Create: `Tarot Divination Site/src/lib/supabaseClient.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: `AuthProvider`/`useAuth` and `ReadingSessionProvider`/`useReadingSession` — not yet wired into `App.tsx` (no consumer exists until the auth and draw-flow sub-projects). `supabaseClient` placeholder export, not yet connected to a real Supabase project.

- [ ] **Step 1: Write the failing test `src/context/AuthContext.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

function Probe() {
  const { userId, isAuthenticated } = useAuth()
  return (
    <div>
      <span>userId: {userId ?? 'none'}</span>
      <span>isAuthenticated: {String(isAuthenticated)}</span>
    </div>
  )
}

describe('AuthContext', () => {
  it('defaults to an unauthenticated, userId-less session', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    )
    expect(screen.getByText('userId: none')).toBeInTheDocument()
    expect(screen.getByText('isAuthenticated: false')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- AuthContext`
Expected: FAILS — Vitest cannot resolve `./AuthContext` (doesn't exist yet).

- [ ] **Step 3: Write `src/context/AuthContext.tsx`**

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  userId: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue>({
  userId: null,
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [value] = useState<AuthContextValue>({ userId: null, isAuthenticated: false })
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- AuthContext`
Expected: PASS (1 test passed)

- [ ] **Step 5: Write the failing test `src/context/ReadingSessionContext.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from './ReadingSessionContext'

function Probe() {
  const { activeSpread } = useReadingSession()
  return <span>activeSpread: {activeSpread ?? 'none'}</span>
}

describe('ReadingSessionContext', () => {
  it('defaults to no active spread', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('activeSpread: none')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test and confirm it fails**

Run: `npm test -- ReadingSessionContext`
Expected: FAILS — Vitest cannot resolve `./ReadingSessionContext` (doesn't exist yet).

- [ ] **Step 7: Write `src/context/ReadingSessionContext.tsx`**

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

type SpreadType = 'single' | 'three-card' | 'celtic-cross' | null

interface ReadingSessionValue {
  activeSpread: SpreadType
}

const ReadingSessionContext = createContext<ReadingSessionValue>({
  activeSpread: null,
})

export function ReadingSessionProvider({ children }: { children: ReactNode }) {
  const [value] = useState<ReadingSessionValue>({ activeSpread: null })
  return <ReadingSessionContext.Provider value={value}>{children}</ReadingSessionContext.Provider>
}

export function useReadingSession() {
  return useContext(ReadingSessionContext)
}
```

- [ ] **Step 8: Run the test and confirm it passes**

Run: `npm test -- ReadingSessionContext`
Expected: PASS (1 test passed)

- [ ] **Step 9: Write `src/lib/supabaseClient.ts`**

```ts
// Placeholder until a real Supabase project is created and wired in a later sub-project.
export const supabaseClient = null
```

- [ ] **Step 10: Commit**

```bash
git add src/context/AuthContext.tsx src/context/AuthContext.test.tsx src/context/ReadingSessionContext.tsx src/context/ReadingSessionContext.test.tsx src/lib/supabaseClient.ts
git commit -m "Add AuthContext/ReadingSessionContext stubs and supabaseClient placeholder"
```

---

### Task 10: Real Home page conversion

**Files:**
- Modify: `Tarot Divination Site/src/pages/HomePage.tsx`
- Modify: `Tarot Divination Site/src/pages/HomePage.test.tsx` (new file — the stub had no dedicated test)
- Create: `Tarot Divination Site/src/pages/HomePage.css`
- Modify: `Tarot Divination Site/src/routes.test.tsx`

**Interfaces:**
- Consumes: `react-router-dom`'s `Link`, Tailwind theme tokens from Task 2
- Produces: `HomePage` now renders the real hero converted from `design/stitch-exports/01-home/code.html`, with its CTA linking to `/draw`

- [ ] **Step 1: Write the failing test `src/pages/HomePage.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('renders the hero title, tagline, and CTA linking to /draw', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: '夜语塔罗' })).toBeInTheDocument()
    expect(screen.getByText(/在午夜时分，倾听命运的回响/)).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: /开始占卜/ })
    expect(cta).toHaveAttribute('href', '/draw')
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- HomePage`
Expected: FAILS — the stub `HomePage` doesn't render "夜语塔罗" or a `/draw` link yet.

- [ ] **Step 3: Write `src/pages/HomePage.css`**

```css
@keyframes drift {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 0.4;
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.2;
  }
}

.floating-card {
  animation: drift 12s ease-in-out infinite;
}

.parallax-deep {
  animation-duration: 20s;
}
.parallax-mid {
  animation-duration: 15s;
}
.parallax-front {
  animation-duration: 10s;
}

.ornate-emblem {
  background-image: url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M300 50 A250 250 0 1 1 299.9 50 Z' fill='none' stroke='%23ebc166' stroke-width='0.5' stroke-opacity='0.3'/%3E%3Cpath d='M300 80 A220 220 0 1 1 299.9 80 Z' fill='none' stroke='%23ebc166' stroke-width='1' stroke-opacity='0.2'/%3E%3Ccircle cx='300' cy='300' r='100' stroke='%23ebc166' stroke-width='0.5' fill='none' stroke-opacity='0.4'/%3E%3Cpath d='M300 200 Q350 300 300 400 Q250 300 300 200' stroke='%23ebc166' stroke-width='1' fill='none' stroke-opacity='0.5'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
```

- [ ] **Step 4: Replace `src/pages/HomePage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-[20%] left-[10%] w-32 h-56 bg-card-back rounded-lg border border-primary/20 floating-card parallax-deep opacity-30 blur-[2px] hidden md:block">
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/30 text-4xl">star</span>
          </div>
        </div>
        <div className="absolute bottom-[15%] right-[15%] w-40 h-72 bg-card-back rounded-lg border border-primary/30 floating-card parallax-mid opacity-40 blur-[1px] hidden md:block">
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/40 text-5xl">auto_awesome</span>
          </div>
        </div>
        <div className="absolute top-[60%] left-[5%] w-28 h-48 bg-card-back rounded-lg border border-primary/10 floating-card parallax-front opacity-20 blur-[3px]">
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/20 text-3xl">brightness_7</span>
          </div>
        </div>
      </div>

      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-margin-mobile text-center pt-20">
        <div className="relative w-full max-w-[800px] flex flex-col items-center justify-center">
          <div className="absolute inset-0 ornate-emblem opacity-60 animate-pulse-slow" />
          <div className="relative z-30 flex flex-col items-center gap-stack-md pt-stack-lg">
            <h1 className="font-display-lg text-[64px] md:text-display-lg text-primary tracking-[0.2em] drop-shadow-[0_0_15px_rgba(235,193,102,0.5)]">
              夜语塔罗
            </h1>
            <p className="font-tagline-italic text-tagline-italic text-highlight-lavender opacity-80 mt-4 italic tracking-wider">
              "在午夜时分，倾听命运的回响"
            </p>
            <div className="mt-stack-lg group">
              <Link
                to="/draw"
                className="relative px-12 py-4 rounded-full border-2 border-primary bg-background-void text-primary font-label-caps text-label-caps tracking-widest overflow-hidden transition-all duration-500 hover:text-on-primary-container active:scale-95 group shadow-[0_0_15px_rgba(235,193,102,0.2)] inline-flex items-center"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-background-void">
                  开始占卜
                  <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                </span>
                <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center bg-card-back shadow-lg group-hover:rotate-45 transition-transform duration-700">
                  <span className="material-symbols-outlined text-[12px] text-primary">ac_unit</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-section-padding flex items-center justify-center gap-8 opacity-40 w-full max-w-md">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-primary to-primary" />
          <span className="material-symbols-outlined text-primary">nights_stay</span>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-primary to-primary" />
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npm test -- HomePage`
Expected: PASS (1 test passed)

- [ ] **Step 6: Update the `/` case in `src/routes.test.tsx`**

Replace the home-page test (which still expects the old stub text) with an assertion matching the real content:

```tsx
  it('renders the home page at /', () => {
    renderAtPath('/')
    expect(screen.getByRole('heading', { name: '夜语塔罗' })).toBeInTheDocument()
  })
```

(This replaces the earlier `expect(screen.getByText(/首页正在筹备中/)).toBeInTheDocument()` assertion from Task 7 — everything else in that file is unchanged.)

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/HomePage.css src/pages/HomePage.test.tsx src/routes.test.tsx
git commit -m "Convert Home page from Stitch mockup to a real React component"
```

---

### Task 11: Final integration validation

**Files:**
- Modify: `.claude/launch.json` (at the outer `SuperClaude` workspace root, not inside `Tarot Divination Site/`)

**Interfaces:**
- Consumes: everything from Tasks 1-10
- Produces: nothing new — this is a verification-only task

- [ ] **Step 1: Run the full test suite one final time**

Run (from `Tarot Divination Site/`): `npm test`
Expected: all tests pass (App/Nav/Footer/AtmosphereLayer/RootLayout/routes/tokens/cards/AuthContext/ReadingSessionContext/HomePage suites).

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: completes with no TypeScript or build errors, producing `dist/`.

- [ ] **Step 3: Add a dev-server launch config**

Add this entry to the `configurations` array in `C:\Users\Yeoh Ming Zhe\Documents\SuperClaude\.claude\launch.json` (append after the existing `sme-einvoicing-dev` entry, do not remove it):

```json
{
  "type": "node",
  "request": "launch",
  "name": "tarot-dev",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev"],
  "cwd": "C:\\Users\\Yeoh Ming Zhe\\Documents\\SuperClaude\\Tarot Divination Site",
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen",
  "port": 5173
}
```

- [ ] **Step 4: Start the dev server and open it in the browser preview**

Use the preview tool with `{name: "tarot-dev"}`, then navigate to `/` (the Home page).

- [ ] **Step 5: Visually compare against the Stitch reference**

Screenshot the rendered Home page and compare against `design/stitch-exports/01-home/screen.png`: colors (deep indigo background, gold primary accents), fonts (Cinzel title, Playfair Display italic tagline, Inter body), layout (centered hero, floating parallax cards, nav bar, footer) should all match.

- [ ] **Step 6: Check each stub route loads without console errors**

Navigate to `/draw`, `/encyclopedia`, `/about`, `/login`, `/register`, `/profile` in the browser preview; check `read_console_messages` for errors after each navigation. Expected: no errors, each shows its placeholder text and the shared Nav/Footer/AtmosphereLayer.

- [ ] **Step 7: Commit the launch.json change**

```bash
cd "C:\Users\Yeoh Ming Zhe\Documents\SuperClaude"
git add .claude/launch.json
git commit -m "Add tarot-dev launch config for previewing the scaffolded app"
```

Note: this commit happens in the outer `SuperClaude` workspace, which is a separate (currently non-git) directory from the `Tarot Divination Site` repo — confirm whether that outer directory is a git repository before running this; if not, skip the commit and just leave the file change in place.
