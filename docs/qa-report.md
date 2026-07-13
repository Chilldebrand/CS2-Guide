# QA report

**Checked:** 2026-07-13

## Structural checks

- 15 map folders found: Ancient, Cache, Dust II, Inferno, Mirage, Nuke, Anubis, Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, Shelter.
- Every map has `README.md`, `offense.md`, `defense.md`, `utility.md`, and `assets/map-overview-source.md`.
- Ten essential principles found in `general/01-essential-principles.md`.
- The repository-wide Markdown link checker resolved 171 local references successfully after the Competitive-only rollout (reproduced 2026-07-13; no broken-link error).

## Content checks

- Office, Italy, and Shelter were checked for misleading bombsite, plant, and post-plant instructions; none were found.
- Every map source note includes a URL and the date checked.
- Twelve map READMEs embed remote overview/callout images; Boulder, Fachwerk, and Shelter are intentionally marked as visual-source pending because their current community-map diagrams need a separate verification pass.
- Every map utility table has five entries and each entry states timing, thrower, purpose, and follow-up/fallback.

## Inferno pilot visual QA

- Pilot files verified: `maps/inferno/README.md`, `maps/inferno/utility.md`, `maps/inferno/assets/map-overview-source.md`, `maps/inferno/assets/positioning-overview.svg`, and `maps/inferno/assets/utility/README.md`.
- `maps/inferno/assets/positioning-overview.svg` is local and complete for the pilot; the map callout overview in `maps/inferno/README.md` remains remote and is recorded in the source note with its source URL, checked date, map-version note, status, attribution basis, and replacement trigger.
- The three utility cards in `maps/inferno/utility.md` are remote-source cards and are not stored locally: `CT molly Banana` (`bo3.gg`), `T smoke CT/Coffins` (`BLAST.tv`), and `T smoke Arch or Library` (`BLAST.tv`). Each source note records the source page, checked date, map-version note, remote status, attribution basis, and replacement trigger.
- Local image targets under `maps/inferno/` resolve; the remote overview target is explicitly recorded as remote in `maps/inferno/assets/map-overview-source.md`.
- Intentionally pending screenshots: no local utility screenshots are stored because reuse permission was not verified; the three cards retain their remote source-page links until permitted, verified assets become available.

## Premier rollout visual QA

- Rollout files verified for Ancient, Cache, Dust II, Mirage, Nuke, and Anubis: each map has its existing `README.md`, `utility.md`, and `assets/map-overview-source.md` plus a local `assets/positioning-overview.svg` and `assets/utility/README.md`.
- Six local positioning SVGs were rendered and inspected. Each is explicitly a route-teaching schematic rather than a pixel-perfect radar; Nuke separates surface/upper and lower layers and marks the Secret, Ramp, and Vent transitions.
- Eighteen utility cards preserve exact target names from their existing utility tables. Every card states Start, Aim, Result, Fallback, and Source, and carries the table's timing and purpose.
- All eighteen cards retain remote source-page links because local screenshot reuse permission was not verified. No remote screenshot pixels were copied into the hand-authored SVGs.
- All six source notes record source URLs, checked dates, map-version notes, local/remote status, attribution or permission basis, and replacement triggers. Older incompatible Cache material was excluded, and Anubis cards whose media predates the January 2026 layout change explicitly require practice verification.
- Baseline checks still find 15 complete map folders, ten essential principles, and no bomb-plant/post-plant regression in the Office, Italy, or Shelter offense/defense plans.

## Competitive-only community-map visual QA

- Boulder and Fachwerk now have source-linked positioning status sections and three canonical utility-purpose cards each.
- Both positioning diagrams remain intentionally pending. Boulder lacks a current published callout topology; Fachwerk's available callout article predates the creator build updated 2026-07-13.
- No `positioning-overview.svg`, utility screenshot, or guessed route graph was created for either map.
- All six pending cards preserve exact target names, timing, purpose, and fallback values from their existing utility tables and explicitly avoid fixed start, aim, throw type, landing, or grenade-behavior claims.
- Both source notes record current source URLs, checked dates, map-version/update context, pending status, attribution/permission basis, and replacement triggers.

## Hostage-map visual QA

- Office, Italy, and Shelter each have a local hand-authored `assets/positioning-overview.svg`, an `assets/utility/README.md` contract, a positioning entry point in the map README, and three canonical purpose-first utility cards.
- The diagrams use attacker/defender labels and show hostage-room access, room isolation, rescue routes, and safe exits. Shelter keeps the sourced Cat Adoptions/Breezeway/Courtyard/Exterior Kennels/Dock route to Playroom distinct from the Yard/Bark Barn route to Pool.
- Italy's selected defender HE card carries the table's explicit anti-rush timing. Office and Shelter include return-route smoke cards that break escort cover without introducing unsupported fixed throws.
- All nine cards preserve exact target names, timing, purpose, and fallback values from their existing utility tables. Callout-only sources are not treated as proof of start positions, pixel aims, throw inputs, bounces, timing, coverage, or damage.
- All three source notes record current source URLs, checked dates, map-version context, local/remote status, attribution/permission basis, and replacement triggers.
- The prescribed hostage terminology guard is run before the hostage-map commit and again in the final baseline pass.

## Known follow-up

Remote overview images remain in use where local reuse permission was not verified. Boulder and Fachwerk positioning diagrams remain intentionally pending until current geometry sources support them; all local and future remote visuals should be rechecked against the installed map version after relevant map updates.
