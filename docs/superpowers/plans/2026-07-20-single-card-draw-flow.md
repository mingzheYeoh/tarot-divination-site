# Single-Card Draw Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/draw` stub with a working single-card tarot reading: optional question → shuffle → pick from a 15-card fan → reveal → real interpretation from the Major Arcana dataset, entirely client-side.

**Architecture:** `ReadingSessionContext` expands from its scaffold stub into the actual session state machine (step, question, drawn card, action functions), wired app-wide in `App.tsx`. `DrawPage` reads `step` and renders exactly one of five step components. A pure `drawCard()` function handles randomization and data lookup, decoupled from React. A shared `TarotCard` component (back/front, CSS-only 3D flip) is reused across select/reveal/result instead of three separate implementations.

**Tech Stack:** Same as the scaffold (Vite, React 18, TypeScript, Tailwind, React Router v6, Vitest, React Testing Library). No new runtime dependencies — CSS transitions/keyframes only, no GSAP/tsParticles.

## Global Constraints

- All work happens inside `Tarot Divination Site/`
- No Supabase wiring — "保存此次占卜" navigates to `/login`, does not persist anything (spec: Decisions)
- No GSAP, no tsParticles, no canvas particle systems, no JS-driven particle bursts — CSS `transition`/`@keyframes` only (spec: Animation scope boundary). Specifically cut from the source mockups: the canvas particle system, JS-injected floating runes, mouse-parallax 3D tilt, and the Web-Animations-API particle burst on reveal.
- Card images: real artwork from `github.com/searge/tarot` (`assets/img/big/maj00.jpg`–`maj21.jpg`, public-domain-style license, already verified in `content/SOURCES.md`) — never the Stitch/Gemini AI-generated placeholder image referenced in the reveal/result mockups
- Select step fan: exactly 15 face-down cards, matching `design/stitch-exports/04-select`'s hardcoded value
- Route: single `/draw` route, no ritual sub-routes — `DrawPage` is a step-state orchestrator (spec: Decisions)
- Randomization: uniform-random across all 22 Major Arcana, independent 50/50 upright/reversed roll
- Decorative Stitch-CDN images not tied to card content (candles, incense, velvet texture, gold filigree backgrounds) are dropped from the port, same call already made for the Home page conversion in the scaffold
- Per-step background decoration (nebula glows, additional blur blobs) is dropped — `RootLayout`'s existing `AtmosphereLayer` already renders the shared starfield/nebula/grain background; re-implementing it per step would be pure duplication

---

### Task 1: Download real Major Arcana card images

**Files:**
- Create: `Tarot Divination Site/public/assets/tarot/maj00.jpg` through `maj21.jpg` (22 files)

**Interfaces:**
- Produces: 22 JPEG files at `public/assets/tarot/majNN.jpg`, matching the `image` field already present in every entry of `src/data/cards-major.json` (e.g. `"image": "/assets/tarot/maj00.jpg"`) — Vite serves `public/` at the site root, so no further wiring is needed for `<img src={card.image}>` to resolve correctly later.

- [ ] **Step 1: Re-verify the image-folder license before bulk downloading**

Run:
```bash
curl -sL https://raw.githubusercontent.com/searge/tarot/master/assets/img/LICENSE | head -5
```
Expected output starts with: `This is free and unencumbered software released into the public domain.`
(Already verified once during the content sub-project; re-checking here since time has passed and this is the actual download step — if the license text has changed or the file 404s, STOP and report BLOCKED rather than downloading.)

- [ ] **Step 2: Download all 22 files**

Run (from `Tarot Divination Site/`):
```bash
mkdir -p public/assets/tarot
for i in $(seq -w 0 21); do
  curl -sL -o "public/assets/tarot/maj${i}.jpg" \
    "https://raw.githubusercontent.com/searge/tarot/master/assets/img/big/maj${i}.jpg"
done
```

- [ ] **Step 3: Verify all 22 files downloaded successfully and are real images**

Run:
```bash
ls public/assets/tarot/ | wc -l
file public/assets/tarot/maj00.jpg public/assets/tarot/maj21.jpg
```
Expected: `22` for the count; `file` reports both as `JPEG image data` (not `HTML document` or `ASCII text`, which would indicate a 404 error page got saved instead of an image).

- [ ] **Step 4: Commit**

```bash
git add public/assets/tarot/
git commit -m "Download real Major Arcana card images from searge/tarot"
```

---

### Task 2: `drawCard` pure function

**Files:**
- Create: `Tarot Divination Site/src/lib/drawCard.ts`
- Test: `Tarot Divination Site/src/lib/drawCard.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks (takes structure/content data as parameters, not imports — decoupled from the specific data files for testability)
- Produces: `DrawnCard` type and `drawCard(structure, content)` function, consumed by `ReadingSessionContext` in Task 3

- [ ] **Step 1: Write the failing test `src/lib/drawCard.test.ts`**

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { drawCard, type DrawnCard } from './drawCard'

const structure = [
  {
    id: 'major_00',
    name: 'The Fool',
    number: 0,
    arcana: 'major',
    suit: null,
    element: null,
    image: '/assets/tarot/maj00.jpg',
  },
  {
    id: 'major_01',
    name: 'The Magician',
    number: 1,
    arcana: 'major',
    suit: null,
    element: null,
    image: '/assets/tarot/maj01.jpg',
  },
]

const content = {
  major_00: {
    name_local: '愚人',
    keywords: ['新的开始', '冒险', '天真信任'],
    upright_meaning: 'UPRIGHT_FOOL_MEANING',
    upright_advice: 'UPRIGHT_FOOL_ADVICE',
    reversed_meaning: 'REVERSED_FOOL_MEANING',
    reversed_advice: 'REVERSED_FOOL_ADVICE',
  },
  major_01: {
    name_local: '魔术师',
    keywords: ['创造力', '意志力', '资源整合'],
    upright_meaning: 'UPRIGHT_MAGICIAN_MEANING',
    upright_advice: 'UPRIGHT_MAGICIAN_ADVICE',
    reversed_meaning: 'REVERSED_MAGICIAN_MEANING',
    reversed_advice: 'REVERSED_MAGICIAN_ADVICE',
  },
}

describe('drawCard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('picks the first structure entry and upright content when Math.random returns low values', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // card index selection -> index 0
      .mockReturnValueOnce(0) // orientation roll -> upright

    const result: DrawnCard = drawCard(structure, content)

    expect(result.id).toBe('major_00')
    expect(result.name).toBe('The Fool')
    expect(result.nameLocal).toBe('愚人')
    expect(result.image).toBe('/assets/tarot/maj00.jpg')
    expect(result.orientation).toBe('upright')
    expect(result.keywords).toEqual(['新的开始', '冒险', '天真信任'])
    expect(result.meaning).toBe('UPRIGHT_FOOL_MEANING')
    expect(result.advice).toBe('UPRIGHT_FOOL_ADVICE')
  })

  it('picks the last structure entry and reversed content when Math.random returns high values', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.999) // card index selection -> last index
      .mockReturnValueOnce(0.999) // orientation roll -> reversed

    const result: DrawnCard = drawCard(structure, content)

    expect(result.id).toBe('major_01')
    expect(result.orientation).toBe('reversed')
    expect(result.meaning).toBe('REVERSED_MAGICIAN_MEANING')
    expect(result.advice).toBe('REVERSED_MAGICIAN_ADVICE')
  })

  it('always returns an id present in the structure array, across many draws', () => {
    const validIds = new Set(structure.map((c) => c.id))
    for (let i = 0; i < 50; i++) {
      const result = drawCard(structure, content)
      expect(validIds.has(result.id)).toBe(true)
      expect(['upright', 'reversed']).toContain(result.orientation)
    }
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- drawCard`
Expected: FAILS — Vitest cannot resolve `./drawCard` (`src/lib/drawCard.ts` doesn't exist yet).

- [ ] **Step 3: Write `src/lib/drawCard.ts`**

```ts
export interface CardStructure {
  id: string
  name: string
  number: number
  arcana: string
  suit: string | null
  element: string | null
  image: string
}

export interface CardContent {
  name_local: string
  keywords: string[]
  upright_meaning: string
  upright_advice: string
  reversed_meaning: string
  reversed_advice: string
}

export type Orientation = 'upright' | 'reversed'

export interface DrawnCard {
  id: string
  name: string
  nameLocal: string
  image: string
  orientation: Orientation
  keywords: string[]
  meaning: string
  advice: string
}

export function drawCard(
  structure: CardStructure[],
  content: Record<string, CardContent>,
): DrawnCard {
  const index = Math.floor(Math.random() * structure.length)
  const picked = structure[index]
  const orientation: Orientation = Math.random() < 0.5 ? 'upright' : 'reversed'
  const localized = content[picked.id]

  return {
    id: picked.id,
    name: picked.name,
    nameLocal: localized.name_local,
    image: picked.image,
    orientation,
    keywords: localized.keywords,
    meaning: orientation === 'upright' ? localized.upright_meaning : localized.reversed_meaning,
    advice: orientation === 'upright' ? localized.upright_advice : localized.reversed_advice,
  }
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- drawCard`
Expected: PASS (3 tests passed)

- [ ] **Step 5: Commit**

```bash
git add src/lib/drawCard.ts src/lib/drawCard.test.ts
git commit -m "Add pure drawCard() function for random card selection"
```

---

### Task 3: Expand `ReadingSessionContext` into the ritual state machine

**Files:**
- Modify: `Tarot Divination Site/src/context/ReadingSessionContext.tsx`
- Modify: `Tarot Divination Site/src/context/ReadingSessionContext.test.tsx`
- Modify: `Tarot Divination Site/src/App.tsx`

**Interfaces:**
- Consumes: `drawCard`, `DrawnCard` from `src/lib/drawCard.ts` (Task 2); `src/data/cards-major.json` and `src/data/cards-major.zh.json` (already present from the scaffold)
- Produces: `useReadingSession()` returning `{ activeSpread, step, question, drawnCard, setQuestion, beginShuffle, finishShuffle, selectCard, finishReveal, reset }`, consumed by every step component in Tasks 5-9 and by `DrawPage` in Task 10

- [ ] **Step 1: Write the failing test — replace `src/context/ReadingSessionContext.test.tsx` entirely**

```tsx
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from './ReadingSessionContext'

function Probe() {
  const session = useReadingSession()
  return (
    <div>
      <span>step: {session.step}</span>
      <span>question: {session.question || 'none'}</span>
      <span>drawnCard: {session.drawnCard ? session.drawnCard.id : 'none'}</span>
      <button onClick={() => session.setQuestion('我该如何前进？')}>setQuestion</button>
      <button onClick={() => session.beginShuffle()}>beginShuffle</button>
      <button onClick={() => session.finishShuffle()}>finishShuffle</button>
      <button onClick={() => session.selectCard()}>selectCard</button>
      <button onClick={() => session.finishReveal()}>finishReveal</button>
      <button onClick={() => session.reset()}>reset</button>
    </div>
  )
}

describe('ReadingSessionContext', () => {
  it('starts at the intention step with no question and no drawn card', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('step: intention')).toBeInTheDocument()
    expect(screen.getByText('question: none')).toBeInTheDocument()
    expect(screen.getByText('drawnCard: none')).toBeInTheDocument()
  })

  it('walks through the full step sequence and produces a valid drawn card', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )

    act(() => screen.getByText('setQuestion').click())
    expect(screen.getByText('question: 我该如何前进？')).toBeInTheDocument()

    act(() => screen.getByText('beginShuffle').click())
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()

    act(() => screen.getByText('finishShuffle').click())
    expect(screen.getByText('step: selecting')).toBeInTheDocument()

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('step: revealing')).toBeInTheDocument()
    expect(screen.getByText(/drawnCard: major_\d{2}/)).toBeInTheDocument()

    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: result')).toBeInTheDocument()
  })

  it('reset returns to intention and clears question and drawn card', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )

    act(() => screen.getByText('setQuestion').click())
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())
    act(() => screen.getByText('selectCard').click())
    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: result')).toBeInTheDocument()

    act(() => screen.getByText('reset').click())
    expect(screen.getByText('step: intention')).toBeInTheDocument()
    expect(screen.getByText('question: none')).toBeInTheDocument()
    expect(screen.getByText('drawnCard: none')).toBeInTheDocument()
  })

  it('defaults activeSpread to null, unchanged from the scaffold stub', () => {
    function ActiveSpreadProbe() {
      const { activeSpread } = useReadingSession()
      return <span>activeSpread: {activeSpread ?? 'none'}</span>
    }
    render(
      <ReadingSessionProvider>
        <ActiveSpreadProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('activeSpread: none')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- ReadingSessionContext`
Expected: FAILS — the current `ReadingSessionContext` only exposes `activeSpread`, none of `step`/`question`/`drawnCard`/the action functions exist yet.

- [ ] **Step 3: Replace `src/context/ReadingSessionContext.tsx` entirely**

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import { drawCard, type DrawnCard, type CardStructure, type CardContent } from '../lib/drawCard'
import cardsStructure from '../data/cards-major.json'
import cardsContent from '../data/cards-major.zh.json'

type SpreadType = 'single' | 'three-card' | 'celtic-cross' | null

export type RitualStep = 'intention' | 'shuffling' | 'selecting' | 'revealing' | 'result'

interface ReadingSessionValue {
  activeSpread: SpreadType
  step: RitualStep
  question: string
  drawnCard: DrawnCard | null
  setQuestion: (question: string) => void
  beginShuffle: () => void
  finishShuffle: () => void
  selectCard: () => void
  finishReveal: () => void
  reset: () => void
}

const noop = () => {}

const ReadingSessionContext = createContext<ReadingSessionValue>({
  activeSpread: null,
  step: 'intention',
  question: '',
  drawnCard: null,
  setQuestion: noop,
  beginShuffle: noop,
  finishShuffle: noop,
  selectCard: noop,
  finishReveal: noop,
  reset: noop,
})

export function ReadingSessionProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<RitualStep>('intention')
  const [question, setQuestionState] = useState('')
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null)

  const value: ReadingSessionValue = {
    activeSpread: null,
    step,
    question,
    drawnCard,
    setQuestion: (nextQuestion: string) => setQuestionState(nextQuestion),
    beginShuffle: () => setStep('shuffling'),
    finishShuffle: () => setStep('selecting'),
    selectCard: () => {
      const card = drawCard(
        cardsStructure as unknown as CardStructure[],
        cardsContent as unknown as Record<string, CardContent>,
      )
      setDrawnCard(card)
      setStep('revealing')
    },
    finishReveal: () => setStep('result'),
    reset: () => {
      setStep('intention')
      setQuestionState('')
      setDrawnCard(null)
    },
  }

  return <ReadingSessionContext.Provider value={value}>{children}</ReadingSessionContext.Provider>
}

export function useReadingSession() {
  return useContext(ReadingSessionContext)
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- ReadingSessionContext`
Expected: PASS (4 tests passed)

- [ ] **Step 5: Wire `ReadingSessionProvider` into `src/App.tsx`**

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { ReadingSessionProvider } from './context/ReadingSessionContext'

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <ReadingSessionProvider>
      <RouterProvider router={router} />
    </ReadingSessionProvider>
  )
}
```

- [ ] **Step 6: Run the full test suite to confirm nothing else broke**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/context/ReadingSessionContext.tsx src/context/ReadingSessionContext.test.tsx src/App.tsx
git commit -m "Expand ReadingSessionContext into the draw ritual state machine"
```

---

### Task 4: `TarotCard` shared component

**Files:**
- Create: `Tarot Divination Site/src/components/draw/TarotCard.tsx`
- Test: `Tarot Divination Site/src/components/draw/TarotCard.test.tsx`
- Create: `Tarot Divination Site/src/components/draw/draw.css`

**Interfaces:**
- Consumes: `DrawnCard` type from `src/lib/drawCard.ts` (Task 2)
- Produces: default export `TarotCard` with props `{ card?: DrawnCard | null; flipped: boolean; onClick?: () => void; ariaLabel?: string; className?: string }`, consumed by `SelectStep` (Task 7), `RevealStep` (Task 8), `ResultStep` (Task 9). When `onClick` is given, the card's decorative content (icon glyph, image, name) is `aria-hidden` and `ariaLabel` becomes the button's sole accessible name — the card face is presentational inside an interactive button, not a substitute for a real label. Front-face content (image/name) only renders in the DOM when `flipped` is true, not merely whenever `card` is given — `backface-visibility: hidden` only hides it visually; without this the front face's image/text would still be discoverable by accessible-name and `getByRole('img')` queries even while showing the back.

- [ ] **Step 1: Write the failing test `src/components/draw/TarotCard.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import TarotCard from './TarotCard'
import type { DrawnCard } from '../../lib/drawCard'

const sampleCard: DrawnCard = {
  id: 'major_17',
  name: 'The Star',
  nameLocal: '星星',
  image: '/assets/tarot/maj17.jpg',
  orientation: 'upright',
  keywords: ['希望', '疗愈', '信念'],
  meaning: 'MEANING',
  advice: 'ADVICE',
}

describe('TarotCard', () => {
  it('renders only the back face when flipped is false, even with a card prop', () => {
    render(<TarotCard card={sampleCard} flipped={false} />)
    expect(screen.queryByRole('img', { name: 'The Star' })).not.toBeInTheDocument()
  })

  it('renders the card image and name when flipped is true', () => {
    render(<TarotCard card={sampleCard} flipped />)
    const image = screen.getByRole('img', { name: 'The Star' })
    expect(image).toHaveAttribute('src', '/assets/tarot/maj17.jpg')
    expect(screen.getByText('星星')).toBeInTheDocument()
  })

  it('calls onClick when clicked, and exposes ariaLabel as the accessible name', async () => {
    let clicked = false
    render(
      <TarotCard flipped={false} onClick={() => (clicked = true)} ariaLabel="点击翻牌" />,
    )
    const button = screen.getByRole('button', { name: '点击翻牌' })
    await userEvent.click(button)
    expect(clicked).toBe(true)
  })

  it('is not a button when no onClick is given (result-page static display)', () => {
    render(<TarotCard card={sampleCard} flipped />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- TarotCard`
Expected: FAILS — Vitest cannot resolve `./TarotCard` (doesn't exist yet).

- [ ] **Step 3: Write `src/components/draw/draw.css`**

```css
.card-flip-container {
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

.card-face-back {
  transform: rotateY(0deg);
}

.card-face-front {
  transform: rotateY(180deg);
}
```

- [ ] **Step 4: Write `src/components/draw/TarotCard.tsx`**

```tsx
import type { DrawnCard } from '../../lib/drawCard'
import './draw.css'

interface TarotCardProps {
  card?: DrawnCard | null
  flipped: boolean
  onClick?: () => void
  ariaLabel?: string
  className?: string
}

export default function TarotCard({
  card,
  flipped,
  onClick,
  ariaLabel,
  className = '',
}: TarotCardProps) {
  const showFront = Boolean(card) && flipped

  const inner = (
    <div
      className={`card-flip-container w-full h-full ${className}`}
      aria-hidden={onClick ? true : undefined}
    >
      <div className={`card-inner ${flipped ? 'is-flipped' : ''}`}>
        <div className="card-face card-face-back rounded-xl bg-card-back border-2 border-primary/40 shadow-xl flex flex-col items-center justify-center overflow-hidden">
          <div className="w-16 h-16 border-2 border-primary/60 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
          </div>
        </div>
        <div className="card-face card-face-front rounded-xl bg-background border border-primary/60 shadow-[0_0_30px_rgba(235,193,102,0.3)] overflow-hidden flex flex-col">
          {showFront && card ? (
            <>
              <img className="w-full flex-1 object-cover" src={card.image} alt={card.name} />
              <div className="py-3 flex flex-col items-center bg-background/50">
                <span className="font-display-md text-[20px] text-primary tracking-widest">
                  {card.nameLocal}
                </span>
                <span className="font-label-caps text-[10px] text-primary/60 tracking-[0.3em] mt-1">
                  {card.name.toUpperCase()}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="block w-full h-full text-left"
      >
        {inner}
      </button>
    )
  }

  return inner
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npm test -- TarotCard`
Expected: PASS (4 tests passed)

- [ ] **Step 6: Commit**

```bash
git add src/components/draw/TarotCard.tsx src/components/draw/TarotCard.test.tsx src/components/draw/draw.css
git commit -m "Add shared TarotCard component (CSS-only 3D flip, back/front faces)"
```

---

### Task 5: `IntentionStep`

**Files:**
- Create: `Tarot Divination Site/src/components/draw/IntentionStep.tsx`
- Test: `Tarot Divination Site/src/components/draw/IntentionStep.test.tsx`

**Interfaces:**
- Consumes: `useReadingSession()` (`question`, `setQuestion`, `beginShuffle`) from Task 3
- Produces: default export `IntentionStep` (no props — reads everything from context), used by `DrawPage` in Task 10

- [ ] **Step 1: Write the failing test `src/components/draw/IntentionStep.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import IntentionStep from './IntentionStep'

function StepProbe() {
  const { step, question } = useReadingSession()
  return (
    <>
      <IntentionStep />
      <span>step: {step}</span>
      <span>question: {question || 'none'}</span>
    </>
  )
}

describe('IntentionStep', () => {
  it('renders the ritual heading and the optional question input', () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入你想问的问题(可选)')).toBeInTheDocument()
  })

  it('stores the typed question and advances to shuffling on submit', async () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    const input = screen.getByPlaceholderText('输入你想问的问题(可选)')
    await userEvent.type(input, '我该如何前进？')
    await userEvent.click(screen.getByRole('button', { name: /开始洗牌/ }))

    expect(screen.getByText('question: 我该如何前进？')).toBeInTheDocument()
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()
  })

  it('advances to shuffling even with no question typed', async () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: /开始洗牌/ }))
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()
    expect(screen.getByText('question: none')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- IntentionStep`
Expected: FAILS — Vitest cannot resolve `./IntentionStep` (doesn't exist yet).

- [ ] **Step 3: Write `src/components/draw/IntentionStep.tsx`**

```tsx
import { useState } from 'react'
import { useReadingSession } from '../../context/ReadingSessionContext'

export default function IntentionStep() {
  const { setQuestion, beginShuffle } = useReadingSession()
  const [value, setValue] = useState('')

  function handleSubmit() {
    setQuestion(value)
    beginShuffle()
  }

  return (
    <div className="flex flex-col items-center text-center gap-stack-lg px-margin-mobile pt-32 pb-section-padding min-h-screen justify-center">
      <h1 className="font-display-lg text-display-lg text-highlight-lavender drop-shadow-[0_0_10px_rgba(232,223,255,0.5)]">
        静下心来，默念你的问题
      </h1>

      <div className="relative mt-8">
        <div className="absolute inset-0 rounded-full bg-highlight-lavender/10 blur-3xl scale-150 animate-pulse" />
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border border-primary/20 bg-gradient-to-tr from-background-void via-glow-violet to-highlight-lavender/20 flex items-center justify-center shadow-[inset_0_0_50px_rgba(232,223,255,0.2)] animate-pulse-glow overflow-hidden">
          <div className="w-1/3 h-1/3 bg-highlight-lavender rounded-full blur-2xl opacity-60" />
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-stack-md">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="输入你想问的问题(可选)"
          className="w-full bg-transparent border-b border-primary/40 py-4 px-2 text-center font-tagline-italic text-tagline-italic text-on-surface-variant focus:outline-none focus:border-primary transition-all duration-700 placeholder:opacity-50 placeholder:italic"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="group relative mt-10 px-12 py-4 rounded-full border border-primary/80 bg-background-void overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(235,193,102,0.2)]"
        >
          <span className="relative z-10 font-label-caps text-label-caps text-primary tracking-[0.2em] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            开始洗牌
          </span>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Add the `pulse-glow` keyframe used above to `src/styles/global.css`**

Append (this is a shared-feel effect, distinct from any existing keyframe — check first that `pulse-glow` isn't already defined; it is not, per the current file from the scaffold):

```css
@keyframes pulse-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 20px rgba(232, 223, 255, 0.4));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 45px rgba(232, 223, 255, 0.7));
    transform: scale(1.02);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npm test -- IntentionStep`
Expected: PASS (3 tests passed)

- [ ] **Step 6: Commit**

```bash
git add src/components/draw/IntentionStep.tsx src/components/draw/IntentionStep.test.tsx src/styles/global.css
git commit -m "Add IntentionStep component"
```

---

### Task 6: `ShuffleStep`

**Files:**
- Create: `Tarot Divination Site/src/components/draw/ShuffleStep.tsx`
- Test: `Tarot Divination Site/src/components/draw/ShuffleStep.test.tsx`

**Interfaces:**
- Consumes: `useReadingSession()` (`finishShuffle`) from Task 3
- Produces: default export `ShuffleStep` (no props), used by `DrawPage` in Task 10. Auto-advances the ritual after a fixed 2-second timer — no user interaction required.

- [ ] **Step 1: Write the failing test `src/components/draw/ShuffleStep.test.tsx`**

```tsx
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import ShuffleStep from './ShuffleStep'

function StepProbe() {
  const { step } = useReadingSession()
  return (
    <>
      <ShuffleStep />
      <span>step: {step}</span>
    </>
  )
}

describe('ShuffleStep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the shuffling caption', () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('命运正在交织...')).toBeInTheDocument()
    expect(screen.getByText('静候星辰的指引，牌阵正在苏醒')).toBeInTheDocument()
  })

  it('advances to selecting after 2 seconds, not before', () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1999)
    })
    expect(screen.getByText('step: shuffling')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.getByText('step: selecting')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- ShuffleStep`
Expected: FAILS — Vitest cannot resolve `./ShuffleStep` (doesn't exist yet).

- [ ] **Step 3: Write `src/components/draw/ShuffleStep.tsx`**

```tsx
import { useEffect } from 'react'
import { useReadingSession } from '../../context/ReadingSessionContext'
import './draw.css'

export default function ShuffleStep() {
  const { finishShuffle } = useReadingSession()

  useEffect(() => {
    const timer = setTimeout(finishShuffle, 2000)
    return () => clearTimeout(timer)
  }, [finishShuffle])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      <div className="relative">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(235, 193, 102, 0.1)" strokeWidth="0.5" />
          <circle
            className="progress-ring-circle"
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="#ebc166"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
        <div className="relative z-20 w-48 h-72 rounded-lg bg-card-back border-2 border-primary shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-2 border border-primary/40 rounded-md" />
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-2">brightness_high</span>
            <span className="font-label-caps text-label-caps text-primary/80">ORACLE</span>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center space-y-4">
        <h2 className="font-display-lg text-display-lg text-primary tracking-[0.2em] animate-pulse">
          命运正在交织...
        </h2>
        <p className="font-tagline-italic text-tagline-italic text-on-surface-variant italic">
          静候星辰的指引，牌阵正在苏醒
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Add the progress-ring keyframe to `src/styles/global.css`**

Append:

```css
@keyframes progress-spin {
  0% {
    stroke-dashoffset: 283;
    transform: rotate(-90deg);
  }
  100% {
    stroke-dashoffset: 0;
    transform: rotate(270deg);
  }
}

.progress-ring-circle {
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  transform-origin: center;
  animation: progress-spin 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
```

(Duration set to `2s` to match this step's own 2-second auto-advance timer, rather than the mockup's `6s` which assumed a much longer, JS-embellished shuffle sequence.)

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npm test -- ShuffleStep`
Expected: PASS (2 tests passed)

- [ ] **Step 6: Commit**

```bash
git add src/components/draw/ShuffleStep.tsx src/components/draw/ShuffleStep.test.tsx src/styles/global.css
git commit -m "Add ShuffleStep component"
```

---

### Task 7: `SelectStep`

**Files:**
- Create: `Tarot Divination Site/src/components/draw/SelectStep.tsx`
- Test: `Tarot Divination Site/src/components/draw/SelectStep.test.tsx`

**Interfaces:**
- Consumes: `useReadingSession()` (`selectCard`) from Task 3, `TarotCard` from Task 4
- Produces: default export `SelectStep` (no props), used by `DrawPage` in Task 10

- [ ] **Step 1: Write the failing test `src/components/draw/SelectStep.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import SelectStep from './SelectStep'

function StepProbe() {
  const { step, drawnCard } = useReadingSession()
  return (
    <>
      <SelectStep />
      <span>step: {step}</span>
      <span>drawnCard: {drawnCard ? drawnCard.id : 'none'}</span>
    </>
  )
}

describe('SelectStep', () => {
  it('renders the selection caption and exactly 15 face-down cards', () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('选择召唤你的那张牌')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /选这张牌/ })).toHaveLength(15)
  })

  it('draws a card and advances to revealing when a fan card is clicked', async () => {
    render(
      <ReadingSessionProvider>
        <StepProbe />
      </ReadingSessionProvider>,
    )
    const cards = screen.getAllByRole('button', { name: /选这张牌/ })
    await userEvent.click(cards[0])

    expect(screen.getByText('step: revealing')).toBeInTheDocument()
    expect(screen.getByText(/drawnCard: major_\d{2}/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- SelectStep`
Expected: FAILS — Vitest cannot resolve `./SelectStep` (doesn't exist yet).

- [ ] **Step 3: Write `src/components/draw/SelectStep.tsx`**

`TarotCard` is called here WITHOUT an `onClick` prop, so per Task 4's implementation it
renders as a bare (non-interactive) face — the real `<button>` lives at this call site,
giving each fan position exactly one interactive element with a correct accessible name,
not a button nested inside another interactive element.

```tsx
import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

const TOTAL_CARDS = 15
const ARC_SPREAD_DEGREES = 50

export default function SelectStep() {
  const { selectCard } = useReadingSession()

  return (
    <div className="flex flex-col items-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      <div className="mb-stack-lg text-center">
        <h1 className="font-display-md text-display-md text-primary mb-2">选择召唤你的那张牌</h1>
        <p className="font-tagline-italic text-tagline-italic text-on-surface-variant italic opacity-80">
          静下心来，跟随你直觉的指引
        </p>
      </div>

      <div className="relative w-full max-w-3xl h-[420px] flex items-end justify-center">
        {Array.from({ length: TOTAL_CARDS }, (_, i) => {
          const angle = (i / (TOTAL_CARDS - 1)) * ARC_SPREAD_DEGREES - ARC_SPREAD_DEGREES / 2
          return (
            <button
              key={i}
              type="button"
              onClick={selectCard}
              aria-label="选这张牌"
              className="absolute bottom-0 left-1/2 w-24 h-40 md:w-32 md:h-52 -ml-12 md:-ml-16 transition-transform duration-500 hover:-translate-y-16 hover:z-50"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'bottom center',
                zIndex: i,
              }}
            >
              <TarotCard flipped={false} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- SelectStep`
Expected: PASS (2 tests passed)

- [ ] **Step 5: Commit**

```bash
git add src/components/draw/SelectStep.tsx src/components/draw/SelectStep.test.tsx
git commit -m "Add SelectStep component with 15-card fan"
```

---

### Task 8: `RevealStep`

**Files:**
- Create: `Tarot Divination Site/src/components/draw/RevealStep.tsx`
- Test: `Tarot Divination Site/src/components/draw/RevealStep.test.tsx`

**Interfaces:**
- Consumes: `useReadingSession()` (`drawnCard`, `finishReveal`) from Task 3, `TarotCard` from Task 4
- Produces: default export `RevealStep` (no props), used by `DrawPage` in Task 10

- [ ] **Step 1: Write the failing test `src/components/draw/RevealStep.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import RevealStep from './RevealStep'

function StepSetup({ onReady }: { onReady: (selectCard: () => void) => void }) {
  const { selectCard, step } = useReadingSession()
  onReady(selectCard)
  return (
    <>
      {step === 'revealing' && <RevealStep />}
      <span>step: {step}</span>
    </>
  )
}

describe('RevealStep', () => {
  it('shows the card face-down with a "TOUCH TO REVEAL" cue, no "查看解读" button yet', async () => {
    let select: () => void = () => {}
    render(
      <ReadingSessionProvider>
        <StepSetup onReady={(fn) => (select = fn)} />
      </ReadingSessionProvider>,
    )
    select()

    expect(screen.queryByRole('button', { name: /查看解读/ })).not.toBeInTheDocument()
  })

  it('flips the card and reveals the "查看解读" button on click, then advances on that button click', async () => {
    let select: () => void = () => {}
    render(
      <ReadingSessionProvider>
        <StepSetup onReady={(fn) => (select = fn)} />
      </ReadingSessionProvider>,
    )
    select()

    const cardButton = screen.getByRole('button', { name: '点击翻牌' })
    await userEvent.click(cardButton)

    const revealButton = await screen.findByRole('button', { name: /查看解读/ })
    await userEvent.click(revealButton)

    expect(screen.getByText('step: result')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- RevealStep`
Expected: FAILS — Vitest cannot resolve `./RevealStep` (doesn't exist yet).

- [ ] **Step 3: Write `src/components/draw/RevealStep.tsx`**

```tsx
import { useState } from 'react'
import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

export default function RevealStep() {
  const { drawnCard, finishReveal } = useReadingSession()
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      <div className="w-72 md:w-80 h-[500px]">
        <TarotCard
          card={drawnCard}
          flipped={isFlipped}
          onClick={isFlipped ? undefined : () => setIsFlipped(true)}
          ariaLabel="点击翻牌"
        />
      </div>

      {isFlipped ? (
        <div className="mt-stack-lg">
          <button
            type="button"
            onClick={finishReveal}
            className="relative px-12 py-3 rounded-full border border-primary/40 bg-surface-container-lowest/30 backdrop-blur-md text-primary font-label-caps text-label-caps tracking-[0.2em] hover:bg-primary/10 transition-all active:scale-95"
          >
            查看解读
          </button>
        </div>
      ) : null}
    </div>
  )
}
```

Note: `onClick` is only set while the card is still face-down (`isFlipped ? undefined : () => setIsFlipped(true)`). Once flipped, `TarotCard` receives no `onClick`, so it renders without a button wrapper and without `aria-hidden` — the revealed image and card name become normally discoverable to assistive tech, rather than staying hidden behind a now-stale "点击翻牌" label forever.

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- RevealStep`
Expected: PASS (2 tests passed)

- [ ] **Step 5: Commit**

```bash
git add src/components/draw/RevealStep.tsx src/components/draw/RevealStep.test.tsx
git commit -m "Add RevealStep component"
```

---

### Task 9: `ResultStep`

**Files:**
- Create: `Tarot Divination Site/src/components/draw/ResultStep.tsx`
- Test: `Tarot Divination Site/src/components/draw/ResultStep.test.tsx`

**Interfaces:**
- Consumes: `useReadingSession()` (`drawnCard`, `question`, `reset`) from Task 3, `TarotCard` from Task 4, `react-router-dom`'s `Link`
- Produces: default export `ResultStep` (no props), used by `DrawPage` in Task 10

- [ ] **Step 1: Write the failing test `src/components/draw/ResultStep.test.tsx`**

```tsx
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import ResultStep from './ResultStep'

// There is no exposed setter for drawnCard (Task 3 deliberately keeps that
// internal to selectCard()), so this test drives the real state machine
// forward via visible buttons, the same proven pattern as
// ReadingSessionContext.test.tsx, rather than calling context setters
// during another component's render (which React does not support safely).
function Harness({ question }: { question: string }) {
  const session = useReadingSession()
  return (
    <div>
      <button onClick={() => session.setQuestion(question)}>setQuestion</button>
      <button onClick={() => session.beginShuffle()}>beginShuffle</button>
      <button onClick={() => session.finishShuffle()}>finishShuffle</button>
      <button onClick={() => session.selectCard()}>selectCard</button>
      <button onClick={() => session.finishReveal()}>finishReveal</button>
      {session.step === 'result' ? <ResultStep /> : null}
    </div>
  )
}

function renderAtResult(question: string) {
  render(
    <MemoryRouter>
      <ReadingSessionProvider>
        <Harness question={question} />
      </ReadingSessionProvider>
    </MemoryRouter>,
  )
  act(() => screen.getByText('setQuestion').click())
  act(() => screen.getByText('beginShuffle').click())
  act(() => screen.getByText('finishShuffle').click())
  act(() => screen.getByText('selectCard').click())
  act(() => screen.getByText('finishReveal').click())
}

describe('ResultStep', () => {
  it('renders the drawn card name, keywords, meaning, and advice', () => {
    renderAtResult('')
    // The actual drawn card is random (real drawCard()), so assert structural
    // presence rather than a specific card's text.
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('给你的建议')).toBeInTheDocument()
    expect(screen.getByText('牌意解读')).toBeInTheDocument()
  })

  it('references the question when one was given', () => {
    renderAtResult('我该如何前进？')
    expect(screen.getByText(/我该如何前进？/)).toBeInTheDocument()
  })

  it('does not reference a question when none was given', () => {
    renderAtResult('')
    expect(screen.queryByText(/关于「/)).not.toBeInTheDocument()
  })

  it('"保存此次占卜" links to /login', () => {
    renderAtResult('')
    expect(screen.getByRole('link', { name: '保存此次占卜' })).toHaveAttribute('href', '/login')
  })

  it('"再抽一张" resets the session back to intention', async () => {
    renderAtResult('')
    await userEvent.click(screen.getByRole('button', { name: /再抽一张/ }))
    expect(screen.queryByText('给你的建议')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- ResultStep`
Expected: FAILS — Vitest cannot resolve `./ResultStep` (doesn't exist yet).

- [ ] **Step 3: Write `src/components/draw/ResultStep.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

const ROMAN_NUMERALS = [
  '0',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
  'XXI',
]

export default function ResultStep() {
  const { drawnCard, question, reset } = useReadingSession()

  if (!drawnCard) {
    return null
  }

  const orientationLabel = drawnCard.orientation === 'upright' ? '正位' : '逆位'

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-20">
      <section className="flex-1 flex flex-col items-center justify-center p-gutter">
        <div className="w-[280px] md:w-[320px] aspect-[2/3.5]">
          <TarotCard card={drawnCard} flipped />
        </div>
        <div className="mt-6 px-6 py-2 rounded-full border border-primary/20 bg-surface-container-low/80 backdrop-blur-md">
          <span className="font-label-caps text-label-caps text-primary">{orientationLabel}</span>
        </div>
      </section>

      <aside className="w-full md:w-[500px] bg-surface-container-lowest/60 backdrop-blur-xl border-l border-primary/20 flex flex-col p-10">
        <div className="space-y-4 mb-stack-lg">
          <span className="font-label-caps text-[12px] tracking-[0.2em] text-primary/70">
            MAJOR ARCANA {ROMAN_NUMERALS[Number(drawnCard.id.replace('major_', ''))]}
          </span>
          <h1 className="font-display-lg text-display-lg text-primary">
            {drawnCard.nameLocal} · {drawnCard.name.toUpperCase()}
          </h1>
          <div className="flex flex-wrap gap-stack-sm pt-2">
            {drawnCard.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-4 py-1.5 rounded-full border border-primary text-primary font-label-caps text-[12px] tracking-widest"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-stack-lg flex-1">
          {question ? (
            <p className="font-tagline-italic text-tagline-italic text-highlight-lavender italic">
              关于「{question}」，星辰的指引是……
            </p>
          ) : null}

          <section>
            <h2 className="font-tagline-italic text-tagline-italic text-highlight-lavender mb-stack-sm italic">
              牌意解读
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {drawnCard.meaning}
            </p>
          </section>

          <section className="bg-surface-container-low/50 p-6 rounded-xl border-l-4 border-primary">
            <h2 className="font-label-caps text-label-caps text-primary mb-stack-sm">给你的建议</h2>
            <p className="font-body-md text-body-md text-on-surface">{drawnCard.advice}</p>
          </section>
        </div>

        <div className="mt-auto pt-stack-lg flex flex-col gap-4">
          <button
            type="button"
            onClick={reset}
            className="w-full py-5 rounded-full bg-primary text-on-primary font-label-caps text-label-caps tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95"
          >
            再抽一张
          </button>
          <Link
            to="/login"
            className="w-full py-5 rounded-full border border-primary/40 font-label-caps text-label-caps text-primary tracking-[0.2em] transition-all hover:bg-primary/5 active:scale-95 text-center"
          >
            保存此次占卜
          </Link>
        </div>
      </aside>
    </div>
  )
}
```

Note: this deliberately does not use `h-screen overflow-hidden` (present in the original mockup) since `ResultStep` renders inside `RootLayout`'s normal document flow (`Nav` above, `Footer` below) rather than owning the full viewport — using `min-h-screen` instead of `h-screen overflow-hidden` lets the page scroll naturally and still show the shared footer, consistent with every other step and with `RootLayout`'s fixed structure.

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- ResultStep`
Expected: PASS (5 tests passed)

- [ ] **Step 5: Commit**

```bash
git add src/components/draw/ResultStep.tsx src/components/draw/ResultStep.test.tsx
git commit -m "Add ResultStep component"
```

---

### Task 10: `DrawPage` orchestrator

**Files:**
- Modify: `Tarot Divination Site/src/pages/DrawPage.tsx`
- Create: `Tarot Divination Site/src/pages/DrawPage.test.tsx`
- Modify: `Tarot Divination Site/src/routes.test.tsx`

**Interfaces:**
- Consumes: `useReadingSession()` from Task 3, all five step components from Tasks 5-9
- Produces: `DrawPage` now renders the real step machine instead of `StubPage`

- [ ] **Step 1: Write the failing test `src/pages/DrawPage.test.tsx`**

```tsx
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ReadingSessionProvider } from '../context/ReadingSessionContext'
import DrawPage from './DrawPage'

function renderDrawPage() {
  render(
    <MemoryRouter>
      <ReadingSessionProvider>
        <DrawPage />
      </ReadingSessionProvider>
    </MemoryRouter>,
  )
}

describe('DrawPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at the intention step', () => {
    renderDrawPage()
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()
  })

  it('walks the full ritual through to a result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDrawPage()

    await user.click(screen.getByRole('button', { name: /开始洗牌/ }))
    expect(screen.getByText('命运正在交织...')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText('选择召唤你的那张牌')).toBeInTheDocument()

    const fanCards = screen.getAllByRole('button', { name: /选这张牌/ })
    await user.click(fanCards[0])

    const cardButton = screen.getByRole('button', { name: '点击翻牌' })
    await user.click(cardButton)
    const revealButton = await screen.findByRole('button', { name: /查看解读/ })
    await user.click(revealButton)

    expect(screen.getByText('给你的建议')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- DrawPage`
Expected: FAILS — the current `DrawPage` renders `StubPage`, none of the ritual text exists.

- [ ] **Step 3: Replace `src/pages/DrawPage.tsx` entirely**

```tsx
import { useReadingSession } from '../context/ReadingSessionContext'
import IntentionStep from '../components/draw/IntentionStep'
import ShuffleStep from '../components/draw/ShuffleStep'
import SelectStep from '../components/draw/SelectStep'
import RevealStep from '../components/draw/RevealStep'
import ResultStep from '../components/draw/ResultStep'

export default function DrawPage() {
  const { step } = useReadingSession()

  switch (step) {
    case 'intention':
      return <IntentionStep />
    case 'shuffling':
      return <ShuffleStep />
    case 'selecting':
      return <SelectStep />
    case 'revealing':
      return <RevealStep />
    case 'result':
      return <ResultStep />
    default:
      return null
  }
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npm test -- DrawPage`
Expected: PASS (2 tests passed)

- [ ] **Step 5: Update the `/draw` case in `src/routes.test.tsx`**

The existing case expects the old stub text. Replace:

```tsx
  it('renders the draw page at /draw', () => {
    renderAtPath('/draw')
    expect(screen.getByText(/抽牌占卜页面正在筹备中/)).toBeInTheDocument()
  })
```

with:

```tsx
  it('renders the draw page at /draw', () => {
    renderAtPath('/draw')
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()
  })
```

(This is the only change to that file — every other test case, including the ones for `/encyclopedia`, `/about`, `/login`, `/register`, `/profile`, and the RootLayout-wrap check, stays exactly as-is.)

Note: `src/routes.test.tsx` renders routes via `createMemoryRouter(routes, ...)`, and `routes.tsx` wraps everything in `RootLayout` but NOT in `ReadingSessionProvider` (that provider lives in `App.tsx`, one level above the router — see Task 3 Step 5). Since `DrawPage` now calls `useReadingSession()`, and the test-time default context value (defined in `ReadingSessionContext.tsx`'s `createContext(...)` call) has `step: 'intention'`, the `/draw` route will render `IntentionStep` correctly even without an explicit provider in this particular test file — no test infrastructure change beyond the text assertion above is needed. If this assumption turns out wrong when you run the test, wrap the `renderAtPath` helper's `<RouterProvider>` in a `<ReadingSessionProvider>` in `routes.test.tsx` and note that as a deviation in your report.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/pages/DrawPage.tsx src/pages/DrawPage.test.tsx src/routes.test.tsx
git commit -m "Wire DrawPage to the ritual step state machine"
```

---

### Task 11: Final integration validation

**Files:**
- None (verification-only task)

**Interfaces:**
- Consumes: everything from Tasks 1-10
- Produces: nothing new

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass (App/Nav/Footer/AtmosphereLayer/RootLayout/routes/tokens/cards/AuthContext/ReadingSessionContext/HomePage/drawCard/TarotCard/IntentionStep/ShuffleStep/SelectStep/RevealStep/ResultStep/DrawPage suites).

- [ ] **Step 2: Run lint and the production build**

Run: `npm run lint`
Expected: exits 0, no errors.

Run: `npm run build`
Expected: completes with no TypeScript or build errors.

- [ ] **Step 3: Visual walkthrough**

Per this project's established environment constraint, use `npm run build && npm run preview` (port 4173) rather than `npm run dev` for browser verification — the dev server's esbuild dependency-optimizer service is known to crash in this sandbox (see the app-scaffold plan's Task 11 notes); the production preview server does not hit this issue.

Navigate to `/draw` and walk the full ritual by hand: type a question, click "开始洗牌", wait for the 2-second shuffle, click a fan card, click the card to flip it, click "查看解读", and confirm the result panel shows a real card image (not a broken image icon — this specifically validates Task 1's downloaded images resolve correctly at their `/assets/tarot/majNN.jpg` paths), the correct keywords/meaning/advice for whichever card was drawn, and the question text if one was given. Click "再抽一张" and confirm it returns to the intention step. Click "保存此次占卜" on a fresh reading and confirm it navigates to `/login`.

- [ ] **Step 4: Check console errors across the ritual**

Use `read_console_messages` after each step transition during the walkthrough above. Expected: no errors at any point (warnings from React Router's future-flag notice, already present before this sub-project, are fine).
