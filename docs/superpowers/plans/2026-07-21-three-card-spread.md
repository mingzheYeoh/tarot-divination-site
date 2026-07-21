# Three-Card Spread Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 3-card Past/Present/Future spread to the existing single-card draw ritual — a new spread-selection step, a repeating draw-without-replacement loop for 3 distinct cards, and a position-aware result page with a template-generated synthesis paragraph.

**Architecture:** Extend `ReadingSessionContext`'s existing single-card state machine to be spread-aware (new `'spread-select'` ritual step, `drawnCards: DrawnCard[]` history, exclude-by-id retry in `selectCard()`, position-count-aware routing in `finishReveal()`) rather than building a parallel state machine. `SelectStep.tsx` and `drawCard.ts` need zero changes — both are already spread-agnostic. Two new components (`SpreadSelectStep`, `ThreeCardResultStep`) and one modified component (`RevealStep`, for a position counter).

**Tech Stack:** Same as the rest of the app — React 18, TypeScript, Vitest, Testing Library, React Router.

## Global Constraints

- `RitualStep` gains `'spread-select'` as a new first step (spec: Architecture)
- `SpreadType` is unchanged (`'single' | 'three-card' | 'celtic-cross' | null`) — this plan only ever produces `'single'` or `'three-card'`; the picker screen does not offer Celtic Cross yet (spec: Architecture)
- Draw without replacement: a 3-card reading never repeats a card id. Implemented as an exclude-by-id retry loop in `ReadingSessionContext.selectCard()` — `drawCard.ts` is NOT modified (spec: Decisions)
- Position labels are fixed: `['过去', '现在', '未来']`, index-matched to draw order (card 0 = past, 1 = present, 2 = future) (spec: Component Breakdown)
- No new position-specific content — each position shows that card's own existing `upright_meaning`/`reversed_meaning`/advice verbatim (spec: Decisions)
- Synthesis paragraph is a fixed template using each card's first keyword:
  `` `过去的${cards[0].keywords[0]}，与现在的${cards[1].keywords[0]}交织，指向未来的${cards[2].keywords[0]}。` `` (spec: Decisions)
- The spread-select screen has no Stitch mockup — built directly with the app's existing design tokens (same classes already used by `IntentionStep`/`ResultStep`), not a new Stitch pass (spec: Decisions)
- `reset()` now returns to `'spread-select'` (was `'intention'`) — an intentional behavior change, not a regression (spec: Decisions, Breaking Changes)
- `SelectStep.tsx` requires ZERO changes — it is already spread-agnostic (clicking any of its 15 fan cards just calls `selectCard()`, which doesn't care which visual card was clicked)
- Repo: working directly on `master`, no feature branch (established project convention)

---

### Task 1: Expand ReadingSessionContext for three-card spread support

**Files:**
- Modify: `Tarot Divination Site/src/context/ReadingSessionContext.tsx`
- Modify: `Tarot Divination Site/src/context/ReadingSessionContext.test.tsx`

**Interfaces:**
- Consumes: `drawCard()` from `../lib/drawCard` (unchanged signature)
- Produces: `selectSpread: (spread: 'single' | 'three-card') => void`, `drawnCards: DrawnCard[]` on `ReadingSessionValue`, consumed by Task 2 (`SpreadSelectStep`), Task 3 (`RevealStep`), and Task 4 (`ThreeCardResultStep`)

This task deliberately does NOT yet change the initial `step` default or `reset()`'s step target away from `'intention'` — that flip is Task 5's job, bundled with the `DrawPage` wiring that actually makes `'spread-select'` reachable through the UI. Doing it here would leave `DrawPage`/`routes` rendering nothing (their switch has no `'spread-select'` case yet) and break their existing tests for no reason — this task only adds capability, fully backward-compatible with every existing test.

Current `ReadingSessionContext.tsx`:
```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import { drawCard, type DrawnCard, type CardStructure, type CardContent } from '../lib/drawCard'
import majorStructure from '../data/cards-major.json'
import majorContent from '../data/cards-major.zh.json'
import minorStructure from '../data/cards-minor.json'
import minorContent from '../data/cards-minor.zh.json'

const allStructure = [...majorStructure, ...minorStructure] as unknown as CardStructure[]
const allContent = {
  ...majorContent,
  ...minorContent,
} as unknown as Record<string, CardContent>

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
      const card = drawCard(allStructure, allContent)
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

- [ ] **Step 1: Write the failing tests**

Replace `ReadingSessionContext.test.tsx` entirely with:

```tsx
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from './ReadingSessionContext'

function Probe() {
  const session = useReadingSession()
  return (
    <div>
      <span>step: {session.step}</span>
      <span>question: {session.question || 'none'}</span>
      <span>activeSpread: {session.activeSpread ?? 'none'}</span>
      <span>drawnCard: {session.drawnCard ? session.drawnCard.id : 'none'}</span>
      <span>drawnCards: {session.drawnCards.length}</span>
      <button onClick={() => session.setQuestion('我该如何前进？')}>setQuestion</button>
      <button onClick={() => session.selectSpread('single')}>selectSpread:single</button>
      <button onClick={() => session.selectSpread('three-card')}>selectSpread:three-card</button>
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
    expect(
      screen.getByText(/drawnCard: (major|wands|cups|swords|pentacles)_\d{2}/),
    ).toBeInTheDocument()

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
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('activeSpread: none')).toBeInTheDocument()
  })

  it('selectSpread sets activeSpread and advances to the intention step', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('selectSpread:three-card').click())
    expect(screen.getByText('activeSpread: three-card')).toBeInTheDocument()
    expect(screen.getByText('step: intention')).toBeInTheDocument()
  })

  it('reset also clears drawnCards and activeSpread', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('selectSpread:three-card').click())
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())
    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCards: 1')).toBeInTheDocument()

    act(() => screen.getByText('reset').click())
    expect(screen.getByText('activeSpread: none')).toBeInTheDocument()
    expect(screen.getByText('drawnCards: 0')).toBeInTheDocument()
  })

  it('a three-card spread draws three cards and only reaches result after the third reveal', () => {
    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('selectSpread:three-card').click())
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('step: revealing')).toBeInTheDocument()
    expect(screen.getByText('drawnCards: 1')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: selecting')).toBeInTheDocument()

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCards: 2')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: selecting')).toBeInTheDocument()

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCards: 3')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())
    expect(screen.getByText('step: result')).toBeInTheDocument()
  })

  it('never draws a duplicate card id across 200 repeated three-card readings', () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const { unmount } = render(
        <ReadingSessionProvider>
          <Probe />
        </ReadingSessionProvider>,
      )
      act(() => screen.getByText('selectSpread:three-card').click())
      act(() => screen.getByText('beginShuffle').click())
      act(() => screen.getByText('finishShuffle').click())

      const ids: string[] = []
      for (let position = 0; position < 3; position++) {
        act(() => screen.getByText('selectCard').click())
        const text = screen.getByText(/^drawnCard: /).textContent ?? ''
        ids.push(text.replace('drawnCard: ', ''))
        act(() => screen.getByText('finishReveal').click())
      }
      expect(new Set(ids).size).toBe(3)
      unmount()
    }
  })

  it('forces a same-index collision on the second draw and proves the retry loop skips the duplicate', () => {
    // drawCard() calls Math.random() twice per invocation (index, then
    // orientation) -- a REJECTED attempt still consumes both calls before
    // the retry loop tries again, so the mock sequence below has 8 values
    // for what ends up being 3 accepted cards (2 + 2 + 2 + 2, since the
    // second position's first attempt collides and is discarded).
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy
      .mockReturnValueOnce(22.5 / 78) // draw 1 index -> wands_01
      .mockReturnValueOnce(0.1) // draw 1 orientation -> upright
      .mockReturnValueOnce(22.5 / 78) // draw 2 attempt 1 index -> wands_01 (collision, rejected)
      .mockReturnValueOnce(0.1) // draw 2 attempt 1 orientation (discarded along with the rejected card)
      .mockReturnValueOnce(23.5 / 78) // draw 2 attempt 2 (retry) index -> wands_02
      .mockReturnValueOnce(0.1) // draw 2 attempt 2 orientation -> upright
      .mockReturnValueOnce(24.5 / 78) // draw 3 index -> wands_03
      .mockReturnValueOnce(0.1) // draw 3 orientation -> upright

    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('selectSpread:three-card').click())
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCard: wands_01')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCard: wands_02')).toBeInTheDocument()
    act(() => screen.getByText('finishReveal').click())

    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCard: wands_03')).toBeInTheDocument()

    randomSpy.mockRestore()
  })
})
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `npm test -- src/context/ReadingSessionContext.test.tsx`
Expected: FAIL — `session.selectSpread is not a function` (and `session.drawnCards` is `undefined`) for every new test; the 4 pre-existing tests still pass unchanged.

- [ ] **Step 3: Implement the context changes**

Replace `ReadingSessionContext.tsx` entirely with:

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import { drawCard, type DrawnCard, type CardStructure, type CardContent } from '../lib/drawCard'
import majorStructure from '../data/cards-major.json'
import majorContent from '../data/cards-major.zh.json'
import minorStructure from '../data/cards-minor.json'
import minorContent from '../data/cards-minor.zh.json'

const allStructure = [...majorStructure, ...minorStructure] as unknown as CardStructure[]
const allContent = {
  ...majorContent,
  ...minorContent,
} as unknown as Record<string, CardContent>

export type SpreadType = 'single' | 'three-card' | 'celtic-cross' | null

export type RitualStep =
  | 'spread-select'
  | 'intention'
  | 'shuffling'
  | 'selecting'
  | 'revealing'
  | 'result'

interface ReadingSessionValue {
  activeSpread: SpreadType
  step: RitualStep
  question: string
  drawnCard: DrawnCard | null
  drawnCards: DrawnCard[]
  setQuestion: (question: string) => void
  selectSpread: (spread: 'single' | 'three-card') => void
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
  drawnCards: [],
  setQuestion: noop,
  selectSpread: noop,
  beginShuffle: noop,
  finishShuffle: noop,
  selectCard: noop,
  finishReveal: noop,
  reset: noop,
})

export function ReadingSessionProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<RitualStep>('intention')
  const [activeSpread, setActiveSpread] = useState<SpreadType>(null)
  const [question, setQuestionState] = useState('')
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null)
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])

  const value: ReadingSessionValue = {
    activeSpread,
    step,
    question,
    drawnCard,
    drawnCards,
    setQuestion: (nextQuestion: string) => setQuestionState(nextQuestion),
    selectSpread: (spread) => {
      setActiveSpread(spread)
      setStep('intention')
    },
    beginShuffle: () => setStep('shuffling'),
    finishShuffle: () => setStep('selecting'),
    selectCard: () => {
      const excludedIds = new Set(drawnCards.map((c) => c.id))
      let card = drawCard(allStructure, allContent)
      while (excludedIds.has(card.id)) {
        card = drawCard(allStructure, allContent)
      }
      setDrawnCard(card)
      setDrawnCards((prev) => [...prev, card])
      setStep('revealing')
    },
    finishReveal: () => {
      const totalPositions = activeSpread === 'three-card' ? 3 : 1
      if (drawnCards.length < totalPositions) {
        setStep('selecting')
      } else {
        setStep('result')
      }
    },
    reset: () => {
      setStep('intention')
      setQuestionState('')
      setDrawnCard(null)
      setDrawnCards([])
      setActiveSpread(null)
    },
  }

  return <ReadingSessionContext.Provider value={value}>{children}</ReadingSessionContext.Provider>
}

export function useReadingSession() {
  return useContext(ReadingSessionContext)
}
```

Note: `step`'s initial `useState` value and `reset()`'s step target are still `'intention'` here — Task 5 flips both to `'spread-select'` once `DrawPage` can actually render that step.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/context/ReadingSessionContext.test.tsx`
Expected: PASS, all 9 tests green

- [ ] **Step 5: Run the full test suite to confirm no regressions**

Run: `npm test`
Expected: PASS — all other existing suites remain green (nothing else references `drawnCards`/`selectSpread` yet)

- [ ] **Step 6: Commit**

```bash
cd "Tarot Divination Site"
git add src/context/ReadingSessionContext.tsx src/context/ReadingSessionContext.test.tsx
git commit -m "Add three-card spread support to ReadingSessionContext"
```

---

### Task 2: SpreadSelectStep component

**Files:**
- Create: `Tarot Divination Site/src/components/draw/SpreadSelectStep.tsx`
- Create: `Tarot Divination Site/src/components/draw/SpreadSelectStep.test.tsx`

**Interfaces:**
- Consumes: `selectSpread`, `activeSpread`, `step` from `useReadingSession()` (Task 1)
- Produces: a component rendering two option buttons; not yet wired into `DrawPage` (Task 5 does that) — this task tests it standalone, wrapped directly in `ReadingSessionProvider`

No Stitch mockup exists for this screen (spec: Decisions) — built directly from the app's existing design tokens, matching `IntentionStep.tsx`'s established classes (`font-display-lg`/`text-display-lg` heading, `font-tagline-italic` subtext, `rounded-full`/`border-primary` button styling).

- [ ] **Step 1: Write the failing test**

Create `SpreadSelectStep.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import SpreadSelectStep from './SpreadSelectStep'

function StateProbe() {
  const { activeSpread, step } = useReadingSession()
  return (
    <span>
      activeSpread: {activeSpread ?? 'none'}, step: {step}
    </span>
  )
}

describe('SpreadSelectStep', () => {
  it('renders both spread options', () => {
    render(
      <ReadingSessionProvider>
        <SpreadSelectStep />
      </ReadingSessionProvider>,
    )
    expect(screen.getByText('单张指引')).toBeInTheDocument()
    expect(screen.getByText('三牌阵 · 过去现在未来')).toBeInTheDocument()
  })

  it('choosing 单张指引 sets activeSpread to single and advances to intention', async () => {
    render(
      <ReadingSessionProvider>
        <SpreadSelectStep />
        <StateProbe />
      </ReadingSessionProvider>,
    )
    await userEvent.click(screen.getByText('单张指引'))
    expect(screen.getByText('activeSpread: single, step: intention')).toBeInTheDocument()
  })

  it('choosing 三牌阵 sets activeSpread to three-card and advances to intention', async () => {
    render(
      <ReadingSessionProvider>
        <SpreadSelectStep />
        <StateProbe />
      </ReadingSessionProvider>,
    )
    await userEvent.click(screen.getByText('三牌阵 · 过去现在未来'))
    expect(screen.getByText('activeSpread: three-card, step: intention')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/draw/SpreadSelectStep.test.tsx`
Expected: FAIL — `Cannot find module './SpreadSelectStep'`

- [ ] **Step 3: Write the component**

Create `SpreadSelectStep.tsx`:

```tsx
import { useReadingSession } from '../../context/ReadingSessionContext'

export default function SpreadSelectStep() {
  const { selectSpread } = useReadingSession()

  return (
    <div className="flex flex-col items-center text-center gap-stack-lg px-margin-mobile pt-32 pb-section-padding min-h-screen justify-center">
      <h1 className="font-display-lg text-display-lg text-highlight-lavender drop-shadow-[0_0_10px_rgba(232,223,255,0.5)]">
        选择你的牌阵
      </h1>

      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-stack-md mt-8">
        <button
          type="button"
          onClick={() => selectSpread('single')}
          className="flex-1 rounded-2xl border border-primary/40 bg-surface-container-lowest/30 backdrop-blur-md px-8 py-10 text-center transition-all duration-500 hover:scale-105 hover:border-primary active:scale-95"
        >
          <span className="block font-display-md text-display-md text-primary mb-stack-sm">
            单张指引
          </span>
          <span className="block font-tagline-italic text-tagline-italic text-on-surface-variant italic opacity-80">
            抽一张牌，获得当下的直接指引
          </span>
        </button>

        <button
          type="button"
          onClick={() => selectSpread('three-card')}
          className="flex-1 rounded-2xl border border-primary/40 bg-surface-container-lowest/30 backdrop-blur-md px-8 py-10 text-center transition-all duration-500 hover:scale-105 hover:border-primary active:scale-95"
        >
          <span className="block font-display-md text-display-md text-primary mb-stack-sm">
            三牌阵 · 过去现在未来
          </span>
          <span className="block font-tagline-italic text-tagline-italic text-on-surface-variant italic opacity-80">
            抽三张牌，展开一段完整的时间线索
          </span>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/draw/SpreadSelectStep.test.tsx`
Expected: PASS, all 3 tests green

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: PASS, no regressions

- [ ] **Step 6: Commit**

```bash
cd "Tarot Divination Site"
git add src/components/draw/SpreadSelectStep.tsx src/components/draw/SpreadSelectStep.test.tsx
git commit -m "Add SpreadSelectStep component"
```

---

### Task 3: RevealStep position counter and dynamic button label

**Files:**
- Modify: `Tarot Divination Site/src/components/draw/RevealStep.tsx`
- Modify: `Tarot Divination Site/src/components/draw/RevealStep.test.tsx`

**Interfaces:**
- Consumes: `drawnCard`, `drawnCards`, `activeSpread`, `finishReveal` from `useReadingSession()` (Task 1)
- Produces: no new exports; existing single-card behavior (button always reads "查看解读", no counter) is unchanged when `activeSpread` is `null` or `'single'`

Current `RevealStep.tsx`:
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
          onClick={() => setIsFlipped(true)}
          ariaLabel={
            isFlipped && drawnCard ? `${drawnCard.nameLocal} · ${drawnCard.name}` : '点击翻牌'
          }
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

Current `RevealStep.test.tsx` (3 existing tests — do not remove or modify these, only add a new `describe` block below them):
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
    await screen.findByText('step: revealing')

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
    await screen.findByText('step: revealing')

    const cardButton = screen.getByRole('button', { name: '点击翻牌' })
    await userEvent.click(cardButton)

    expect(screen.queryByRole('button', { name: '点击翻牌' })).not.toBeInTheDocument()

    const revealButton = await screen.findByRole('button', { name: /查看解读/ })
    await userEvent.click(revealButton)

    expect(screen.getByText('step: result')).toBeInTheDocument()
  })

  it('keeps the card as an interactive button (not a bare div) after it is flipped', async () => {
    let select: () => void = () => {}
    render(
      <ReadingSessionProvider>
        <StepSetup onReady={(fn) => (select = fn)} />
      </ReadingSessionProvider>,
    )
    select()
    await screen.findByText('step: revealing')

    const cardButton = screen.getByRole('button', { name: '点击翻牌' })
    await userEvent.click(cardButton)

    const flippedCardButton = screen.getByRole('button', { name: /·/ })
    expect(flippedCardButton).toBeInTheDocument()
    expect(flippedCardButton).not.toHaveAccessibleName('点击翻牌')
  })
})
```

- [ ] **Step 1: Write the failing test**

Append this new `describe` block to the end of `RevealStep.test.tsx` (after the existing `describe('RevealStep', ...)` block, same file):

```tsx

describe('RevealStep with a three-card spread', () => {
  function ThreeCardSetup({
    onReady,
  }: {
    onReady: (actions: {
      selectSpread: () => void
      selectCard: () => void
      finishReveal: () => void
    }) => void
  }) {
    const { selectSpread, selectCard, finishReveal, step } = useReadingSession()
    onReady({
      selectSpread: () => selectSpread('three-card'),
      selectCard,
      finishReveal,
    })
    return (
      <>
        {step === 'revealing' && <RevealStep />}
        <span>step: {step}</span>
      </>
    )
  }

  it('shows a "1 / 3" counter and "揭示下一张" for the first two cards, then "查看解读" for the third', async () => {
    let actions = {
      selectSpread: () => {},
      selectCard: () => {},
      finishReveal: () => {},
    }
    render(
      <ReadingSessionProvider>
        <ThreeCardSetup onReady={(a) => (actions = a)} />
      </ReadingSessionProvider>,
    )
    actions.selectSpread()

    actions.selectCard()
    await screen.findByText('step: revealing')
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '点击翻牌' }))
    expect(screen.getByRole('button', { name: '揭示下一张' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '揭示下一张' }))
    await screen.findByText('step: selecting')

    actions.selectCard()
    await screen.findByText('step: revealing')
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '点击翻牌' }))
    expect(screen.getByRole('button', { name: '揭示下一张' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '揭示下一张' }))
    await screen.findByText('step: selecting')

    actions.selectCard()
    await screen.findByText('step: revealing')
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '点击翻牌' }))
    expect(screen.getByRole('button', { name: '查看解读' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '查看解读' }))
    expect(screen.getByText('step: result')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/draw/RevealStep.test.tsx`
Expected: FAIL on the new test — current `RevealStep` renders no "1 / 3" counter and its button always reads "查看解读", never "揭示下一张". The 3 pre-existing tests still pass.

- [ ] **Step 3: Implement the counter and dynamic label**

Replace `RevealStep.tsx` entirely with:

```tsx
import { useState } from 'react'
import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

export default function RevealStep() {
  const { drawnCard, drawnCards, activeSpread, finishReveal } = useReadingSession()
  const [isFlipped, setIsFlipped] = useState(false)

  const totalPositions = activeSpread === 'three-card' ? 3 : 1
  const currentPosition = drawnCards.length
  const isLastPosition = currentPosition >= totalPositions

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      {totalPositions > 1 ? (
        <p className="mb-stack-md font-label-caps text-label-caps text-primary tracking-[0.3em]">
          {currentPosition} / {totalPositions}
        </p>
      ) : null}

      <div className="w-72 md:w-80 h-[500px]">
        <TarotCard
          card={drawnCard}
          flipped={isFlipped}
          onClick={() => setIsFlipped(true)}
          ariaLabel={
            isFlipped && drawnCard ? `${drawnCard.nameLocal} · ${drawnCard.name}` : '点击翻牌'
          }
        />
      </div>

      {isFlipped ? (
        <div className="mt-stack-lg">
          <button
            type="button"
            onClick={finishReveal}
            className="relative px-12 py-3 rounded-full border border-primary/40 bg-surface-container-lowest/30 backdrop-blur-md text-primary font-label-caps text-label-caps tracking-[0.2em] hover:bg-primary/10 transition-all active:scale-95"
          >
            {isLastPosition ? '查看解读' : '揭示下一张'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/draw/RevealStep.test.tsx`
Expected: PASS, all 4 tests green (3 existing + 1 new)

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: PASS, no regressions

- [ ] **Step 6: Commit**

```bash
cd "Tarot Divination Site"
git add src/components/draw/RevealStep.tsx src/components/draw/RevealStep.test.tsx
git commit -m "Add position counter and dynamic button label to RevealStep"
```

---

### Task 4: ThreeCardResultStep component

**Files:**
- Create: `Tarot Divination Site/src/components/draw/ThreeCardResultStep.tsx`
- Create: `Tarot Divination Site/src/components/draw/ThreeCardResultStep.test.tsx`

**Interfaces:**
- Consumes: `drawnCards`, `question`, `reset`, `selectSpread`, `setQuestion`, `beginShuffle`, `finishShuffle`, `selectCard`, `finishReveal` from `useReadingSession()` (Task 1); `TarotCard` from `./TarotCard` (unchanged)
- Produces: a component rendering 3 position-labeled card panels + a synthesis paragraph; not yet wired into `DrawPage` (Task 5 does that) — this task tests it standalone via a Provider+Harness, matching the existing `ResultStep.test.tsx` pattern

- [ ] **Step 1: Write the failing test**

Create `ThreeCardResultStep.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ReadingSessionProvider, useReadingSession } from '../../context/ReadingSessionContext'
import ThreeCardResultStep from './ThreeCardResultStep'

function Harness({ question }: { question: string }) {
  const session = useReadingSession()
  return (
    <div>
      <button onClick={() => session.selectSpread('three-card')}>selectSpread</button>
      <button onClick={() => session.setQuestion(question)}>setQuestion</button>
      <button onClick={() => session.beginShuffle()}>beginShuffle</button>
      <button onClick={() => session.finishShuffle()}>finishShuffle</button>
      <button onClick={() => session.selectCard()}>selectCard</button>
      <button onClick={() => session.finishReveal()}>finishReveal</button>
      {session.step === 'result' ? <ThreeCardResultStep /> : null}
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
  act(() => screen.getByText('selectSpread').click())
  act(() => screen.getByText('setQuestion').click())
  act(() => screen.getByText('beginShuffle').click())
  act(() => screen.getByText('finishShuffle').click())
  act(() => screen.getByText('selectCard').click())
  act(() => screen.getByText('finishReveal').click())
  act(() => screen.getByText('selectCard').click())
  act(() => screen.getByText('finishReveal').click())
  act(() => screen.getByText('selectCard').click())
  act(() => screen.getByText('finishReveal').click())
}

describe('ThreeCardResultStep', () => {
  it('renders all three positions labeled 过去/现在/未来 in order', () => {
    renderAtResult('')
    const labels = screen.getAllByText(/^(过去|现在|未来)$/)
    expect(labels.map((el) => el.textContent)).toEqual(['过去', '现在', '未来'])
  })

  it('renders three cards, each with real card art, and the synthesis panel', () => {
    renderAtResult('')
    expect(screen.getAllByRole('img')).toHaveLength(3)
    expect(screen.getByText('整体指引')).toBeInTheDocument()
  })

  it('shows a synthesis paragraph built from a deterministic three-card draw', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    // Card 1: major_00 (The Fool), upright -- keywords: 新的开始/冒险/天真信任
    randomSpy.mockReturnValueOnce(0.5 / 78).mockReturnValueOnce(0.1)
    // Card 2: major_01 (The Magician), upright -- keywords: 创造力/意志力/资源整合
    randomSpy.mockReturnValueOnce(1.5 / 78).mockReturnValueOnce(0.1)
    // Card 3: major_02 (The High Priestess), upright -- keywords: 直觉/潜意识/隐藏的智慧
    randomSpy.mockReturnValueOnce(2.5 / 78).mockReturnValueOnce(0.1)

    renderAtResult('')

    expect(
      screen.getByText('过去的新的开始，与现在的创造力交织，指向未来的直觉。'),
    ).toBeInTheDocument()

    randomSpy.mockRestore()
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

  it('"再抽一张" resets the session away from the result step', async () => {
    renderAtResult('')
    await userEvent.click(screen.getByRole('button', { name: /再抽一张/ }))
    expect(screen.queryByText('整体指引')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/draw/ThreeCardResultStep.test.tsx`
Expected: FAIL — `Cannot find module './ThreeCardResultStep'`

- [ ] **Step 3: Write the component**

Create `ThreeCardResultStep.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

const POSITION_LABELS = ['过去', '现在', '未来']

export default function ThreeCardResultStep() {
  const { drawnCards, question, reset } = useReadingSession()

  if (drawnCards.length < 3) {
    return null
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      {question ? (
        <p className="mb-stack-lg font-tagline-italic text-tagline-italic text-highlight-lavender italic">
          关于「{question}」，星辰的指引是……
        </p>
      ) : null}

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
        {drawnCards.map((card, index) => {
          const orientationLabel = card.orientation === 'upright' ? '正位' : '逆位'
          return (
            <div key={card.id} className="flex flex-col items-center text-center">
              <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] mb-stack-sm">
                {POSITION_LABELS[index]}
              </span>
              <div className="w-40 md:w-48 aspect-[2/3.5] mb-stack-sm">
                <TarotCard card={card} flipped />
              </div>
              <h2 className="font-display-md text-display-md text-primary mb-1">
                {card.nameLocal} · {card.name.toUpperCase()}
              </h2>
              <span className="font-label-caps text-[11px] text-primary/70 tracking-[0.2em] mb-stack-sm">
                {orientationLabel}
              </span>
              <div className="flex flex-wrap justify-center gap-2 mb-stack-sm">
                {card.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 rounded-full border border-primary text-primary font-label-caps text-[11px] tracking-widest"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-stack-sm">
                {card.meaning}
              </p>
              <p className="font-body-md text-body-md text-on-surface bg-surface-container-low/50 p-4 rounded-xl border-l-4 border-primary w-full">
                {card.advice}
              </p>
            </div>
          )
        })}
      </div>

      <section className="w-full max-w-3xl mt-stack-lg bg-surface-container-low/50 p-6 rounded-xl border-l-4 border-primary">
        <h2 className="font-label-caps text-label-caps text-primary mb-stack-sm">整体指引</h2>
        <p className="font-body-md text-body-md text-on-surface">
          过去的{drawnCards[0].keywords[0]}，与现在的{drawnCards[1].keywords[0]}交织，指向未来的
          {drawnCards[2].keywords[0]}。
        </p>
      </section>

      <div className="mt-stack-lg flex flex-col gap-4 w-full max-w-md">
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
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/draw/ThreeCardResultStep.test.tsx`
Expected: PASS, all 7 tests green

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: PASS, no regressions

- [ ] **Step 6: Commit**

```bash
cd "Tarot Divination Site"
git add src/components/draw/ThreeCardResultStep.tsx src/components/draw/ThreeCardResultStep.test.tsx
git commit -m "Add ThreeCardResultStep component"
```

---

### Task 5: Wire DrawPage and flip the spread-select defaults

**Files:**
- Modify: `Tarot Divination Site/src/pages/DrawPage.tsx`
- Modify: `Tarot Divination Site/src/context/ReadingSessionContext.tsx`
- Modify: `Tarot Divination Site/src/pages/DrawPage.test.tsx`
- Modify: `Tarot Divination Site/src/routes.test.tsx`

**Interfaces:**
- Consumes: `SpreadSelectStep` (Task 2), `ThreeCardResultStep` (Task 4), all `ReadingSessionContext` exports (Task 1)
- Produces: `/draw` now starts on the spread picker; this is the task that makes `'spread-select'` reachable through the real UI

This is the one task in this plan that intentionally changes existing, already-shipped behavior: the ritual's entry point moves from `'intention'` to `'spread-select'`, and `reset()` now returns there instead of `'intention'`. Every test touched below is touched for that reason, not because of a regression.

**Note on `ResultStep.test.tsx`**: the spec assumed this file would also need a `selectSpread` call added to its click sequence. That turns out to be unnecessary — `ResultStep.test.tsx` renders `ResultStep` directly through its own `Harness` (not through `DrawPage`), and `finishReveal()`'s routing is unchanged for any `activeSpread` value other than `'three-card'` (including the `null` that `ResultStep.test.tsx` never overrides). Do not modify `ResultStep.test.tsx` — Step 6 below explicitly confirms it still passes untouched.

Current `DrawPage.tsx`:
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

Current `routes.test.tsx`:
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
    expect(screen.getByRole('heading', { name: '夜语塔罗' })).toBeInTheDocument()
  })

  it('renders the draw page at /draw', () => {
    renderAtPath('/draw')
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()
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

- [ ] **Step 1: Update the failing tests**

Replace `DrawPage.test.tsx` entirely with:

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
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at the spread-select step', () => {
    renderDrawPage()
    expect(screen.getByText('选择你的牌阵')).toBeInTheDocument()
  })

  it('walks the full single-card ritual through to a result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDrawPage()

    await user.click(screen.getByText('单张指引'))
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()

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

  it('walks the full three-card ritual through to a position-labeled result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderDrawPage()

    await user.click(screen.getByText('三牌阵 · 过去现在未来'))
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /开始洗牌/ }))
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText('选择召唤你的那张牌')).toBeInTheDocument()

    for (let position = 0; position < 3; position++) {
      const fanCards = screen.getAllByRole('button', { name: /选这张牌/ })
      await user.click(fanCards[0])

      const cardButton = screen.getByRole('button', { name: '点击翻牌' })
      await user.click(cardButton)

      const isLast = position === 2
      const nextButton = await screen.findByRole('button', {
        name: isLast ? '查看解读' : '揭示下一张',
      })
      await user.click(nextButton)

      if (!isLast) {
        expect(screen.getByText('选择召唤你的那张牌')).toBeInTheDocument()
      }
    }

    expect(screen.getByText('整体指引')).toBeInTheDocument()
  })
})
```

Replace `routes.test.tsx` entirely with:

```tsx
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { routes } from './routes'
import { ReadingSessionProvider } from './context/ReadingSessionContext'

function renderAtPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <ReadingSessionProvider>
      <RouterProvider router={router} />
    </ReadingSessionProvider>,
  )
}

describe('routes', () => {
  it('renders the home page at /', () => {
    renderAtPath('/')
    expect(screen.getByRole('heading', { name: '夜语塔罗' })).toBeInTheDocument()
  })

  it('renders the draw page at /draw', () => {
    renderAtPath('/draw')
    expect(screen.getByText('选择你的牌阵')).toBeInTheDocument()
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

In `ReadingSessionContext.test.tsx`, change these two existing assertions (leave everything else in that file untouched):
- In `'starts at the intention step with no question and no drawn card'`: change `expect(screen.getByText('step: intention')).toBeInTheDocument()` to `expect(screen.getByText('step: spread-select')).toBeInTheDocument()`, and rename the test to `'starts at the spread-select step with no question and no drawn card'`.
- In `'reset returns to intention and clears question and drawn card'`: change the post-reset `expect(screen.getByText('step: intention')).toBeInTheDocument()` to `expect(screen.getByText('step: spread-select')).toBeInTheDocument()`, and rename the test to `'reset returns to spread-select and clears question and drawn card'`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/pages/DrawPage.test.tsx src/routes.test.tsx src/context/ReadingSessionContext.test.tsx`
Expected: FAIL — `DrawPage` still has no `'spread-select'` case (renders nothing, so `'选择你的牌阵'`/`'单张指引'`/`'三牌阵...'` are never found), and `ReadingSessionContext`'s initial/reset step is still `'intention'`.

- [ ] **Step 3: Wire DrawPage**

Replace `DrawPage.tsx` entirely with:

```tsx
import { useReadingSession } from '../context/ReadingSessionContext'
import SpreadSelectStep from '../components/draw/SpreadSelectStep'
import IntentionStep from '../components/draw/IntentionStep'
import ShuffleStep from '../components/draw/ShuffleStep'
import SelectStep from '../components/draw/SelectStep'
import RevealStep from '../components/draw/RevealStep'
import ResultStep from '../components/draw/ResultStep'
import ThreeCardResultStep from '../components/draw/ThreeCardResultStep'

export default function DrawPage() {
  const { step, activeSpread } = useReadingSession()

  switch (step) {
    case 'spread-select':
      return <SpreadSelectStep />
    case 'intention':
      return <IntentionStep />
    case 'shuffling':
      return <ShuffleStep />
    case 'selecting':
      return <SelectStep />
    case 'revealing':
      return <RevealStep />
    case 'result':
      return activeSpread === 'three-card' ? <ThreeCardResultStep /> : <ResultStep />
    default:
      return null
  }
}
```

- [ ] **Step 4: Flip the context defaults**

In `ReadingSessionContext.tsx`, change the fallback context object's `step: 'intention'` to `step: 'spread-select'`, change the `ReadingSessionProvider`'s `useState<RitualStep>('intention')` to `useState<RitualStep>('spread-select')`, and change `reset()`'s `setStep('intention')` to `setStep('spread-select')`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- src/pages/DrawPage.test.tsx src/routes.test.tsx src/context/ReadingSessionContext.test.tsx`
Expected: PASS, all tests green

- [ ] **Step 6: Run the full test suite, specifically confirming `ResultStep.test.tsx` is unaffected**

Run: `npm test`
Expected: PASS, all suites green, including `ResultStep.test.tsx` with zero modifications made to it

- [ ] **Step 7: Commit**

```bash
cd "Tarot Divination Site"
git add src/pages/DrawPage.tsx src/context/ReadingSessionContext.tsx src/pages/DrawPage.test.tsx src/routes.test.tsx src/context/ReadingSessionContext.test.tsx
git commit -m "Wire spread-select into DrawPage and flip the ritual's entry point"
```

---

### Task 6: Final integration validation

**Files:**
- None created or modified — this task validates the whole sub-project

**Interfaces:**
- Consumes: everything from Tasks 1-5

- [ ] **Step 1: Full automated check**

Run, in order:
```bash
cd "Tarot Divination Site"
npm test
npm run lint
npm run build
```
Expected: all three succeed with no errors. `npm test` should show a higher total test count than before this sub-project.

- [ ] **Step 2: Manual smoke test via production preview**

```bash
npm run build
npm run preview
```
Open the preview URL, navigate to `/draw`, and verify:
- The spread-select screen appears first, offering "单张指引" and "三牌阵 · 过去现在未来"
- Choosing "单张指引" reproduces the exact single-card ritual from the previous sub-project (question → shuffle → select → reveal → result), unchanged
- Choosing "三牌阵 · 过去现在未来" walks through question → shuffle → select/reveal three times in a row (watch for the "1 / 3" / "2 / 3" / "3 / 3" counter and the "揭示下一张" → "查看解读" button label change on the last card) → a result page showing three cards labeled 过去/现在/未来 with real card art, each card's own keywords/meaning/advice, and an "整体指引" synthesis paragraph referencing all three cards' first keywords
- "再抽一张" from either result page returns to the spread-select screen (not straight back into the same spread)
- "保存此次占卜" still links to `/login`

- [ ] **Step 3: Confirm no console errors**

While doing the manual walkthrough above, check the browser console — expect zero errors throughout both the single-card and three-card paths.

- [ ] **Step 4: Final commit if any cleanup was needed**

If Steps 1-3 required any fixes, commit them:
```bash
cd "Tarot Divination Site"
git add -A
git commit -m "Fix issues found during three-card spread final integration validation"
```
If no fixes were needed, skip this step — nothing to commit.

---

## Out of Scope (tracked in the spec's Out of Scope section)

- Celtic Cross (10-card) spread — next sub-project, reusing this one's draw-without-replacement and reveal-loop architecture
- Horseshoe spread, Relationship spread — undecided, not scheduled
- Actual Supabase save (button still navigates to `/login`)
- Position-specific (as opposed to generic per-card) interpretive content
- A Stitch-designed spread-picker screen (current one is hand-built from existing tokens)
- GSAP/tsParticles animation polish
