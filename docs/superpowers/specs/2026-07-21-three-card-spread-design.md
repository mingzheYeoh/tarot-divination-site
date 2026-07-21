# Three-Card Spread — Design Spec

Date: 2026-07-21
Status: Approved (pending user review of this doc)

## Context

The Minor Arcana content sub-project just completed: the app now draws from the full
78-card deck for its single-card ritual. This spec covers the next sub-project in the
agreed roadmap — the first multi-card spread (过去·现在·未来 / Past-Present-Future) — and
is scoped deliberately smaller than the full "multi-card spreads" idea from the original
brief: Celtic Cross (10 cards) is a separate, later sub-project, since it's a meaningfully
larger complexity tier (10 positions, cross+staff layout, accordion UI) than a 3-card row.
Building the 3-card spread first proves out the general "multi-card" architecture —
drawing without replacement, a repeating select→reveal loop, position-aware results — so
Celtic Cross can reuse it rather than inventing it twice.

Designs already exist and are referenced throughout this spec:
`design/stitch-exports/16-three-card-layout` (laying state) and
`design/stitch-exports/09-three-card-result` (result page). Position semantics were
already locked in during an earlier design pass, in `design/stitch-prompt.md` §2.6:
I=过去 (Past), II=现在 (Present), III=未来 (Future).

## Goal

Let a user choose a 3-card spread (instead of the existing single-card draw), go through
a repeating reveal ritual for three distinct cards, and read a position-aware result page
with a template-generated synthesis paragraph tying the three cards together — reusing as
much of the existing single-card ritual machinery as possible.

## Decisions (confirmed during brainstorming)

- **Spread selection**: a new first ritual step, not a Home-page change or a separate
  route. `/draw` now starts on a spread picker (单张指引 / 三牌阵) before the existing
  intention→shuffle→select→reveal→result flow. Rationale: keeps a single route and state
  machine (consistent with the original single-card decision to avoid sub-routing a linear
  ritual), and the existing `SpreadType`/`activeSpread` field was already reserved for
  exactly this.
- **No Stitch mockup for the spread-picker screen**: it wasn't anticipated in any earlier
  design round. Built directly with the app's existing design tokens (same typography/
  color/button classes already used by `IntentionStep`/`ResultStep`) rather than
  commissioning a new Stitch pass — it's two selectable option cards, not a novel layout.
- **Draw without replacement**: a 3-card reading must never repeat a card. Implemented as
  a simple exclude-by-id retry loop around the existing `drawCard()` — `drawCard.ts` itself
  is NOT modified, since it's already a pure, arcana-agnostic, spread-agnostic function.
  Exclusion logic lives entirely in `ReadingSessionContext`.
- **Reveal loop, not three separate flows**: `SelectStep` (the 15-card fan) needs zero
  changes — it's purely decorative and spread-agnostic already (clicking any fan card just
  calls `selectCard()`, which doesn't care which visual card was clicked). The ritual
  simply loops `selecting → revealing` three times before advancing to `result`, tracked
  by how many cards have been drawn so far.
- **Position-specific content**: reuse each card's *existing* `upright_meaning`/
  `reversed_meaning`/`advice` verbatim under a position label (过去/现在/未来). No new
  position-flavored content is authored — position is a display label only, not new
  copy. This avoids an infeasible content-authoring surface (3 positions × 78 cards ×
  2 orientations).
- **"整体指引" (overall guidance) synthesis**: a fixed sentence template filled with each
  drawn card's own first keyword — e.g. "过去的{kw1}，与现在的{kw2}交织，指向未来的{kw3}。"
  — not hand-authored per card combination (78³ combinations is infeasible) and not
  omitted (the approved design explicitly includes this panel).
- **"再抽一张" (draw again) now returns to spread-select, not intention**: since
  spread-select is the new true entry point of the ritual, resetting should let the user
  pick a different spread next time, not silently retain the previous choice. This is a
  deliberate behavior change from the single-card sub-project (where reset already went to
  `'intention'`, the previous entry point) — see Breaking Changes below for the exact tests
  this touches.
- **"保存此次占卜"**: same placeholder behavior as the single-card result page — links to
  `/login`. Unchanged.

## Architecture

`RitualStep` gains one new value, inserted before the existing flow:

```ts
type RitualStep = 'spread-select' | 'intention' | 'shuffling' | 'selecting' | 'revealing' | 'result'
```

`SpreadType` is unchanged (`'single' | 'three-card' | 'celtic-cross' | null`) — this spec
only ever sets it to `'single'` or `'three-card'`; `'celtic-cross'` remains reserved for a
future sub-project and is not offered as a choice on the picker screen yet.

`ReadingSessionValue` gains:

```ts
interface ReadingSessionValue {
  activeSpread: SpreadType        // now actually settable, was always null before
  step: RitualStep
  question: string
  drawnCard: DrawnCard | null      // unchanged meaning: "the card currently being revealed / most recently drawn"
  drawnCards: DrawnCard[]          // NEW: full history for the active reading, in draw order
  setQuestion: (question: string) => void
  selectSpread: (spread: 'single' | 'three-card') => void   // NEW
  beginShuffle: () => void
  finishShuffle: () => void
  selectCard: () => void          // MODIFIED: spread-aware, see below
  finishReveal: () => void        // MODIFIED: spread-aware routing, see below
  reset: () => void               // MODIFIED: returns to 'spread-select'
}
```

`drawnCard` keeps its existing meaning and is still what `RevealStep`/`TarotCard` render
without any changes to those read sites — every draw (single or multi-card) sets both
`drawnCard` (the current card) and appends to `drawnCards` (the running history). This
means `RevealStep`'s core flip interaction needs no changes at all; only its counter/button
label do (see Component Breakdown).

### `selectSpread(spread)`

```ts
selectSpread: (spread) => {
  setActiveSpread(spread)
  setStep('intention')
}
```

### `selectCard()` (modified)

```ts
selectCard: () => {
  const excludedIds = new Set(drawnCards.map((c) => c.id))
  let card = drawCard(allStructure, allContent)
  while (excludedIds.has(card.id)) {
    card = drawCard(allStructure, allContent)
  }
  setDrawnCard(card)
  setDrawnCards((prev) => [...prev, card])
  setStep('revealing')
}
```

For `activeSpread === 'single'` this behaves identically to today (the exclusion set is
always empty on the only draw). For `'three-card'`, each of the three calls excludes
whatever's already been drawn this reading.

### `finishReveal()` (modified)

```ts
finishReveal: () => {
  const totalPositions = activeSpread === 'three-card' ? 3 : 1
  if (drawnCards.length < totalPositions) {
    setStep('selecting')
  } else {
    setStep('result')
  }
}
```

### `reset()` (modified)

```ts
reset: () => {
  setStep('spread-select')
  setQuestionState('')
  setDrawnCard(null)
  setDrawnCards([])
  setActiveSpread(null)
}
```

`DrawPage.tsx`'s step switch gains one case and one branch:

```tsx
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
```

## Component Breakdown

```
src/
  components/draw/
    SpreadSelectStep.tsx       # NEW: two option cards (单张指引 / 三牌阵), calls selectSpread()
    SpreadSelectStep.test.tsx  # NEW
    RevealStep.tsx             # MODIFIED: counter + dynamic button label for multi-card
    RevealStep.test.tsx        # MODIFIED
    ThreeCardResultStep.tsx    # NEW: position-labeled 3-card result + synthesis paragraph
    ThreeCardResultStep.test.tsx  # NEW
    # SelectStep.tsx, TarotCard.tsx, IntentionStep.tsx, ShuffleStep.tsx: UNCHANGED
  pages/
    DrawPage.tsx               # MODIFIED: new case + result branch (shown above)
    DrawPage.test.tsx          # MODIFIED
  context/
    ReadingSessionContext.tsx      # MODIFIED: per Architecture above
    ReadingSessionContext.test.tsx # MODIFIED
  routes.test.tsx              # MODIFIED: /draw now lands on spread-select, not intention
```

### `SpreadSelectStep.tsx`

Two selectable cards/buttons, matching the existing design-token language (same font/
color/button classes as `IntentionStep`/`ResultStep` — `font-display-md`/`text-display-md`
heading, `rounded-full` primary buttons, etc.):
- "单张指引" (single card) — short description, calls `selectSpread('single')`
- "三牌阵 · 过去现在未来" (three-card) — short description, calls `selectSpread('three-card')`

### `RevealStep.tsx` changes

Reads `activeSpread` and `drawnCards.length` from context to compute:
- `totalPositions = activeSpread === 'three-card' ? 3 : 1`
- `currentPosition = drawnCards.length` (already incremented by the time this step renders)
- If `totalPositions > 1`: render a small counter (`{currentPosition} / {totalPositions}`,
  matching the "2 / 3" progress indicator already specified in the approved
  `16-three-card-layout` design)
- Button label: `"揭示下一张"` if `currentPosition < totalPositions`, else `"查看解读"`
  (both call the same `finishReveal()` — the label is purely informational, the routing
  logic already lives in context)
- If `totalPositions === 1` (single-card spread): no counter, button always reads
  `"查看解读"` — i.e. pixel-for-pixel the same as today.

### `ThreeCardResultStep.tsx`

Reads `drawnCards` (guaranteed length 3 by the time this renders), `question`, `reset`
from context. Layout follows `09-three-card-result`:
- Three cards side by side, each labeled with its position (`过去`/`现在`/`未来`) above a
  `TarotCard` (flipped, no onClick), card name below
- Below each card: that card's own keywords + `upright_meaning`/`reversed_meaning` +
  `upright_advice`/`reversed_advice` (orientation-resolved exactly like `ResultStep`
  already does) — verbatim, no position-flavored rewriting
- A synthesis panel titled "整体指引": the template
  `` `过去的${drawnCards[0].keywords[0]}，与现在的${drawnCards[1].keywords[0]}交织，指向未来的${drawnCards[2].keywords[0]}。` ``
- If `question` is non-empty, the same "关于「{question}」…" line style as `ResultStep`
- Same two buttons as `ResultStep`: `"再抽一张"` (calls `reset()`), `"保存此次占卜"`
  (`<Link to="/login">`)

`POSITION_LABELS = ['过去', '现在', '未来']` indexes directly against `drawnCards`, since
draw order is guaranteed to be position order (card 0 = past, card 1 = present, card 2 =
future) — the reveal loop always fills positions in sequence.

## Breaking Changes to Existing Tests

Because `'spread-select'` is now the initial step (was `'intention'`) and `reset()` now
targets `'spread-select'` (was `'intention'`), these existing tests need updating as part
of this work (not a regression — an intentional, spec'd behavior change):

- `routes.test.tsx`: the `/draw` route assertion currently expects to land directly on
  `'静下心来，默念你的问题'` (the intention heading) — must change to expect the
  spread-select screen's content instead.
- `ReadingSessionContext.test.tsx`: the initial-state test (`step: intention`) and the
  reset test (asserts `step: intention` after reset) must both change their expected step
  to `'spread-select'`. The full-walkthrough test needs a new first action (selecting a
  spread) before `setQuestion`/`beginShuffle`/etc.
- `DrawPage.test.tsx`: the "starts at the intention step" test and the full-ritual
  walkthrough test both need a spread-selection step prepended.
- `ResultStep.test.tsx`'s `renderAtResult()` test helper needs an extra `selectSpread`
  step at the start of its click sequence (it currently starts directly with
  `setQuestion`).

## Testing

- `ReadingSessionContext.test.tsx`: `selectSpread` sets `activeSpread` and advances step;
  a deterministic `Math.random` mock forcing the 2nd draw to land on the same index as the
  1st proves the exclude-by-id retry loop actually re-draws instead of accepting the
  duplicate; a second, non-mocked test runs the full 3-draw sequence 200 times and asserts
  zero duplicate ids in any single run, as a real-random-data backstop to the mocked test;
  `finishReveal()` routes to `'selecting'` after 1st/2nd reveal and `'result'` after the
  3rd, for a three-card spread; single-card spread routing is unchanged (straight to
  `'result'` after 1 reveal); `reset()` clears `drawnCards`/`activeSpread` and returns to
  `'spread-select'`.
- `SpreadSelectStep.test.tsx`: renders both options; clicking each sets the expected
  `activeSpread` value and advances to `'intention'`.
- `RevealStep.test.tsx`: single-card case unchanged (no counter, "查看解读"); three-card
  case shows "1 / 3" / "2 / 3" / "3 / 3" at the right times and "揭示下一张" until the
  last position, then "查看解读".
- `ThreeCardResultStep.test.tsx`: all three positions labeled correctly and in order;
  each position's content matches that specific card's own data; synthesis paragraph
  exact text for a fixed set of drawn cards (deterministic `Math.random` mock); question
  reference line present/absent correctly; both action buttons present and correct.
- `DrawPage.test.tsx`: one integration test driving the full three-card ritual
  (spread-select → intention → shuffle → select/reveal ×3 → result) end-to-end via a real
  `ReadingSessionProvider`, asserting the final `ThreeCardResultStep` content matches
  whatever three cards the (mocked) random draws produced.
- Existing single-card integration test updated per Breaking Changes above, otherwise
  unchanged in spirit (proves the single-card path still works exactly as before).

## Out of Scope (deferred to later sub-projects)

- Celtic Cross (10-card) spread — next after this, reusing this sub-project's
  exclude-by-id draw logic and reveal-loop pattern
- Horseshoe spread, Relationship spread — still undecided, not scheduled
- Actual Supabase save (button still navigates to `/login`)
- Position-specific (as opposed to generic per-card) interpretive content
- A real Stitch-designed spread-picker screen (current one is hand-built from existing
  tokens; could be revisited later if the user wants a bespoke design pass)
- GSAP/tsParticles animation polish
