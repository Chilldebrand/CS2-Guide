# CS2 Guide - next-chat handoff

## Current state

- Repository: `https://github.com/Chilldebrand/CS2-Guide.git`
- Local checkout: `C:\Users\hilde\OneDrive\Documents\CS2 Guide\CS2-Guide`
- Branch: `main`
- Most recent code commit: `117e1cc docs: finalize utility visuals fix pass`
- Final QA status and durable verification evidence are recorded in `docs/qa-report.md`.

## What is already built

The repository contains a folder-based Markdown guide for new players focused on climbing Competitive/Premier:

- Root navigation in `README.md`.
- General fundamentals in `general/`: ten essential principles, aim/movement, economy, communication, round flow, and practice/demo review.
- Shared utility curriculum in `utility/`.
- Fifteen map folders in `maps/`: Ancient, Cache, Dust II, Inferno, Mirage, Nuke, Anubis, Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, and Shelter.
- Every map has `README.md`, `offense.md`, `defense.md`, `utility.md`, `assets/map-overview-source.md`, and `assets/utility/README.md`.
- Office, Italy, and Shelter are written as hostage-mode guides and avoid bombsite/post-plant instructions.
- Sources and dated map-pool notes are in `sources/`.
- Design and QA documents are in `docs/superpowers/specs/` and `docs/qa-report.md`.
- The completed visual rollout now includes 45 purpose-first utility cards across all 15 maps, 13 local positioning SVGs, and utility asset README contracts for every map.
- Boulder and Fachwerk intentionally remain source-linked for positioning diagrams until reliable current geometry sources become available.

## Verification already completed

- 15 map folders and all required files present, including `assets/utility/README.md` for every map.
- Exactly 10 essential principles.
- 171 local Markdown/image targets resolved with no broken local references.
- 15 dated map visual/source notes with required source metadata.
- 45 visual cards checked against their utility-table targets; every card contains Start, Aim, Result, Fallback, and Source labels.
- `docs/qa-report.md` carries the durable `900 x 580` render evidence for Train, Vertigo, Overpass, Office, Italy, and Shelter, along with the intentionally pending Boulder/Fachwerk note.
- Hostage terminology check passed.
- Every map utility table has five purpose-first entries with timing, thrower, purpose, and follow-up/fallback.

## Research scope

The map pool was checked July 13, 2026. The seven Premier/Active Duty maps are Ancient, Cache, Dust II, Inferno, Mirage, Nuke, and Anubis. Competitive-only maps are Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, and Shelter.

Primary references are recorded in `sources/map-pool.md` and `sources/research-log.md`, including Valve's July 8, 2026 Season 5 update and the current map-pool table.

## Recommended next task: visual maintenance after map updates

The rollout is complete. The next maintenance pass should only happen when one of these changes:

1. The Premier/Competitive pool changes.
2. Verified map geometry or callouts change.
3. A cited remote lineup source changes, disappears, or gains verified local reuse permission.

Maintenance priorities:

- Re-check all local positioning SVGs against the installed map version after geometry/callout changes.
- Re-check remote overview and lineup sources against their recorded replacement triggers.
- Prioritize Boulder and Fachwerk for local diagram work only when reliable current geometry sources support them.
- Preserve hostage terminology rules and do not invent geometry or fixed lineup mechanics from callout-only material.

## Web companion status and next work

- The Inferno web companion proof of concept is implemented in `web/`: it generates one Inferno document from the Markdown guide, provides desktop sticky-map and disabled-map modes, a reversible collapse control, a stacked mobile layout, reduced-motion CSS, and links back to the Markdown source.
- Markdown remains authoritative. The web companion is a generated reading layer and must not become a second source for tactics, utility, callouts, or source metadata.
- GitHub Pages publishing is configured for `https://chilldebrand.github.io/CS2-Guide/`. It will publish after this reviewed branch is merged and pushed to `main`; do not describe the site as already deployed before then.

Optional next work:

1. Validate the deployed Inferno layout in a browser environment that can exercise native keyboard navigation and reduced-motion media emulation.
2. Reuse the proven template for another map only after that layout review, while retaining Markdown-derived content and each map's source disclosures.
3. Maintain the generator, Pages workflow, dependencies, local SVG paths, source links, and browser QA evidence when Markdown, map geometry, or browser support changes.

## Important workflow notes

- The repository is nested under the workspace folder; work inside `CS2-Guide`, not the outer workspace root.
- `.superpowers/` is ignored scratch state used by the planning workflow.
- Do not use destructive Git commands such as reset/checkout unless explicitly requested.
- After any future visual maintenance triggered by map-pool, geometry/callout, or remote-source changes, re-run the structural checks in `docs/qa-report.md`, update the QA report and source notes, commit, and then push to `origin/main`.
- For the web companion, keep generated/build output separate from the Markdown source and verify local SVG paths, mobile layout, keyboard access, reduced-motion behavior, and the disabled-toggle mode before publishing.
