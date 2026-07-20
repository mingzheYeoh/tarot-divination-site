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
