# Major Arcana Content Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce accurate, structurally validated Chinese-language content for the 22 Rider-Waite-Smith Major Arcana cards, split into a locale-independent structure file and a locale content file, ready to drop into the app once scaffolding begins.

**Architecture:** Two-file split per the approved spec — `cards-major.json` (id, canonical English name, number, arcana/suit/element, image path) and `cards-major.zh.json` (localized name, keywords, upright/reversed meaning + advice), keyed by matching `id`. Content is written from the implementer's own knowledge of the standard Rider-Waite-Smith tradition (numbering, names, and meanings are well-documented public domain material — see Task 1 note on ordering), summarized in original wording rather than copied from any single source.

**Tech Stack:** Plain JSON files, validated with Python's `json` module via Bash. No app code yet (scaffolding is a separate, later effort).

## Global Constraints

- Content language: Chinese (`zh`) only in this batch — no English/other-locale content files yet (spec: Language Scope decision)
- Card count: exactly 22, numbered 0–21, no gaps or duplicates
- Meanings/advice must reflect standard, well-established Rider-Waite-Smith tradition content — the user explicitly asked for 100% fidelity to real tarot meanings, not invented content, since this feeds reading "accuracy"
- No verbatim long-form copying from any source text — original phrasing only
- Image paths reference `/assets/tarot/majNN.jpg` (matching the verified `searge/tarot` GitHub repo naming) but no image files are downloaded in this batch
- This project directory is not a git repository — steps below skip `git commit`; files are just saved directly

---

### Task 1: Structure file — all 22 cards

**Files:**
- Create: `Tarot Divination Site/content/cards-major.json`

**Interfaces:**
- Produces: an array of 22 objects, each `{ id, name, number, arcana, suit, element, image }`, `id` format `"major_NN"` (zero-padded 2-digit), used by Task 2-5 content files (which must key on the same `id` values) and Task 6 validation.

Standard Rider-Waite-Smith Major Arcana ordering and names (locked in now since this is
factual, not a content-quality judgment call):

| # | id | name | image |
|---|---|---|---|
| 0 | major_00 | The Fool | maj00.jpg |
| 1 | major_01 | The Magician | maj01.jpg |
| 2 | major_02 | The High Priestess | maj02.jpg |
| 3 | major_03 | The Empress | maj03.jpg |
| 4 | major_04 | The Emperor | maj04.jpg |
| 5 | major_05 | The Hierophant | maj05.jpg |
| 6 | major_06 | The Lovers | maj06.jpg |
| 7 | major_07 | The Chariot | maj07.jpg |
| 8 | major_08 | Strength | maj08.jpg |
| 9 | major_09 | The Hermit | maj09.jpg |
| 10 | major_10 | Wheel of Fortune | maj10.jpg |
| 11 | major_11 | Justice | maj11.jpg |
| 12 | major_12 | The Hanged Man | maj12.jpg |
| 13 | major_13 | Death | maj13.jpg |
| 14 | major_14 | Temperance | maj14.jpg |
| 15 | major_15 | The Devil | maj15.jpg |
| 16 | major_16 | The Tower | maj16.jpg |
| 17 | major_17 | The Star | maj17.jpg |
| 18 | major_18 | The Moon | maj18.jpg |
| 19 | major_19 | The Sun | maj19.jpg |
| 20 | major_20 | Judgement | maj20.jpg |
| 21 | major_21 | The World | maj21.jpg |

Note: Strength=8 and Justice=11 (not swapped) is the Waite-Smith-specific ordering — this
matters for accuracy since older Marseille-tradition decks swap these two.

- [ ] **Step 1: Write `cards-major.json`** with all 22 entries per the table above, e.g.:

```json
[
  {
    "id": "major_00",
    "name": "The Fool",
    "number": 0,
    "arcana": "major",
    "suit": null,
    "element": null,
    "image": "/assets/tarot/maj00.jpg"
  }
]
```
(full array continues for all 22 rows in the table, in order)

- [ ] **Step 2: Validate structure**

Run:
```bash
python -c "
import json
d = json.load(open('Tarot Divination Site/content/cards-major.json', encoding='utf-8'))
assert len(d) == 22, f'expected 22, got {len(d)}'
ids = [c[\"id\"] for c in d]
assert ids == [f'major_{i:02d}' for i in range(22)], ids
assert all(c['image'] == f'/assets/tarot/maj{c[\"number\"]:02d}.jpg' for c in d)
print('OK: 22 cards, ids and image paths consistent')
"
```
Expected: `OK: 22 cards, ids and image paths consistent`

---

### Task 2: Chinese content — cards 0–5 (The Fool → The Hierophant)

**Files:**
- Create: `Tarot Divination Site/content/cards-major.zh.json`

**Interfaces:**
- Consumes: `id` values `major_00`..`major_05` from Task 1's structure file
- Produces: top-level keys `major_00`..`major_05` in `cards-major.zh.json`, each
  `{ name_local, keywords: [3 strings], upright_meaning, upright_advice, reversed_meaning, reversed_advice }`.
  Later tasks (3-5) add more top-level keys to this same file — do not overwrite existing keys.

- [ ] **Step 1: Write content for major_00–major_05**

Write `cards-major.zh.json` with entries for The Fool, The Magician, The High Priestess,
The Empress, The Emperor, The Hierophant. For each: a Chinese display name, 3 Chinese
keywords, a 2-4 sentence upright meaning and 1-sentence upright advice, a 2-4 sentence
reversed meaning and 1-sentence reversed advice — all in original phrasing reflecting
standard Waite-Smith card symbolism and meaning (e.g. The Fool = new beginnings/leap of
faith/innocence; The Magician = willpower/manifestation/resourcefulness; The High
Priestess = intuition/hidden knowledge/mystery; The Empress = abundance/nurturing/
fertility; The Emperor = authority/structure/stability; The Hierophant = tradition/
institutions/conformity — these thematic anchors must actually appear in the meanings
written, not generic filler).

- [ ] **Step 2: Validate**

Run:
```bash
python -c "
import json
d = json.load(open('Tarot Divination Site/content/cards-major.zh.json', encoding='utf-8'))
expected = [f'major_{i:02d}' for i in range(6)]
for k in expected:
    assert k in d, f'missing {k}'
    c = d[k]
    for field in ['name_local','keywords','upright_meaning','upright_advice','reversed_meaning','reversed_advice']:
        assert field in c and c[field], f'{k} missing {field}'
    assert len(c['keywords']) == 3, f'{k} keywords count'
print('OK: major_00..major_05 present and complete')
"
```
Expected: `OK: major_00..major_05 present and complete`

---

### Task 3: Chinese content — cards 6–10 (The Lovers → Wheel of Fortune)

**Files:**
- Modify: `Tarot Divination Site/content/cards-major.zh.json`

**Interfaces:**
- Consumes: `id` values `major_06`..`major_10`
- Produces: adds top-level keys `major_06`..`major_10` to the existing file (same shape as Task 2), preserving `major_00`..`major_05`.

- [ ] **Step 1: Add content for major_06–major_10**

Add entries for The Lovers, The Chariot, Strength, The Hermit, Wheel of Fortune, same
field shape as Task 2, thematically anchored (The Lovers = union/choice/values alignment;
The Chariot = willpower/determination/victory through control; Strength = inner
strength/compassion/courage over force; The Hermit = introspection/solitude/inner
guidance; Wheel of Fortune = cycles/fate/turning points).

- [ ] **Step 2: Validate**

Run the same validation pattern as Task 2 Step 2, with `expected = [f'major_{i:02d}' for i in range(6, 11)]` and confirm it prints `OK`. Also re-run Task 2's check to confirm `major_00`..`major_05` are still intact (unchanged length/content).

---

### Task 4: Chinese content — cards 11–16 (Justice → The Tower)

**Files:**
- Modify: `Tarot Divination Site/content/cards-major.zh.json`

**Interfaces:**
- Consumes: `id` values `major_11`..`major_16`
- Produces: adds top-level keys `major_11`..`major_16`, preserving all prior keys.

- [ ] **Step 1: Add content for major_11–major_16**

Add entries for Justice, The Hanged Man, Death, Temperance, The Devil, The Tower —
thematically anchored (Justice = fairness/truth/cause-and-effect; The Hanged Man =
surrender/new perspective/pause; Death = transformation/endings enabling new beginnings,
NOT literal death; Temperance = balance/moderation/integration; The Devil = bondage/
materialism/unhealthy attachment; The Tower = sudden upheaval/revelation/breaking false
structures).

- [ ] **Step 2: Validate**

Same validation pattern with `range(11, 17)`, plus a full re-check that `major_00`..`major_10` remain intact.

---

### Task 5: Chinese content — cards 17–21 (The Star → The World)

**Files:**
- Modify: `Tarot Divination Site/content/cards-major.zh.json`

**Interfaces:**
- Consumes: `id` values `major_17`..`major_21`
- Produces: adds the final top-level keys `major_17`..`major_21`, bringing the file to all 22 entries.

- [ ] **Step 1: Add content for major_17–major_21**

Add entries for The Star, The Moon, The Sun, Judgement, The World — thematically anchored
(The Star = hope/healing/renewed faith; The Moon = illusion/subconscious/uncertainty; The
Sun = joy/vitality/success; Judgement = reckoning/awakening/rebirth; The World =
completion/wholeness/fulfillment).

- [ ] **Step 2: Validate full file**

Run:
```bash
python -c "
import json
struct = json.load(open('Tarot Divination Site/content/cards-major.json', encoding='utf-8'))
content = json.load(open('Tarot Divination Site/content/cards-major.zh.json', encoding='utf-8'))
struct_ids = sorted(c['id'] for c in struct)
content_ids = sorted(content.keys())
assert struct_ids == content_ids, (struct_ids, content_ids)
assert len(content_ids) == 22
for k, c in content.items():
    for field in ['name_local','keywords','upright_meaning','upright_advice','reversed_meaning','reversed_advice']:
        assert field in c and c[field], f'{k} missing {field}'
    assert len(c['keywords']) == 3
print('OK: all 22 cards present in both files, ids match, all fields populated')
"
```
Expected: `OK: all 22 cards present in both files, ids match, all fields populated`

---

### Task 6: Sources documentation

**Files:**
- Create: `Tarot Divination Site/content/SOURCES.md`

**Interfaces:**
- Consumes: nothing from prior tasks (documentation only)
- Produces: a file the future "关于" (About) page's credit section can reference

- [ ] **Step 1: Write `SOURCES.md`**

```markdown
# Content Sources

## Card Meanings

Meanings and advice text for all 22 Major Arcana cards are written in original wording,
summarizing the standard Rider-Waite-Smith tarot tradition (as documented in A.E. Waite's
1910 *The Pictorial Key to the Tarot*, public domain, available at sacred-texts.com). Text
is not copied verbatim from any single source.

## Card Images (referenced, not yet downloaded)

Intended source: [github.com/searge/tarot](https://github.com/searge/tarot),
`assets/img/big/maj00.jpg` through `maj21.jpg` (Major Arcana) and
`{cups,pents,swords,wands}01-14.jpg` (Minor Arcana, for a future batch).

**License note:** the repo's overall badge is CC-BY-SA-4.0, but the image folder itself
(`assets/img/LICENSE`) carries separate public-domain-style (Unlicense) terms. The
underlying 1909 Pamela Colman Smith artwork is public domain. Re-verify
`assets/img/LICENSE` at actual download time before bulk-importing, since it's a distinct
grant from the repo-level badge and could change.

No image files have been downloaded as part of this content batch — only file paths are
referenced in `cards-major.json`.
```

- [ ] **Step 2: Confirm file exists**

Run: `ls "Tarot Divination Site/content/"`
Expected: lists `cards-major.json`, `cards-major.zh.json`, `SOURCES.md`

---

## Out of Scope (tracked in the spec's Future Work)

- Minor Arcana (56 cards)
- Additional locale files (`en`, `ja`, etc.)
- Actual image file download
- Wiring data into the app (no scaffolding exists yet)
