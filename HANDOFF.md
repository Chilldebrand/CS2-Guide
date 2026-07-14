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

## Recommended next chat: optional web companion with scroll-following maps

The next product question is whether the guide should remain GitHub-Markdown-first or gain an optional web experience. GitHub's rendered Markdown cannot provide a reliable sticky/following map panel with a user toggle, so do not try to implement that behavior inside ordinary README pages.

Preferred direction to evaluate:

- Keep the Markdown guide fully usable on GitHub.
- Add a separate web companion, ideally published through GitHub Pages or the project's approved hosting path.
- On each map page, show the guide content beside the map/positioning visual.
- Add a visible `Map follows scroll` toggle. When enabled, the map panel uses sticky positioning and the page can highlight or swap the relevant map visual as the reader moves through offense, defense, utility, and positioning sections. When disabled, the map remains in its normal document position.
- Start with one map, preferably Inferno, as a proof of concept before generating pages for all 15 maps.
- Reuse the existing local SVG positioning diagrams, remote-source disclosures, Markdown content, and source metadata. Do not create a second tactical truth that can drift from the Markdown guide.

Design questions for the next chat:

1. Should the web companion be a lightweight static site generated from the existing Markdown, or a small hand-authored map viewer that links back to Markdown sections?
2. Should the map-follow behavior only keep one map panel sticky, or should it switch between positioning/utility diagrams as the reader reaches related sections?
3. Should the companion be hosted with GitHub Pages, or remain a local/static preview until the layout is approved?

First implementation target: an Inferno page with a desktop two-column layout, a stacked mobile layout, accessible toggle control, reduced-motion support, and a clear link back to the GitHub Markdown source.

## Important workflow notes

- The repository is nested under the workspace folder; work inside `CS2-Guide`, not the outer workspace root.
- `.superpowers/` is ignored scratch state used by the planning workflow.
- Do not use destructive Git commands such as reset/checkout unless explicitly requested.
- After any future visual maintenance triggered by map-pool, geometry/callout, or remote-source changes, re-run the structural checks in `docs/qa-report.md`, update the QA report and source notes, commit, and then push to `origin/main`.
- For the web companion, keep generated/build output separate from the Markdown source and verify local SVG paths, mobile layout, keyboard access, reduced-motion behavior, and the disabled-toggle mode before publishing.
