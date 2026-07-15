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
- Boulder and Fachwerk intentionally remain pending with no authoritative local `positioning-overview.svg`.
- No guessed route graph, local screenshot, or unsupported lineup mechanics were added for Boulder or Fachwerk.

## Hostage-map visual QA

- Office, Italy, and Shelter each retain a local `assets/positioning-overview.svg`, an `assets/utility/README.md` contract, a positioning entry point in the map README, and three canonical purpose-first utility cards.
- The diagrams use attacker/defender labels and show hostage-room access, room isolation, rescue routes, and safe exits.
- Shelter continues to keep the sourced Cat Adoptions/Breezeway/Courtyard/Exterior Kennels/Dock route to Playroom distinct from the Yard/Bark Barn route to Pool.
- Hostage terminology remained clean in the final audit.

## Competitive-only local SVG render QA

- The six Competitive-only local positioning SVGs were rendered at `900 x 580` inside a `1020 x 700` browser viewport through a temporary localhost preview: `maps/train/assets/positioning-overview.svg`, `maps/vertigo/assets/positioning-overview.svg`, `maps/overpass/assets/positioning-overview.svg`, `maps/office/assets/positioning-overview.svg`, `maps/italy/assets/positioning-overview.svg`, and `maps/shelter/assets/positioning-overview.svg`.
- Each of the six renders was visually inspected at Markdown-like size for label readability, route clarity, contrast, intact legends, unclipped SVG bounds, and useful teaching hierarchy.
- A follow-up browser-side bounding-box check rechecked all six files and found zero label/role-marker collisions and zero clipped text across the final `900 x 580` renders.
- Final per-map readout: Train remained clear after the Yard/marker cleanup; Vertigo retained readable floor-transition labeling; Overpass retained readable split-route labeling; Office, Italy, and Shelter retained clean hostage-route labeling and legible safe-exit hierarchy.
- Boulder and Fachwerk remain intentionally pending in this section as well because there is still no authoritative current local SVG source for their route geometry.

## Known follow-up

Remote overview images remain in use where local reuse permission was not verified. Boulder and Fachwerk positioning diagrams remain intentionally pending until reliable current geometry sources support them. All local and remote visuals should be rechecked after map-pool, map-geometry, callout, or verified utility-behavior changes.

## Web companion QA

**Checked:** 2026-07-14. The Inferno companion is the only generated web map in this pass; Markdown remains the tactical source of truth.

### Local build and preview

- From `web/`, `npm ci` was blocked before execution because this PowerShell session prohibits loading `C:\Program Files\nodejs\npm.ps1`. The equivalent Windows command shim completed successfully: `npm.cmd ci` (one package added), `npm.cmd test` (9 passed, 0 failed), and `npm.cmd run build` (exit 0).
- The build produced `web/dist/index.html` (10,472 bytes), `web/dist/styles.css` (3,485 bytes), `web/dist/app.js` (1,396 bytes), and `web/dist/assets/positioning-overview.svg` (8,535 bytes).
- `python -m http.server 4173 --directory dist` could not start because neither `python` nor the `py` launcher is installed in this environment. A temporary Node standard-library static server served the built `dist/` directory at `http://localhost:4173/` for the browser checks; it returned the page and all required assets, and the browser recorded no console errors.

### Browser checks

- Desktop (`1280 x 720`): the page was one continuous scrollable document. Each unique section link landed at its target: `#round-plan`, `#offense`, `#defense`, and `#utility-priorities` (target top within 0.5 px of the viewport top).
- The default checked `Map follows scroll` control applied `position: sticky`. Unchecking it removed the sticky class and returned the panel to `position: static` while its map body remained visible. Refreshing preserved the disabled preference (`followChecked: false`, static panel).
- Collapse changed the label to `Show map`, set `aria-expanded="false"`, and hid the map body. Activating it again restored `Collapse map`, `aria-expanded="true"`, and the body.
- Mobile (`375 x 667`): the layout resolved to one 340 px grid column; the map panel was static, visible, and below the guide content, so it did not obscure the article.
- Keyboard-only input could not be independently exercised in the available in-app browser runtime: locator key simulation did not dispatch native control activation, and repeated native `Tab` input left focus on `BODY`. The rendered controls are nonetheless uniquely exposed as a checkbox, button, section links, and source links; the automated template/accessibility-contract test passed.
- The browser runtime does not expose reduced-motion emulation. Static verification confirmed the `@media (prefers-reduced-motion: reduce)` rule sets `html { scroll-behavior: auto; }` and removes transition duration; the automated responsive/reduced-motion test passed. Its current browser preference was not reduced motion (`scroll-behavior: smooth`), so runtime reduced-motion behavior remains a follow-up for a browser environment with media emulation.

### Publishing status

- GitHub Pages is configured for `https://chilldebrand.github.io/CS2-Guide/`. The site is not claimed as deployed in this QA pass: it will publish after the reviewed branch is merged and pushed to `main`.

## Map enlargement QA

**Checked:** 2026-07-14. These changes are present on the local `feat/map-enlargement` branch only; the branch has not been merged or pushed, and no public deployment is claimed.

### Automated behavior and build checks

- `npm.cmd test --prefix web` passed: 16 tests passed and 0 failed. The suite covers persistent 1×–3× inline size selection, temporary 4× overlay behavior, Close/Escape restoration and focus return, partial/absent dialog API fallback, and independence of the follow and collapse controls.
- `npm.cmd run build --prefix web` completed with exit code 0.
- The automated CSS/template contract checks include mobile stacking overrides and the reduced-motion rules. This is static/automated coverage; it is not a replacement for runtime browser validation.

### Browser QA status

- Interactive local-preview QA was blocked in this environment. The temporary local server was cleaned up when its launching command ended, both available browser surfaces then received `net::ERR_CONNECTION_REFUSED`, and direct `file:///` opening was prohibited by browser policy.
- Accordingly, desktop 1×–3× visual resizing, runtime 4× Close/Escape/focus behavior, mobile stacking, follow/collapse regression behavior, and runtime reduced-motion behavior still need a local browser pass outside this sandbox. No product failure was observed or inferred from the blocked preview.
