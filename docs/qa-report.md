# QA report

**Checked:** 2026-07-13

## Structural checks

- 15 map folders found: Ancient, Cache, Dust II, Inferno, Mirage, Nuke, Anubis, Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, Shelter.
- Every map has `README.md`, `offense.md`, `defense.md`, `utility.md`, `assets/map-overview-source.md`, and `assets/utility/README.md`.
- 13 local `positioning-overview.svg` files are present: Inferno, Ancient, Cache, Dust II, Mirage, Nuke, Anubis, Train, Vertigo, Overpass, Office, Italy, and Shelter.
- Boulder and Fachwerk intentionally remain without `positioning-overview.svg` because current source material still does not justify a reliable local route diagram.
- Ten essential principles found in `general/01-essential-principles.md`.
- The repository-wide Markdown/image audit resolved 171 local targets successfully (158 local links plus 13 local image targets; no broken local references).

## Content checks

- All 15 maps now expose visual lineups: 45 purpose-first cards total, three per map.
- Every visual card heading matches a utility-table target, and every card contains Start, Aim, Result, Fallback, and Source labels.
- Every map source note includes current URL coverage, checked date, map-version note, status, attribution/license or permission basis, and replacement trigger.
- Office, Italy, and Shelter were rechecked for misleading bombsite, plant, and post-plant instructions; none were found.
- Remote utility screenshots remain source-linked where local reuse permission was not verified; no third-party screenshot pixels were copied into the local SVGs.

## Visual coverage summary

- 13 local Markdown image targets point to local positioning SVGs and resolve correctly.
- 12 Markdown image targets remain remote overview/callout references and are explicitly treated as remote in their source notes.
- Inferno, the six Premier rollout maps, Train, Vertigo, Overpass, Office, Italy, and Shelter all have local positioning SVG coverage.
- Boulder and Fachwerk retain source-linked pending diagrams and purpose-level lineup cards only.

## Inferno pilot visual QA

- `maps/inferno/README.md`, `maps/inferno/utility.md`, `maps/inferno/assets/map-overview-source.md`, `maps/inferno/assets/positioning-overview.svg`, and `maps/inferno/assets/utility/README.md` remain present and internally consistent.
- The map overview in `maps/inferno/README.md` remains remote and is recorded in the source note with its source URL, checked date, map-version note, status, attribution basis, and replacement trigger.
- The three Inferno utility cards remain remote-source cards and are not stored locally: `CT molly Banana` (`bo3.gg`), `T smoke CT/Coffins` (`BLAST.tv`), and `T smoke Arch or Library` (`BLAST.tv`).
- No local utility screenshots are stored for Inferno because reuse permission was not verified; the cards correctly retain remote source-page links.

## Premier rollout visual QA

- Ancient, Cache, Dust II, Mirage, Nuke, and Anubis each retain a local `assets/positioning-overview.svg` plus `assets/utility/README.md`.
- The 18 Premier cards preserve exact target names from the existing utility tables and retain matching timing, purpose, and fallback values.
- All six Premier source notes record source URLs, checked dates, map-version notes, local/remote status, attribution or permission basis, and replacement triggers.
- Older incompatible Cache material remains excluded, and Anubis cards whose media predates the January 2026 layout change still explicitly require practice verification.

## Competitive-only community-map visual QA

- Train, Vertigo, and Overpass retain local positioning SVGs, utility asset contracts, and three canonical visual cards each.
- Boulder and Fachwerk retain three source-linked pending cards each and now also have explicit utility asset README contracts to document how future local visual assets must be handled.
- Boulder still lacks a current published callout topology, and Fachwerk's available callout article still predates the creator build updated 2026-07-13.
- No guessed route graph, local screenshot, or unsupported lineup mechanics were added for Boulder or Fachwerk.

## Hostage-map visual QA

- Office, Italy, and Shelter each retain a local `assets/positioning-overview.svg`, an `assets/utility/README.md` contract, a positioning entry point in the map README, and three canonical purpose-first utility cards.
- The diagrams use attacker/defender labels and show hostage-room access, room isolation, rescue routes, and safe exits.
- Shelter continues to keep the sourced Cat Adoptions/Breezeway/Courtyard/Exterior Kennels/Dock route to Playroom distinct from the Yard/Bark Barn route to Pool.
- Hostage terminology remained clean in the final audit.

## Representative Markdown-size render QA

- Representative local SVGs were rendered at `900 x 580` inside a `1020 x 700` browser viewport through a temporary localhost preview: `maps/inferno/assets/positioning-overview.svg`, `maps/ancient/assets/positioning-overview.svg`, `maps/train/assets/positioning-overview.svg`, and `maps/office/assets/positioning-overview.svg`.
- The first Task 7 render pass exposed label/role-marker collisions on Inferno (`Banana`, `Arch`, `Car`) and Ancient (`Mid`, `A Main`, `B Ramp`).
- Corrections were limited to label-position nudges in `maps/inferno/assets/positioning-overview.svg` and `maps/ancient/assets/positioning-overview.svg`. No route geometry, callout relationships, utility claims, or tactical meaning changed.
- The final browser-side bounding-box check found zero text-circle overlaps and zero clipped text across all four representative `900 x 580` renders.
- Visual inspection confirmed readable labels, consistent contrast, unclipped SVG content, intact legends, and useful hierarchy between the schematic, markers, arrows, teaching read, legend, and round rule.

## Known follow-up

Remote overview images remain in use where local reuse permission was not verified. Boulder and Fachwerk positioning diagrams remain intentionally pending until reliable current geometry sources support them. All local and remote visuals should be rechecked after map-pool, map-geometry, callout, or verified utility-behavior changes.
