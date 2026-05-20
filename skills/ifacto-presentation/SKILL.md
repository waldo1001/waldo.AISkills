---
name: ifacto-presentation
description: Build HTML presentation decks styled like the iFacto.be brand — green-on-black, Poppins, light-weight headlines with one accent word, photographic/animated dark hero, alternating dark/light slides, pill buttons, "Meer …" chevron links. Trigger whenever the user asks for an iFacto deck, iFacto slides, an iFacto-branded presentation, a deck for an iFacto session, or any HTML presentation that should match the iFacto.be visual language. Also trigger when the user is working in the "Agentic Development at iFacto" project folder and asks for slides, even if they don't say "iFacto" explicitly — that folder is iFacto-branded by default.
---

# iFacto presentation skill

Use this skill any time the user wants an HTML presentation that should match the iFacto.be brand. The brand was inspected directly from www.ifacto.be — the design tokens and patterns below are not invented, they're what the live site uses.

## How to use this skill

1. Open `assets/template.html`. It's a fully working 6-slide deck wired up with keyboard nav, animations, and every layout pattern listed below. Treat it as the starting point — copy it, then swap content.
2. If the user wants only some of the slide patterns, delete the slides you don't need. Don't rewrite the CSS from scratch — the patterns interlock (e.g. `.hero-bg` is reused on multiple dark slides).
3. Save the resulting deck to the user's workspace folder, not the skill folder. The template stays untouched.

## Slide density — minimum text on every slide

The presenter is the verbal layer. The slide is a visual anchor, not a teleprompter. Waldo will *talk around* every slide — the deck is the backdrop, not the script.

Hard rules:

- A slide must be readable in **under 5 seconds** without the presenter speaking.
- Prefer **one strong sentence** over a paragraph. Prefer a **1–3 word label** over a caption.
- **No bulleted prose.** A bullet that reads as a full sentence belongs in the spoken track, not on screen.
- Card labels are 1–3 words: "Toolchain", not "We invest heavily in our toolchain".
- A headline + one green accent word + one supporting visual is usually enough for an entire slide.
- If a slide needs more than ~15 visible words, it is two slides — split it.
- The "lead" / subtitle paragraph under a hero is the only place a longer line is acceptable, and even then keep it to one short sentence.

Apply this to every layout pattern below. If a pattern in `template.html` shows denser demo text, that's demo content — strip it down before shipping.

## Brand tokens — non-negotiable

These come from inspecting the live site. Don't substitute values — the brand recognition comes from these specific choices.

| Token | Value | Where it shows up |
|---|---|---|
| Primary green | `#3BAF5A` | Accent words, buttons, links, logo ring, chevrons |
| Near-black | `#040404` | Dark slide background |
| White | `#FFFFFF` | Light slide background |
| Off-white text on dark | `#FBFBFC` | Body on dark slides |
| Ink (dark text) | `#212427` | Body on light slides |
| Subtle line | `#DEE2E6` | Card borders on light slides |
| Muted grey | `#7A8088` | Secondary text on light slides |

Font: **Poppins** everywhere. No exceptions. Loaded via Google Fonts in the template.

## Type scale (current, at h1 ≤ 110px)

H1 cap is 110px — the user pushed back when it was 140px and again when it crept up. Do not raise it without checking.

```
h1     clamp(56px, 7vw, 110px)   weight 300, letter-spacing -0.025em
h2     clamp(48px, 6vw, 92px)    weight 300
h3     clamp(28px, 2.4vw, 40px)  weight 400
h4     clamp(22px, 1.7vw, 28px)  weight 400
.lead  clamp(24px, 1.85vw, 34px) weight 400 — for subtitle under hero
p      clamp(20px, 1.55vw, 28px) weight 400
.arrow clamp(18px, 1.3vw, 22px)  weight 500 — "Meer …" links
```

Body text uses **bold inside light text** to emphasise keywords mid-sentence — this is an iFacto signature. Example: "iFacto als **development partner**, door het bouwen van **Business Central**-code …". Never bold a whole sentence; pick the 1–3 key terms.

## The "one green word" headline rule

iFacto headlines almost always have *one* word in green inside an otherwise-monochrome headline. The green word is usually the verb or the most important noun.

Examples from the live site:
- "Level **up** your business" (verb is green)
- "**Digitale transformatie**" (whole phrase, only when it stands alone)
- "Sectorkennis als **uitgangspunt**" (the noun being defined)

Do this with `<span class="g">word</span>`. Never colour more than one word/phrase per headline unless mirroring "Vragen. **Push-back.** Ideeën." (a list of three where one is the emphasis).

## Buttons — pill, two flavours only

```html
<a class="pillbtn" href="#">Contact</a>          <!-- outlined green -->
<a class="pillbtn solid" href="#">Onze tools</a> <!-- filled green   -->
```

40px radius, Poppins 500, 13px 32px padding. Subtle lift + green-shadow on hover. The site only has these two button styles — don't add a third.

## "Meer …" chevron links

iFacto's secondary CTAs are not buttons, they're text links with a green chevron:

```html
<a class="arrow" href="#">Meer over de Playbook<span class="chev">›</span></a>
```

Chevron animates on hover. Use these wherever a card or section needs a "read more" affordance.

## Example / live-demo link — bottom-left corner

When a slide is meant to be presented alongside a **live external example** (a real PR in Azure DevOps, a working demo URL, a GitHub repo, a telemetry dashboard — anything Waldo wants to click during the talk), drop in a single `.example-link` at the bottom-left of the slide.

```html
<a class="example-link reveal"
   href="https://dev.azure.com/.../pullrequest/21875"
   target="_blank" rel="noopener noreferrer">
  Example<span class="chev">›</span>
</a>
```

Where it sits: `position:absolute; bottom:60px; left:9vw;` — directly above the pager's left label (`Topic NN / 13`), sharing the same `left:9vw` margin so the two stack cleanly. The link is small, uppercase, letter-spaced (matches the pager / topbar voice), green (`var(--green)` → `var(--green-deep)` on hover) with a chevron that slides right on hover.

Why bottom-left, not top-right / top-center / bottom-center / bottom-right:
- **Top-right** collides with the topbar text (`iFacto (BE, NL & Food) + Astena · 2026`).
- **Bottom-center** collides with the fixed prev/next nav.
- **Bottom-right** collides with the `bridge-mini` corner.
- **Bottom-left** is the only empty corner on a finished iFacto slide. (User locked this position 2026-05-15 after trying the other three.)

**Hard rule, same as every other link in a delivered deck:** real URL only. `href="#"` is fine inside `template.html` to demo the pattern, but a delivered deck must either fill in a real link or strip the element. No placeholder example links shipping.

## Logo

Green animated SVG ring + "ifacto" wordmark + "level up your business" tagline. The ring rotates slowly (28s loop) — leave that alone, it's a nice subtle signal that the page is alive.

## Slide patterns available in the template

Seven patterns, each demonstrating a piece of the iFacto layout vocabulary. Pick what fits:

1. **Dark hero** — animated motion-blur background (3 floating green/gold blur orbs + 24 horizontal speed lines), big light headline with one green word, lead paragraph, single chevron link.
2. **Centered intro on white** — mirrors the site's "Digitale transformatie" section. Centered title, centered lead, two pill buttons (one solid, one outlined).
3. **Offset title + 2×2 card grid** — mirrors the site's "Sectorkennis als uitgangspunt" section. Title-block on the left, four module cards on the right. Decorative concentric rings behind it.
4. **Flow diagram on warm grey** — five steps with circular numbered badges and an animated dashed SVG curve threading through them. The "live" step (`.step.live`) pulses.
5. **Insights on dark** — one feature card with image-area + text, list of three tiles with gradient thumbs. Mirrors the site's "Insights" section.
6. **Closing CTA on dark** — split: large "Vragen. Push-back. Ideeën." headline on the left + dark gradient contact panel with breathing radial glows on the right.
7. **Snap-in box row on light** *(slide 6b in the template)* — 3-up rounded white boxes that pop in with overshoot on slide entry, staggered 120ms apart, with a light-green flash on the dominant element 220ms after each box settles. Two typographic variants share the same box chrome:
   - **Variant A — eyebrow + body** (`.snapbox-eyebrow` + `.snapbox-body`): small green caps eyebrow over a short body line. Use for *"three angles on the same idea"* / metaphor triptychs (e.g. *Standardized · Universal · Pluggable*).
   - **Variant B — name + caption** (`.snapbox-name` + `.snapbox-caption`): big light-weight headline word over a short supporting caption. Use for *"three pillars / three legs"* trios (e.g. *Knowledge · Capabilities · Orchestration*).

   Mix-and-match is fine — same row supports 2, 3, or 4 boxes via `flex:1 1 0`. **Canonical box hover (`.snapbox:hover`):** top-down green-tinted gradient (11% → 3.5% → white) + inset top glow (rgba(59,175,90,.38)) + lifted ring shadow + `translateY(-4px) scale(1.08)` + `z-index:10`. Reads as a soft "spotlight from above" with a clear zoom that says *this is the one I'm pointing at*. This is the iFacto-deck box hover convention — reproduce it whenever you build a new white-card pattern (see `.tc-pillar`, `.mcp-box` for in-deck reproductions).

   **Chip variant (`.chip` / `.chip.green`):** the same spotlight hover scaled to a chip — `translateY(-2px) scale(1.12)` + `position:relative; z-index:10`, smaller inset glow, thinner ring. Two variants in the template: `.chip` (neutral white) and `.chip.green` (already-green-tinted). Both auto-darken to a dark-theme variant under `.slide.dark`. Reproduced in the deck as `.mcp-chip` (neutral) and `.kn-chip` / `.cr-chip` / `.doc-chip` (green). Use chips for label rows, MCP/tool inventories, rule lists — anything pill-shaped that benefits from "this is a labeled thing the audience can focus on."

   **Hover-zoom scale ladder (consistent across the deck):**
   - Chips: `scale(1.12)` — small elements, can zoom more without breaking
   - Boxes: `scale(1.08)` — visible focus pop without disrupting the row
   - Planks: `scale(2)` — full feature-detail zoom (used on the bridge deck only)

   The smaller items zoom more (proportionally) than the larger ones; the planks go full 2× because the bridge deck has room and the audience needs to actually *read* the plank up close.

8. **Bridge stage on dark** *(slide 7 in the template)* — *"X (over here) is delivered, via Z, to Y (over there)"*. Three columns:
   - **Left bank** (`.bs-bank.l`): stacked `.bs-tile` chips — the source / what's accumulated centrally. Subtle green left-accent on each tile. Followed by a `.bs-bank-label` (small caps).
   - **Bridge** (`.bs-bridge`): two glowing green `.pillar`s flanking a green `.bs-deck`. A faint SVG `.cable` arcs across the top in a catenary curve. Deck has a breathing afterglow underneath that pulses every 4.5s.
   - **Right bank** (`.bs-bank.r`): a VS Code-style `.bs-window` (red/yellow/green dots in the chrome bar) framing a single short headline (`.bs-window-headline`) — the destination. Swap the inner content if "developer machine" isn't the right metaphor.

   **The deck has two states:**
   - **Hero state (default):** 64px-tall deck, one big label centred (`.bs-deck-label`). This is the visual claim — *"the bridge is X"*.
   - **Unfolded state (after Next-click):** the deck expands to 140px, the label fades, and N labelled `.bs-plank` cells drop into place across the deck with a ~70ms per-plank stagger. Each plank has a numbered green badge, a 1-2 word label, and a tiny caption. Up to 8 planks comfortably; tighter than that wraps awkwardly.

   The transition between states is driven by adding `.shown` to the `.bs-deck-planks.step` element — handled automatically by the template's step-nav JS (Next-click / Right-arrow / Space). The deck expand and label fade are CSS-only via `:has()` selectors. Use when the audience needs to absorb the metaphor *before* the detail.

   **Plank hover (`.bs-plank:hover`):** zooms the whole plank ~2× and floats it above its neighbours (`z-index: 20`), with a fully-opaque dark-green spotlight skin so the bridge underneath doesn't bleed through. Per-cell `transform-origin` anchors edge planks (1st and last) so they scale inward rather than off the bridge edge. Use this when the audience benefits from "lean in and read this one feature" — works well in live demos where Waldo is hovering each plank as he narrates.

Slides alternate dark / light / dark / alt-grey / dark / dark — that rhythm matters. Don't put three light slides in a row.

## Step reveal — sequential click-to-show inside a slide

The template's nav JS supports in-slide step reveals (added 2026-05-15). Add class `step` to any element you want hidden by default and revealed by the next Next-click / Right-arrow / Space:

```html
<p class="step">This appears on the first click.</p>
<p class="step">This on the second click.</p>
```

When `.shown` is added to a `.step`, the global `.step.shown` rule plays a fade-up reveal. Override the global reveal for custom animations — see the bridge-stage planks in `template.html` for an example using `:has()` to trigger CSS-only reactions in sibling elements (deck expanding, label fading).

Steps are automatically reset when the slide changes (back-and-forth restarts the sequence). Combine `step` with `typed` for typewriter-style click reveals — see the `.step.typed` pattern in the working session deck.

## Animations to keep

These are all in the template and they're cheap. Don't strip them — they're what makes the deck feel "alive" rather than static.

- Slide entry: stagger-reveal (each `.reveal` element fades up 120ms after the previous).
- Hero: floating blur orbs (`.glow1/2/3`), speed lines streaking horizontally.
- Logo ring: slow rotation.
- Cards: hover lift + green corner glow.
- Flow path: animated dashed stroke.
- Live flow step: pulsing green halo.
- Closing panel: two breathing radial glows.
- Snap-in boxes: pop with overshoot (0.85 → 1.05 → 1.0), 120ms stagger. Dominant element (eyebrow or name) flashes light-green with a soft halo 220ms after each box settles.
- Page-dot indicator: active dot stretches into a green pill.

## Things the user pushed back on — don't repeat

- The colour is **green**, not orange. Easy to get wrong if you guess from "Belgian B2B brand."
- The font is **Poppins** at **weight 300** for headlines. Inter / Space Grotesk / heavy weights are wrong.
- H1 cap is **110px**. They've corrected this twice.
- The hero needs an actual visual, not a flat gradient. The animated orbs + speed lines are the minimum viable substitute when there's no real photo. If the user has a real motion-blur photo to drop in, swap it onto `.hero-bg`.
- Top-bar text, button text, body text needed to be sized substantially larger than typical web defaults. Current values in the template are calibrated; don't shrink them.
- **Default deck language is English.** The bundled `template.html` uses Dutch demo content because the iFacto.be live site is Dutch — that's brand demo, not a language preference. When building a real deck, translate all copy to English unless the user explicitly requests Dutch. The closing pattern translates as **"Questions. Push-back. Ideas."** ("Push-back" stays the green word). Don't ship a half-translated deck (e.g. English bullets with a Dutch open-questions callout).
- **No dead links in delivered decks.** The `template.html` uses `href="#"` to *demonstrate* the button and arrow-link patterns — that's fine for the template. But when generating a real deck for the user, every `<a href="#">` must either be filled in with a real URL or the element removed. The user pushed back hard on placeholder "Meer over deze sessie" arrows that go nowhere. Do a final sweep for `href="#"` before delivery and ask for real URLs (or strip) rather than shipping placeholders.
- **Hero content must use the slide's real estate.** The template's `.hero-content` originally had `max-width:60ch;padding-left:4vw` which made the title and lead feel cramped against the left edge. Then `padding-right:32vw` (reserving a third of the slide for the orb glow) was still too narrow — at H1 cap (110px), longer headlines like "for Business Central." couldn't fit on one line. Current value is `max-width:none;padding-left:0;padding-right:10vw` — gives the headline ~74vw to breathe. The orb glow at `right:-15vw` is wide and blurred enough to still register behind the headline; don't reintroduce a fat right reserve to "protect" it. When applying the hero pattern to a new deck, use these wider settings.

## Output

Save to the user's workspace folder (e.g. the project folder where they're working). Use `computer://` link in the response so they can open it directly. Don't put the deliverable in this skill folder.

## Reference

- Live site: https://www.ifacto.be — fetch with browser tools and inspect computed styles if you need to verify a token.
- Project context lives in the user's auto-memory under `ifacto_session_*` files — read those for the specific session this deck supports.
