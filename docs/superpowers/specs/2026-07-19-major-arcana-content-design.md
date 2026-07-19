# Major Arcana Content Data — Design Spec

Date: 2026-07-19
Status: Approved (pending user review of this doc)

## Context

The Tarot Divination Site ("夜语塔罗" / Midnight Oracle) project has a design prompt doc
(`design/stitch-prompt.md`) but no code or generated Stitch/Figma output yet. The user chose to
wait on Stitch exports before scaffolding the app, and to use this time on content, which is
independent of visual design.

This spec covers the first content sub-project: structured data for the 22 Major Arcana cards.
Minor Arcana (56 cards), additional locales, and actual image file downloads are explicitly
out of scope here (see Future Work).

## Goal

Produce a reviewable, structurally sound dataset for the 22 Major Arcana cards that:
- Can be dropped into the app once scaffolding begins, with no schema rework
- Is architected for multi-language support from the start (the user does not want the site
  limited to just Chinese/English — mainstream languages should be addable later without
  touching existing files)
- Uses meanings summarized in original wording from a public-domain source, not copied text

## Scope

- 22 Major Arcana cards, numbered 0 (The Fool) through 21 (The World)
- Content language: Chinese (`zh`) only, for this batch
- Image files: NOT downloaded in this batch. Data references final asset paths and documents
  the intended source so downloading is a single later step (see Future Work).

## File Layout

```
Tarot Divination Site/
  content/
    cards-major.json       # locale-independent structure, one entry per card
    cards-major.zh.json    # Chinese content, keyed by card id
    SOURCES.md             # image licensing note + text sourcing methodology
```

Rationale for splitting structure from content: adding a new language later (e.g. `en`, `ja`,
`es`) means creating one new `cards-major.<locale>.json` file with no edits to existing files.
A single nested-object schema (`{ name: { zh: ..., en: ... } }`) would require touching every
existing card record for every new locale — the split-file approach avoids that.

## Schema

**`cards-major.json`** (structure, locale-independent — includes the canonical English
tarot name, since that name doesn't change per locale and the reveal/result screens
display it alongside the localized name, e.g. "星星 · THE STAR"):
```json
{
  "id": "major_00",
  "name": "The Fool",
  "number": 0,
  "arcana": "major",
  "suit": null,
  "element": null,
  "image": "/assets/tarot/maj00.jpg"
}
```

**`cards-major.zh.json`** (content, keyed by id — only fields that actually vary by locale):
```json
{
  "major_00": {
    "name_local": "愚人",
    "keywords": ["新的开始", "冒险", "天真"],
    "upright_meaning": "2-4 句正位牌意，基于 Waite 原著自己总结",
    "upright_advice": "1 句可执行的正位建议",
    "reversed_meaning": "2-4 句逆位牌意",
    "reversed_advice": "1 句逆位建议"
  }
}
```

A locale file's top-level keys are card `id`s, so the app loads `cards-major.json` for
structure and merges in the active locale's file for display text. Adding a locale is
additive only.

## Content Sourcing

- Meanings and keywords are written in original wording, summarized from A.E. Waite's
  *The Pictorial Key to the Tarot* (1910, public domain, available at sacred-texts.com) —
  per the user's original brief instruction to summarize rather than copy.
- Each card gets: English canonical name, Chinese display name, 3 keywords, upright
  meaning (2-4 sentences), upright advice (1 sentence), reversed meaning (2-4 sentences),
  reversed advice (1 sentence).

## Image Sourcing

Source identified: [github.com/searge/tarot](https://github.com/searge/tarot),
`assets/img/big/maj00.jpg` … `maj21.jpg` — a complete, consistently-named 78-card set
(verified via GitHub API listing).

Licensing note: the repo's overall badge is CC-BY-SA-4.0, but `assets/img/LICENSE`
(covering the image folder specifically) is public-domain-style (Unlicense text). The
underlying 1909 Pamela Colman Smith artwork is itself public domain. Re-verify the
`assets/img/LICENSE` terms at actual download time, since it's a separate license grant
from the repo-level badge.

This batch only records the intended path (`/assets/tarot/maj00.jpg`, etc.) in
`cards-major.json` and documents the source in `SOURCES.md`. No image files are fetched
in this batch — bulk-cloning the repo (or downloading the 22 relevant files) is a
separate step requiring the user's explicit go-ahead per file-download policy.

## Deliverables

1. `content/cards-major.json` — 22 structural entries
2. `content/cards-major.zh.json` — 22 Chinese content entries
3. `content/SOURCES.md` — image license caveat + text sourcing methodology, for later
   credit-page use (the "关于" page already anticipates a source-credit section)

## Validation

- Both JSON files parse cleanly (`JSON.parse` / `python -m json.tool` sanity check)
- Card count is exactly 22 in both files, with matching `id` keys between structure and
  content files
- No verbatim long-form copying from Waite's text — original phrasing only

## Future Work (explicitly out of scope now)

- Minor Arcana: 56 cards across Wands/Cups/Swords/Pentacles, same structure/content split
- Additional locales (`en`, `ja`, `es`, etc.) as new `cards-major.<locale>.json` files
- Actual image file download/import once the user approves a specific download step
- Wiring this data into the app once Vite/React scaffolding begins
