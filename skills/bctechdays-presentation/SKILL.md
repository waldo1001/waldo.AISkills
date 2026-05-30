---
name: bctechdays-presentation
description: Build HTML presentation decks styled like the BC TechDays 2026 brand — a LIGHT cool-grey canvas, RED Montagu Slab slab-serif titles (#F7514F), Corbel body, full-bleed indigo/coral/magenta colour "moment" panels, the real BC TechDays scan-line "glitch wave" + wireframe-roster motif and torn-ticket "BC/NAV TECH DAYS 2026 · mibuso.com" logo (both inlined from the official PowerPoint), and the full pattern engine (claim-stack prov, centered tc-context, six-pillar tc-map, MCP hub, animated bridge, df-day timeline, htrack stage-tracker, agents-team grid, pb-hero playbook bridge, lavender Q&A/Thank-You enders). Trigger whenever the user asks for a BC TechDays deck, BC TechDays slides, a BC TechDays-branded presentation, or a deck for a BC TechDays / mibuso session or talk. Business Central / BC / NAV conference talks default to this look.
---

# BC TechDays presentation skill

Use this skill any time the user wants an HTML presentation that should match the **BC TechDays 2026** brand. The design tokens below were sampled directly from the **official BCTechDays2026 PowerPoint template** (theme colours, embedded fonts, and the logo/motif artwork) — not from a guess and not from the marketing site's raw CSS (which exposes a different lime token that is *not* how the presentation brand actually reads). Don't substitute values.

This skill shares the proven deck engine of the iFacto presentation skill (keyboard nav, step reveals, typewriter, slide picker with topic separators, present mode) but is a completely different brand.

## How to use this skill

1. Open `assets/template.html`. It's a working multi-slide deck with every pattern below wired up, plus keyboard nav and the wave/mesh motif generator. Copy it, then swap content.
2. The demo content is generic placeholder. Replace it with the real talk; **don't rewrite the CSS**.
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
| Canvas-alt | `#E9E9F2` | Slightly lavender-tinted alt canvas |
| **Red** | **`#F7514F`** | **Titles, eyebrows, links** on light slides; progress bar. The `.pptx` main-title colour |
| Ink | `#161616` | Body text on light; the optional `.g` accent word inside a red title |
| Indigo | `#6165E6` | Dominant **panel** colour (dividers/team) + components (timeline, chips, bridge glow). Resolved as `--green` alias internally so iFacto-engine components work. |
| Magenta | `#C944B4` | Secondary panel / accent |
| Coral | `#F7514F` | Panel (closing) — same hue as the title red |
| Cyan | `#00B0EB` | Accent |
| Yellow | `#F9DF35` | Categorical accent — and the accent-word colour **on** colour panels |
| Purple | `#552CB4` | Deep secondary (= `--green-deep` for bridges/depth) |
| Periwinkle / Lavender | `#C8C3F5` | The `.slide.lavender` ender panel |
| White | `#FFFFFF` | Headlines & text on colour panels; cards |

Fonts (the families the official deck actually embeds):

- **Montagu Slab** — display headlines (`h1`–`h3`), Bold/Black. A slab serif. **This is the BC TechDays voice.** Loaded from Google Fonts. Enforced via `!important` so any `<h1>`/`<h2>`/`<h3>` inherits it.
- **Corbel** — body, captions, lead, the slide canvas default. A humanist sans (installed on Windows/Office machines). The stack is `"Corbel","Hanken Grotesk",system-ui,…`; **Hanken Grotesk** (Google) is the portable fallback so the deck still looks right on machines without Corbel.
- **Barlow Condensed** — eyebrows, pager, picker chrome, kickers, numbers, the logo lockup, `.df-tag`, `.cnum`, `.secnum`. Heavy condensed grotesque, uppercase, tracked — it echoes the "BC TECH DAYS" wordmark.

> Do **not** use lime `#CCFF00`, dark/near-black backgrounds, or Poppins/Inter/Barlow-as-headline. Those were an earlier wrong read of the brand. The presentation brand is light + slab serif + indigo.

## Type scale

```
h1 (hero/statement)  clamp(46px,5.6vw,88px)  Montagu Slab 700, line-height .98
h2 (slide headline)  clamp(48px,6vw,92px)    Montagu Slab 700, line-height 1.04
h3 (card title)      clamp(28px,2.4vw,40px)  Montagu Slab 600, line-height 1.2
h4                   clamp(22px,1.7vw,28px)  Montagu Slab, line-height 1.3
.eyebrow             clamp(14px,1.05vw,17px) Barlow Condensed 700, UPPERCASE, tracked .13em
.lead                clamp(30px,2.3vw,42px)  Corbel/Hanken 500
p                    clamp(20px,1.55vw,28px) Corbel/Hanken 400
.pager / .topnav     14px / 15px             Barlow Condensed, tracked
```

Body uses **bold inside light text** to emphasise 1–3 keywords mid-sentence. Never bold a whole sentence.

## Title colour & the optional accent word

- On the **light** canvas, headlines (`h1`/`h2`/`h3`) are **RED `#F7514F`** — that's the `.pptx` main-title colour. (They are *not* black-with-a-coloured-word, and *not* purple/indigo.) Card-title divs stay black.
- On a **colour panel** (`.slide.fill`), headlines are **white**.
- The accent span `<span class="g">word</span>` makes ONE word stand out: on light it's **ink/black** (a dark word inside the red title — two-tone); on a panel it flips to **yellow**. Use it sparingly or not at all — a fully-red title is the default and is fine.

Never colour more than one word/phrase per headline.

## Slide patterns in the template

This deck carries the **full pattern engine** — every pattern below is wired in `template.html`, with `<style>` defs in the head and a working demo slide in the body. Copy and adapt the ones you need; don't rewrite the CSS.

### Title slides

1. **`.title-photo-slide`** — full-bleed real artwork from the official PowerPoint. Inline an exported JPG as `<img class="title-photo">` for a true single-file deck, or use `.title-img-slide` with `background-image:url('title-session2.jpg')` for an externally-referenced file. The deck ships with one of each. *Pasted-in-chat images can't be used directly — save them as files first.*
2. **Animated hero** (`.slide` without `.light`/`.fill`) — a "Welcome" slide with the `.hero-bg` orb backdrop (glow1 indigo / glow2 yellow / glow3 green, all blurred and floating), the `.mesh-plane` wireframe, and a `.wave.hero` corner accent. The hero-bg orbs are visible on this slide; on other slides they get neutralised by a brand override.

### Light-canvas content patterns (`.slide.light`)

3. **Provocation / claim stack** (`.slide.light.prov`) — 3–4 headlines that type/reveal on click (`.prov-line.step.typed`). Claim → reframe → implication → call-to-action. Often paired with an image on the right. Background orbs are dimmed so the text dominates.
4. **Centered intro** (`.slide.light.tc-context`) — centered headline + lead + an optional reference link. The section opener / "before we go further" moment.
5. **Six-pillar toolchain map** (`.slide.light.tc-map`) — an offset headline over a horizontal row of pillar cards (Montagu Slab titles, Corbel captions) with a spotlight hover. Supports a "Core layer" always-visible block and an "Operational layer" click-revealed block, plus an optional `.tc-sync` indicator that reveals after the step.
6. **MCP hub** (`.slide.light.mcp`) — the "USB-C for agents" slide. Big eyebrow + acronym expansion (`.mcp-acronym.mcp-expand.step.typed`), three feature boxes (`.mcp-box`), and a chip cluster with SVG spokes (`.mcp-chip` + `.mcp-spokes`). Speedlines streak in the background.
7. **Day-flow timeline** (`.slide.light.df-day`) — a horizontal spine with numbered stops, badges that reveal on click, a pulsing "live" step and a `.df-pr` / `.df-deploy` highlight, plus an optional `.df-footnote` step. The full agent dev flow lives here.
8. **Generic grid + chips** — an offset headline over a 2×3 or 3-column grid of white cards (Montagu Slab titles, Corbel captions). Example chips can reveal on click.

### Colour-panel patterns (`.slide.fill` — the "moment" slides; white text, yellow accent)

9. **Indigo panel** (`.slide.fill`, default) — eyebrow + headline + lead with the `.mesh` torus in the corner and a `.wave.hero` glitch wave. The brand's saturated energy.
10. **Magenta / coral panel** (`.slide.fill.magenta`, `.slide.fill.coral`) — colour modifiers. Use coral for chapter closers, magenta for accents.
11. **Stage tracker** (`.htrack` + `.htrack-cap`) — a horizontal row of `.htrack-box` chips with three states: `.done` (greyed), `.on` (lit indigo with `.hb-dot`), `.todo` (faint). Sits inside an indigo `.slide.fill` and shows progress through the 9-box harness across the deck. Pair with a `.htrack-cap` caption.
12. **Animated bridge** (`.slide.fill.ink` + `.bridge-stage`) — *"Fit the harness"* moment. Two `.bridge-pillar`s rise, then `.plank`s drop in sequence, a `.bridge-shimmer` sweeps, and the deck breathes. Use sparingly — it's the visual climax.
13. **Agent-team grid** (`.slide.fill.agents-team`) — rows of `.agent-card`s with connector `.team-arrow`s and a `.team-footnote`. Optionally end with a `.bridge-mini` breadcrumb (Knowledge → Capabilities → Orchestration).
14. **Playbook bridge / pb-hero** (`.slide.fill.pb-hero` or `.slide.fill.ink.pb-hero`) — *"X over here is delivered, via Z, to Y over there."* Left bank of tiles (`.pb-tile` + `.pb-bank-label`) → glowing indigo `.pb-bridge` with `.pillar`, `.cable`, `.pb-deck-planks.step`, and a `.pb-deck-label` → VS Code-style `.pb-vscode` window on the right. Click expands the deck and drops in labelled planks. Hover scales individual planks.
15. **Demo gate** (`.slide.tc-demo`) — black, centered. Big "Demo N" typewriter word + a small `.tc-demo-launch` sub-label. Used as the transition into a live demo.
16. **Closing question** (`.slide.fill.coral.q-slide`) — giant centred "Questions?" with the accent on the punctuation.

### Lavender enders

17. **Q&A** (`.slide.lavender.qa-slide`) — lavender panel `#C8C3F5`, a huge centred "Q&A" (`.bigword.qa`) with an "Any Questions?" condensed sub-label, **scattered `.scatter` repeats** (filled + `.outline`) bleeding off the edges, a `.roster.tr` torus top-right + warped `.roster.bc` plane bottom.
18. **Thank-You** (`.slide.lavender.ty-slide`) — same lavender + scatter + roster treatment, big "Thank / You" stacked with the second word right-aligned (`.ty1` / `.ty2`).

Panel modifiers: `.slide.fill` is indigo by default; add `.magenta`, `.coral`, or `.ink` to vary; `.slide.lavender` is the light-purple `#C8C3F5` word-slide (black type). The wave auto-picks a palette that reads on each background. The lavender enders use the real wireframe **rosters** (`.roster.tr` torus top-right, `.roster.bc` warped plane bottom) — a more visible placement of the same mesh symbols.

### Slide rhythm

Light-dominant with colour punctuation. Open on the **title-photo** or **animated hero**, drop a **colour panel** at each chapter break / big moment (htrack stage opener, team, bridge, closing), and keep the working content on **light**. Don't run two colour panels back to back, and don't go more than ~4 light slides without a colour beat. The panels are where the brand's saturated energy lives.

Sequencing tip used by the working deck: pair every stage opener (a `.slide.fill` with eyebrow + `.htrack`) with a few light working slides, then a `.tc-demo` gate before a live demo. Close on `.q-slide` → `.qa-slide` → `.ty-slide`.

## The signature motif — scan-line "glitch wave" + wireframe mesh

This is what makes a slide read as BC TechDays. Two reusable elements:

- **`.wave`** — a stack of coloured horizontal scan-lines whose widths trace a rough envelope (a frequency-spectrum / waveform look), skewed slightly, with an occasional horizontal "glitch" jitter. A JS generator fills every `.wave` on load. Tune it with:
  - `data-wave-lines="48"` — line count.
  - `data-wave-colors="--indigo,--indigo,--magenta,--coral"` — CSS-var palette, comma-separated (repeat a colour to weight it). Default is indigo-weighted.
  - Placement classes: `.wave.hero` (large, bottom-right corner, for title/panel/closing) and `.wave.edge` (vertical-centre right edge, for quieter content slides).
- **`.mesh`** — the brand's **real wireframe "rosters"**: the warped grid plane (`#bc-mesh-plane`) and the torus ring (`#bc-mesh-torus`), taken straight from the `.pptx` and inlined as SVG `<symbol>`s. A `.mesh` div holds `<svg><use href="#bc-mesh-torus"/></svg>` (use the plane on the hero, the torus on panels). Strokes are `currentColor`, so `.mesh-svg` recolours faint ink on light slides and faint white on `.slide.fill` automatically. Source files also live in `assets/bc-mesh-plane.svg` / `assets/bc-mesh-torus.svg`.

Use the wave on hero, panel, and closing slides; use it sparingly (one per slide). On content-heavy slides, prefer the quieter `.wave.edge` or no motif at all.

> **About `.hero-bg` / `.glow1-3`** — the engine ships the iFacto-style dark hero with floating coloured orbs and a grid overlay, but the BC TechDays brand override (`hero-bg{background:transparent !important}` + `hero-bg::before,::after{display:none !important}`) neutralises the dark canvas + grid. The orbs themselves still render where placed, so you can use them on the "Welcome" hero to add subtle floating colour — but most slides use `.wave` + `.mesh` instead.

## Logo — the real torn-ticket lockup

The **real BC TechDays logo** (the official `.pptx` artwork: torn-ticket / speech-bubble tag, "BC/NAV TECH DAYS 2026" + "mibuso.com") is inlined once as an SVG `<symbol id="bc-logo">` and referenced on every slide via `<a class="brandtag"><svg><use href="#bc-logo"/></svg></a>`, **top-right** (matching the official title slide; keeps the left clear for the headline). Its fills are `currentColor`, so it's ink on light slides and white on colour panels automatically. The source file is `assets/bc-logo.svg`. Use a `<div class="topnav"><span>…</span></div>` next to it for the session label (e.g. "Session 02"). (Do **not** hand-recreate the logo — use the real symbol.)

## Buttons & links

```html
<a class="pillbtn solid" href="#">Register</a>     <!-- indigo fill, white text, pill rounded -->
<a class="pillbtn" href="#">Programme</a>           <!-- indigo outline pill -->
<a class="arrow" href="#">More<span class="chev">›</span></a>   <!-- red chevron link, indigo on panels -->
<a class="example-link" href="#">Open the PR <span class="chev">›</span></a>   <!-- bottom-left, for live demos -->
```

On colour panels these invert to white automatically. **Example / live-demo link:** drop a single `.example-link` (bottom-left, above the pager) when presenting alongside something clickable (a real PR, demo URL, dashboard). **Real URL only in a delivered deck** — `href="#"` is fine in the template to show the pattern, but sweep for it and fill in or strip before shipping.

## Interactive: hover spotlight & image lightbox

Two opt-in patterns let the deck feel alive when the presenter mouses around. Both are wired in `template.html` (CSS + JS); add the class, the behaviour follows.

- **`.zoomable`** — opt-in on any card/box element. On hover the card lifts (`translateY(-4px) scale(1.04)`), borders go indigo, and an inset glow fires. On colour panels (`.slide.fill`) the spotlight flips to a white-tint instead. Use it for grids of choices, agent cards, term boxes, "stacks" rows — anywhere the audience might wonder which one you're emphasising.
- **`.zoomable-img`** — opt-in on any `<img>`. Cursor turns to `zoom-in`, hover gently scales, and **click opens a full-screen lightbox** (dark blurred backdrop, image centred, "esc" close button top-right). Click backdrop or press **Esc** to close. The overlay is built once on load and reused for every image. Use it for screenshots, diagrams, photos — anywhere the slide thumbnail is too small to read at the back of the room.

```html
<!-- Hover spotlight on a card -->
<div class="card zoomable">
  <h3>One option</h3>
  <p>…</p>
</div>

<!-- Click-to-focus an image -->
<img class="zoomable-img" src="assets/screenshot.png" alt="Agent flow diagram" />
```

Don't apply `.zoomable` to elements that already animate on hover (like `.tc-pillar` or `.agent-card.anchor`) — it'll double up. And don't put `.zoomable-img` on tiny icons; reserve it for content images the audience actually needs to read.

## Step reveal, typewriter & present mode

- Add class `step` to any element to hide it until the next Next-click / Right-arrow / Space. Combine `step` + `typed` for a typewriter reveal (per-char animation; the JS at the bottom splits text into per-char spans on load). Steps reset when the slide changes.
- An element with `.typed` but no `.step` types automatically when the slide becomes active (250ms initial pause then ~22ms/char).
- `?present=1` in the URL (or pressing **P**) hides the bottom nav for a clean projected view.
- Click the slide counter to open the **slide picker** (jump to any slide); the picker is grouped by `data-topic` via `.picker-topic-sep` headers, with `.picker-item.current` highlighting the active slide. **Esc** closes it.

## Things to get right — don't repeat the easy mistakes

- The presentation brand is **light canvas + Montagu Slab + RED titles**, not dark + lime, and the title colour is **red `#F7514F`, not purple/indigo**. (The marketing site's CSS exposes a lime token and indigo reads as purple — neither is the title colour. The `.pptx` "main title" is red.)
- Headlines are **Montagu Slab** (slab serif). Body is **Corbel** (with a Hanken Grotesk fallback). Eyebrows/numbers are **Barlow Condensed**. The `h1-h4` override carries `!important` — don't fight it with inline `font-family` unless you have a reason.
- **Use the real artwork, don't recreate it:** the logo (`#bc-logo`) and the wireframe rosters (`#bc-mesh-plane` / `#bc-mesh-torus`) are inlined from the official `.pptx`. A hand-drawn logo was a rejected earlier attempt.
- Indigo is the **panel/component** colour; red is the **title** colour. The other colours are for *categorical* meaning — don't scatter all of them on one slide.
- The `.g` accent word is ink on light, **yellow on colour panels**. The template flips it automatically; don't override it back.
- Use the **glitch-wave / roster-mesh** motif to brand a slide — but one motif per slide, keep it in a corner clear of text, and keep content slides quiet.
- **One stage opener per stage**: don't spam `.htrack` on every slide — it's a chapter beat, not chrome.
- The animated **bridge** and **pb-hero** are heavy hitters; one per deck (each).
- **No dead links** in a delivered deck. Sweep for `href="#"`.
- Default language is English; translate placeholder copy to the real talk.

## Output

Save to the user's workspace folder. Give them a `computer://` link so they can open it. Don't put the deliverable in this skill folder.

## Reference

- Brand source: the official **BCTechDays2026 PowerPoint** (theme colours, embedded fonts: Montagu Slab + Corbel; logo/motif SVGs). Re-open it with the `pptx` skill to re-verify a token.
- Live site: https://www.bctechdays.com (and mibuso.com). Treat its raw CSS tokens with caution — verify against the deck artwork before trusting a colour.
- Shares the deck engine with the `ifacto-presentation` skill — keyboard nav, picker, typewriter, wave generator, present mode all behave identically.
