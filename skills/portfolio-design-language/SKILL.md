---
name: portfolio-design-language
description: Design language for a section-banded, accent-driven portfolio site — pastel color bands, a floating right-aligned menu that adopts the active section's accent, and highlighter-style hover states. Use when building or restyling a Next.js + Tailwind site that should feel like this portfolio. Typography is intentionally out of scope.
---

# Portfolio Design Language

A quiet, paper-like editorial site built from **five full-bleed pastel bands**. Every
band owns a color pair; the chrome (menu, links, dividers, footer) reads that pair at
runtime instead of hardcoding it. The result is a site that changes temperature as you
scroll while never introducing a second design system.

Scope: **color, menu, hover/interaction, surfaces, motion.** Typography is deliberately
excluded — pick your own type and it will still work.

---

## 1. The core idea: one accent variable, driven by scroll

This is the single mechanic worth stealing. Everything else follows from it.

Each section declares two colors:

- a **`100` tint** — the full-bleed background of the band
- a **`300` accent** — the saturated sibling, used only for *marks*: hover fills, active
  dots, rules under headings, footer dividers

The section writes its accent into a CSS custom property. A scroll observer copies the
active section's accent onto the fixed header. So the menu, the CV button, and the
language switcher all glow in whatever color the reader is currently standing in — with
**zero** conditional class logic.

```
--section-accent   →  set per <section>, consumed inside that band
--header-accent    →  set on the fixed header, rewritten on scroll
```

Rules of the system:

- **Tints (100) are surfaces. Accents (300) are events.** Never fill a large area with a
  300; never use a 100 for a hover.
- Chrome never names a color. It only ever references `var(--header-accent)` or
  `var(--section-accent)`.
- Text color is always from the neutral ramp, never from the accent. Color carries
  *location*, ink carries *hierarchy*. This is why the site stays calm despite five hues.

---

## 2. Palette

### Neutrals (all text, always)

| Token | Hex | Use |
| --- | --- | --- |
| `black-primary` | `#111111` | Body text, active nav, headings |
| `black-secondary` | `#4B4B4B` | Inactive nav, metadata, captions, eyebrows |
| `black-tertiary` | `#2A2A22` | Card body copy and card headings — a warm near-black that sits better on tinted paper than pure `#111` |

`black-tertiary` being *warmer and slightly greener* than `black-primary` is not an
accident: card text sits on translucent white over a pastel, and a neutral black looks
cold there.

### Section pairs

| Section | Band (100) | Accent (300) |
| --- | --- | --- |
| Home | `#FFF6B3` | `#FFD84D` |
| Selected work | `#CFF8D8` | `#6EE7A8` |
| Experience | `#D8F0FF` | `#74C8FF` |
| Skills | `#E9DEFF` | `#B78CFF` |
| Education | `#FFE0D6` | `#FF9B7A` |

Chosen for **equal perceived lightness** — the bands read as one paper stock in five
inks, not as five different brightness levels. Keep that property if you extend the
palette: pick new hues at the same L, don't just grab Tailwind defaults.

The order is a deliberate warm → cool → warm arc (yellow → green → blue → purple →
coral), so scrolling feels like a temperature curve rather than a random sequence.

### Hairline

```
--color-border-subtle: rgb(0 0 0 / 0.06);
```

An **alpha**, never a solid. It must read identically over all five bands — a fixed grey
would go muddy on coral and disappear on yellow.

### Tailwind v4 setup (Next.js)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-ink-primary:   #111111;
  --color-ink-secondary: #4B4B4B;
  --color-ink-tertiary:  #2A2A22;

  --color-band-yellow: #FFF6B3;  --color-accent-yellow: #FFD84D;
  --color-band-green:  #CFF8D8;  --color-accent-green:  #6EE7A8;
  --color-band-blue:   #D8F0FF;  --color-accent-blue:   #74C8FF;
  --color-band-purple: #E9DEFF;  --color-accent-purple: #B78CFF;
  --color-band-coral:  #FFE0D6;  --color-accent-coral:  #FF9B7A;

  --color-border-subtle: rgb(0 0 0 / 0.06);
}
```

Light-mode only. The palette is built on tinted paper; there is no dark counterpart, and
inventing one dilutes the concept. Lock it:

```css
:root { color-scheme: light; }
```

Consume the runtime accent with Tailwind v4's arbitrary-property-value syntax:
`hover:bg-(--header-accent)`, `border-(--section-accent)`.

Because accent classes are composed at runtime, the JIT scanner can't see them —
either safelist the combinations or (better) keep chrome referencing the CSS variable
so nothing needs safelisting at all.

### Config shape

Keep the section list as data, not scattered through JSX:

```ts
// config/sections.ts
export const SECTIONS = [
  { id: "home",       label: "Home",       band: "bg-band-yellow", accent: "accent-yellow" },
  { id: "work",       label: "Work",       band: "bg-band-green",  accent: "accent-green"  },
  { id: "experience", label: "Experience", band: "bg-band-blue",   accent: "accent-blue"   },
  { id: "skills",     label: "Skills",     band: "bg-band-purple", accent: "accent-purple" },
  { id: "education",  label: "Education",  band: "bg-band-coral",  accent: "accent-coral"  },
] as const;
```

One array drives the nav, the band backgrounds, the accents, and the scroll spy. Adding
a section is a one-line change.

---

## 3. Menu

The most distinctive element. Not a top bar — a **floating right-aligned stack**.

### Anatomy

- `position: fixed`, pinned **top-right** (`top-4 right-4`, `top-8 right-8` at md+)
- Items stack **vertically**, `items-end` — right-aligned, ragged left
- No background, no border, no blur on desktop. It floats directly on the band.
- Vertically scrollable with `max-h-[calc(100dvh-4rem)]` so it survives short viewports
- Above it: a compact utility row — CV download and a two-letter language switcher

Why it works: a conventional sticky top bar would need an opaque background, which would
break the full-bleed bands. A right-rail menu never crosses the content column, so the
bands stay uninterrupted edge to edge.

### Item states

Each nav item is a row of two parts:

```
[ ● dot ]  [ label ]
```

| State | Dot | Label |
| --- | --- | --- |
| Idle | `opacity-0` (occupies space) | `font-light`, `ink-secondary` |
| Hover | still hidden | `ink-primary` + **accent background fill** behind the text |
| Active | `opacity-100`, filled with `--header-accent` | `font-bold`, `ink-primary` |

The dot is always in the DOM at `size-3` with `opacity-0`, so activating an item **never
shifts layout** — it fades in place. Do not conditionally render it.

Active state is driven by `data-active="true"` + `aria-current`, styled with
`data-[active=true]:` variants. Group the dot's reaction off the parent link with
`group-data-[active=true]:opacity-100`.

### Mobile

Below `md`, the whole thing collapses to a disclosure:

- A text toggle button (not a hamburger icon) labeled with the word "Menu"
- The utility row gets `bg-white/40 backdrop-blur-sm` so it stays legible over content;
  at `md+` that background is removed entirely
- Panel opens via a `data-menu-open` flag on the header, styled with
  `group-data-[menu-open=true]/header:block`
- Dismisses on: link click, `Escape` (returning focus to the toggle), outside click

### Scroll spy

Active section = the one whose band currently owns the viewport center
(`start: "top center"`, `end: "bottom center"`). Center-based, not top-based — top-based
spies flicker on tall sections.

On change, do three things:

1. Move `data-active` / `aria-current` to the matching link
2. Write the new section's accent onto the header's `--header-accent`
3. Update the URL hash with **`history.replaceState`** — never `pushState`, or scrolling
   the page poisons the back button

Implement with an `IntersectionObserver` (`rootMargin: "-50% 0px -50% 0px"` gives the
same center line without a scroll library) or GSAP ScrollTrigger if it's already
present.

---

## 4. Hovers

The signature move is a **highlighter fill**, not an underline and not a color swap.

### The highlighter

```
transition-colors duration-300  →  hover:bg-(--header-accent)
```

Applied to the nav label, the CV link, the language codes, the footer email, and the
social icons. On hover the accent floods the element's padding box like a marker stroke.
It's fast to read, needs no extra DOM, and inherits the section color for free.

Give hoverable text a small padding box (`px-2 py-0.5`) so the fill has something to
fill. Text with no padding gets a cramped, sticker-like highlight.

Consistent timing: **300ms `transition-colors`** on all chrome. Not `transition-all` —
only color.

### Cards

Cards are the one place that uses shadow instead of color:

```css
.card         { transition: box-shadow 200ms ease; }
.card:hover   { box-shadow: 0 2px 8px rgb(0 0 0 / 0.04); }
```

`0.04` alpha and an 8px blur — barely perceptible, and deliberately so. It's a hint of
lift, not a card that jumps. No transform, no scale, no border color change.

Note the asymmetry: chrome hovers at **300ms color**, surfaces hover at **200ms shadow**.
Chrome is a navigational commitment and can afford to be languid; a card is passive and
should settle faster.

### Portrait

The home portrait is `grayscale` at rest and `hover:filter-none` — color returns on
hover. One image, one line, memorable.

### Focus

Never suppressed. `focus-visible:outline-2` with a dark outline and `outline-offset-2`
on carousel controls and interactive regions. Hover and focus are styled separately —
the highlighter is a hover affordance, the outline is the keyboard one.

---

## 5. Surfaces

### The card

One card definition, shared by work, experience, skills, and education so the four
sections cannot drift apart:

```css
.card {
  background-color: rgb(255 255 255 / 0.5);
  border: 1px solid var(--color-border-subtle);
  border-radius: 0.5rem;
  padding: 2rem;
}
```

**Translucent white at 50%** is the key detail — the card doesn't sit *on* the band, it
tints *with* it. A green card and a purple card are the same component; the band shows
through. Never use an opaque white card, and never give cards a per-section background.

`rounded-lg` (8px) only. Everything else in the system — tags, hover fills, buttons,
menu items — is **square**. The card is the sole rounded surface, which is what makes it
read as a distinct object.

Layout (column span, gaps) stays in the markup. The class owns look only.

### Tags

Shape and type only; the section supplies the fill:

```css
.tag {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

Filled with the section's **100 tint** (`bg-band-green` in work, `bg-band-purple` in
skills) over the translucent card — a tint on a tint, so tags stay quiet. Square corners.
Never accent-filled: 300s are reserved for hover and active states.

### Rules and dividers

Page titles carry a **bottom border in the section accent** (`border-b
border-(--section-accent)` with `pb-6`), and the footer separates with the same. This is
the only structural use of a 300 — a single saturated line anchoring each band.

### Section band rhythm

```
w-full  +  mx-auto max-w-[100rem]  px-8 py-24  md:px-48 md:py-32
```

The band is full-bleed; the *content* is constrained. Very generous side padding at md+
(`md:px-48`) pushes text into a narrow editorial column and, not incidentally, leaves the
right rail clear for the floating menu. Vertical padding (`py-32`) is large enough that
each color owns a full screen — critical for the scroll spy to feel intentional.

---

## 6. Motion

Restrained. Two behaviors, no more.

### Scroll reveal

Elements marked `.reveal` fade and rise on first entry:

```css
.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--index, 0) * 80ms);
}
.reveal[data-revealed="true"] { opacity: 1; transform: none; }
```

12px of travel and an `expo.out` curve — it settles rather than slides. Stagger via an
`--index` custom property on each wrapper (80ms apart), so a list of six cards costs one
CSS rule and zero per-item JS.

Fire with an `IntersectionObserver` at `rootMargin: "0px 0px -15% 0px"` — hold the reveal
until the element is meaningfully into view — and **unobserve after revealing**. It's a
one-shot entrance, never a re-animating scroll toy.

### Two non-negotiable guards

1. **No-JS / no-observer fallback.** Gate the hidden state behind a class an inline
   `<head>` script sets before first paint (`document.documentElement.classList.add("js-reveal")`),
   and scope every rule to `:root.js-reveal .reveal`. If the module script never runs,
   content renders normally instead of staying invisible forever. In Next.js, use a
   `beforeInteractive` script or a raw inline `<script>` in the root layout `<head>`.

2. **`prefers-reduced-motion: reduce`** → reveal everything immediately, transitions off.
   Handle it in *both* the CSS and the observer setup.

Also: `scroll-behavior: smooth` on `<html>` for anchor jumps, and reduced-motion should
switch programmatic scrolling to `behavior: "auto"`.

---

## 7. Porting checklist

- [ ] `@theme` block with the five band/accent pairs plus the three-step ink ramp
- [ ] `color-scheme: light`, no dark variants anywhere
- [ ] `SECTIONS` config array as the single source of truth
- [ ] Section component writes `--section-accent` and applies its band background
- [ ] Fixed top-right menu; header holds `--header-accent`
- [ ] Scroll spy: center-line detection → `data-active` + accent swap + `replaceState`
- [ ] Dot always rendered at `opacity-0`; never conditionally mounted
- [ ] Highlighter hover (`hover:bg-(--header-accent)`, 300ms) on every chrome link
- [ ] `.card`: `white/0.5`, 6%-alpha hairline, `rounded-lg`, 200ms shadow hover only
- [ ] Tags: square, uppercase, `0.05em` tracking, filled with the section **tint**
- [ ] Section title underlined with the section **accent**
- [ ] `.reveal` + `--index` stagger, `js-reveal` pre-paint gate, reduced-motion escape
- [ ] Focus outlines preserved and distinct from hover

## 8. Anti-patterns

Things that will break the language:

- A solid top navigation bar — it cuts the bands and kills the concept
- Opaque white cards — they stop tinting with the band
- Any dark-mode palette — the system is tinted paper
- Accent (300) used as a large fill, or tint (100) used as a hover
- Colored body text — hierarchy is ink, location is color
- Rounded corners on anything but the card
- `transition-all`, or hover transforms/scales on cards
- `pushState` in the scroll spy
- Reveal animations that replay on every scroll pass
