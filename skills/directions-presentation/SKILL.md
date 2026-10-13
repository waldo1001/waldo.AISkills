---
name: directions-presentation
description: Build HTML presentation decks styled like the Directions EMEA 2026 (Paris) brand — white canvas, Vibrant Purple #4A54A0 panels with the Dark Purple #393F79 wave artwork, Poppins everywhere (Medium titles), the real four-colour "directions emea paris 2026" frame logo (colour on white, white on purple, inlined from the official PowerPoint), the red · orange · green · blue stripe, and the official layouts (title, title-with-photo, agenda side panel, section divider, big title, KPI discs, donut stats, laptop + hand-phone mockups, Q&A, "Give us Feedback!" conference-app slide, end slide with contact lines) — on top of the full shared pattern engine (claim stack, MCP hub, tc-map, timeline, bridge, pb-hero, agents grid, stage tracker, trail tracker, vocab zoom, replay overlay, presenter notes, View Transitions, print-pdf). Trigger whenever the user asks for a Directions deck, Directions EMEA slides, a Directions-branded presentation, or a deck for a Directions EMEA / Directions Paris 2026 session or talk.
---

# Directions EMEA presentation skill

Use this skill any time the user wants an HTML presentation that should match the **Directions EMEA 2026 Paris** brand. Every token below was taken from the **official Directions EMEA 2026 PowerPoint template** — its theme, its slide layouts, its embedded fonts and media, and the brand palette slide it ships with. Don't substitute values.

This skill shares the proven deck engine of the `bctechdays-presentation` and `ifacto-presentation` skills (keyboard nav, step reveals, typewriter, slide picker with topic separators, present mode, replay overlay, trail tracker…) but wears the Directions brand.

## How to use this skill

1. Open `assets/template.html`. It's a working multi-slide deck: the Directions layouts first, then every engine pattern, then the enders. Copy it, then swap content.
2. The demo content is generic placeholder. Replace it with the real talk; **don't rewrite the CSS**.
3. Delete patterns you don't need. Keep the rhythm (see "Slide rhythm").
4. Save the deck to the user's workspace folder, **not** the skill folder.
5. The template is **self-contained**: logos, mockups and wave artwork are inlined (data URIs / SVG symbols). Only Google Fonts (Poppins, Caveat) load from the network.

## Slide density — minimum text on every slide

The presenter is the verbal layer; the slide is a visual anchor, not a teleprompter.

- Readable in **under 5 seconds** without the presenter speaking.
- One strong sentence > a paragraph. A 1–3 word label > a caption.
- No bulleted prose. Card labels are 1–3 words.
- A headline + one accent word + the motif is enough for most slides.
- Over ~15 visible words → it's two slides. Split it.

## Brand tokens — non-negotiable

From the `.pptx` theme (`Custom 520`) and the template's own brand-palette slide (General / Directions / Days of Knowledge columns). The deck is **white-dominant**: content lives on a plain white canvas; the title, section, big-title, Q&A and end slides are **full-bleed Vibrant Purple** with **Dark Purple waves**.

| Token | CSS var | Value | Role |
|---|---|---|---|
| **Vibrant Purple** | `--purple-v` | **`#4A54A0`** | Panel colour (theme accent1), accent word on white, eyebrows, links, KPI accent |
| **Dark Purple** | `--purple-d` | **`#393F79`** | The wave shapes on purple panels |
| Dark grey | `--grey-d` | `#3A3A3A` | Titles + body on white (theme dk1 `#3C3C3B`), KPI discs, donut fill |
| Signature grey | `--grey-s` | `#484848` | Secondary ink |
| Ice blue | `--ice` | `#EAF7F7` | Agenda side panel, `.slide.alt` canvas (theme lt2 `#EDF7F7`) |
| White ice | `--ice-w` | `#F6FCFC` | Very light tint |
| Light violet | `--violet-l` | `#EEF3F8` | Light tint |
| Signature teal | `--teal` | `#008A95` | Secondary panel (`.slide.fill.teal`) — "Days of Knowledge" family |
| Dark teal | `--teal-d` | `#00666E` | Waves on the teal panel |
| Red | `--red` | `#E5232A` | Logo frame / stripe |
| Orange ("Yellow") | `--orange` | `#F28B25` | Logo frame / stripe; the `.g` accent word **on purple panels** |
| Blue | `--blue` | `#3176BB` | Logo frame / stripe |
| Green | `--green-b` | `#127E3F` | Logo frame / stripe |
| White | — | `#FFFFFF` | Canvas; text on panels |

Engine aliases (`--indigo`, `--green`, `--black`, `--magenta`, `--yellow`, `--cyan`, `--coral`, `--purple`) are remapped onto these so every shared component resolves to Directions colours. Don't use them in new markup — use the names above.

The four logo colours (red, orange, green, blue) are **the stripe and the frame**, nothing else. Don't make red/orange/green/blue panels or titles — the deck never does.

### Font

**Poppins** — the only family the official deck uses (theme major + minor font, embedded). Loaded from Google Fonts.

- Titles: **Poppins Medium (500)**, enforced with `!important` on `h1`–`h4`.
- Body/lead: Poppins Regular (400). Bold (600) for 1–3 keywords inside a sentence — never a whole sentence.
- Labels/eyebrows: Poppins SemiBold (600), uppercase, tracked.
- The one exception: the feedback slide's script word ("Feedback!") — the deck uses Segoe Script Bold; the template falls back to **Caveat** (Google) where Segoe Script isn't installed. Use `.script` only there.

## Type scale

```
h1 (title/statement)  clamp(40px,3.65vw,70px)  Poppins 500, line-height 1.3 on the title slide
h2 (slide headline)   engine default            Poppins 500, dark grey on white / white on purple
.eyebrow              clamp(13px,1vw,16px)       Poppins 600, UPPERCASE, tracked .14em, purple
.lead / p             engine default             Poppins 400
.dx-who (speaker)     clamp(13px,.95vw,17px)     Poppins, name in 600
```

## Title colour & the accent word

- On **white**: headlines are **dark grey `#3A3A3A`**. The optional accent `<span class="g">word</span>` turns ONE word **Vibrant Purple**.
- On **purple panels** (`.slide.fill`): headlines are **white**; the `.g` word flips to **orange `#F28B25`**.
- Never colour more than one word/phrase per headline. A fully dark-grey (or fully white) title is the default and is fine.

## The logo — real artwork, two variants

The real "directions emea paris 2026" lockup (stepped four-colour frame; **directions** / **emea** bold, *paris* / *2026* light) is inlined as two PNG data URIs in CSS custom properties: `--dx-logo-color` (dark text, for white slides) and `--dx-logo-white` (white text, for purple panels). The source files are `assets/dx-logo-color.png` / `assets/dx-logo-white.png`, cropped from the `.pptx` media.

```html
<span class="brandtag"><span class="dx-logo" role="img" aria-label="Directions EMEA Paris 2026"></span></span>
```

Drop that inside `.topbar` on every slide. The variant switches automatically (`.slide.fill`, `.ink`, `.tc-demo` → white). Placement follows the `.pptx`: **top-left on purple panels, top-right on white content slides** (the mobile-mockup and feedback slides put it top-left — override inline as the template does). **Never** retype the logo in text or redraw the frame.

## The signature motifs

1. **Dark Purple waves** (`.dxw`) — two large swooping bands from the title/section/end layouts, converted from the layouts' real custom geometry into the SVG `<symbol id="dx-waves">`. Every purple panel carries them:
   ```html
   <div class="dxw" aria-hidden="true"><svg viewBox="0 0 1920 1080" preserveAspectRatio="xMaxYMid slice"><use href="#dx-waves"/></svg></div>
   ```
   `.dxw.outline` gives the **section-divider** treatment (no fill, white 19 % outline — exactly the "Section divider" layout). On `.teal` the waves turn dark teal, on `.ink` near-black. A slow drift animation runs while the slide is active.
2. **The four-colour stripe** — red · orange · green · blue, 5 px. On white slides it is drawn **automatically** at the top-left edge (`.slide.light::after`, `.slide.alt::after`) — don't add it by hand. On purple title/section/end slides place `<span class="dx-stripe">` under the title.
3. **Frame outlines** (`.dx-frames` + `<symbol id="dx-frame">`) — two giant crops of the stepped frame outline at 19 % white; only on the **Big title** layout.

One motif per slide. Content slides stay quiet: white + stripe + logo.

## Slide patterns in the template

### Directions layouts (the official `.pptx` slide layouts)

1. **Title** (`.slide.fill.dx-title`) — purple + waves, white logo top-left, two-line Medium title, stripe, speaker name/company bottom-left (`.dx-who`).
2. **Title with photo** (`.dx-title.dx-title-img`) — same, with a rounded `.dx-photo` box on the right. Replace the placeholder div with `<img class="dx-photo" src="…" alt="…">`.
3. **Agenda** (`.slide.light.dx-agenda`) — ice-blue rounded side panel with the "Agenda" title, numbered list (`.dx-list`) on the right. Mark the current item `li.now` to reuse it as a chapter marker.
4. **Section divider** (`.slide.fill.dx-section`) — outline waves, `.secnum`, one-line title, stripe.
5. **Big title** (`.slide.fill.dx-big`) — one statement with the giant frame outlines.
6. **KPI discs** (`.dx-kpis` → `.dx-kpi` + `.dx-kpi-arrow`) — dark discs, `.ring` outlined disc, `.accent` purple disc, arrows between. From the "KPI / 3 Stats" layout.
7. **Donut stats** (`.dx-donuts` → `.dx-donut` with `.ring style="--p:40"`) — animated conic donuts from the "KPI / 4 Stats" layout; `.accent` makes one purple.
8. **Laptop mockup** (`.dx-laptop-block` + `.dx-laptop`) — purple text block left, the real laptop frame bleeding off the right; drop a screenshot `<img>` into `.screen`.
9. **Hand + phone mockup** (`.dx-phone-band` + `.dx-hand`) — purple band right, the greyscale wooden hand holding a phone; screenshot goes into `.screen`. Text in `.dx-mobile-text`.

### Enders

10. **Questions?** (`.slide.fill.coral.q-slide`, engine) — giant centred word; `.coral` resolves to Dark Purple here.
11. **Q&A** (`.slide.fill.dx-qa`) — huge white "Q&A" with an orange light-weight ampersand, waves, stripe.
12. **Feedback** (`.slide.light.dx-feedback`) — the conference's own "Give us *Feedback!* … rate my session in the Conference App" slide with the session-feedback screen in the hand. **Keep this before the end slide at Directions** — the organisers ask every speaker for it.
13. **End** (`.slide.fill.dx-end`) — "Thank you" + contact lines with icons (`.dx-contact`), as in the "End slide" layout.

### Shared engine patterns (light = white canvas, `.fill` = purple panel)

Everything from the BC TechDays / iFacto engine is wired in and re-skinned: **claim stack** (`.prov`), **MCP hub** (`.mcp`), **centred intro** (`.tc-context`), **six-pillar map** (`.tc-map`), **agent-team grid** (`.agents-team`), **animated bridge** (`.fill.ink` + `.bridge-stage`), **demo gate** (`.tc-demo`), **day-flow timeline** (`.df-day`), **playbook bridge** (`.pb-hero`), **stage tracker** (`.htrack`), **teal panel** (`.fill.teal`), **generic grid + chips**, **extended chips** (`.spec-chip`, `.model-chip`, `.kn-chip`, `.skill-card`), **three-node storyline** (`.cr-stage`), **pipeline analyzer** (`.pa-stage`), **hub-and-spokes** (`.csp-hub`), **View Transitions morph**, **hover spotlight / lightbox**, **hands-up cards**, **trail overview + stage legs**, **vocab zoom cards**, **term grid**, **strap list**, **photo/instruction splits**, **galleries**, **retro C/AL skin**, **replay row**. See the sections below for their mechanics.

Panel modifiers: `.slide.fill` = Vibrant Purple (default), `.fill.deep` (or legacy `.coral`) = Dark Purple, `.fill.teal` (or legacy `.magenta`) = Signature Teal, `.fill.ink` = dark grey. `.slide.alt` = ice-blue canvas.

### Slide rhythm

White-dominant with purple punctuation — like the official deck. Open on **Title** (or Title with photo) → **Agenda** → for each chapter a **Section divider** (or the agenda again with `li.now`) followed by a few **white** working slides → a **Big title** for the one statement you want remembered → **Questions? / Q&A** → **Feedback** → **End**. Don't run two purple panels back to back (title→section is the exception), and don't go more than ~5 white slides without a purple beat.

## Buttons & links

```html
<a class="pillbtn solid" href="#">Register</a>     <!-- purple fill, white text, pill rounded -->
<a class="pillbtn" href="#">Programme</a>           <!-- purple outline pill -->
<a class="arrow" href="#">More<span class="chev">›</span></a>   <!-- purple chevron link, white on panels -->
<a class="example-link" href="#">Open the PR <span class="chev">›</span></a>   <!-- bottom-left, for live demos -->
```

On colour panels these invert to white automatically. **Example / live-demo link:** drop a single `.example-link` (bottom-left, above the pager) when presenting alongside something clickable (a real PR, demo URL, dashboard). **Real URL only in a delivered deck** — `href="#"` is fine in the template to show the pattern, but sweep for it and fill in or strip before shipping.

## Interactive: hover spotlight & image lightbox

Two opt-in patterns let the deck feel alive when the presenter mouses around. Both are wired in `template.html` (CSS + JS); add the class, the behaviour follows.

- **`.zoomable`** — opt-in on any card/box element. On hover the card lifts (`translateY(-4px) scale(1.04)`), borders go purple, and an inset glow fires. On colour panels (`.slide.fill`) the spotlight flips to a white-tint instead. Use it for grids of choices, agent cards, term boxes, "stacks" rows — anywhere the audience might wonder which one you're emphasising.
- **`.zoomable-img`** — opt-in on any `<img>`. Cursor turns to `zoom-in`, hover gently scales, and **click opens a full-screen lightbox** (dark blurred backdrop, image centred, "esc" close button top-right). Click backdrop or press **Esc** to close. The overlay is built once on load and reused for every image. Use it for screenshots, diagrams, photos — anywhere the slide thumbnail is too small to read at the back of the room. You can also open the lightbox from a **non-`<img>`** element with `data-lightbox="path/to/image.png"` (and optional `data-lightbox-alt="…"`) — handy for a button or caption that should pop a full-size image.

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

## Extended chip types

Beyond the basic grid cards, the template carries several specialised chip/card components:

- **`.spec-chip`** — Specialist/persona chip with an orange dot indicator. Use for named agent roles or people. The dot is `::before { background: var(--amber) }`.
- **`.model-chip`** — LLM model chip with colour-coded dots: `.opus` = teal, `.sonnet` = purple, `.gpt` = blue. Use for listing available models.
- **`.kn-chip`** — Knowledge-source chip with a CSS-drawn three-line stack icon (`.kn-icon`). Use for knowledge bases, documentation references, data sources.
- **`.skill-card`** — Skill/capability card with a CSS-drawn file icon (`.skc-icon`). Larger than chips; supports a title + short caption. Use for listing agent skills or extension points.

All chips share the same hover recipe: `translateY(-2px) scale(1.12)`, purple border, inset glow. On `.slide.fill` the spotlight flips to white-tint automatically.

## View Transitions / element morph

The deck supports the **View Transitions API** for shared-element morphing between slides. When two slides both contain elements with a matching `data-morph` token, the transition animates the element smoothly from its position on slide N to its position on slide N+1.

```html
<!-- Slide N: a small chip -->
<span data-morph="bcci" class="chip">BC Code Intelligence</span>

<!-- Slide N+1: expanded hero -->
<div data-morph="bcci" class="bcci-hero">
  <h2>BC Code Intelligence</h2>
  <p class="lead">…</p>
</div>
```

**How it works:** On `show(n)`, the JS collects `[data-morph]` tokens from both the leaving and entering slides. If any token appears in both AND `document.startViewTransition` exists, it wraps the swap in a View Transition. Falls back to instant swap on unsupported browsers.

**CSS:** Each morphed element auto-gets `view-transition-name: <token>-token`. The template provides:
```css
::view-transition-group(*-token){ animation-duration:2000ms; animation-timing-function:cubic-bezier(.2,.8,.25,1); }
::view-transition-old(*-token),::view-transition-new(*-token){ animation-duration:1400ms; }
```

Use sparingly — one morph per slide transition max. Best for "chip expands into hero" or "card flies to a new position" moments.

## BCCI hero shrink-on-step

A hero element that smoothly transitions its size when a later step is revealed, using `:has()`:

```css
.bcci-hero { transition: font-size 800ms, padding 800ms, border-radius 800ms, gap 800ms; }
.slide.bcci:has(.bcci-stack-area.shown) .bcci-hero {
  font-size: clamp(26px,3vw,48px); padding: 14px 36px; border-radius: 80px;
}
```

Unshown steps collapse via `max-height:0; overflow:hidden; margin-top:-28px` so the hero stays centred until content appears.

## Replay overlay (iframe-based chat replay)

Embed and play external HTML replays (from the `chat-replayer` skill) directly inside the deck without leaving the presentation.

**Trigger:** Any element with `data-replay="path/to/replay.html"` and optional `data-replay-title="Label"`. Use the `.replay-link` class for the standard styled button:

```html
<a class="replay-link reveal" data-replay="replays/demo.html" data-replay-title="Full loop demo">
  <span class="rl-ico">&#9654;</span> Play replay <span class="chev">&rsaquo;</span>
</a>
```

**Overlay structure** (add once at end of `<body>`):
```html
<div class="replay-overlay" id="replayOverlay" aria-hidden="true">
  <div class="replay-frame-bar">
    <span class="rt" id="replayTitle">Chat replay</span>
    <span><a id="replayOpen" href="about:blank" target="_blank" rel="noopener">Open in new tab &rsaquo;</a>
      &nbsp;&nbsp;<button class="replay-close" id="replayClose">Close &times; (Esc)</button></span>
  </div>
  <div class="replay-stage"><iframe id="replayFrame" title="Chat replay" src="about:blank"></iframe><div class="replay-sheen" aria-hidden="true"></div></div>
</div>
```

**Behaviour:**
- Click `[data-replay]` → sets iframe `src`, opens overlay with scale-up animation
- Injects Esc listener into iframe content document for seamless close
- Blocks ALL deck navigation keys while overlay is open (Space, arrows, Page)
- Supports `window.postMessage('bctb-replay-close')` from inside the iframe
- Decorative: rotating conic-gradient border glow + sheen sweep

The `.replay-link` also doubles as a regular link (`href` + `target="_blank"`) so it works if JS is disabled or for right-click → open in new tab.

## SVG zoom overlay

Click any `.zoomable-svg` to open its SVG full-viewport in a dark overlay. Built dynamically — just add the class to any inline `<svg>`:

```html
<svg class="zoomable-svg" viewBox="…">…</svg>
```

JS clones the SVG's `outerHTML` into a `.svg-zoom-stage` div. Esc or backdrop click closes.

## Dogsled trail — persistent top progress tracker

A thin **always-on progress tracker** pinned to the top of the deck: a sled glides along a track with named stops, marking which "stage" of the talk you're in. It's the running-progress companion to the per-section `.htrack` stage opener (the trail is global chrome; `.htrack` is a one-slide chapter beat).

**Markup** (one `#trail` block just inside `<body>`, after `#progress`):
```html
<div class="trail" id="trail" aria-hidden="true">
  <div class="trail-track">
    <div class="trail-fill" id="trailFill"></div>
    <div class="trail-sled" id="trailSled">&#128759;</div>
    <div class="trail-stops">
      <div class="trail-stop" data-leg="1"><div class="trail-dot"></div><div class="trail-label">Stage 1</div></div>
      … one .trail-stop per stage …
    </div>
  </div>
</div>
```

**Per-slide opt-in:** a slide joins the trail with `data-leg="N"`. `TRAIL_POS` (in the JS) maps each leg number to a percent along the track (`{'0':2,'1':10,'2':30,'3':50,'4':70,'5':90,'6':100}` by default — edit it to match your stage count). On each `show()`, `updateTrail()`:
- hides the trail on slides with **no `data-leg`** (and on the `data-anchor="overview"` slide);
- glides `#trailFill` / `#trailSled` to the leg's percent and marks stops `.done` / `.active`;
- on a **stage-shift** slide (`data-stage` set) adds `.stage-zoom` so the active stop zooms to spotlight the new stage;
- flips to a light treatment (`.on-dark`) automatically on colour panels / dark slides.

**Overview slide + build-trail morph.** A `.slide` with `data-anchor="overview"` holds a big inline **`.build-trail`** (the same stops, large, each `.bt-stop` carrying `data-goto="N"` to jump to the slide whose `data-stage="N"`). Leaving the overview slide **forward** to a `data-leg` slide, the big build-trail **flies up and becomes the top trail** via a shared `legtrail` View Transition (~2s glide). A floating **`#ovLink`** ("Overview") button appears while you're on the stage legs (`STAGE_LEGS` set) and jumps back to the overview. Overview cards / build-trail stops use `[data-goto]`; the engine wires the jumps automatically.

The template demos the whole thing: an overview slide + five `data-leg`/`data-stage` stage slides (each also showcasing a different new component).

## print-pdf export mode

Add **`?print-pdf`** to the URL and the deck lays every slide out as a static **1280×720** block, one per page, with all `.step` reveals forced visible and nav / progress / trail / animations stripped — then **Print → Save as PDF** (the `@page` size is set to match). Triggered by a one-line guard at the top of the main script that adds `.print-pdf` to `<html>`; the rest is the `html.print-pdf …` CSS block. Use it to hand out or archive a deck.

## Vocabulary cards — click-to-zoom

A row of term cards that blow up to ~200% on click — a richer replacement for the old one-word-per-slide vocabulary walk. `.vocab-grid` holds `.vocab-card`s (`.vc-kicker` / `.vc-word` / `.vc-desc`). Clicking a card clones its content into a centred `.vocab-zoom` overlay (`.vz-card`) scaled up; backdrop click or **Esc** closes. The overlay is built once on load.

```html
<div class="vocab-grid">
  <div class="vocab-card"><span class="vc-kicker">Noun</span><span class="vc-word">Harness</span><span class="vc-desc">Short definition, zoomed on click.</span></div>
  …
</div>
```

## More layout components

Pure-CSS content blocks added to the template; copy the markup, swap the content.

- **`.term-grid`** — a row of `.term-item` cards (purple top-rule) with an uppercase Poppins `.term-label` + `.term-def`. A terminology / glossary strip on light slides.
- **`.strap-list`** — vertical numbered rows (`.strap-item` → `.strap-num` orange + `.strap-text` + optional right-aligned `.strap-pillar`). Takeaways / principles on a colour panel.
- **`.photo-split`** — text left (`.ps-text`), framed image right (`.ps-img`); the image takes `.zoomable-img` or `data-lightbox` for click-to-zoom. **`.instr-split`** is the same idea with a narrower image column (`.is-text` / `.is-img`) for screenshots.
- **`.history-gallery`** — an equal-width row of photos (dark slides), each lightly dimmed; pairs with `.zoomable-img`.
- **`.fail-grid`** — a 2×2 grid of captioned thumbnails (`.fail-img-wrap` + `.fail-img-caption` overlay). "Where it breaks" / before-and-after evidence.
- **Retro C/AL skin** (`.slide.retro-cal` + `.crt`) — a deliberately old-fashioned Win95 / C-SIDE window (`.crt-title` / `.crt-menu` / `.crt-body` with `.crt-eyebrow` + `.crt-h2` + `.crt-p`, `.crt-status` footer) on a teal desktop. The "we used to do it the OG way" gag slide. The wave motif is hidden here on purpose.
- **`.replay-row`** — several `.replay-link` launch buttons side by side **in flow** (centred), instead of one bottom-left button. Use when a slide offers a menu of replays to play in-deck.

## Presenter notes (inline in the slide picker)

Per-slide talk-track notes accessible from the slide picker, for speaker preparation and on-stage reference. (This replaced the old `.narr` modal: notes now expand **inline** under the picker row — no separate overlay.)

**Define notes** in a `SLIDE_NOTES` object keyed by `data-slide` — one plain string per slide:
```js
const SLIDE_NOTES = {
  '00': 'Title. Welcome them in. 45 minutes, two live demos.',
  '02': 'Walk the prerequisites — keep it to one sentence out loud.',
};
```

**UI:** When building the slide picker, each slide that has a `SLIDE_NOTES` entry grows a small `ⓘ` button (`.picker-note-btn`). Clicking it toggles an expanding `.picker-note` row right under that picker item; the picker stays open. If `SLIDE_NOTES` is undefined or has no entry for a slide, no `ⓘ` appears. Keep each note to a sentence or two — it's a cue, not a script.

## Slide persistence

Two strategies wired in the deck engine — use one or both:

- **URL hash** (default): `history.replaceState(null,'','#'+(i+1))` on every slide change. Reloading the page resumes at the same slide. Shareable links (`deck.html#14`). Responds to `hashchange` for browser back/forward.
- **localStorage** (opt-in): `localStorage.setItem('dx-current-slide', i)` — survives reloads even without hash support. Useful for offline decks or when you don't want the hash visible.

## tc-sync pattern (`:has()` sibling reveal)

A row that auto-reveals when a sibling `.step` gets `.shown`, without needing its own click:

```css
.slide.tc-map .tc-map-row.tc-sync { opacity:0; transform:translateY(28px); }
.slide.tc-map.active:has(.step.shown) .tc-map-row.tc-sync {
  animation: revealUp .8s cubic-bezier(.2,.8,.25,1) forwards;
}
```

Use for "appears together with the first step" elements — sync indicators, footnotes, secondary labels.

## `animation-fill-mode: backwards` technique

Use `backwards` instead of `forwards` when you need `:hover` transforms to override the animation's final state:

```css
.slide.mcp.active .mcp-boxes.step.shown .mcp-box {
  animation: mcpBoxSnap .55s cubic-bezier(.34,1.56,.64,1) backwards;
}
```

`backwards` holds the initial keyframe during `animation-delay`, then after completion the property reverts to the regular cascade — so `:hover { transform:… }` works freely.

## Topbar anti-animation fix

Prevent the persistent topbar from re-animating on every slide change:

```css
.slide .topbar.reveal { animation:none; opacity:1; transform:none; }
```

## Step reveal, typewriter & present mode

- Add class `step` to any element to hide it until the next Next-click / Right-arrow / Space. Combine `step` + `typed` for a typewriter reveal (per-char animation; the JS at the bottom splits text into per-char spans on load). Steps reset when the slide changes.
- An element with `.typed` but no `.step` types automatically when the slide becomes active (250ms initial pause then ~22ms/char).
- `?present=1` in the URL (or pressing **P**) hides the bottom nav for a clean projected view.
- Click the slide counter to open the **slide picker** (jump to any slide); the picker is grouped by `data-topic` via `.picker-topic-sep` headers, with `.picker-item.current` highlighting the active slide. **Esc** closes it.

## Things to get right — don't repeat the easy mistakes

- The brand is **white canvas + Vibrant Purple panels + Poppins**. Not dark-by-default, not slab serif, not multicolour panels. Titles are **dark grey on white, white on purple** — never red, never purple-filled text on white except the one `.g` word.
- **Poppins only** (Medium titles). The `h1-h4` override carries `!important` — don't fight it with inline `font-family`. The script font belongs to the feedback slide alone.
- **Use the real artwork, don't recreate it:** the logo PNGs (`--dx-logo-color` / `--dx-logo-white`), the waves (`#dx-waves`), the frame outline (`#dx-frame`), the laptop/hand mockups and the feedback screen all come from the official `.pptx`. Never retype "directions emea paris 2026" as text.
- The four logo colours are for the **stripe and the frame only**. Categorical colour in diagrams: purple first, then teal, then grey; reach for red/orange/green/blue only when the meaning is literally a traffic light or the four Directions colours.
- White slides get the stripe **automatically** — don't add a second one. Purple title/section/Q&A/end slides get an explicit `.dx-stripe`.
- Logo **top-left on purple, top-right on white**. Don't put it in both corners or in the pager.
- Keep the **Feedback** slide; Directions organisers ask every speaker to show it. Don't edit the app screenshot.
- `.g` is purple on white and **orange on purple** — the template flips it automatically (also inside `.dx-laptop-block`).
- **One stage opener per stage**, one bridge, one pb-hero, one build-trail morph per deck — they're set pieces.
- **No dead links** in a delivered deck. Sweep for `href="#"` and placeholder `data-replay` / `data-lightbox` / `src` paths. The `.dx-photo` and mockup `.screen` placeholders must get real images or be deleted.
- Before printing/archiving, open with **`?print-pdf`** and "Save as PDF" rather than screenshotting slides.
- Default language is English; translate placeholder copy to the real talk.

## Output

Save to the user's workspace folder and give them the path (or publish it as an artifact if they want to share it). Don't put the deliverable in this skill folder.

## Reference

- Brand source: the official **Directions EMEA 2026 Paris PowerPoint template** (theme `Custom 520`: accent1 `#4A54A0`, dk1 `#3C3C3B`, lt2 `#EDF7F7`, Poppins major/minor; layouts Title Slide, Title Slide with Image, Section divider, Big title, Agenda, KPI/Stats, Laptop/Mobile mockups, End slide; its brand-palette slide). Re-open it with the `pptx` skill to re-verify a token.
- Assets in `assets/`: `dx-logo-color.png`, `dx-logo-white.png`, `dx-laptop.webp`, `dx-hand-phone.webp` (greyscaled, as the deck shows it), `dx-phone.webp`, `dx-feedback-app.webp`, `dx-frame-outline.svg`. The template inlines them; the files are there for re-use and re-export.
- Shares the deck engine with `bctechdays-presentation` and `ifacto-presentation` — keyboard nav, picker, typewriter, notes, trail, replay overlay and present mode behave identically. The replay overlay still listens for the `bctb-replay-close` message so `chat-replayer` output closes it.
