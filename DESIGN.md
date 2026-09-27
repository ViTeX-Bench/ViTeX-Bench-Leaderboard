---
name: ViTeX-Bench Leaderboard
description: Methods as stars in one black-and-white three-dimensional space of correctness, temporal quality and locality, with one lavender accent for the Pareto front.
colors:
  field-space: "#050505"
  field-space-raised: "#0F0F0F"
  field-starlight: "#F4F4F4"
  field-starlight-dim: "#A8A8A8"
  field-starlight-faint: "#7E7E7E"
  field-hairline: "rgba(255, 255, 255, 0.1)"
  field-hairline-strong: "rgba(255, 255, 255, 0.22)"
  field-wash-hover: "rgba(255, 255, 255, 0.045)"
  field-wash-selected: "rgba(255, 255, 255, 0.075)"
  field-accent: "#A99DF6"
  field-accent-ink: "#0E0A24"
  field-accent-soft: "rgba(169, 157, 246, 0.14)"
  desk-paper: "#E8E8E8"
  desk-paper-raised: "#F0F0F0"
  desk-ink: "#161616"
  desk-ink-dim: "#404040"
  desk-ink-faint: "#5C5C5C"
  desk-hairline: "rgba(0, 0, 0, 0.1)"
  desk-hairline-strong: "rgba(0, 0, 0, 0.22)"
  desk-wash-hover: "rgba(0, 0, 0, 0.035)"
  desk-wash-selected: "rgba(0, 0, 0, 0.06)"
  desk-accent: "#5242C2"
  desk-accent-ink: "#FFFFFF"
  desk-accent-soft: "rgba(82, 66, 194, 0.1)"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3rem)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1
  figure:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.2
    fontFeature: "tnum"
  metric-key:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.2
  metric-key-compact:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.3
  badge:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.01em"
  ideal-label:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1
rounded:
  hairline-box: "4px"
  pre: "10px"
  card: "12px"
  group-grid: "20px"
  group: "22px"
  pill: "999px"
spacing:
  control-inset: "4px"
  tight: "8px"
  item: "14px"
  table-inset: "20px"
  cell: "24px"
  column: "32px"
  gutter: "clamp(20px, 5vw, 56px)"
  section: "clamp(88px, 12vw, 152px)"
  max-width: "1200px"
  header-height: "60px"
components:
  button-primary:
    backgroundColor: "{colors.field-starlight}"
    textColor: "{colors.field-space}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "46px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.field-starlight}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "46px"
  button-small:
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "36px"
  segment:
    backgroundColor: "transparent"
    textColor: "{colors.field-starlight-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "9px 14px"
  segment-active:
    backgroundColor: "{colors.field-starlight}"
    textColor: "{colors.field-space}"
    rounded: "{rounded.pill}"
  view-switch:
    rounded: "{rounded.group}"
    padding: "4px"
  metric-tabs:
    rounded: "{rounded.pill}"
    padding: "4px"
  metric-tabs-compact:
    rounded: "{rounded.group-grid}"
    padding: "4px"
  sort-select:
    backgroundColor: "{colors.field-space}"
    textColor: "{colors.field-starlight}"
    rounded: "{rounded.pill}"
    padding: "0 36px 0 14px"
    height: "38px"
  order-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.field-starlight-dim}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "38px"
  front-pill:
    backgroundColor: "{colors.field-accent}"
    textColor: "{colors.field-accent-ink}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "4px 10px 4px 7px"
  metric-chip:
    backgroundColor: "transparent"
    textColor: "{colors.field-starlight-dim}"
    typography: "{typography.metric-key}"
    rounded: "{rounded.pill}"
    padding: "7px 10px"
  metric-chip-primary:
    backgroundColor: "{colors.field-accent-soft}"
    textColor: "{colors.field-accent}"
    rounded: "{rounded.pill}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.field-starlight-dim}"
    rounded: "{rounded.pill}"
    size: "36px"
  selection-card:
    backgroundColor: "{colors.field-space-raised}"
    textColor: "{colors.field-starlight}"
    rounded: "{rounded.card}"
    padding: "18px 20px 16px"
    width: "300px"
  table-row:
    backgroundColor: "transparent"
    textColor: "{colors.field-starlight}"
    typography: "{typography.figure}"
    height: "60px"
    padding: "0 14px"
  table-row-hover:
    backgroundColor: "{colors.field-wash-hover}"
  compact-item:
    backgroundColor: "transparent"
    textColor: "{colors.field-starlight}"
    padding: "14px 12px 6px"
---

# Design System: ViTeX-Bench Leaderboard

## Overview

**Creative North Star: "Stars in a Dark Universe"**

Every method is a point of light in one three-dimensional space whose axes are text correctness, temporal quality and edit locality. The page is built around that space. It fills the first viewport. The type, rules and controls that surround it stay quiet, so the light points carry the meaning. The world is black and white with one hue: the lavender accent it shares with the project page, reserved for the Pareto front and a few interaction details. It has two lightings of the same object: **Field** (the dark default) is near-black space with white stars, the front in pale lavender, and a soft glow reserved for the Pareto front and the ideal corner. **Desk** (light) is paper with ink points, the front in deep lavender, and no glow. Neither lighting draws anything outside the cube except the axes, their labels and the ideal star.

Density is low and airy. Each screen holds little text, and structure comes from hairlines and whitespace rather than panels. One legible sans family carries every word, with thin weights for display. Its mono sibling carries every figure and metric key. Status and hierarchy are encoded by symbol shape, weight and opacity. The accent adds front membership on top of its own ring-and-core symbol and never stands in for it.

**Key Characteristics:**
- A black-and-white base in both themes plus one shared lavender accent for the Pareto front and a few interaction details; everything else is tuned by foreground opacity alone.
- A rotatable 3-D star space as the signature, with animated camera moves to three orthographic face views. The Pareto front is a faint lavender triangulated surface in it, and the ideal corner is its brightest (foreground) star.
- Hairline structure (1px at 9–22% foreground) instead of filled surfaces.
- Atkinson Hyperlegible Next for words, Atkinson Hyperlegible Mono for numbers.
- Pill-shaped controls that stay neutral; the active control inverts to solid foreground.

## Colors

Two lightings of one black-and-white object, plus one lavender accent shared with the project page. Each theme uses a single foreground and steps down from it with fixed tints and alpha, and it tunes the accent separately for its background. The Field values are the `:root` default. The Desk values apply under `[data-theme="light"]` or `prefers-color-scheme: light`.

### Primary
- **Pale Lavender / Deep Lavender** (`field-accent` / `desk-accent`): the only hue, taken from the ViTeX logo and shared with the project page. It marks the Pareto front everywhere it appears: front stars, their glow and the front mesh on the canvas, the front symbol in the legend, table and selection card, the "Pareto front" pill, the front divider titles, the leaders-strip "Pareto front" label and the front-row tint. It also appears in four interaction details: text selection, link-hover underlines, the ghost-button hover border and the protocol's primary-metric chips. Against the background it reaches 8.6:1 in Field and 5.9:1 in Desk.
- **Accent Ink** (`field-accent-ink` / `desk-accent-ink`): text and symbol colour on a solid accent fill (the front pill, selected text). It is near-black violet in Field and white in Desk, at 8.1:1 and 7.2:1.
- **Accent Soft** (`field-accent-soft` / `desk-accent-soft`): the translucent accent fill behind primary-metric chips.

### Neutral
- **Starlight / Ink** (`field-starlight` / `desk-ink`): the foreground. It is used for body text, the ideal star, the active segment, the primary button fill, the checked checkbox and the focus outline. Controls take emphasis from inversion (a solid pill) or weight, never from the accent.
- **Deep Space / Paper** (`field-space` / `desk-paper`): the page and stage background. The Desk paper is a soft neutral grey, not white, so the light theme never glares. It is also used as the halo behind canvas labels and as the ring cut around track markers.
- **Raised Space / Light Sheet** (`field-space-raised` / `desk-paper-raised`): the selection card, mixed at 88% under a blur. This is the one raised surface.
- **Dim Starlight / Grey Ink** (`field-starlight-dim` / `desk-ink-dim`): secondary copy, nav links, inactive segments, metric keys and chips.
- **Faint Starlight / Faint Ink** (`field-starlight-faint` / `desk-ink-faint`): tertiary metadata, ranks, sort headers at rest, axis ticks, label leaders, unranked rows. It meets AA against its own background in both themes.
- **Hairline** (`*-hairline`): row rules, column dividers, section borders, and the chip border at rest.
- **Strong Hairline** (`*-hairline-strong`): table top rule, ghost-button and icon-button borders, card border, track lines.
- **Hover / Selected wash** (`*-wash-hover`, `*-wash-selected`): row hover, open-row background and sorted-column tint.
- **Front tint** (accent mixed at 6%, 11% on hover or open): the resting background of Pareto-front rows and compact entries. It is a mix, not a new token.

### Named Rules
**The One Accent Rule.** The only hue is the shared lavender accent, with its ink and soft fill. It marks the Pareto front and the listed interaction details (selection, link-hover underline, ghost-button hover border, primary-metric chips), and nothing else. It never encodes another category, a rank, good or bad values, or a method family. Controls (segmented tabs, view switch, primary button, checkbox) stay neutral, exactly as on the project page. Every other tone is the theme's foreground or background or an alpha mix of the two. A blue link, a red worst value or a coloured method family breaks the world.

**The Glow Belongs to Field Rule.** Radial glow renders only when `--glow` is 1 (dark): an accent glow around Pareto stars and a foreground glow around the ideal corner. Desk shows the same stars, mesh and ideal star flat, with no glow. There is no background star field in either theme.

## Typography

**Display Font:** Atkinson Hyperlegible Next (with ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif), self-hosted variable woff2, weights 200–800
**Body Font:** Atkinson Hyperlegible Next
**Label/Mono Font:** Atkinson Hyperlegible Mono (with ui-monospace, SF Mono, Menlo, Consolas, monospace), self-hosted variable woff2

**Character:** One humanist sans chosen for letter distinction, set thin and large for headings and plain for reading. Its mono sibling gives every figure and metric key a steady tabular rhythm.

### Hierarchy
- **Display** (300, `clamp(2rem, 3.6vw, 3rem)`, 1.08): the single page title over the star space. It is balanced to wrap onto two lines.
- **Headline** (300, `clamp(1.9rem, 3.2vw, 2.6rem)`, 1.1): section titles (Leaderboard, How it is scored, Submit a result).
- **Title** (500, 19–20px): selection-card name, protocol axis names and expanded-row method name. Axis-leader names use 400 at 20px.
- **Body** (400, 16px, 1.6): running copy. Section intros are capped at 620px, and notes at 54ch.
- **Label** (500, 13px): segments, tabs, buttons, legend, canvas axis names, canvas star names (500, 12.5px; 11.5px on small canvases). The sort select and order toggle use 500 at 13.5px. Canvas names are always the full method name ("ViTeX-Edit-14B (Composite)", "Source video"), never an abbreviation, and view buttons carry full axis names ("Correctness × Temporal").
- **Ideal label** (500, 13.5px; 12px on small canvases): the single word "Ideal" beside the ideal star, at 95% foreground on a background halo.
- **Badge** (500, 11.5px, +0.01em; 11px inside the table's meta line): the accent "Pareto front" pill.
- **Figure** (mono 400, 15px, tabular numerals): every score. The best value in a column goes to 600, and the selection-card values use 500 at 14px.
- **Metric key** (mono 400, 13px): SeqAcc, Warp<sub>c</sub> and the other metric keys in sort headers, chips, card rows and axis captions. Subscripts are set at 0.72–0.75em. In table headers the key stacks above its direction arrow.
- **Compact metric key** (mono 400, 11.5px, 1.3): the metric labels in the compact list's 3-column grid, above 15px figures.

### Named Rules
**The Words Sans, Numbers Mono Rule.** Every numeral that is a measurement or a rank is set in the mono with tabular figures. Every word is set in the sans. Do not use a third family, a script or an italic display face.

**The Thin Display Rule.** Headings are weight 300 with −0.02em tracking. Emphasis in running text is weight 500 in the foreground colour, never italic.

## Layout

The content column is 1200px wide, with a fluid gutter of `clamp(20px, 5vw, 56px)` and a sticky 60px header. The first viewport is a full-bleed stage, `clamp(600px, 100svh − 60px, 960px)` tall. The canvas fills it. The title block (max 380px) sits top-left on the column edge, the view switch bottom-left with a hint line above it, and the legend bottom-right. Below the stage, a four-column strip of axis leaders sits between hairlines: three axes plus the Pareto front. Sections open with `clamp(88px, 12vw, 152px)` of top space, and the footer with `clamp(96px, 13vw, 168px)`. Columns inside sections (protocol axes, submit steps, leaders) are equal grids separated by vertical hairlines or top rules, with 24–32px spacing.

The leaderboard shows one metric group at a time (Primary metrics, Text correctness, Temporal quality, Edit locality), so the table always fits its column: 20px side insets on the first and last cells, no sticky columns and no sideways scrolling at any width. Controls sit above it in one row: metric-group tabs on the left; sort select, order toggle and references checkbox on the right.

Breakpoints: at 1000px the leaders go to 2×2 and the expanded row stacks. At 960px the table is replaced by the compact list, the controls stack, and the metric-group tabs become a 2-column grid. At 860px the stage goes into document flow: canvas `clamp(340px, 54svh, 520px)`, then the view switch, note, legend and card stack beneath it, and the protocol, notes and steps collapse to one column. At 600px the view switch becomes a full-width 2-column grid, the leaders go to one column, and the nav keeps only the Submit link.

## Elevation & Depth

The page is flat, with no box shadows. Depth belongs to the canvas alone: perspective projection, depth-scaled star opacity (0.55–1), back walls with tick gridlines at 8% foreground, a cube outline at 13% and axis edges at 22%. Chrome that floats over the stage (header, view switch, selection card) uses translucent background mixes (70–88%) with a 6–12px backdrop blur and a hairline border. It does not cast a shadow. The one `box-shadow` in the system is a 3px background-colour ring that cuts the vector-track marker out of its line. It works as a knockout, not as elevation.

### Named Rules
**The Light Is the Depth Rule.** On a page surface, elevation is expressed by translucency plus a hairline, never by a cast shadow. In the space, depth is expressed by opacity and perspective.

## Shapes

The form language is the circle and the hairline. Stars, legend symbols, track markers, the icon button and the card close button are all circles. Every interactive control (segments, tabs, buttons, the sort select, the order toggle, metric chips, link pills) and the "Pareto front" badge is a full pill (999px). A control group that can wrap onto more than one line cannot stay a pill: the view switch track is 22px, and when the view switch or the metric-group tabs become a 2-column grid their track is 20px, while the items inside stay pills. The selection card is the only rounded rectangle at 12px, and the citation block uses 10px. Checkboxes, inline code and the skip link use 4px. Borders are always 1px. The focus outline is 1.5px solid foreground at a 3px offset.

## Components

### Buttons
Solid or outlined pills, calm and direct.
- **Shape:** full pill (999px), 46px tall; the small size is 36px.
- **Primary:** foreground fill with background-colour text, 500 weight at 14.5px, 22px side padding. Hover lowers opacity to 0.86.
- **Ghost:** transparent with a strong-hairline border. On hover the border moves to the accent.
- **Link pills (expanded row):** 13px label, strong-hairline border, 8px × 12px padding, with a 13px stroke icon.
- **Text link button:** foreground 500 at 13px with no border, underlined on hover.

### Segmented switches (view switch, metric-group tabs)
- **Style:** a 4px-inset track with a hairline border and 4px gaps. The metric-group tabs are a pill track (items 9px × 16px). The view switch sits on a 70% background mix with 6px blur and uses a 22px track so it can wrap. On narrow screens both become 2-column grids with a 20px track (tabs at ≤960px, views at ≤600px).
- **Labels:** full words only: "3D", "Correctness × Temporal", "Correctness × Locality", "Temporal × Locality"; "Primary metrics", "Text correctness", "Temporal quality", "Edit locality".
- **State:** inactive items are dim text; hover brings them to foreground. The active item (`aria-pressed` / `aria-checked`) inverts to a solid foreground pill.

### Sort select and order toggle
- **Sort select:** a "Sort by" dim label beside a 38px pill select, background fill, strong-hairline border, 500 13.5px foreground text and a faint chevron. Options are "Pareto front", Method, then metrics grouped by axis. Hover moves the border to faint.
- **Order toggle:** a 38px outlined pill with a stroke icon, reading "Best first" / "Worst first" ("A–Z" / "Z–A" for Method). It is hidden while sorting by Pareto front, which has no direction.
- Header clicks sort too and keep select and toggle in step.

### Chips
- **Style:** mono 13px metric keys, 7px × 10px, with a hairline pill border in dim text.
- **Primary metric:** accent border and accent text on the accent-soft fill. The border carries the status as well, so it reads without colour.

### Cards / Containers
- **Selection card:** 300px wide, 12px radius, raised background at 88% with 10px blur, strong-hairline border, padding 18/20/16px. It enters over 360ms with a 6px rise. Inside are a name row with the star's own symbol, a meta line, a three-column mono grid of key / value / rank, and a hairline-topped footer.
- There are no other cards. Sections are separated by hairlines, not boxes.

### Table
- **Default order:** by Pareto front layer (non-dominated sorting on the three primary metrics), random within a layer on each visit. The first column reads "Front" and shows the layer number.
- **Divider rows:** 13px faint text, 48px tall, set at the bottom: "Pareto front · unbeaten on all three primary metrics, in random order" (accent, 500), "Front 2", "Front 3", "Not compared · temporal scores not comparable", "References · not ranked".
- **Front rows:** a faint 6% accent tint (11% on hover or open), the accent front symbol, and the accent "Pareto front" pill in the meta line under the method name.
- **Rows:** 60px tall with hairline bottoms and right-aligned mono figures; 20px insets at both ends. The sorted column gets the hover wash, and the row hover or open state gets the same wash.
- **Headers:** mono sort buttons in faint text; metric headers stack the key above the direction arrow and caret. They turn foreground when hovered or sorted. The caret slot is always reserved so nothing shifts.
- **Unranked rows:** faint text, grouped under their divider, drawn with the hollow-ring symbol.
- **Expanded row:** a full-width wash panel with the method identity on the left and a three-column vector. Each metric has a hairline track, with other methods as 4px faint dots and this method as an 8px foreground dot.

### Compact list (≤960px)
- One entry per method with hairline bottoms, under the same divider titles. The head row holds the faint mono rank, the star symbol, the 500 15.5px name, the front pill and a faint chevron that rotates 90° when open.
- Below it, a 3-column grid of the current metric group: compact metric keys (mono 11.5px, faint; foreground when sorted) over 15px mono figures, best at 600. Opening an entry shows the full vector beneath.
- Front entries carry the same 6% accent tint as front rows, and the "Pareto front" divider title is in the accent.

### Front pill
- An accent pill (accent fill, accent-ink text and symbol) reading "Pareto front", badge type, 4px × 10px × 4px × 7px, with an 11px ring-and-core symbol. It marks front membership only; it is never a rank or a "#1".

### Navigation
- **Header:** sticky, 60px, background mixed at 82% with 12px blur and a bottom hairline. The wordmark is 600 with a 400 faint "Leaderboard" suffix. Links are 14px dim and turn foreground on hover. After the section nav, a hairline-separated "Project page ↗" link (14px dim, 14px arrow icon) leads to the project page, mirroring that page's "Leaderboard ↗" link. The theme toggle is a 36px circular icon button. Below 600px the nav keeps only Submit plus the Project page link, and the wordmark suffix drops.

### Star Space (signature)
The system is a hand-drawn canvas projection of the three primary metrics into a unit cube. Nothing is drawn outside the cube except the axes, their labels and the ideal star. It has three star symbols:
- **Pareto front:** an accent 4.4px core at depth opacity + 0.15 (capped at 1), an accent 8.5px ring at 0.6 × depth opacity, and a 20px accent radial glow (45%) in Field only. The legend, table and selection card use the same accent ring-and-core.
- **Editor:** a small filled foreground point at 62%.
- **Reference or unranked:** a 4.2px hollow ring.

**Ideal corner** (1, 1, 1): the largest, brightest star, always in the foreground colour, never the accent. In Field it has a 70px radial glow (46px on small canvases); in both themes it has four gradient diffraction spikes (horizontal and vertical at 30px half-length and 1.4px, diagonals at 45% of that and 1px), a solid 5.5px core, an 11px ring at 50%, and the label "Ideal".

**Pareto front mesh:** the front's stars are joined by a Delaunay triangulation computed in the plane facing the ideal diagonal, drawn back to front in 3-D. Faces are faint accent fills (12% Field, 10% Desk) and edges are 1px accent hairlines (60% Field, 70% Desk). Two front members are joined by a single accent hairline at 60%.

A focused star gains a 13px ring and, in 3-D, a dashed drop line to the floor. Names are set in 500 sans on a background-colour halo, placed to avoid collisions. In 3-D only the front and the focused star are named; in a face view every ranked star is. Front and focused names that cannot sit beside their star move out on a faint 1px leader line. Dragging rotates the space. The view switch animates yaw, pitch, perspective and zoom over 1100ms with a cubic in-out ease into orthographic face views (C×T, C×L, T×L). At rest the 3-D view drifts slowly. Reduced motion jumps instantly and does not drift.

**The Front Is a Surface Rule.** The Pareto front is never drawn as a 2-D frontier line or staircase. In 3-D it is the triangulated mesh; the mesh's opacity follows the camera's perspective, so it fades out during the move into a face view and is absent there, where a projected surface would read as a 2-D frontier.

## Do's and Don'ts

### Do:
- **Do** derive every neutral tone from the theme's foreground and background, and step down through the dim, faint and hairline tokens. Take the one hue only from the accent tokens of the current theme.
- **Do** set every measurement and rank in Atkinson Hyperlegible Mono with tabular numerals.
- **Do** keep all three primary axes together in the one rotatable space. Face views are projections of that space, and their note must say that the Pareto front is judged in three dimensions.
- **Do** mark status by symbol shape (ring-and-core, point, hollow ring, spiked ideal star), by the front pill and by weight, so it survives without colour. The accent reinforces front membership and never replaces the symbol.
- **Do** order the leaderboard by Pareto front layer by default, random within a layer, and name methods and axes in full.
- **Do** invert the active control to a solid foreground pill, and keep every control (tabs, view switch, primary button, checkbox) neutral, as on the project page.
- **Do** keep glow to the dark Field theme.
- **Do** show one metric group at a time so the table never scrolls sideways; below 960px switch to the compact list.

### Don't:
- **Don't** introduce any hue beyond the shared lavender accent, and don't use the accent for anything but the Pareto front and the listed interaction details: no accent ranks, good or bad values, method families or categories, and no blue links, red worst values or coloured scales.
- **Don't** draw the Pareto front as a 2-D frontier line or staircase in any view; the mesh exists only in 3-D and fades out in face views.
- **Don't** draw a background star field or anything else outside the cube besides the axes, labels and ideal star.
- **Don't** use script, handwritten or italic display faces, or a second sans.
- **Don't** give page surfaces cast shadows or filled panels. Use a hairline and whitespace.
- **Don't** add an aggregate score, an overall rank or an overall #1 treatment anywhere in the visual hierarchy. Front layers are ties, not ranks.
