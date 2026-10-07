---
name: Brandon Fricker, PhD
description: A behavior map. Scattered points settle into four labeled regions of work, all drawn from one magma colormap.
colors:
  magma-0-plum-black: "#0D0716"
  magma-1: "#1C1044"
  magma-2: "#3B0F70"
  magma-3-deep-violet: "#641A80"
  magma-4-orchid: "#8C2981"
  magma-5-raspberry: "#B73779"
  magma-6-coral-rose: "#DE4968"
  magma-7: "#F7705C"
  magma-8-apricot: "#FE9F6D"
  magma-9-peach-cream: "#FECF92"
  magma-10-pale-yellow: "#FCFDBF"
  cluster-c1: "#FECF92"
  cluster-c2: "#FE9F6D"
  cluster-c3: "#DE4968"
  cluster-c4: "#B73779"
  field: "#0D0716"
  field-2: "#160C25"
  field-ink: "#F6EFF4"
  field-ink-2: "#D8C9DD"
  field-muted: "#A898B1"
  field-rule: "rgba(252, 253, 191, .14)"
  ground: "#FAF9FB"
  ground-2: "#F2EFF5"
  ink: "#1A1024"
  ink-2: "#44384F"
  muted: "#675B71"
  rule: "#E2DDE8"
  rule-strong: "#C9C0D3"
  ground-dark: "#0D0716"
  ground-2-dark: "#150B22"
  ink-dark: "#F4EEF6"
  ink-2-dark: "#D9CCE0"
  muted-dark: "#AC9DB6"
  rule-dark: "#2A1E37"
  rule-strong-dark: "#43334F"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-.03em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.65rem, 3.1vw, 2.45rem)"
    fontWeight: 760
    lineHeight: 1.12
    letterSpacing: "-.02em"
    fontVariation: "'wdth' 106"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 680
    lineHeight: 1.35
    letterSpacing: "-.005em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: ".7rem"
    fontWeight: 620
    lineHeight: 1.4
    letterSpacing: ".1em"
    fontVariation: "'wdth' 118"
  region-name:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: ".74rem"
    fontWeight: 650
    letterSpacing: ".16em"
    fontVariation: "'wdth' 125"
  mono-id:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: ".74rem"
    fontWeight: 500
    letterSpacing: ".04em"
    fontVariation: "'wdth' 75"
rounded:
  r: "2px"
  dot: "50%"
spacing:
  gutter: "clamp(20px, 4vw, 40px)"
  wrap: "1180px"
  band-block: "clamp(64px, 9vw, 112px)"
  head-gap: "clamp(32px, 5vw, 52px)"
  row-block: "22px"
  region-block: "34px"
components:
  button-primary:
    backgroundColor: "{colors.magma-8-apricot}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r}"
    padding: ".6em 1.15em"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.magma-9-peach-cream}"
    textColor: "{colors.ink}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.r}"
    padding: ".6em 1.15em"
    height: "44px"
  button-header:
    backgroundColor: "{colors.magma-8-apricot}"
    textColor: "{colors.magma-0-plum-black}"
    rounded: "{rounded.r}"
    padding: ".45em .95em"
    height: "38px"
  cluster-key:
    textColor: "{colors.ink-2}"
    typography: "{typography.body}"
    rounded: "{rounded.r}"
  pub-flag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.r}"
    padding: "2px 7px"
  segmented-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    padding: "9px 16px"
    height: "40px"
  segmented-off:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    padding: "9px 16px"
    height: "40px"
  legend-panel:
    backgroundColor: "rgba(13, 7, 22, .9)"
    textColor: "{colors.field-ink}"
    rounded: "{rounded.r}"
    padding: "28px 30px 26px"
  nav-header:
    backgroundColor: "{colors.field}"
    textColor: "{colors.field-ink-2}"
    height: "64px"
---

# Design System: Brandon Fricker, PhD

## Overview

**Creative North Star: "The Behavior Map"**

The site reads like a behavior-space density map. A dark field of smooth magma heat, thin contour lines and a dust of points sits at the top of every page; the work is organized into four labeled regions (C1 Model the data, C2 Build the tool, C3 Design the study, C4 Test the cause), and that one cluster-ID labeling system tags every project and paper. On the home page the points start as uniform noise and settle into the clusters once; under reduced motion the settled map draws at once. Hovering or focusing a key lights its region and every item tagged with it across the page (linked brushing).

Below the field, reading happens on cool plot-paper white, or on the field's own black in the dark theme. Structure comes from hairline rules and grid rows, not containers: lists of regions, works, papers and timeline entries are ruled rows. Figures are numbered and captioned ("Fig. 1", "Fig. 2") the way a paper's are, and every chart is an original drawing or a design schematic.

The density is calm: generous band padding, one idea per band, short ruled rows. The world refuses the portfolio template (name hero beside a portrait, stats strip, icon-card grid, chip clouds, kickers) and the faculty CV.

**Key Characteristics:**
- One colormap (magma) supplies every color, including the four cluster colors.
- A dark map field anchors every page top (map hero on home, point-cloud page head inside) and the closing band and footer.
- Archivo variable width for all reading text; Martian Mono only for IDs, axes, DOIs, years and counts.
- Square 2px corners, hairline rules, no elevation.
- Cluster keys (colored dot plus ID and name) are the single labeling system site-wide, and they drive linked brushing.

## Colors

Every color is sampled from the magma colormap, from plum-black through violet, rose and apricot to pale yellow; neutrals are magma-tinted, never gray.

### Primary
- **Apricot** (magma 8): the action color. Primary buttons ("Email me", header "Contact"), the active nav underline, and dark-theme links.
- **Orchid** (magma 4): light-theme links and the focus ring; Deep Violet (magma 3) is its hover.

### Secondary
- **Cluster colors** C1 Peach Cream (magma 9), C2 Apricot (magma 8), C3 Coral Rose (magma 6), C4 Raspberry (magma 5): used only as the dot of a cluster key, the evidence bullets of a region, the brushing underline, and the lit points of the page-head cloud. Defined once in `_data/clusters.yml` and mirrored in CSS.
- **Coral Rose** (magma 6) also marks the subject and arrows in experiment schematics.

### Tertiary
- **Peach Cream** (magma 9) is the highlight on the field: the legend role line, the hover state of primary buttons, the copied state, selection background, and dark-theme focus.

### Neutral
- **Field** (plum-black, magma 0) and **Field 2**: the map field, page heads, header, closing band and footer, dark in both themes. Field Ink, Field Ink 2 and Field Muted are its text tiers; Field Rule is pale yellow at 14% alpha.
- **Ground** (cool plot-paper white) and **Ground 2** (tinted band): light-theme reading surfaces. In dark theme Ground becomes the field's black.
- **Ink / Ink 2 / Muted**: heading, body and meta text tiers on Ground.
- **Rule / Rule Strong**: hairlines between rows, and frames for figures, screenshots and segmented controls.

### Named Rules
**The One Colormap Rule.** No color enters the system that is not a magma sample or a magma-tinted neutral. A new accent is a new magma stop, not a new hue.

**The Cluster Color Is a Key Rule.** Cluster colors only identify a region (dots, bullets, underlines, lit points). They never fill buttons, backgrounds or text.

**The Field Is Always Dark Rule.** The map field, page heads, closing band and footer use the Field tokens in both themes; only reading surfaces switch.

## Typography

**Display Font:** Archivo (variable width and weight; with ui-sans-serif, system-ui)
**Body Font:** Archivo
**Label/Mono Font:** Martian Mono (at width 75; with ui-monospace, Menlo)

**Character:** One grotesque stretched across its width axis does all the speaking: expanded and heavy for display, normal for reading, expanded tracked caps for small labels like a cartographer's. Condensed Martian Mono marks only machine-like values.

### Hierarchy
- **Display** (800, width 112, clamp(2.5rem, 6vw, 4.6rem), 1.02, -.03em): the page h1, in the legend panel and page heads.
- **Headline** (760, width 106, clamp(1.65rem, 3.1vw, 2.45rem), 1.12): band headings; the closing band uses a larger clamp up to 3.4rem.
- **Title** (680 to 740, width up to 108, 1.15rem to 1.7rem): region names, project and paper titles.
- **Body** (400, 17px, 1.6): reading text, max 60 to 72ch; ledes at 1.06 to 1.12rem.
- **Label caps** (620 to 650, width 118 to 125, .66 to .74rem, tracked .1 to .16em, uppercase): map region names, readout row labels, publication flags.
- **Mono** (500, width 75, about .72 to .76rem, tracked .02 to .06em): cluster IDs (C1 to C4), axis labels, DOIs, publication years, timeline dates, figure numbers, the email address.

### Named Rules
**The Mono Is For Values Rule.** Martian Mono sets only IDs, axes, DOIs, years, dates, counts and figure numbers. Cluster names, flags, readout labels and all prose are Archivo.

**The Meta Below Rule.** No kicker or eyebrow above a heading. Meta lines (version, status, role) sit directly below the heading they describe.

## Layout

A single centered column (1180px max) with a fluid gutter (clamp(20px, 4vw, 40px)) inside full-bleed bands. Bands are separated by a hairline and padded clamp(64px, 9vw, 112px); a band head pairs a heading and lede with an optional right-aligned "more" link, and stacks under 640px.

Content is ruled rows on grids: regions (locator thumbnail, body, evidence list), work rows, publications grouped by year in a 120px mono year column, timeline rows with a 9.5rem date column, and 3 or 4 column grids divided by vertical hairlines. Two-column layouts collapse to one between 860 and 900px.

The home hero is a full-bleed map field (min(84vh, 780px)) with the legend panel left-aligned to the column and region labels placed from cluster coordinates. Under 820px the field shortens to 52vw (260 to 360px), uses mobile cluster positions, and the legend drops below it, overlapping the field's lower edge by 28px. The header is sticky from 820px up; below, the nav wraps to its own row. Pages with a single field band (contact, 404) flex that band to fill down to the footer.

## Elevation & Depth

The system is flat. Depth comes from the dark map field against the light reading surface, and from the density map's own heat, never from elevation. No box-shadow lifts any surface.

Two shadow-like devices are native to the map and are allowed: a dark text halo behind region labels on the field (legibility over the heat), and a soft colored ring around a cluster dot while its cluster is brushed.

### Named Rules
**The Field Is the Depth Rule.** Surfaces never lift. To separate, use a hairline, a tinted band, or the dark field.

## Shapes

Square corners at 2px on everything with a box: buttons, panels, frames, inputs, screenshots, flags. Circles are reserved for data points: cluster dots, evidence bullets, step numbers, the point cloud. Hairline (1px) rules and frames carry structure; the only heavier line is the 3px top rule of a process step.

### Named Rules
**The Points Are Round Rule.** Round shapes mean data points or cluster keys. Containers stay square.

## Components

### Buttons
- **Shape:** square (2px), 44px minimum height, Archivo 650.
- **Primary:** Apricot fill with dark ink; hover shifts to Peach Cream. In the header it is compact (38px).
- **Line:** transparent with Rule Strong border; hover darkens the border to Ink. On the field the border is pale yellow at 30% and hovers to Peach Cream.
- **Disabled:** transparent, muted text, Rule border.

### Cluster Keys
The one labeling system. A small round dot in the cluster color, then the mono ID and the Archivo name in ink text (never cluster-colored text). Brushable keys underline in the cluster color on hover or press and ring their dot; every other tagged item dims to .28 opacity.

### Map Region Labels
On the field: a dot plus mono ID above the region name in expanded tracked caps, field-ink with a dark text halo. They fade in once the map settles; hover lights the label and underlines the name in its cluster color.

### Legend Panel
A plum-black panel at 90% opacity with a field-rule hairline, holding name, role, portrait, pitch, actions, and the region keys in a 2-column grid (1 column under 380px).

### Cards / Containers
None as structure. Figures use a Rule Strong hairline frame; the readout is a ruled definition list with label-caps terms.

### Chips
- **Publication flag:** label caps in a hairline box, Ink 2 text.
- **Segmented filter:** hairline group; the pressed segment inverts to Ink on Ground.

### Navigation
Dark field header with the brand mark, Field Ink 2 links that brighten on hover with a faint underline; the current page carries a 2px Apricot underline. A square theme toggle cycles system, light and dark.

### Page Head
Inner pages open on the field with display h1 and lede; a static point cloud at right lights the page's own cluster.

### Contact Close
A field band with a large headline and the email in mono inside a hairline box, with a Copy button that confirms in Peach Cream.

## Do's and Don'ts

### Do:
- **Do** take every new color from magma or the magma-tinted neutrals.
- **Do** tag projects and papers with cluster keys (dot, mono ID, Archivo name) and wire them to linked brushing.
- **Do** set IDs, axes, DOIs, years, dates and counts in Martian Mono at width 75, and everything else in Archivo.
- **Do** put small labels in expanded tracked Archivo caps (width 118 to 125, .1 to .16em).
- **Do** place meta lines (version, status, role) below the heading.
- **Do** caption figures with a mono "Fig. N" and keep charts original or schematic.
- **Do** gate JS-dependent hiding on the live state (`.mapfig.is-live`, `.js`) so the page reads fully without JavaScript.
- **Do** make every motion static under prefers-reduced-motion.
- **Do** flex a page's single field band down to the footer.

### Don't:
- **Don't** add kickers or eyebrows above headings.
- **Don't** lift surfaces with drop shadows or use cards as structure; text halos on the field and brushing rings on cluster dots are the only shadows.
- **Don't** color text or fills with cluster colors; cluster color lives in the dot.
- **Don't** set names, flags, labels or prose in Martian Mono.
- **Don't** round containers past 2px.
- **Don't** build portfolio tropes: a name hero beside a portrait, stats strips, icon-card grids, chip clouds.
