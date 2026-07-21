# Minor Arcana Content Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce all 56 Minor Arcana cards (structure + Chinese content + real card images), then wire the existing single-card draw ritual to pull from the full 78-card pool instead of just the 22 Major Arcana.

**Architecture:** Same two-file split already used for Major Arcana — `content/cards-minor.json` (locale-independent structure) and `content/cards-minor.zh.json` (Chinese content, keyed by matching `id`) — copied into `src/data/` and merged with the existing Major Arcana files inside `ReadingSessionContext`. `drawCard()` itself needs no changes since it already operates on a generic `CardStructure[]` / content map with no arcana-specific logic.

**Tech Stack:** Plain JSON data files, Vitest for app-level tests, Python (via Bash) for standalone JSON validation, `curl` for image downloads. React/TypeScript for the two app-code changes (Tasks 9-10).

## Global Constraints

- Content language: Chinese (`zh`) only — matches the existing Major Arcana batch (spec: Scope)
- Card count: exactly 56 new entries (4 suits × 14 cards), bringing the combined pool to exactly 78 with no gaps or duplicate ids (spec: Scope, Testing)
- Numbering: 1–10 for pip cards (Ace=1), then 11=Page, 12=Knight, 13=Queen, 14=King (spec: Schema)
- Suits/elements: `wands`/fire, `cups`/water, `swords`/air, `pentacles`/earth (spec: Schema)
- `id` format: `<suit>_<2-digit-number>`, e.g. `wands_01`, `pentacles_14` (spec: Schema)
- Meanings/advice: original wording summarizing A.E. Waite's 1910 *The Pictorial Key to the Tarot* (public domain), Part II — no verbatim copying (spec: Content Sourcing)
- Images: sourced from `github.com/searge/tarot`, `assets/img/big/{wands,cups,swords,pents}01-14.jpg`; re-verify `assets/img/LICENSE` (Unlicense) at download time; downloaded files renamed from `pents` to `pentacles` (spec: Image Sourcing)
- `drawCard.ts` is not modified — it's already arcana-agnostic (spec: Wiring Change)
- Repo: working directly on `master`, no feature branch (established project convention)

---

### Task 1: Structure file — all 56 Minor Arcana cards

**Files:**
- Create: `Tarot Divination Site/content/cards-minor.json`

**Interfaces:**
- Produces: an array of 56 objects, each `{ id, name, number, arcana, suit, element, image }`, used by Tasks 2-5 (content files, which must key on the same `id` values), Task 7 (image filenames), and Task 8 (validation).

Card list (locked in now — factual RWS structure, not a content-quality judgment call):

**Wands (element: `fire`)**

| # | id | name | image |
|---|---|---|---|
| 1 | wands_01 | Ace of Wands | wands01.jpg |
| 2 | wands_02 | Two of Wands | wands02.jpg |
| 3 | wands_03 | Three of Wands | wands03.jpg |
| 4 | wands_04 | Four of Wands | wands04.jpg |
| 5 | wands_05 | Five of Wands | wands05.jpg |
| 6 | wands_06 | Six of Wands | wands06.jpg |
| 7 | wands_07 | Seven of Wands | wands07.jpg |
| 8 | wands_08 | Eight of Wands | wands08.jpg |
| 9 | wands_09 | Nine of Wands | wands09.jpg |
| 10 | wands_10 | Ten of Wands | wands10.jpg |
| 11 | wands_11 | Page of Wands | wands11.jpg |
| 12 | wands_12 | Knight of Wands | wands12.jpg |
| 13 | wands_13 | Queen of Wands | wands13.jpg |
| 14 | wands_14 | King of Wands | wands14.jpg |

**Cups (element: `water`)**

| # | id | name | image |
|---|---|---|---|
| 1 | cups_01 | Ace of Cups | cups01.jpg |
| 2 | cups_02 | Two of Cups | cups02.jpg |
| 3 | cups_03 | Three of Cups | cups03.jpg |
| 4 | cups_04 | Four of Cups | cups04.jpg |
| 5 | cups_05 | Five of Cups | cups05.jpg |
| 6 | cups_06 | Six of Cups | cups06.jpg |
| 7 | cups_07 | Seven of Cups | cups07.jpg |
| 8 | cups_08 | Eight of Cups | cups08.jpg |
| 9 | cups_09 | Nine of Cups | cups09.jpg |
| 10 | cups_10 | Ten of Cups | cups10.jpg |
| 11 | cups_11 | Page of Cups | cups11.jpg |
| 12 | cups_12 | Knight of Cups | cups12.jpg |
| 13 | cups_13 | Queen of Cups | cups13.jpg |
| 14 | cups_14 | King of Cups | cups14.jpg |

**Swords (element: `air`)**

| # | id | name | image |
|---|---|---|---|
| 1 | swords_01 | Ace of Swords | swords01.jpg |
| 2 | swords_02 | Two of Swords | swords02.jpg |
| 3 | swords_03 | Three of Swords | swords03.jpg |
| 4 | swords_04 | Four of Swords | swords04.jpg |
| 5 | swords_05 | Five of Swords | swords05.jpg |
| 6 | swords_06 | Six of Swords | swords06.jpg |
| 7 | swords_07 | Seven of Swords | swords07.jpg |
| 8 | swords_08 | Eight of Swords | swords08.jpg |
| 9 | swords_09 | Nine of Swords | swords09.jpg |
| 10 | swords_10 | Ten of Swords | swords10.jpg |
| 11 | swords_11 | Page of Swords | swords11.jpg |
| 12 | swords_12 | Knight of Swords | swords12.jpg |
| 13 | swords_13 | Queen of Swords | swords13.jpg |
| 14 | swords_14 | King of Swords | swords14.jpg |

**Pentacles (element: `earth`)**

| # | id | name | image |
|---|---|---|---|
| 1 | pentacles_01 | Ace of Pentacles | pentacles01.jpg |
| 2 | pentacles_02 | Two of Pentacles | pentacles02.jpg |
| 3 | pentacles_03 | Three of Pentacles | pentacles03.jpg |
| 4 | pentacles_04 | Four of Pentacles | pentacles04.jpg |
| 5 | pentacles_05 | Five of Pentacles | pentacles05.jpg |
| 6 | pentacles_06 | Six of Pentacles | pentacles06.jpg |
| 7 | pentacles_07 | Seven of Pentacles | pentacles07.jpg |
| 8 | pentacles_08 | Eight of Pentacles | pentacles08.jpg |
| 9 | pentacles_09 | Nine of Pentacles | pentacles09.jpg |
| 10 | pentacles_10 | Ten of Pentacles | pentacles10.jpg |
| 11 | pentacles_11 | Page of Pentacles | pentacles11.jpg |
| 12 | pentacles_12 | Knight of Pentacles | pentacles12.jpg |
| 13 | pentacles_13 | Queen of Pentacles | pentacles13.jpg |
| 14 | pentacles_14 | King of Pentacles | pentacles14.jpg |

- [ ] **Step 1: Write `cards-minor.json`** with all 56 entries per the four tables above, in order Wands → Cups → Swords → Pentacles (this order matters — later tasks rely on it for deterministic test fixtures). Example entry shape:

```json
[
  {
    "id": "wands_01",
    "name": "Ace of Wands",
    "number": 1,
    "arcana": "minor",
    "suit": "wands",
    "element": "fire",
    "image": "/assets/tarot/wands01.jpg"
  }
]
```
(full array continues for all 56 rows across the four tables, in order, each entry's `image` field as `/assets/tarot/<image column value>`)

- [ ] **Step 2: Validate structure**

Run:
```bash
python -c "
import json
d = json.load(open('Tarot Divination Site/content/cards-minor.json', encoding='utf-8'))
assert len(d) == 56, f'expected 56, got {len(d)}'
suits = {'wands': 'fire', 'cups': 'water', 'swords': 'air', 'pentacles': 'earth'}
seen = set()
for c in d:
    suit, num = c['id'].split('_')
    assert suit in suits, c['id']
    assert c['suit'] == suit, c['id']
    assert c['element'] == suits[suit], c['id']
    assert c['arcana'] == 'minor', c['id']
    assert c['number'] == int(num), c['id']
    assert c['image'] == f'/assets/tarot/{suit}{num}.jpg', c['id']
    seen.add(c['id'])
assert len(seen) == 56
order = [c['id'] for c in d]
assert order == sorted(order, key=lambda i: (['wands','cups','swords','pentacles'].index(i.split('_')[0]), int(i.split('_')[1])))
print('OK: 56 cards, ids/suits/elements/image paths consistent, correct order')
"
```
Expected: `OK: 56 cards, ids/suits/elements/image paths consistent, correct order`

- [ ] **Step 3: Commit**

```bash
cd "Tarot Divination Site"
git add content/cards-minor.json
git commit -m "Add Minor Arcana structure data (56 cards)"
```

---

### Task 2: Chinese content — Wands (14 cards)

**Files:**
- Create: `Tarot Divination Site/content/cards-minor.zh.json`

**Interfaces:**
- Consumes: `id` values `wands_01`..`wands_14` from Task 1's structure file
- Produces: top-level keys `wands_01`..`wands_14` in `cards-minor.zh.json`, each
  `{ name_local, keywords: [3 strings], upright_meaning, upright_advice, reversed_meaning, reversed_advice }`
  — same shape as `cards-major.zh.json` entries. Tasks 3-5 add more top-level keys to this
  same file — do not overwrite existing keys.

- [ ] **Step 1: Write content for wands_01–wands_14**

Write `cards-minor.zh.json` with entries for all 14 Wands cards. For each: a Chinese
display name, 3 Chinese keywords, a 2-4 sentence upright meaning and 1-sentence upright
advice, a 2-4 sentence reversed meaning and 1-sentence reversed advice — all in original
phrasing reflecting standard Waite-Smith Minor Arcana symbolism (Wands = fire element:
passion, creativity, career, action). Thematic anchors per card (these must actually
appear in the meanings written, not generic filler):

- Ace of Wands = new inspiration / creative spark / raw potential
- Two of Wands = forward planning / personal power / choosing a direction
- Three of Wands = expansion / foresight / awaiting results already in motion
- Four of Wands = celebration / harmony / a milestone homecoming
- Five of Wands = competition / friction / clashing opinions
- Six of Wands = victory / public recognition / earned pride
- Seven of Wands = defending your position / perseverance under pressure
- Eight of Wands = swift movement / fast-arriving news / sudden acceleration
- Nine of Wands = resilience / a last stand / guarded boundaries
- Ten of Wands = overload / carrying too much responsibility
- Page of Wands = eager exploration / a new idea's messenger / free spirit
- Knight of Wands = impulsive action / adventure / hot-blooded passion
- Queen of Wands = confident warmth / independence / social magnetism
- King of Wands = bold vision / entrepreneurial leadership / natural authority

- [ ] **Step 2: Validate**

Run:
```bash
python -c "
import json
d = json.load(open('Tarot Divination Site/content/cards-minor.zh.json', encoding='utf-8'))
expected = [f'wands_{i:02d}' for i in range(1, 15)]
for k in expected:
    assert k in d, f'missing {k}'
    c = d[k]
    for field in ['name_local','keywords','upright_meaning','upright_advice','reversed_meaning','reversed_advice']:
        assert field in c and c[field], f'{k} missing {field}'
    assert len(c['keywords']) == 3, f'{k} keywords count'
print('OK: wands_01..wands_14 present and complete')
"
```
Expected: `OK: wands_01..wands_14 present and complete`

- [ ] **Step 3: Commit**

```bash
cd "Tarot Divination Site"
git add content/cards-minor.zh.json
git commit -m "Add Minor Arcana Chinese content: Wands"
```

---

### Task 3: Chinese content — Cups (14 cards)

**Files:**
- Modify: `Tarot Divination Site/content/cards-minor.zh.json`

**Interfaces:**
- Consumes: `id` values `cups_01`..`cups_14`
- Produces: adds top-level keys `cups_01`..`cups_14` to the existing file (same shape as Task 2), preserving `wands_01`..`wands_14`.

- [ ] **Step 1: Add content for cups_01–cups_14**

Add entries for all 14 Cups cards (Cups = water element: emotion, relationships,
intuition). Same field shape and depth as Task 2. Thematic anchors:

- Ace of Cups = new emotional beginning / overflowing love / an open heart
- Two of Cups = mutual attraction / partnership / a genuine connection
- Three of Cups = friendship / celebration / joyful community
- Four of Cups = apathy / withdrawn contemplation / a missed offer
- Five of Cups = loss / regret / fixating on what spilled instead of what remains
- Six of Cups = nostalgia / childhood memory / an innocent reunion
- Seven of Cups = too many choices / illusion / wishful fantasy versus reality
- Eight of Cups = walking away / seeking deeper meaning / leaving what no longer fulfills
- Nine of Cups = satisfaction / a wish granted / emotional contentment
- Ten of Cups = lasting happiness / family harmony / emotional fulfillment
- Page of Cups = a gentle, intuitive messenger / creative curiosity / sensitivity
- Knight of Cups = romantic idealism / following the heart / quiet charm
- Queen of Cups = compassion / emotional security / nurturing intuition
- King of Cups = emotional balance / calm diplomacy / mastery over feeling

- [ ] **Step 2: Validate**

Run:
```bash
python -c "
import json
d = json.load(open('Tarot Divination Site/content/cards-minor.zh.json', encoding='utf-8'))
required = ['name_local','keywords','upright_meaning','upright_advice','reversed_meaning','reversed_advice']
for suit in ['wands', 'cups']:
    expected = [f'{suit}_{i:02d}' for i in range(1, 15)]
    for k in expected:
        assert k in d, f'missing {k}'
        c = d[k]
        for field in required:
            assert field in c and c[field], f'{k} missing {field}'
        assert len(c['keywords']) == 3, f'{k} keywords count'
print('OK: wands_01..wands_14 and cups_01..cups_14 present and complete')
"
```
Expected: `OK: wands_01..wands_14 and cups_01..cups_14 present and complete`

- [ ] **Step 3: Commit**

```bash
cd "Tarot Divination Site"
git add content/cards-minor.zh.json
git commit -m "Add Minor Arcana Chinese content: Cups"
```

---

### Task 4: Chinese content — Swords (14 cards)

**Files:**
- Modify: `Tarot Divination Site/content/cards-minor.zh.json`

**Interfaces:**
- Consumes: `id` values `swords_01`..`swords_14`
- Produces: adds top-level keys `swords_01`..`swords_14`, preserving all prior keys.

- [ ] **Step 1: Add content for swords_01–swords_14**

Add entries for all 14 Swords cards (Swords = air element: intellect, conflict,
communication, truth). Same field shape and depth as Task 2. Thematic anchors:

- Ace of Swords = clarity / breakthrough / a truth cutting through confusion
- Two of Swords = indecision / stalemate / avoidance of a hard choice
- Three of Swords = heartbreak / sorrow / a painful truth
- Four of Swords = rest / recovery / a deliberate pause before acting again
- Five of Swords = conflict / winning at all costs / a hollow victory
- Six of Swords = transition / moving on / gradually leaving difficulty behind
- Seven of Swords = deception / strategy / getting away with something quietly
- Eight of Swords = self-imposed restriction / feeling trapped / a victim mindset
- Nine of Swords = anxiety / worry / mental anguish that keeps you up at night
- Ten of Swords = a painful ending / betrayal / rock bottom that also means release
- Page of Swords = curiosity / vigilance / a sharp new idea, or gossip
- Knight of Swords = fast, assertive action / blunt directness / impulsive pursuit of truth
- Queen of Swords = clear boundaries / independent thinking / unsentimental honesty
- King of Swords = intellectual authority / fairness / clear-headed judgment

- [ ] **Step 2: Validate**

Run:
```bash
python -c "
import json
d = json.load(open('Tarot Divination Site/content/cards-minor.zh.json', encoding='utf-8'))
required = ['name_local','keywords','upright_meaning','upright_advice','reversed_meaning','reversed_advice']
for suit in ['wands', 'cups', 'swords']:
    expected = [f'{suit}_{i:02d}' for i in range(1, 15)]
    for k in expected:
        assert k in d, f'missing {k}'
        c = d[k]
        for field in required:
            assert field in c and c[field], f'{k} missing {field}'
        assert len(c['keywords']) == 3, f'{k} keywords count'
print('OK: wands_01..wands_14, cups_01..cups_14, and swords_01..swords_14 present and complete')
"
```
Expected: `OK: wands_01..wands_14, cups_01..cups_14, and swords_01..swords_14 present and complete`

- [ ] **Step 3: Commit**

```bash
cd "Tarot Divination Site"
git add content/cards-minor.zh.json
git commit -m "Add Minor Arcana Chinese content: Swords"
```

---

### Task 5: Chinese content — Pentacles (14 cards)

**Files:**
- Modify: `Tarot Divination Site/content/cards-minor.zh.json`

**Interfaces:**
- Consumes: `id` values `pentacles_01`..`pentacles_14`
- Produces: the final top-level keys `pentacles_01`..`pentacles_14`, bringing the file to all 56 entries.

- [ ] **Step 1: Add content for pentacles_01–pentacles_14**

Add entries for all 14 Pentacles cards (Pentacles = earth element: material world,
career, money, health, practical matters). Same field shape and depth as Task 2.
Thematic anchors:

- Ace of Pentacles = a new material opportunity / tangible potential / prosperity beginning
- Two of Pentacles = balancing priorities / adaptability / juggling resources
- Three of Pentacles = teamwork / collaboration / skill recognized by others
- Four of Pentacles = security through control / saving / holding on tightly
- Five of Pentacles = hardship / financial worry / feeling left out in the cold
- Six of Pentacles = generosity / giving and receiving / a balance of power
- Seven of Pentacles = patience / long-term investment / assessing progress so far
- Eight of Pentacles = diligence / skill-building / dedicated craftsmanship
- Nine of Pentacles = self-sufficiency / refined independence / enjoying what you've built alone
- Ten of Pentacles = legacy / lasting wealth / stability across generations
- Page of Pentacles = studious ambition / a practical new opportunity taking root
- Knight of Pentacles = methodical effort / reliability / steady routine
- Queen of Pentacles = nurturing abundance / practical care / resourceful comfort
- King of Pentacles = material mastery / financial security / generous, steady leadership

- [ ] **Step 2: Validate full file**

Run:
```bash
python -c "
import json
struct = json.load(open('Tarot Divination Site/content/cards-minor.json', encoding='utf-8'))
content = json.load(open('Tarot Divination Site/content/cards-minor.zh.json', encoding='utf-8'))
struct_ids = sorted(c['id'] for c in struct)
content_ids = sorted(content.keys())
assert struct_ids == content_ids, (struct_ids, content_ids)
assert len(content_ids) == 56
for k, c in content.items():
    for field in ['name_local','keywords','upright_meaning','upright_advice','reversed_meaning','reversed_advice']:
        assert field in c and c[field], f'{k} missing {field}'
    assert len(c['keywords']) == 3
print('OK: all 56 Minor Arcana cards present in both files, ids match, all fields populated')
"
```
Expected: `OK: all 56 Minor Arcana cards present in both files, ids match, all fields populated`

- [ ] **Step 3: Commit**

```bash
cd "Tarot Divination Site"
git add content/cards-minor.zh.json
git commit -m "Add Minor Arcana Chinese content: Pentacles"
```

---

### Task 6: Update sources documentation

**Files:**
- Modify: `Tarot Divination Site/content/SOURCES.md`

**Interfaces:**
- Consumes: nothing from prior tasks (documentation only)
- Produces: an updated file the "关于" (About) page's future credit section can reference; also corrects two lines that went stale after the single-card draw-flow sub-project already downloaded the Major Arcana images (the file currently still says "referenced, not yet downloaded")

- [ ] **Step 1: Rewrite `SOURCES.md`**

Replace the entire file contents with:

```markdown
# Content Sources

## Card Meanings

Meanings and advice text for all 78 cards (22 Major Arcana + 56 Minor Arcana) are written
in original wording, summarizing the standard Rider-Waite-Smith tarot tradition (as
documented in A.E. Waite's 1910 *The Pictorial Key to the Tarot*, public domain, available
at sacred-texts.com — Part I covers the Major Arcana, Part II covers the Minor Arcana pip
and court cards). Text is not copied verbatim from any single source.

Major Arcana numbering and names follow the Waite-Smith-specific ordering (Strength = VIII,
Justice = XI — not swapped, as in the older Tarot de Marseille tradition). Minor Arcana
cards are numbered 1 (Ace) through 10 within each suit, then 11=Page, 12=Knight, 13=Queen,
14=King.

## Card Images

Source: [github.com/searge/tarot](https://github.com/searge/tarot),
`assets/img/big/maj00.jpg` through `maj21.jpg` (Major Arcana) and
`assets/img/big/{wands,cups,swords,pents}01-14.jpg` (Minor Arcana).

**License note:** the repo's overall badge is CC-BY-SA-4.0, but the image folder itself
(`assets/img/LICENSE`) carries separate public-domain-style (Unlicense) terms. The
underlying 1909 Pamela Colman Smith artwork is public domain. This was re-verified at
download time for both the Major Arcana batch (single-card draw-flow sub-project) and the
Minor Arcana batch (this sub-project).

All 78 card images are downloaded into `public/assets/tarot/`. Minor Arcana files are
renamed from the source's `pents` abbreviation to `pentacles` (e.g. `pentacles01.jpg`) to
match the `suit` value used in `cards-minor.json`; all other suit names are unchanged.

## Language / i18n

This batch ships Chinese (`zh`) content only, in `cards-major.zh.json` and
`cards-minor.zh.json`. Additional locales (e.g. `en`, `ja`, `es`) should be added as new
`cards-major.<locale>.json` / `cards-minor.<locale>.json` files with the same key shape,
without modifying the structure files or any existing locale file.
```

- [ ] **Step 2: Confirm file contents**

Run: `cat "Tarot Divination Site/content/SOURCES.md"`
Expected: shows the exact content from Step 1, no leftover references to "not yet downloaded" or "future batch"

- [ ] **Step 3: Commit**

```bash
cd "Tarot Divination Site"
git add content/SOURCES.md
git commit -m "Update SOURCES.md for the completed Minor Arcana batch"
```

---

### Task 7: Download the 56 Minor Arcana card images

**Files:**
- Create: `Tarot Divination Site/public/assets/tarot/wands01.jpg` … `wands14.jpg`
- Create: `Tarot Divination Site/public/assets/tarot/cups01.jpg` … `cups14.jpg`
- Create: `Tarot Divination Site/public/assets/tarot/swords01.jpg` … `swords14.jpg`
- Create: `Tarot Divination Site/public/assets/tarot/pentacles01.jpg` … `pentacles14.jpg`

**Interfaces:**
- Consumes: `image` paths from Task 1's `cards-minor.json` (`/assets/tarot/<suit><NN>.jpg`)
- Produces: 56 real card image files at those exact paths, consumed at render time by `TarotCard.tsx` (`<img src={card.image}>`) — no code change needed there since it already renders whatever `image` path the drawn card carries.

- [ ] **Step 1: Download all 56 files**

Run:
```bash
cd "Tarot Divination Site"
mkdir -p public/assets/tarot

if curl -sf -o /dev/null "https://raw.githubusercontent.com/searge/tarot/main/assets/img/big/maj00.jpg"; then
  BRANCH="main"
else
  BRANCH="master"
fi
echo "Using branch: $BRANCH"

for suit_pair in "wands:wands" "cups:cups" "swords:swords" "pents:pentacles"; do
  SRC_SUIT="${suit_pair%%:*}"
  DST_SUIT="${suit_pair##*:}"
  for i in $(seq -w 1 14); do
    SRC_URL="https://raw.githubusercontent.com/searge/tarot/$BRANCH/assets/img/big/${SRC_SUIT}${i}.jpg"
    DST_FILE="public/assets/tarot/${DST_SUIT}${i}.jpg"
    if ! curl -sf -o "$DST_FILE" "$SRC_URL"; then
      echo "FAILED: $SRC_URL"
      exit 1
    fi
  done
done
echo "Download loop complete"
```
Expected: `Download loop complete` with no `FAILED:` lines printed above it

- [ ] **Step 2: Verify all 56 files exist and are non-trivial size**

Run:
```bash
python -c "
import os
suits = ['wands', 'cups', 'swords', 'pentacles']
base = 'Tarot Divination Site/public/assets/tarot'
missing = []
tiny = []
for suit in suits:
    for i in range(1, 15):
        fname = f'{suit}{i:02d}.jpg'
        path = os.path.join(base, fname)
        if not os.path.exists(path):
            missing.append(fname)
        elif os.path.getsize(path) < 1000:
            tiny.append(fname)
assert not missing, f'missing: {missing}'
assert not tiny, f'suspiciously small (possibly an error page, not a real image): {tiny}'
print('OK: all 56 Minor Arcana images present and non-trivial size')
"
```
Expected: `OK: all 56 Minor Arcana images present and non-trivial size`

- [ ] **Step 3: Commit**

```bash
cd "Tarot Divination Site"
git add public/assets/tarot/
git commit -m "Download real Minor Arcana card images (56 files)"
```

---

### Task 8: Wire content into `src/data` and extend data validation tests

**Files:**
- Create: `Tarot Divination Site/src/data/cards-minor.json`
- Create: `Tarot Divination Site/src/data/cards-minor.zh.json`
- Modify: `Tarot Divination Site/src/data/cards.test.ts`

**Interfaces:**
- Consumes: `content/cards-minor.json`, `content/cards-minor.zh.json` (Tasks 1-5)
- Produces: `src/data/cards-minor.json` and `src/data/cards-minor.zh.json`, consumed by Task 9's `ReadingSessionContext` wiring

- [ ] **Step 1: Write the failing test**

Replace `Tarot Divination Site/src/data/cards.test.ts` entirely with:

```ts
import { describe, it, expect } from 'vitest'
import majorStructure from './cards-major.json'
import majorContent from './cards-major.zh.json'
import minorStructure from './cards-minor.json'
import minorContent from './cards-minor.zh.json'

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
  const cards = majorStructure as unknown as CardStructure[]
  const localized = majorContent as unknown as Record<string, CardContent>

  it('has exactly 22 structural entries numbered 0-21', () => {
    expect(cards).toHaveLength(22)
    const ids = cards.map((c) => c.id).sort()
    const expected = Array.from(
      { length: 22 },
      (_, i) => `major_${String(i).padStart(2, '0')}`,
    ).sort()
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

describe('Minor Arcana card data', () => {
  const cards = minorStructure as unknown as CardStructure[]
  const localized = minorContent as unknown as Record<string, CardContent>

  it('has exactly 56 structural entries across 4 suits', () => {
    expect(cards).toHaveLength(56)
    const suits = ['wands', 'cups', 'swords', 'pentacles']
    const ids = cards.map((c) => c.id).sort()
    const expected = suits
      .flatMap((suit) =>
        Array.from({ length: 14 }, (_, i) => `${suit}_${String(i + 1).padStart(2, '0')}`),
      )
      .sort()
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

  it('has correct suit/element pairing for every card', () => {
    const elementBySuit: Record<string, string> = {
      wands: 'fire',
      cups: 'water',
      swords: 'air',
      pentacles: 'earth',
    }
    for (const card of cards) {
      expect(card.arcana).toBe('minor')
      expect(card.suit).toBeTruthy()
      expect(card.element).toBe(elementBySuit[card.suit as string])
    }
  })
})

describe('Combined 78-card pool', () => {
  it('has 78 total entries with no duplicate ids across both arcana', () => {
    const allIds = [
      ...(majorStructure as unknown as CardStructure[]).map((c) => c.id),
      ...(minorStructure as unknown as CardStructure[]).map((c) => c.id),
    ]
    expect(allIds).toHaveLength(78)
    expect(new Set(allIds).size).toBe(78)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/cards.test.ts`
Expected: FAIL — `Cannot find module './cards-minor.json'` (the file doesn't exist in `src/data/` yet)

- [ ] **Step 3: Copy the data files into `src/data`**

```bash
cd "Tarot Divination Site"
cp content/cards-minor.json src/data/cards-minor.json
cp content/cards-minor.zh.json src/data/cards-minor.zh.json
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/data/cards.test.ts`
Expected: PASS, all tests in `Major Arcana card data`, `Minor Arcana card data`, and `Combined 78-card pool` green

- [ ] **Step 5: Commit**

```bash
cd "Tarot Divination Site"
git add src/data/cards-minor.json src/data/cards-minor.zh.json src/data/cards.test.ts
git commit -m "Wire Minor Arcana content into src/data with combined-pool validation"
```

---

### Task 9: Draw from the combined 78-card pool

**Files:**
- Modify: `Tarot Divination Site/src/context/ReadingSessionContext.tsx`
- Modify: `Tarot Divination Site/src/context/ReadingSessionContext.test.tsx`

**Interfaces:**
- Consumes: `src/data/cards-minor.json`, `src/data/cards-minor.zh.json` (Task 8); `drawCard()` from `../lib/drawCard` (unchanged signature: `drawCard(structure: CardStructure[], content: Record<string, CardContent>): DrawnCard`)
- Produces: `selectCard()` now draws from all 78 cards — `DrawnCard.id` can be any of `major_00`..`major_21` or `<suit>_01`..`<suit>_14`. This is consumed by Task 10 (`ResultStep`'s caption logic).

Current relevant code in `ReadingSessionContext.tsx`:
```ts
import { drawCard, type DrawnCard, type CardStructure, type CardContent } from '../lib/drawCard'
import cardsStructure from '../data/cards-major.json'
import cardsContent from '../data/cards-major.zh.json'
```
and inside `ReadingSessionProvider`:
```ts
    selectCard: () => {
      const card = drawCard(
        cardsStructure as unknown as CardStructure[],
        cardsContent as unknown as Record<string, CardContent>,
      )
      setDrawnCard(card)
      setStep('revealing')
    },
```

- [ ] **Step 1: Write the failing tests**

In `ReadingSessionContext.test.tsx`, add `vi` to the vitest import (`import { describe, it, expect, vi } from 'vitest'`), widen the existing regex assertion that currently only matches Major Arcana ids, and add a new deterministic test proving the combined pool is wired up. The file becomes:

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

  it('can draw a Minor Arcana card from the combined 78-card pool', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(22.5 / 78) // index 22 = first Minor Arcana entry (wands_01)
    randomSpy.mockReturnValueOnce(0.1) // upright

    render(
      <ReadingSessionProvider>
        <Probe />
      </ReadingSessionProvider>,
    )
    act(() => screen.getByText('beginShuffle').click())
    act(() => screen.getByText('finishShuffle').click())
    act(() => screen.getByText('selectCard').click())
    expect(screen.getByText('drawnCard: wands_01')).toBeInTheDocument()

    randomSpy.mockRestore()
  })
})
```

- [ ] **Step 2: Run test to verify the new test fails**

Run: `npm test -- src/context/ReadingSessionContext.test.tsx`
Expected: FAIL on `'can draw a Minor Arcana card from the combined 78-card pool'` — the pool is still 22 cards, so index 22 is out of bounds and `drawCard()` throws when it tries to read `.name_local` off `undefined`

- [ ] **Step 3: Wire the combined pool**

In `ReadingSessionContext.tsx`, replace the imports:
```ts
import { drawCard, type DrawnCard, type CardStructure, type CardContent } from '../lib/drawCard'
import cardsStructure from '../data/cards-major.json'
import cardsContent from '../data/cards-major.zh.json'
```
with:
```ts
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
```

Then replace the body of `selectCard`:
```ts
    selectCard: () => {
      const card = drawCard(
        cardsStructure as unknown as CardStructure[],
        cardsContent as unknown as Record<string, CardContent>,
      )
      setDrawnCard(card)
      setStep('revealing')
    },
```
with:
```ts
    selectCard: () => {
      const card = drawCard(allStructure, allContent)
      setDrawnCard(card)
      setStep('revealing')
    },
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/context/ReadingSessionContext.test.tsx`
Expected: PASS, all 5 tests green

- [ ] **Step 5: Run the full test suite to confirm no regressions elsewhere**

Run: `npm test`
Expected: PASS — all existing suites (including `DrawPage.test.tsx`, `ResultStep.test.tsx`, etc.) remain green since none of them assert a specific card id other than the regex just widened

- [ ] **Step 6: Commit**

```bash
cd "Tarot Divination Site"
git add src/context/ReadingSessionContext.tsx src/context/ReadingSessionContext.test.tsx
git commit -m "Draw from the combined 78-card Major+Minor Arcana pool"
```

---

### Task 10: Suit-aware result caption for Minor Arcana

**Files:**
- Modify: `Tarot Divination Site/src/components/draw/ResultStep.tsx`
- Modify: `Tarot Divination Site/src/components/draw/ResultStep.test.tsx`

**Interfaces:**
- Consumes: `DrawnCard` from `../../lib/drawCard` (unchanged type); `useReadingSession()` (Task 9's expanded pool)
- Produces: `ResultStep` renders `MAJOR ARCANA {roman numeral}` for Major Arcana draws (unchanged) and `{SUIT} · {RANK}` (e.g. `WANDS · ACE`) for Minor Arcana draws

Current relevant code in `ResultStep.tsx`:
```tsx
const ROMAN_NUMERALS = [
  '0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
]
```
and inside the JSX:
```tsx
          <span className="font-label-caps text-[12px] tracking-[0.2em] text-primary/70">
            MAJOR ARCANA {ROMAN_NUMERALS[Number(drawnCard.id.replace('major_', ''))]}
          </span>
```

- [ ] **Step 1: Write the failing tests**

In `ResultStep.test.tsx`, add `vi` to the vitest import (`import { describe, it, expect, vi } from 'vitest'`) and add two new tests at the end of the `describe('ResultStep', ...)` block:

```tsx
  it('shows a suit-based caption for a Minor Arcana result', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(22.5 / 78) // index 22 = wands_01 (Ace of Wands)
    randomSpy.mockReturnValueOnce(0.1) // upright
    renderAtResult('')
    expect(screen.getByText('WANDS · ACE')).toBeInTheDocument()
    randomSpy.mockRestore()
  })

  it('still shows the Roman-numeral caption for a Major Arcana result', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValueOnce(7.5 / 78) // index 7 = major_07 (The Chariot)
    randomSpy.mockReturnValueOnce(0.1) // upright
    renderAtResult('')
    expect(screen.getByText('MAJOR ARCANA VII')).toBeInTheDocument()
    randomSpy.mockRestore()
  })
```

- [ ] **Step 2: Run test to verify the Minor Arcana test fails**

Run: `npm test -- src/components/draw/ResultStep.test.tsx`
Expected: FAIL on `'shows a suit-based caption for a Minor Arcana result'` — current code computes `Number('wands_01'.replace('major_', ''))` which is `NaN`, so it renders `MAJOR ARCANA undefined`, not `WANDS · ACE`

- [ ] **Step 3: Implement the suit-aware caption**

In `ResultStep.tsx`, after the `ROMAN_NUMERALS` array, add:

```tsx
const RANK_LABELS = [
  '',
  'ACE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
  'PAGE',
  'KNIGHT',
  'QUEEN',
  'KING',
]

const SUIT_LABELS: Record<string, string> = {
  wands: 'WANDS',
  cups: 'CUPS',
  swords: 'SWORDS',
  pentacles: 'PENTACLES',
}

function arcanaCaption(drawnCard: { id: string }): string {
  if (drawnCard.id.startsWith('major_')) {
    return `MAJOR ARCANA ${ROMAN_NUMERALS[Number(drawnCard.id.replace('major_', ''))]}`
  }
  const [suit, numStr] = drawnCard.id.split('_')
  return `${SUIT_LABELS[suit]} · ${RANK_LABELS[Number(numStr)]}`
}
```

Then replace the caption span's contents:
```tsx
          <span className="font-label-caps text-[12px] tracking-[0.2em] text-primary/70">
            MAJOR ARCANA {ROMAN_NUMERALS[Number(drawnCard.id.replace('major_', ''))]}
          </span>
```
with:
```tsx
          <span className="font-label-caps text-[12px] tracking-[0.2em] text-primary/70">
            {arcanaCaption(drawnCard)}
          </span>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/draw/ResultStep.test.tsx`
Expected: PASS, all 7 tests green (5 existing + 2 new)

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: PASS, no regressions

- [ ] **Step 6: Commit**

```bash
cd "Tarot Divination Site"
git add src/components/draw/ResultStep.tsx src/components/draw/ResultStep.test.tsx
git commit -m "Show suit-aware result caption for Minor Arcana draws"
```

---

### Task 11: Final integration validation

**Files:**
- None created or modified — this task validates the whole sub-project

**Interfaces:**
- Consumes: everything from Tasks 1-10

- [ ] **Step 1: Full automated check**

Run, in order:
```bash
cd "Tarot Divination Site"
npm test
npm run lint
npm run build
```
Expected: all three succeed with no errors. `npm test` should show a higher total test count than before this sub-project (new suites/cases from Tasks 8-10).

- [ ] **Step 2: Manual smoke test via production preview**

The Vite dev server's esbuild dependency-optimizer service is known to crash in this
sandbox — use the production preview instead:
```bash
npm run build
npm run preview
```
Open the preview URL, navigate to `/draw`, state a question, go through shuffle → select
→ reveal. Repeat the full ritual a few times (the pool is now 78 cards, so most draws will
land on a Minor Arcana card — roughly 72% odds per draw) until both outcomes are observed
at least once:
- A Major Arcana result: caption reads `MAJOR ARCANA <roman numeral>`, real Major Arcana
  artwork renders
- A Minor Arcana result: caption reads `<SUIT> · <RANK>` (e.g. `CUPS · SEVEN`), real Minor
  Arcana artwork renders (not a broken image icon)

- [ ] **Step 3: Confirm no leftover stale references**

Run: `grep -r "future batch" "Tarot Divination Site/content/" "Tarot Divination Site/src/"`
Expected: no matches (confirms Task 6 fully replaced the old "future batch" language)

- [ ] **Step 4: Final commit if any cleanup was needed**

If Steps 1-3 required any fixes, commit them:
```bash
cd "Tarot Divination Site"
git add -A
git commit -m "Fix issues found during Minor Arcana final integration validation"
```
If no fixes were needed, skip this step — nothing to commit.

---

## Out of Scope (tracked in the spec's Out of Scope section)

- Multi-card spreads (3-card, Celtic Cross) — next sub-project
- Horseshoe spread, Relationship spread — undecided, not scheduled
- The rules doc's section 8 disclaimer guidance — no live page for it yet (About page sub-project)
- Additional locales beyond `zh` for the new Minor Arcana content
- Supabase persistence of readings
