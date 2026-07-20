# Minor Arcana Content Data — Design Spec

Date: 2026-07-20
Status: Approved (pending user review of this doc)

## Context

The user shared a comprehensive tarot rules/gameplay reference document and asked whether
the current system matches it. Comparison against the live app found the single biggest
gap: the deck is currently 22 cards (Major Arcana only) rather than the standard 78-card
deck. `content/SOURCES.md` already flagged this back when the Major Arcana content
sub-project shipped ("Minor Arcana... for a future batch") — this spec is that batch.

This is the fourth sub-project overall, after Major Arcana content, app scaffold, and the
single-card draw flow. It precedes multi-card spreads (3-card, Celtic Cross) in the
roadmap: the user chose to fill the deck out to 78 cards first, rather than build spreads
that would draw disproportionately from Major Arcana while Minor Arcana content doesn't
exist yet.

## Goal

Produce all 56 Minor Arcana cards with the same structural rigor as the existing Major
Arcana dataset, download their real card art, and wire the existing single-card draw
ritual (`/draw`) to pull from the full 78-card pool — so "occasionally you draw a Major
Arcana card" becomes true again, matching how real tarot spreads actually feel, instead of
every draw guaranteed to be a "major life theme" card.

## Scope

- 56 Minor Arcana cards: 4 suits (Wands, Cups, Swords, Pentacles) × 14 cards each
  (Ace through 10, then Page/Knight/Queen/King)
- Content language: Chinese (`zh`) only, matching the existing Major Arcana batch
- Image files: downloaded as part of this sub-project (unlike the original Major Arcana
  content batch, which deferred image download to the later draw-flow sub-project — this
  time downloading up front avoids a broken-image gap between "content exists" and "content
  is drawable")
- Wiring the full 78-card pool into the existing single-card draw (`ReadingSessionContext`)

## File Layout

```
Tarot Divination Site/
  content/
    cards-minor.json       # locale-independent structure, 56 entries
    cards-minor.zh.json    # Chinese content, keyed by card id
    SOURCES.md             # MODIFIED: mark Minor Arcana batch as delivered
  src/data/
    cards-minor.json       # copy, wired into the app
    cards-minor.zh.json    # copy, wired into the app
    cards.test.ts          # MODIFIED: validate combined 78-card pool
  public/assets/tarot/
    wands01.jpg … wands14.jpg
    cups01.jpg … cups14.jpg
    swords01.jpg … swords14.jpg
    pentacles01.jpg … pentacles14.jpg
  src/context/
    ReadingSessionContext.tsx   # MODIFIED: draw from combined major+minor pool
```

This mirrors the existing Major Arcana split (structure file + locale content file), kept
as a separate pair of files rather than merged into `cards-major.json` — consistent with
how a new locale is added as a new file without touching existing ones, adding a new arcana
batch follows the same additive principle without touching the Major Arcana files.

## Schema

**`cards-minor.json`** (structure — identical shape to `cards-major.json`, with `suit` and
`element` populated instead of `null`):
```json
{
  "id": "wands_01",
  "name": "Ace of Wands",
  "number": 1,
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "image": "/assets/tarot/wands01.jpg"
}
```

- Numbering: 1–10 for pip cards, 11=Page, 12=Knight, 13=Queen, 14=King — matches the source
  image set's `01`–`14` naming per suit.
- Suits and elements: `wands`/fire, `cups`/water, `swords`/air, `pentacles`/earth.
- `id` format: `<suit>_<2-digit-number>`, e.g. `wands_01`, `cups_14`.

**`cards-minor.zh.json`** (content — identical shape to `cards-major.zh.json`):
```json
{
  "wands_01": {
    "name_local": "权杖首牌",
    "keywords": ["新的灵感", "创造冲动", "行动的起点"],
    "upright_meaning": "2-4 句正位牌意，基于 Waite 原著自己总结",
    "upright_advice": "1 句可执行的正位建议",
    "reversed_meaning": "2-4 句逆位牌意",
    "reversed_advice": "1 句逆位建议"
  }
}
```

Court card names use the standard English form (`Page of Wands`, `Knight of Cups`, etc.);
`name_local` uses natural Chinese court-card phrasing (e.g. "权杖侍者", "圣杯骑士").

## Content Sourcing

Same methodology as the Major Arcana batch: original wording, summarizing (not copying)
A.E. Waite's *The Pictorial Key to the Tarot* (1910, public domain, sacred-texts.com) —
Part II of that text covers the Minor Arcana pip and court card meanings. Each card gets:
English canonical name, Chinese display name, 3 keywords, upright meaning (2-4 sentences),
upright advice (1 sentence), reversed meaning (2-4 sentences), reversed advice (1 sentence),
matching the Major Arcana content depth exactly.

## Image Sourcing

Same source as Major Arcana: [github.com/searge/tarot](https://github.com/searge/tarot),
`assets/img/big/{wands,cups,swords,pents}01-14.jpg` (56 files). Same licensing situation
already verified for the Major Arcana download — the image folder (`assets/img/LICENSE`)
carries Unlicense (public-domain-style) terms distinct from the repo's overall CC-BY-SA-4.0
badge, and the underlying 1909 Pamela Colman Smith artwork is itself public domain.
Re-verify `assets/img/LICENSE` at actual download time per established practice.

Downloaded files are renamed from the source's `pents` abbreviation to `pentacles` for
clarity in this codebase (matching the `suit` value used in `cards-minor.json`), all other
suit names kept as-is.

## Wiring Change

`ReadingSessionContext.tsx` currently does:
```ts
import cardsStructure from '../data/cards-major.json'
import cardsContent from '../data/cards-major.zh.json'
// ...
selectCard: () => {
  const card = drawCard(cardsStructure as unknown as CardStructure[], cardsContent as unknown as Record<string, CardContent>)
  // ...
}
```

This becomes:
```ts
import majorStructure from '../data/cards-major.json'
import majorContent from '../data/cards-major.zh.json'
import minorStructure from '../data/cards-minor.json'
import minorContent from '../data/cards-minor.zh.json'

const allStructure = [...majorStructure, ...minorStructure] as unknown as CardStructure[]
const allContent = { ...majorContent, ...minorContent } as unknown as Record<string, CardContent>
// ...
selectCard: () => {
  const card = drawCard(allStructure, allContent)
  // ...
}
```

`drawCard.ts` itself is untouched — it already operates on a generic `CardStructure[]` /
`Record<string, CardContent>` pair with no arcana-specific logic. `SpreadType` and
`activeSpread` are untouched; this sub-project only changes the pool size feeding the
existing single-card ritual, not spread mechanics.

`TarotCard`, `SelectStep`, `RevealStep` need no changes — they already render generically
off `DrawnCard`, which doesn't distinguish Major from Minor Arcana. `ResultStep` needs one
targeted change: the small caption above the card name currently hardcodes
`MAJOR ARCANA {ROMAN_NUMERALS[...]}`. This becomes conditional on `drawnCard.id`'s prefix:

- Major Arcana (`id` starts with `major_`): unchanged — `MAJOR ARCANA {roman numeral}`,
  e.g. `MAJOR ARCANA VII`.
- Minor Arcana (`id` starts with any suit prefix): `{SUIT_EN} · {RANK_EN}`, both segments
  uppercase English, mirroring the existing caption's all-caps-English style — e.g.
  `WANDS · ACE`, `CUPS · TEN`, `SWORDS · KNIGHT`. `SUIT_EN` is the suit name uppercased
  (`WANDS`/`CUPS`/`SWORDS`/`PENTACLES`). `RANK_EN` comes from a new lookup array parallel
  to `ROMAN_NUMERALS`: index 1 = `ACE`, 2–10 = `TWO`…`TEN`, 11 = `PAGE`, 12 = `KNIGHT`,
  13 = `QUEEN`, 14 = `KING`, indexed by `drawnCard.number`.

The `<h1>` line below the caption (`{nameLocal} · {name.toUpperCase()}`) needs no change —
it already works for any card, e.g. "权杖首牌 · ACE OF WANDS".

This ResultStep caption gap was flagged as a Minor finding during the draw-flow review
(roman-numeral edge case for future Minor Arcana) — this sub-project is where it actually
needs fixing, since it's no longer hypothetical once Minor Arcana cards can be drawn.

## Testing

- `cards.test.ts`: combined structure is exactly 78 entries; all 78 `id`s unique; every
  structure `id` has a matching content entry across the merged major+minor content;
  `arcana` field is `'major'` for the 22 existing entries and `'minor'` for the 56 new ones.
- `drawCard.test.ts`: unchanged — the function already doesn't care about pool composition,
  existing fixture-based tests remain valid.
- `ReadingSessionContext.test.tsx` / `DrawPage.test.tsx`: extend or add a case that mocks
  `Math.random` to pin a Minor Arcana draw, asserting `ResultStep` renders the suit-based
  label instead of a Roman numeral / "MAJOR ARCANA" for that case.

## Deliverables

1. `content/cards-minor.json` — 56 structural entries
2. `content/cards-minor.zh.json` — 56 Chinese content entries
3. `content/SOURCES.md` — updated to mark the Minor Arcana batch delivered (images + text)
4. `public/assets/tarot/{wands,cups,swords,pentacles}01-14.jpg` — 56 image files
5. `src/data/cards-minor.json`, `src/data/cards-minor.zh.json` — copies wired into the app
6. `src/context/ReadingSessionContext.tsx` — draws from the combined 78-card pool
7. `src/components/draw/ResultStep.tsx` — suit-aware label for Minor Arcana results
8. Updated/extended tests per Testing section above

## Validation

- Both new JSON files parse cleanly, exactly 56 entries each, matching `id` keys between
  structure and content
- No verbatim long-form copying from Waite's text — original phrasing only
- `npm test` passes with the combined 78-card pool
- Manual check: draw repeatedly (or seed `Math.random`) until both a Major and a Minor
  Arcana card appear, confirm `ResultStep` renders correctly for both

## Out of Scope (deferred)

- Multi-card spreads (3-card, Celtic Cross) — next sub-project after this one; designs
  already exist in `design/stitch-exports/` (09, 10, 16, 17) but no code wires them up yet
- Horseshoe spread, Relationship spread — mentioned in the user's rules reference doc as
  common spreads, but never scoped or designed; deferred, undecided
- The rules doc's section 8 disclaimer guidance ("塔罗解读...不能替代专业意见") — no live
  page to put this on yet; falls under the encyclopedia/about pages sub-project
- Additional locales beyond `zh` for the new Minor Arcana content
- Supabase persistence of readings (any spread type)
