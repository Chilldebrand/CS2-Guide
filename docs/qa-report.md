# QA report

**Checked:** 2026-07-13

## Structural checks

- 15 map folders found: Ancient, Cache, Dust II, Inferno, Mirage, Nuke, Anubis, Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, Shelter.
- Every map has `README.md`, `offense.md`, `defense.md`, `utility.md`, and `assets/map-overview-source.md`.
- Ten essential principles found in `general/01-essential-principles.md`.
- The existing repository-wide Markdown link checker resolved 130 references successfully (reproduced 2026-07-13; no broken-link error).

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

## Known follow-up

The first pass uses remote overview images where reliable sources were available. The next visual pass should download or recreate locally annotated diagrams, especially for Boulder, Fachwerk, and Shelter, and then verify every image against the installed map version.
