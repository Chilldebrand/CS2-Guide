# QA report

**Checked:** 2026-07-13

## Structural checks

- 15 map folders found: Ancient, Cache, Dust II, Inferno, Mirage, Nuke, Anubis, Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, Shelter.
- Every map has `README.md`, `offense.md`, `defense.md`, `utility.md`, and `assets/map-overview-source.md`.
- Ten essential principles found in `general/01-essential-principles.md`.
- The repository-wide Markdown link checker resolved 141 local references successfully after the Premier rollout (reproduced 2026-07-13; no broken-link error).

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

## Known follow-up

The first pass uses remote overview images where reliable sources were available. The next visual pass should download or recreate locally annotated diagrams, especially for Boulder, Fachwerk, and Shelter, and then verify every image against the installed map version.
