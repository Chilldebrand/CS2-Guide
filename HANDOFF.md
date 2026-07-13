# CS2 Guide — next-chat handoff

## Current state

- Repository: `https://github.com/Chilldebrand/CS2-Guide.git`
- Local checkout: `C:\Users\hilde\OneDrive\Documents\CS2 Guide\CS2-Guide`
- Branch: `main`
- Last guide commit: `8164d41 docs: add CS2 competitive rank-up guide`
- This handoff should be committed as the next change and pushed to `origin/main`.

## What is already built

The repository contains a folder-based Markdown guide for new players focused on climbing Competitive/Premier:

- Root navigation in `README.md`.
- General fundamentals in `general/`: ten essential principles, aim/movement, economy, communication, round flow, and practice/demo review.
- Shared utility curriculum in `utility/`.
- Fifteen map folders in `maps/`: Ancient, Cache, Dust II, Inferno, Mirage, Nuke, Anubis, Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, and Shelter.
- Every map has `README.md`, `offense.md`, `defense.md`, `utility.md`, and `assets/map-overview-source.md`.
- Office, Italy, and Shelter are written as hostage-mode guides and avoid bombsite/post-plant instructions.
- Sources and dated map-pool notes are in `sources/`.
- Design and QA documents are in `docs/superpowers/specs/` and `docs/qa-report.md`.

## Verification already completed

- 15 map folders and all required files present.
- Exactly 10 essential principles.
- 98 internal Markdown links resolved.
- 15 dated map visual/source notes.
- Hostage terminology check passed.
- Every map utility table has five purpose-first entries with timing, thrower, purpose, and follow-up/fallback.

## Research scope

The map pool was checked July 13, 2026. The seven Premier/Active Duty maps are Ancient, Cache, Dust II, Inferno, Mirage, Nuke, and Anubis. Competitive-only maps are Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, and Shelter.

Primary references are recorded in `sources/map-pool.md` and `sources/research-log.md`, including Valve’s July 8, 2026 Season 5 update and the current map-pool table.

## Recommended next task: visual utility lineup cards

Add visual lineup references to each map’s `utility.md`, then link the most important entries from `offense.md` and `defense.md`.

For each high-value grenade, prefer a two- or three-image card:

1. Thrower’s starting position.
2. Crosshair/aim reference and throw type.
3. Landing result and the teammate action it enables.

Start with the seven Premier maps, then cover Competitive-only maps. Use attributed source pages or locally stored images only where permitted. Do not generate map geometry with AI. Record source URL, date checked, map version, and replacement trigger in the map’s `assets/` note.

Useful researched examples:

- [BLAST Inferno smoke guide](https://blast.tv/article/cs2-inferno-smokes) — step-by-step screenshot sequences for Short, Long, Moto, Arch, Library, CT, and Coffins.
- [Dot Esports Inferno grenade guide](https://dotesports.com/counter-strike/news/best-cs2-inferno-grenade-spots) — screenshot groups for Banana, Pit, Coffins, CT, Balcony, Quad, and Top Mid.
- [Steam Mirage smoke guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3297387549) — visually documented Mirage throws, but verify availability/currentness before relying on it because the page currently reports compatibility/removal warnings.

## Important workflow notes

- The repository is nested under the workspace folder; work inside `CS2-Guide`, not the outer workspace root.
- `.superpowers/` is ignored scratch state used by the planning workflow.
- Do not use destructive Git commands such as reset/checkout unless explicitly requested.
- After adding visuals, re-run the structural checks in `docs/qa-report.md`, update the QA report, commit, and push to `origin/main`.

