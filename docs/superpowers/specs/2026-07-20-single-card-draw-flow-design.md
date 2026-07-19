# Single-Card Draw Flow — Design Spec

Date: 2026-07-20
Status: Approved (pending user review of this doc)

## Context

The app scaffold sub-project is complete and merged: Vite+React+TypeScript+Tailwind+
Vitest toolchain, the merged design-system theme, shared layout (`Nav`/`Footer`/
`AtmosphereLayer`/`RootLayout`), a routing skeleton with `/draw` currently rendering a
`StubPage`, the 22-card Major Arcana dataset in `src/data/`, and an unwired
`ReadingSessionContext` stub (`{ activeSpread: SpreadType }`, no setter, no consumer).

This spec covers the second sub-project in the agreed decomposition: the single-card
draw ritual — intention → shuffle → select → reveal → result — the first genuinely
interactive, usable slice of the product. Multi-card spreads, Supabase persistence,
encyclopedia/about content, and GSAP/tsParticles animation polish are separate,
later sub-projects (see Out of Scope).

## Goal

Replace the `/draw` stub with a working single-card reading: a user can state an
optional question, watch a shuffle animation, pick a card from a fanned spread, watch
it reveal, and read a real interpretation sourced from the Major Arcana dataset —
entirely client-side, no backend required.

## Decisions (confirmed during brainstorming)

- **Routing**: one route (`/draw`), no sub-routes per ritual step. `DrawPage` is a
  step-state orchestrator, not a router. Rationale: this is a guided linear ritual, not
  independently bookmarkable content — deep-linking into the middle of a shuffle isn't
  meaningful, and a plain state machine avoids that entirely.
- **Animation**: CSS transitions/keyframes only (fade, 3D flip via `transform`,
  scale). No GSAP or tsParticles in this sub-project — those are explicitly deferred to
  the later "Animation & atmosphere polish" sub-project. The ritual must be fully
  functional now; richer choreography is a separate pass on top of working code, not a
  blocker to shipping the flow.
- **Selection UI**: the full fanned spread from `design/stitch-exports/04-select`
  (multiple overlapping face-down cards, one clickable), not a simplified single-pile
  tap — the design is already approved and referenced, porting it now avoids revisiting
  this component later.
- **Question input**: held in `ReadingSessionContext` state and referenced on the
  result page (e.g. "关于「用户问题」，星辰的指引是…"), even though there's no database to
  persist it to yet. Purely client-side for this sub-project.
- **Randomization**: uniform-random selection across all 22 Major Arcana cards,
  independent 50/50 upright/reversed roll.
- **"保存此次占卜" (save reading)**: navigates to `/login` (an existing real stub route)
  rather than being a dead button or silently doing nothing — honest placeholder
  behavior given Supabase auth doesn't exist yet.
- **"再抽一次" (draw again)**: resets `ReadingSessionContext` and returns to the
  intention step.

## Architecture

`ReadingSessionContext` is expanded from its current stub shape into the actual state
container for an in-progress reading:

```ts
type RitualStep = 'intention' | 'shuffling' | 'selecting' | 'revealing' | 'result'

interface DrawnCard {
  id: string
  name: string
  nameLocal: string
  image: string
  orientation: 'upright' | 'reversed'
  keywords: string[]
  meaning: string
  advice: string
}

interface ReadingSessionValue {
  activeSpread: SpreadType   // unchanged from scaffold
  step: RitualStep
  question: string
  drawnCard: DrawnCard | null
  setQuestion: (question: string) => void
  beginShuffle: () => void
  finishShuffle: () => void
  selectCard: () => void      // internally calls drawCard(), stores result, advances step
  finishReveal: () => void
  reset: () => void
}
```

`ReadingSessionProvider` wraps `<RouterProvider>` in `App.tsx` (currently only
`RouterProvider` is rendered there) so the session is available app-wide — a
prerequisite for later sub-projects (multi-card spreads, saved-reading history) reusing
the same context shape, not just this one page.

`DrawPage` reads `step` from `useReadingSession()` and renders exactly one of five step
components based on it — no other page-level state.

## Draw Logic

`src/lib/drawCard.ts` exports a single pure function:

```ts
function drawCard(
  structure: CardStructure[],
  content: Record<string, CardContent>,
): DrawnCard
```

It picks a uniformly random entry from `structure` (the 22-entry `cards-major.json`
array), rolls orientation independently via `Math.random() < 0.5`, looks up the
matching `content[id]` entry, and returns a single merged `DrawnCard` object using
`upright_meaning`/`upright_advice` or `reversed_meaning`/`reversed_advice` depending on
the roll. Pure function, no React/DOM dependency — the actual data files are imported
by the caller (`ReadingSessionContext`) and passed in, keeping `drawCard` itself
trivially unit-testable with fixture data.

## Component Breakdown

```
src/
  pages/
    DrawPage.tsx            # step router: reads context.step, renders matching component
  components/
    draw/
      IntentionStep.tsx     # question textarea + "开始洗牌" button
      ShuffleStep.tsx       # animated shuffling state, auto-advances via finishShuffle() after 2s
      SelectStep.tsx        # fanned spread of 12 face-down TarotCard instances
      RevealStep.tsx        # single TarotCard mid-flip animation + "查看解读" button (manual advance, not timer-based, matching the approved design's fade-in button)
      ResultStep.tsx        # name/keywords/meaning/advice + question reference + action buttons
      TarotCard.tsx          # shared: renders a card back or front, handles the flip
  lib/
    drawCard.ts
    drawCard.test.ts
  context/
    ReadingSessionContext.tsx   # MODIFIED: expanded per Architecture above
```

`TarotCard` is the one shared visual primitive reused by `SelectStep` (12 face-down
instances), `RevealStep` (one card mid-flip), and `ResultStep` (one revealed card) —
avoiding three separate card-rendering implementations.

## Result Page Content

Sourced entirely from `context.drawnCard` and `context.question`:
- Card name (`name` + `nameLocal`, matching the "星星 · THE STAR" display pattern from
  the approved result-page design)
- Orientation indicator (upright/reversed)
- 3 keyword pills
- Meaning paragraph, advice line (already orientation-resolved by `drawCard`)
- If `question` is non-empty, a line referencing it before the meaning
- "再抽一次" button → `reset()` then step returns to `'intention'`
- "保存此次占卜" button → `<Link to="/login">`

## Testing

- `drawCard.test.ts`: given fixture structure/content data, asserts the returned card's
  `id` is always one of the 22 valid ids, orientation is always `'upright'` or
  `'reversed'`, and the merged fields match the fixture's expected upright/reversed
  content for a given orientation (mock `Math.random` to pin specific outcomes for
  deterministic assertions).
- Component tests per step (render + interaction, e.g. `IntentionStep` advancing step
  on submit, `SelectStep` triggering `selectCard()` on card click).
- One integration test rendering `DrawPage` wrapped in a real `ReadingSessionProvider`
  and driving it through all five steps via user events, asserting the final result
  content matches whatever card the (mocked) random draw produced.

## Out of Scope (deferred to later sub-projects)

- Multi-card spreads (3-card, Celtic Cross)
- Actual Supabase save (the button navigates to `/login`, doesn't persist anything)
- GSAP shuffle/flip choreography, tsParticles background, audio
- Reduced-motion accessibility handling
- Encyclopedia/About page content
