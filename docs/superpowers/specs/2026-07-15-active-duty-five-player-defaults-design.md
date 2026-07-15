# Active Duty five-player default overlays

**Date:** 2026-07-15  
**Status:** Design approved in conversation; implementation pending  
**Scope:** Ancient, Cache, Dust II, Inferno, Mirage, Nuke, and Anubis

## Goal

Add two original tactical teaching overlays for each Active Duty map:

1. A five-player T-side default showing roles, routes from the known spawn areas, and the first pressure point.
2. A five-player CT-side default showing roles, initial hold angles or lanes, support relationships, and the first rotation trigger.

The diagrams must be drawn over the sourced map overviews already documented by the repository. They are editorial overlays, not recreated maps and not pixel-perfect radar replacements.

The pair will be embedded in each map's Markdown guide and reused by generated web pages. The existing broad `positioning-overview.svg` remains as a map-context visual.

## Requirements

### Tactical content

Each map receives exactly one T overlay and one CT overlay.

The T overlay contains:

- five numbered player markers;
- a short role label and action for every player;
- route arrows beginning at the clear spawn-area locations and pointing toward the intended lane or pressure point;
- a limited number of pressure or decision zones;
- a concise round-plan caption and a regroup/fallback rule.

The CT overlay contains:

- five numbered player markers;
- a short role label and action for every player;
- hold-angle wedges, sightline rays, or lane indicators showing what each player is responsible for watching;
- support relationships between nearby players where useful;
- a concise round-plan caption and the first rotation or information trigger.

Both diagrams show initial pressure and opening responsibilities only. They do not claim exact pixel positions, exact spawn assignments, fixed grenade lineups, or universal timings. Utility may be mentioned only when it explains the opening pressure; version one does not add lineup icons or grenade mechanics.

### Visual language

The sourced overview image is the bottom layer of each new SVG. The local SVG contributes the annotations and a restrained dark backing where needed for legibility. No source map pixels are copied into the repository.

Shared conventions:

- red numbered markers for T players and blue numbered markers for CT players;
- arrows for movement routes and rotation paths;
- translucent directional wedges or rays for CT hold responsibilities;
- translucent zones for pressure or decision areas;
- visible labels that do not rely on color alone;
- a compact legend, map/side title, and one-sentence teaching rule;
- an explicit note that the diagram is a sourced-map teaching overlay, not a replacement radar.

Every SVG has an accessible `<title>` and `<desc>`. Player groups also expose machine-readable metadata using `data-side`, `data-player`, `data-role`, and `data-action` attributes.

### Source and attribution policy

Each overlay uses a direct remote overview-image URL recorded in that map's `assets/map-overview-source.md`. The source note must also record the source page, check date, map-version context, attribution/license or permission basis, and the replacement trigger.

If an existing source note has only a source page and no direct overview URL, implementation must identify and verify a direct image URL before authoring that overlay. A synthetic replacement map must not be substituted silently.

The new local SVGs must link their source note in the surrounding Markdown and include source attribution in their accessible description or teaching note. If the remote background is unavailable at runtime, the annotations and text must remain understandable, and the source link must still be available.

Tactical claims must be grounded in the existing map `README.md`, `offense.md`, `defense.md`, `utility.md`, and documented research sources. New map-specific claims must be added to `sources/research-log.md` with the source title, URL, date checked, supported claim, map-version note, and replacement trigger.

## Repository structure

For each Active Duty map, add:

```text
maps/<map>/assets/default-t.svg
maps/<map>/assets/default-ct.svg
```

Keep the existing `maps/<map>/assets/positioning-overview.svg` unchanged as the broad context visual unless a narrowly scoped compatibility edit is required.

Add a `## Five-player defaults` section to each map `README.md`. It presents the T overlay first and the CT overlay second, with descriptive alt text, a concise round-plan caption, and a link to the map source note. The README also gains a top-of-guide link to the corresponding generated web page.

## Web companion architecture

Replace the current single-map hardcoded build assumptions with a small Active Duty map manifest. Each manifest entry identifies:

- map slug and display name;
- README, offense, defense, utility, and source-note paths;
- the context visual path;
- the T and CT default overlay paths;
- the generated page title and navigation labels.

The build generates one shared-format page per Active Duty map under a stable map-specific URL, plus a map index or landing link as appropriate. Pages render the Markdown source and reuse the local T/CT SVG files; they do not maintain separate copies of diagram content.

The existing Inferno map controls and accessibility behavior must remain functional while the build becomes map-aware. Required source files and assets are validated before output is written. A missing Markdown source, source note, context asset, T overlay, or CT overlay produces a clear build error naming the map and path.

## Verification

Automated checks must cover:

- XML/SVG parsing for all fourteen new overlay files;
- presence of a title, description, source-reference note, legend, and side label in every overlay;
- exactly five machine-readable player groups in each overlay;
- valid `data-side`, `data-player`, `data-role`, and `data-action` metadata;
- valid remote background references and source-note links;
- all README image and web-companion links;
- generation of seven map pages and their copied/served assets;
- the existing web test suite, production build, and whitespace check.

Visual QA must inspect representative T and CT overlays across simple and complex layouts, including Nuke's upper/lower route relationship. The review must confirm that:

- the sourced map remains recognizable beneath the annotations;
- markers and labels do not hide critical callouts;
- T arrows point from spawn areas toward the intended routes;
- CT wedges/rays show a defensible angle or lane rather than an invented exact position;
- the two sides are distinguishable by text, shape, and color;
- the SVG remains legible at normal Markdown width and at mobile width;
- a missing remote background does not make the textual teaching content unusable.

## Acceptance criteria

The work is complete when:

1. All seven Active Duty maps have one T and one CT sourced-map overlay.
2. Each overlay visibly communicates five roles and the requested initial routes or hold responsibilities.
3. Each map README embeds both overlays, retains its existing context visual, and links to its web companion.
4. The research log and source notes document the background and tactical sources for the new claims.
5. The generated site contains the seven map pages and serves the same local SVG assets used by Markdown.
6. Automated tests, production build, whitespace checks, and visual QA pass without weakening the source-of-truth or attribution rules.

## Out of scope

- replacing the existing broad positioning visuals;
- copying or locally storing third-party map screenshots;
- exact spawn-number assignments, pixel-perfect player coordinates, or universal timing claims;
- new grenade lineup cards or lineup screenshots;
- non-Active-Duty maps;
- unrelated guide prose or web-control redesign.
