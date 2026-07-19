# Content Sources

## Card Meanings

Meanings and advice text for all 22 Major Arcana cards are written in original wording,
summarizing the standard Rider-Waite-Smith tarot tradition (as documented in A.E. Waite's
1910 *The Pictorial Key to the Tarot*, public domain, available at sacred-texts.com). Text
is not copied verbatim from any single source.

Card numbering and names follow the Waite-Smith-specific ordering (Strength = VIII,
Justice = XI — not swapped, as in the older Tarot de Marseille tradition).

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

## Language / i18n

This batch ships Chinese (`zh`) content only, in `cards-major.zh.json`. Additional locales
(e.g. `en`, `ja`, `es`) should be added as new `cards-major.<locale>.json` files with the
same key shape, without modifying `cards-major.json` (locale-independent structure) or any
existing locale file.
