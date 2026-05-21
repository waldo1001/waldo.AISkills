---
name: bctechdays-presentation
description: Build HTML presentation decks styled like the BC TechDays 2026 brand — a LIGHT cool-grey canvas, RED Montagu Slab slab-serif titles (#F7514F), Corbel body, full-bleed indigo/coral colour "moment" panels, the real BC TechDays scan-line "glitch wave" + wireframe-roster motif and torn-ticket "BC/NAV TECH DAYS 2026 · mibuso.com" logo (both inlined from the official PowerPoint), and the full iFacto pattern engine (grid, timeline, bridge stage, cards). Trigger whenever the user asks for a BC TechDays deck, BC TechDays slides, a BC TechDays-branded presentation, or a deck for a BC TechDays / mibuso session or talk. Business Central / BC / NAV conference talks default to this look.
---

# BC TechDays presentation skill

Use this skill any time the user wants an HTML presentation that should match the **BC TechDays 2026** brand. The design tokens below were sampled directly from the **official BCTechDays2026 PowerPoint template** (theme colours, embedded fonts, and the logo/motif artwork) — not from a guess and not from the marketing site's raw CSS (which exposes a different lime token that is *not* how the presentation brand actually reads). Don't substitute values.

This skill shares the proven deck engine of the iFacto presentation skill (keyboard nav, step reveals, typewriter, slide picker, present mode) but is a completely different brand.

## How to use this skill

1. Open `assets/template.html`. It's a working 7-slide deck with every pattern below wired up, plus keyboard nav and the wave/mesh motif generator. Copy it, then swap content.
2. The demo content is generic placeholder (`A headline`, `Knowledge / Capabilities / Orchestration`). Replace it with the real talk; don't rewrite the CSS.
3. Delete patterns you don't need. Keep the rhythm (see "Slide rhythm" below).
4. Save the deck to the user's workspace folder, **not** the skill folder.

## Slide density — minimum text on every slide

The presenter is the verbal layer; the slide is a visual anchor, not a teleprompter.

- Readable in **under 5 seconds** without the presenter speaking.
- One strong sentence > a paragraph. A 1–3 word label > a caption.
- No bulleted prose. Card labels are 1–3 words ("Orchestration", not a sentence).
- A headline + one accent word + the motif is enough for most slides.
- Over ~15 visible words → it's two slides. Split it.

If a pattern in `template.html` shows denser demo text, strip it down before shipping.

## Brand tokens — non-negotiable

Sampled from the official `.pptx`. The deck is **light-dominant**: a cool off-white canvas, punctuated by **full-bleed colour panels** for the "moment" slides. **Titles are RED `#F7514F`** (the `.pptx` "main title" colour); **indigo `#6165E6`** is the dominant *panel / component* colour. The rest are a deliberate carnival used for *categorical* meaning (different cards / tracks / sections), not random decoration.

| Token | Value | Role |
|---|---|---|
| Canvas | `#F2F4F0` | Light cool-grey slide background (the default) |
| **Red** | **`#F7514F`** | **Titles, eyebrows, links** on light slides; progress bar. The `.pptx` main-title colour |
| Ink | `#161616` | Body text on light; the optional `.g` accent word inside a red title |
| Indigo | `#6165E6` | Dominant **panel** colour (dividers/team) + components (timeline, chips, bridge glow) |
| Magenta | `#C944B4` | Secondary panel / accent |
| Coral | `#F7514F` | Panel (closing) — same hue as the title red |
| Cyan | `#00B0EB` | Accent |
| Yellow | `#F9DF35` | Categorical accent — and the accent-word colour **on** colour panels |
| Purple | `#552CB4` | Deep secondary |
| White | `#FFFFFF` | Headlines & text on colour panels; cards |

Fonts (the families the official deck actually embeds):

- **Montagu Slab** — display headlines (`h1`–`h3`), Bold/Black. A slab serif. **This is the BC TechDays voice.** Loaded from Google Fonts.
- **Corbel** — body, captions. A humanist sans (installed on Windows/Office machines). The template stack is `"Corbel","Hanken Grotesk",system-ui,…`; **Hanken Grotesk** (Google) is the portable fallback so the deck still looks right on machines without Corbel.
- **Barlow Condensed** — eyebrows / kickers / numbers / pager / the logo lockup. Heavy condensed grotesque, uppercase, tracked — it echoes the "BC TECH DAYS" wordmark.

> Do **not** use lime `#CCFF00`, dark/near-black backgrounds, or Poppins/Inter/Barlow-as-headline. Those were an earlier wrong read of the brand. The presentation brand is light + slab serif + indigo.

## Type scale

```
h1 (hero/statement)  clamp(44px,5.4vw,88px)  Montagu Slab 700, line-height 1.01
h2 (slide headline)  clamp(34px,3.7vw,58px)  Montagu Slab 700
h3 (card title)      clamp(22px,1.85vw,30px) Montagu Slab 600
.eyebrow             clamp(14px,1.05vw,17px) Barlow Condensed 700, UPPERCASE, tracked
.lead                clamp(22px,1.95vw,32px) Corbel/Hanken 500
p                    clamp(17px,1.4vw,22px)  Corbel/Hanken 400
```

Body uses **bold inside light text** to emphasise 1–3 keywords mid-sentence. Never bold a whole sentence.

## Title colour & the optional accent word

- On the **light** canvas, headlines (`h1`/`h2`/`h3`) are **RED `#F7514F`** — that's the `.pptx` main-title colour. (They are *not* black-with-a-coloured-word, and *not* purple/indigo.) Card-title divs stay black.
- On a **colour panel** (`.slide.fill`), headlines are **white**.
- The accent span `<span class="g">word</span>` makes ONE word stand out: on light it's **ink/black** (a dark word inside the red title — two-tone); on a panel it flips to **yellow**. Use it sparingly or not at all — a fully-red title is the default and is fine.

Never colour more than one word/phrase per headline.

## Slide patterns in the template

This deck carries the **full iFacto pattern engine**, re-skinned to BC TechDays — so you get all the rich, animated layouts, not just title/bullets. The 8 demo slides each show one pattern; copy and adapt the ones you need.

**Light-canvas patterns (`.slide.light`):**
1. **Title / hero** — eyebrow + big black Montagu Slab headline with one indigo word, the **glitch-wave** in the bottom-right corner over a faint wireframe **mesh**, logo top-right.
2. **Typed claim stack** — 3–4 headlines that type/reveal on click (`.prov-line.step.typed`). Claim → reframe → implication → call to action.
3. **Centered intro** — centered headline + lead + an optional reference link. The section opener.
4. **Grid + chips** — an offset headline over a 2×3 grid of white pillar cards (Montagu Slab titles, Corbel captions) with the "spotlight" hover; example chips can reveal on click.
5. **Flow timeline** — a horizontal spine with numbered stops, badges that reveal on click, a pulsing "live" step and a failure-path footnote.

**Colour-panel patterns (`.slide.fill` — the "moment" slides; white text, yellow accent):**
6. **Team / card grid** (indigo) — rows of cards with connector arrows + a footnote; the mesh + a corner wave.
7. **Bridge stage** (`.fill.ink`, near-black so the structure glows) — *"X over here is delivered, via Z, to Y over there."* Left bank of tiles → glowing indigo bridge with a catenary cable → VS Code-style destination window. Click expands the deck and drops in labelled planks.
8. **Closing / Q&A** (coral) — giant "Questions?" with the accent on the punctuation.

**Title & ender slides (recreated 1:1 from the official deck):**
9. **Title** (`.title-photo-slide`) — the **real title artwork** exported from the PowerPoint, inlined full-bleed as a base64 JPG (`assets/title-bg.jpg`). Pixel-exact, but the text/photo are baked into the image — for a *different* talk, export a fresh title slide and swap the `src`, or use the editable hero pattern (slide 1) instead. (An editable CSS title with a `.speaker-chip` is also available as the hero pattern.)
10. **Q&A ender** (`.slide.lavender`, `.qa-slide`) — lavender panel, a huge centred "Q&A" (`.bigword.qa`) with an "Any Questions?" condensed sub-label, **scattered `.scatter` repeats** (filled + `.outline`) bleeding off the edges, a torus roster top-right + warped-grid roster bottom.
11. **Thank-You ender** (`.slide.lavender`, `.ty-slide`) — same lavender + scatter + roster treatment, big "Thank / You".

Panel modifiers: `.slide.fill` is indigo by default; add `.magenta`, `.coral`, or `.ink` to vary; `.slide.lavender` is the light-purple `#C8C3F5` word-slide (black type). The wave auto-picks a palette that reads on each background. The lavender enders use the real wireframe **rosters** (`.roster.tr` torus top-right, `.roster.bc` warped plane bottom) — a more visible placement of the same mesh symbols.

### Slide rhythm

Light-dominant with colour punctuation. Open on the **light** title, drop a **colour panel** at each chapter break / big moment (team, bridge, closing), and keep the working content on **light**. Don't run two colour panels back to back, and don't go more than ~4 light slides without a colour beat. The panels are where the brand's saturated energy lives.

## The signature motif — scan-line "glitch wave" + wireframe mesh

This is what makes a slide read as BC TechDays. Two reusable, generated/CSS elements:

- **`.wave`** — a stack of coloured horizontal scan-lines whose widths trace a rough envelope (a frequency-spectrum / waveform look), skewed slightly, with an occasional horizontal "glitch" jitter. A JS generator fills every `.wave` on load. Tune it with:
  - `data-wave-lines="48"` — line count.
  - `data-wave-colors="--indigo,--indigo,--magenta,--coral"` — CSS-var palette, comma-separated (repeat a colour to weight it). Default is indigo-weighted.
  - Placement classes: `.wave.hero` (large, bottom-right, for title/closing) and `.wave.edge` (vertical-centre right edge, for content slides).
- **`.mesh`** — the brand's **real wireframe "rosters"**: the warped grid plane (`#bc-mesh-plane`) and the torus ring (`#bc-mesh-torus`), taken straight from the `.pptx` and inlined as SVG `<symbol>`s. A `.mesh` div holds `<svg><use href="#bc-mesh-torus"/></svg>` (use the plane on the hero, the torus on panels). Strokes are `currentColor`, so `.mesh-svg` recolours faint ink on light slides and faint white on `.slide.fill` automatically. Source files also live in `assets/bc-mesh-plane.svg` / `assets/bc-mesh-torus.svg`.

Use the wave on hero, panel, and closing slides; use it sparingly (one per slide). On content-heavy slides, prefer the quieter `.wave.edge` or no motif at all.

## Logo — the real torn-ticket lockup

The **real BC TechDays logo** (the official `.pptx` artwork: torn-ticket / speech-bubble tag, "BC/NAV TECH DAYS 2026" + "mibuso.com") is inlined once as an SVG `<symbol id="bc-logo">` and referenced on every slide via `<a class="brandtag"><svg><use href="#bc-logo"/></svg></a>`, **top-right** (matching the official title slide; keeps the left clear for the headline). Its fills are `currentColor`, so it's ink on light slides and white on colour panels automatically. The source file is `assets/bc-logo.svg`. Update "Session NN" (`.topmeta`) per deck. (Do **not** hand-recreate the logo — use the real symbol.)

## Buttons & links

```html
<a class="btn solid" href="#">Register</a>   <!-- indigo fill, white text -->
<a class="btn" href="#">Programme</a>          <!-- indigo outline -->
<a class="arrow" href="#">More<span class="chev">›</span></a>   <!-- chevron link -->
```

On colour panels these invert to white automatically. **Example / live-demo link:** drop a single `.example-link` (bottom-left, above the pager) when presenting alongside something clickable (a real PR, demo URL, dashboard). **Real URL only in a delivered deck** — `href="#"` is fine in the template to show the pattern, but sweep for it and fill in or strip before shipping.

## Step reveal & present mode

- Add class `step` to any element to hide it until the next Next-click / Right-arrow / Space. Combine `step` + `typed` for a typewriter reveal. Steps reset when the slide changes.
- `?present=1` in the URL (or pressing **P**) hides the bottom nav for a clean projected view.
- Click the slide counter to open the **slide picker** (jump to any slide); **Esc** closes it.

## Things to get right — don't repeat the easy mistakes

- The presentation brand is **light canvas + Montagu Slab + RED titles**, not dark + lime, and the title colour is **red `#F7514F`, not purple/indigo**. (The marketing site's CSS exposes a lime token and indigo reads as purple — neither is the title colour. The `.pptx` "main title" is red.)
- Headlines are **Montagu Slab** (slab serif). Body is **Corbel** (with a Hanken Grotesk fallback). Eyebrows/numbers are **Barlow Condensed**.
- **Use the real artwork, don't recreate it:** the logo (`#bc-logo`) and the wireframe rosters (`#bc-mesh-plane` / `#bc-mesh-torus`) are inlined from the official `.pptx`. A hand-drawn logo was a rejected earlier attempt.
- Indigo is the **panel/component** colour; red is the **title** colour. The other colours are for *categorical* meaning — don't scatter all of them on one slide.
- The `.g` accent word is ink on light, **yellow on colour panels**. The template flips it automatically; don't override it back.
- Use the **glitch-wave / roster-mesh** motif to brand a slide — but one motif per slide, keep it in a corner clear of text, and keep content slides quiet.
- **No dead links** in a delivered deck. Sweep for `href="#"`.
- Default language is English; translate placeholder copy to the real talk.

## Output

Save to the user's workspace folder. Give them a `computer://` link so they can open it. Don't put the deliverable in this skill folder.

## Reference

- Brand source: the official **BCTechDays2026 PowerPoint** (theme colours, embedded fonts: Montagu Slab + Corbel; logo/motif SVGs). Re-open it with the `pptx` skill to re-verify a token.
- Live site: https://www.bctechdays.com (and mibuso.com). Treat its raw CSS tokens with caution — verify against the deck artwork before trusting a colour.
- Shares the deck engine with the `ifacto-presentation` skill.
