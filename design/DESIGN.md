---
name: Midnight Oracle
colors:
  surface: '#16111f'
  surface-dim: '#16111f'
  surface-bright: '#3c3746'
  surface-container-lowest: '#100c19'
  surface-container-low: '#1e1927'
  surface-container: '#221d2c'
  surface-container-high: '#2d2836'
  surface-container-highest: '#383241'
  on-surface: '#e8dff3'
  on-surface-variant: '#d1c5b2'
  inverse-surface: '#e8dff3'
  inverse-on-surface: '#332e3d'
  outline: '#9a8f7e'
  outline-variant: '#4e4637'
  surface-tint: '#ebc166'
  primary: '#ebc166'
  on-primary: '#402d00'
  primary-container: '#c9a24b'
  on-primary-container: '#4f3900'
  inverse-primary: '#795902'
  secondary: '#dab8ff'
  on-secondary: '#451078'
  secondary-container: '#5c2d90'
  on-secondary-container: '#cea2ff'
  tertiary: '#fcb0d4'
  on-tertiary: '#521e3a'
  tertiary-container: '#da92b4'
  on-tertiary-container: '#602a47'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9e'
  primary-fixed-dim: '#ebc166'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dab8ff'
  on-secondary-fixed: '#2b0053'
  on-secondary-fixed-variant: '#5c2d90'
  tertiary-fixed: '#ffd8e8'
  tertiary-fixed-dim: '#fcb0d4'
  on-tertiary-fixed: '#380725'
  on-tertiary-fixed-variant: '#6c3451'
  background: '#16111f'
  on-background: '#e8dff3'
  surface-variant: '#383241'
  background-void: '#0B0714'
  background-nebula: '#120C1F'
  glow-violet: '#2A1B3D'
  accent-magenta: '#7B4397'
  highlight-lavender: '#E8DFFF'
  card-back: '#3D0C29'
typography:
  display-lg:
    fontFamily: Cinzel
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  display-md:
    fontFamily: Cinzel
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  tagline-italic:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.8'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Cinzel
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  display-lg-mobile:
    fontFamily: Cinzel
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  section-padding: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system for this product is rooted in the "Midnight Oracle" narrative—a sophisticated blend of cosmic mysticism and the tactile luxury of a vintage fortune-telling parlor. The brand personality is enigmatic, wise, and premium, avoiding common occult clichés in favor of a restrained, high-end aesthetic similar to luxury cosmetics or artisanal astrology applications.

The chosen style is **Corporate Modern meets Tactile Mysticism**. It utilizes professional layout structures and high-readability typography, but layers them with rich textures: subtle film grain, radial vignettes, and metallic foil effects. Every interaction is designed to feel like a ritual, emphasizing a slow, deliberate pace that evokes a sense of sacred ceremony.

**Design Principles:**
- **Ritualistic Pacing:** Use intentional pauses and transitions to create a sense of importance around user actions.
- **Luminous Depth:** Depth is created through light (glows, god-rays, and starfields) emerging from a void-like darkness.
- **Metallic Precision:** Accents should feel like physical gold leaf—thin, precise, and subtly reflective.

## Colors

The color strategy is built on a "Void and Radiance" philosophy. The foundation is a near-black indigo that provides infinite depth, while the primary antique gold acts as the guiding light for navigation and interaction.

- **Primary (Antique Gold):** Reserved for interactive elements, borders, and fine iconography. It should be rendered with a subtle linear gradient to simulate metallic foil.
- **Secondary (Amethyst & Magenta):** Used exclusively for environmental lighting, such as radial glows behind cards or nebula-like background washes.
- **Tertiary (Deep Burgundy):** Specific to the "physical" card objects (backs), distinguishing them from the digital UI layers.
- **Highlight (Lavender-White):** Used sparingly for particle effects, "light bursts" during card reveals, and high-priority text highlights.

Backgrounds should never be flat; they must utilize the `#0B0714` to `#120C1F` gradient paired with a subtle noise overlay.

## Typography

The typographic hierarchy balances ceremonial tradition with modern clarity.

- **Cinzel (Headlines):** Used for titles, card names, and primary calls to action. Its small-caps feel provides an "engraved" look that suggests ancient authority.
- **Playfair Display Italic (Secondary/Accents):** Used for poetic elements—taglines, quotes, and "narrator" voice text. It adds a human, handwritten touch to the cosmic theme.
- **Inter (Body):** Ensures that complex tarot readings remain highly legible. The line height is intentionally generous (1.6 to 1.8) to maintain a breathy, relaxed reading pace.

All Cinzel text should be rendered in uppercase or small-caps where appropriate to enhance the "monumental" feel.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for content clarity, centered within a fluid, "infinite" background.

- **Desktop:** 12-column grid with a 1200px max-width. Large section padding (80px+) is used to ensure the UI feels "airy" and not cramped, allowing the background starfield to breathe.
- **Mobile:** 4-column grid with 16px side margins. Content is primarily centered to maintain the "altar-like" focus of the card readings.
- **Reflow Rules:** In reading views, the layout shifts from a side-by-side (Card | Interpretation) desktop view to a vertical stack (Card -> Interpretation) on mobile to keep the card as the focal point.

Spacing follows an 8px base unit, but is applied loosely to emphasize the "unstructured" nature of the cosmos.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Luminous Depth** rather than traditional shadows.

- **The Void (Base):** The deepest layer containing the drifting starfield and noise texture.
- **Nebula Glows:** Soft, blurred radial gradients of violet and magenta that "lift" content areas without the use of hard borders.
- **Floating Surfaces:** Cards and UI elements utilize "Ambient Glows"—a soft drop shadow tinted with the secondary violet color to make elements look as if they are levitating above a velvet surface.
- **Metallic Outlines:** Interaction boundaries are defined by thin (1px) gold borders. Hover states should trigger a "shimmer" effect—a diagonal light sweep across the border to simulate gold leaf catching the light.

## Shapes

The shape language is "Softened Geometric." 

- **Primary Elements:** Cards and input fields use a standard 0.5rem (rounded) corner radius, which feels approachable yet structured.
- **Buttons & Chips:** Use a **Pill-shaped (3)** or circular profile to mimic wax seals and coins. 
- **Decorative:** Ornamental gold line-art (moon phases, celestial glyphs) serves as the primary visual divider, replacing standard horizontal rules to maintain the mystical theme.

## Components

### Buttons
Styled as "Wax Seals" or "Embossed Coins."
- **Primary:** Pill-shaped, gold border, faint inner gold glow. On hover, the inner glow intensifies and a soft "bloom" effect appears around the edges.
- **Secondary/Ghost:** Thin gold border with transparent center, Cinzel typography.

### Cards
- **Backs:** Burgundy `#3D0C29` with fine gold filigree. 
- **Fronts:** Rounded corners (0.5rem), 1px gold frame. When revealed, they should have a "halo" glow (`#E8DFFF`) emanating from behind.

### Inputs
Parchment-style or "Void" style. Minimalist thin gold bottom-border (no full box) with Playfair Display italic placeholder text.

### Chips/Labels
Small, pill-shaped with a thin gold outline and uppercase Cinzel labels. Used for card keywords (e.g., "HOPE", "HEALING").

### Icons
Thin-line celestial motifs. Icons should always be monochrome Gold (`#C9A24B`). Avoid solid fills; use strokes only to maintain an "etched" look.

### Section Dividers
Replace standard HR tags with ornamental line-art: a central moon or sun glyph with thin horizontal lines extending and fading into transparency.