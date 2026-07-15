# Active Duty five-player default overlays Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add sourced-map T/CT five-player default overlays for the seven Active Duty maps, embed them in Markdown, and generate map-aware web companion pages from the same source assets.

**Architecture:** Keep each existing `positioning-overview.svg` as a context visual and add `default-t.svg` and `default-ct.svg` as hand-authored SVG overlays whose bottom layer references the verified remote map overview. Replace the hardcoded Inferno-only build with a manifest-driven build that renders one shared-format page per Active Duty map and copies the local SVG assets. Tactical content remains in the map Markdown and research notes; the web layer only renders and links it.

**Tech Stack:** Node.js 22, ESM JavaScript, `marked`, Node test runner, hand-authored SVG, Markdown, GitHub Pages.

## Global Constraints

- Use the sourced overview image as the bottom layer of each new SVG; do not recreate the map or copy source pixels locally.
- Each map gets exactly one T overlay and one CT overlay with exactly five machine-readable player groups.
- T overlays show roles, spawn-based routes, initial pressure, and a fallback; CT overlays show roles, hold angles/lanes, support, and a rotation trigger.
- Do not claim exact pixel positions, exact spawn assignments, fixed grenade lineups, or universal timings.
- Keep `positioning-overview.svg` as the broad context visual.
- Keep Markdown as the source of truth and reuse the same SVGs in Markdown and generated web pages.
- Record overview and tactical sources, dates, map-version context, attribution/license basis, and replacement triggers.
- Preserve existing Inferno map controls and accessibility behavior.
- Do not weaken existing tests, source-safety rules, or attribution rules.

---

## File map

### Shared web implementation

- Create: `web/maps.mjs` — Active Duty manifest and stable page metadata.
- Modify: `web/build.mjs` — validate all manifest inputs, render each map, copy shared and map assets, and emit a landing page.
- Modify: `web/template.html` — convert the Inferno-only shell into a map-token template with T/CT default panels while preserving controls.
- Modify: `web/styles.css` — style the two default panels and map navigation without breaking existing responsive sizing.
- Modify: `web/test/build.test.mjs` — test seven-page output, asset copying, and map-specific validation.
- Modify: `web/test/ui-contract.test.mjs` — update template assertions for map-neutral labels while retaining control contracts.
- Modify: `web/test/deployment-contract.test.mjs` — update the public-guide copy and generated-site expectations.
- Create: `web/test/overlay-contract.test.mjs` — parse and validate all fourteen SVG overlays and their metadata.

### Map source and Markdown integration

- Modify: `maps/{ancient,cache,dust2,inferno,mirage,nuke,anubis}/README.md` — add the web link and `Five-player defaults` section.
- Modify: `maps/{ancient,cache,dust2,inferno,mirage,nuke,anubis}/assets/map-overview-source.md` — record direct remote overview URL and the two overlay records.
- Modify: `sources/research-log.md` — record map-specific role/route/angle research used for the defaults.
- Create: `maps/{ancient,cache,dust2,inferno,mirage,nuke,anubis}/assets/default-t.svg` — T overlay.
- Create: `maps/{ancient,cache,dust2,inferno,mirage,nuke,anubis}/assets/default-ct.svg` — CT overlay.

### Documentation and handoff

- Modify: `README.md` — describe the seven-map web companion instead of only the Inferno page.
- Modify: `HANDOFF.md` — record the completed overlay/web work and the next safe follow-up.

---

## Task 1: Establish the manifest and failing contracts

**Files:**
- Create: `web/maps.mjs`
- Create: `web/test/overlay-contract.test.mjs`
- Modify: `web/test/build.test.mjs`

**Interfaces:**
- `ACTIVE_DUTY_MAPS` is an exported array of objects with `slug`, `title`, `poolLabel`, `sourceDir`, `markdown`, `assets`, and `pageTitle` fields.
- `getRequiredInputs(map)` returns the eight required source paths: README, offense, defense, utility, source note, context SVG, T SVG, and CT SVG.
- `validateOverlaySvg(svgText, expectedSide, expectedFile)` throws an actionable error or returns `true`.

- [ ] **Step 1: Write failing manifest and output tests.**

Add tests that import `ACTIVE_DUTY_MAPS`, assert the seven slugs in order, and expect the build output to contain `index.html` plus `maps/<slug>/index.html` for every slug. Add an overlay contract test that reads the fourteen expected paths and expects five `data-player` groups, the expected side, `<title>`, `<desc>`, a legend, and a remote `<image>` reference.

- [ ] **Step 2: Run the focused tests to verify they fail.**

Run from `web`:

```powershell
npm test -- --test-name-pattern "manifest|seven|overlay contract"
```

Expected: FAIL because `web/maps.mjs`, the fourteen new SVGs, and the multi-page build do not exist yet.

- [ ] **Step 3: Create the manifest with the exact seven maps.**

Use this shape:

```js
export const ACTIVE_DUTY_MAPS = [
  { slug: 'ancient', title: 'Ancient', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/ancient', pageTitle: 'Ancient | CS2 Guide' },
  { slug: 'cache', title: 'Cache', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/cache', pageTitle: 'Cache | CS2 Guide' },
  { slug: 'dust2', title: 'Dust II', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/dust2', pageTitle: 'Dust II | CS2 Guide' },
  { slug: 'inferno', title: 'Inferno', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/inferno', pageTitle: 'Inferno | CS2 Guide' },
  { slug: 'mirage', title: 'Mirage', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/mirage', pageTitle: 'Mirage | CS2 Guide' },
  { slug: 'nuke', title: 'Nuke', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/nuke', pageTitle: 'Nuke | CS2 Guide' },
  { slug: 'anubis', title: 'Anubis', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/anubis', pageTitle: 'Anubis | CS2 Guide' },
];
```

Derive the Markdown and asset paths from `sourceDir` so the build has one source of truth for path conventions.

- [ ] **Step 4: Commit the red contracts and manifest.**

```powershell
git add web/maps.mjs web/test/overlay-contract.test.mjs web/test/build.test.mjs
git commit -m "test: define active duty overlay contracts"
```

## Task 2: Refactor the web build to seven map pages

**Files:**
- Modify: `web/build.mjs`
- Modify: `web/template.html`
- Modify: `web/styles.css`
- Modify: `web/test/build.test.mjs`
- Modify: `web/test/ui-contract.test.mjs`

**Interfaces:**
- `buildSite({ rootDir, outputDir })` builds the landing page and one page per `ACTIVE_DUTY_MAPS` entry.
- `buildMapPage({ rootDir, outputDir, map })` validates one map, renders its four Markdown sections, and copies `positioning-overview.svg`, `default-t.svg`, and `default-ct.svg` into that map’s `assets` directory.
- `renderMapTemplate({ template, map, content })` replaces map tokens without duplicating the template.

- [ ] **Step 1: Add failing tests for page paths, map links, and copied assets.**

Assert that `buildSite` writes `index.html`, `maps/inferno/index.html`, and `maps/anubis/index.html`; each map page contains its title, `assets/default-t.svg`, `assets/default-ct.svg`, `data-map-side="t"`, `data-map-side="ct"`, and a source-note link. Assert that every map asset is copied. Add a missing-input test that creates a fake map directory and expects the error to name the map and missing path.

- [ ] **Step 2: Run the focused build tests and confirm failure.**

```powershell
npm test -- --test-name-pattern "page|asset|missing"
```

Expected: FAIL because `buildSite` is still Inferno-only.

- [ ] **Step 3: Implement manifest-driven validation and rendering.**

Move the current Inferno-specific `REQUIRED_INPUTS` logic into `getRequiredInputs(map)` and validate every entry before writing output. Keep heading ID rewriting and local Markdown anchor rewriting. Render the existing `README`, `offense`, `defense`, and `utility` content in the same order, but make the template tokens map-specific. Emit a landing page with links to all seven pages.

- [ ] **Step 4: Add the default panels while preserving controls.**

The generated map template must include two images with these attributes:

```html
<img data-map-side="t" src="assets/default-t.svg" alt="...">
<img data-map-side="ct" src="assets/default-ct.svg" alt="...">
```

Keep the existing follow/collapse/size controls, map overlay, keyboard Escape behavior, focus restoration, reduced motion, and no-dialog fallback. Use the map title in labels and `aria-label` values.

- [ ] **Step 5: Add CSS for the two default panels and mobile stacking.**

Keep existing `.guide-layout.map-size-*` and overlay width rules intact. Add a compact `.default-grid` that is two columns at roomy widths and one column below the existing mobile breakpoint. Ensure the SVGs remain width-constrained and that captions retain readable contrast.

- [ ] **Step 6: Run the build and UI tests.**

```powershell
npm test
npm run build
```

Expected: the new contract tests remain red only for missing overlay assets until Task 3 onward supplies them; existing control tests pass. Do not commit a knowingly broken intermediate state; commit the build refactor together with the first complete overlay pair in Task 4.

## Task 3: Verify source image URLs and tactical inputs

**Files:**
- Modify: `maps/ancient/assets/map-overview-source.md`
- Modify: `maps/cache/assets/map-overview-source.md`
- Modify: `maps/dust2/assets/map-overview-source.md`
- Modify: `maps/inferno/assets/map-overview-source.md`
- Modify: `maps/mirage/assets/map-overview-source.md`
- Modify: `maps/nuke/assets/map-overview-source.md`
- Modify: `maps/anubis/assets/map-overview-source.md`
- Modify: `sources/research-log.md`

**Interfaces:**
- Each source note exposes one direct `Positioning diagram background URL` used by both new SVGs.
- Each new research-log entry names the source-backed role, route, hold-angle, or pressure claim and its replacement trigger.

- [ ] **Step 1: Write a source-note contract test for direct overview URLs.**

Extend `web/test/overlay-contract.test.mjs` to read each source note and assert that it contains a direct `http` image URL and both `default-t.svg` and `default-ct.svg` records.

- [ ] **Step 2: Verify or discover the direct overview URL for every map.**

Use the source page already recorded for each map. For Ancient, Dust II, Inferno, Mirage, Nuke, and Anubis, preserve the recorded CSGold image URL. For Cache, identify the current direct overview image URL from the cited Hotspawn page or another permitted current overview source and record its source page, checked date, map-version note, and attribution basis. Do not invent a URL or use a synthetic background.

- [ ] **Step 3: Add the tactical research records.**

For each map, record the existing offense/defense plan claims that justify the T routes and CT holds. Add a source title, URL, date checked, supported roles/routes/angles, map-version note, and replacement trigger. Use web research for unstable current-map claims and cite only primary/authoritative or directly relevant sources in the repository notes.

- [ ] **Step 4: Run the source-note contract.**

```powershell
npm test -- --test-name-pattern "source|background"
```

Expected: PASS for all seven source notes before SVG authoring begins.

- [ ] **Step 5: Commit the verified source records.**

```powershell
git add maps/*/assets/map-overview-source.md sources/research-log.md web/test/overlay-contract.test.mjs
git commit -m "docs: record default overlay sources"
```

## Task 4: Author Ancient and Cache overlays and Markdown integration

**Files:**
- Create: `maps/ancient/assets/default-t.svg`
- Create: `maps/ancient/assets/default-ct.svg`
- Create: `maps/cache/assets/default-t.svg`
- Create: `maps/cache/assets/default-ct.svg`
- Modify: `maps/ancient/README.md`
- Modify: `maps/cache/README.md`

**Interfaces:**
- Each SVG uses `<image href="<direct-source-url>">` as its background and five player groups with the metadata contract.
- Each README embeds the two files with alt text, captions, source-note links, and a generated-page link.

- [ ] **Step 1: Add the two red/blue five-player SVGs for Ancient.**

Use the verified Ancient map background. Place five T markers at the clear T spawn/early-lane areas and draw routes for the default’s lane split and first pressure point from the existing Ancient offense plan. Place five CT markers on the documented A/B/Mid responsibilities and draw hold rays toward the first contested lanes from the defense plan. Add a source note, legend, title, description, and exactly five `data-side="t"` or `data-side="ct"` groups.

- [ ] **Step 2: Add the Ancient README section and links.**

Insert the web companion link near the top and a `Five-player defaults` section after the context/positioning content. T comes first, CT second, and captions explain the initial pressure/hold rule without exact lineups.

- [ ] **Step 3: Add the two SVGs and README section for Cache.**

Use the verified returned-Cache overview. Draw the T three-lane pressure and CT A/B/Mid/rotator responsibilities supported by the current Cache plan. Keep labels compatible with the current Cache callouts.

- [ ] **Step 4: Run the map contract.**

```powershell
npm test -- --test-name-pattern "ancient|cache|overlay contract"
```

Expected: PASS for Ancient and Cache SVG metadata, source background references, README links, and five-player counts.

- [ ] **Step 5: Commit the pair.**

```powershell
git add maps/ancient maps/cache
git commit -m "feat: add Ancient and Cache player defaults"
```

## Task 5: Author Dust II and Inferno overlays and Markdown integration

**Files:**
- Create: `maps/dust2/assets/default-t.svg`
- Create: `maps/dust2/assets/default-ct.svg`
- Create: `maps/inferno/assets/default-t.svg`
- Create: `maps/inferno/assets/default-ct.svg`
- Modify: `maps/dust2/README.md`
- Modify: `maps/inferno/README.md`

- [ ] **Step 1: Author Dust II overlays.**

Show the T Long/Mid/Cat/Tunnels routes and initial split pressure supported by the Dust II offense plan. Show CT Long, A, Mid, and B holds with sightline rays and a clear first-rotation trigger. Keep the source background visible and do not turn the overlay into a new map drawing.

- [ ] **Step 2: Author Inferno overlays.**

Show the T Banana/A-side pressure and the CT Banana layers, A anchor, and Mid rotator supported by the current Inferno plan. Use the existing context visual only as a separate visual; the new pair must use the verified remote Inferno overview as its bottom layer.

- [ ] **Step 3: Integrate both README files.**

Add the web link, T/CT images, captions, and source-note links without removing the existing positioning visual or guide content.

- [ ] **Step 4: Run the map contract and existing Inferno build tests.**

```powershell
npm test -- --test-name-pattern "dust2|inferno|overlay contract"
npm run build
```

Expected: PASS for the two maps and no regression in the Inferno-generated page controls.

- [ ] **Step 5: Commit the pair.**

```powershell
git add maps/dust2 maps/inferno
git commit -m "feat: add Dust II and Inferno player defaults"
```

## Task 6: Author Mirage and Nuke overlays and Markdown integration

**Files:**
- Create: `maps/mirage/assets/default-t.svg`
- Create: `maps/mirage/assets/default-ct.svg`
- Create: `maps/nuke/assets/default-t.svg`
- Create: `maps/nuke/assets/default-ct.svg`
- Modify: `maps/mirage/README.md`
- Modify: `maps/nuke/README.md`

- [ ] **Step 1: Author Mirage overlays.**

Show five T players distributing through Mid, A Ramp/Palace, B Apartments, and the first split pressure. Show five CT players holding A, B, Mid/Window/Connector, and the first rotation lanes. Use route arrows and hold rays rather than a synthetic radar.

- [ ] **Step 2: Author Nuke overlays.**

Use the remote sourced overview as the base and make the upper/lower distinction explicit. Show T Outside/Ramp/Secret pressure and CT upper/lower anchors, Ramp, Outside, and rotation transitions. Every vertical transition must be labeled in text as well as represented graphically.

- [ ] **Step 3: Integrate both README files and source-note links.**

Keep the existing two-layer context diagram, add the default pair, and add the generated-page link.

- [ ] **Step 4: Run the map contract.**

```powershell
npm test -- --test-name-pattern "mirage|nuke|overlay contract"
```

Expected: PASS with Nuke’s upper/lower metadata and all labels present.

- [ ] **Step 5: Commit the pair.**

```powershell
git add maps/mirage maps/nuke
git commit -m "feat: add Mirage and Nuke player defaults"
```

## Task 7: Author Anubis overlays and finish Markdown integration

**Files:**
- Create: `maps/anubis/assets/default-t.svg`
- Create: `maps/anubis/assets/default-ct.svg`
- Modify: `maps/anubis/README.md`
- Modify: `README.md`
- Modify: `HANDOFF.md`

- [ ] **Step 1: Author Anubis overlays.**

Show T Mid/Connector/Water/Canal pressure and five role-specific routes. Show CT site anchors, Mid/Connector information responsibility, Water/Canal holds, and the first rotation trigger. Keep current post-January-2026 map context and source notes visible.

- [ ] **Step 2: Integrate the Anubis README and root README.**

Add the two overlays and web link to Anubis. Update the root web-guide description to point to the seven-map companion while retaining the reading order and map links.

- [ ] **Step 3: Update the handoff.**

Replace the recommended “seven Active Duty five-player setup diagrams” task with the actual completion state and list any remaining maintenance trigger, such as re-checking direct source URLs after map geometry changes.

- [ ] **Step 4: Run the full content contract.**

```powershell
npm test -- --test-name-pattern "overlay|README|source"
```

Expected: PASS for all fourteen overlays, seven source notes, and seven README integrations.

- [ ] **Step 5: Commit the final content pair.**

```powershell
git add maps/anubis README.md HANDOFF.md
git commit -m "feat: add Anubis player defaults"
```

## Task 8: Complete web tests, render, and visual QA

**Files:**
- Modify: `web/test/build.test.mjs`
- Modify: `web/test/ui-contract.test.mjs`
- Modify: `web/test/deployment-contract.test.mjs`
- Modify: `web/styles.css` if visual QA finds a layout defect

- [ ] **Step 1: Strengthen generated-page assertions.**

Assert the landing page lists all seven map pages, every generated map page includes both default images and its source-note link, no local Markdown links leak into generated HTML, and existing map-control selectors remain present.

- [ ] **Step 2: Run the complete test suite and build.**

```powershell
npm test
npm run build
```

Expected: all Node tests pass and `web/dist` contains the landing page, seven map pages, shared assets, context SVGs, and fourteen default SVGs.

- [ ] **Step 3: Run whitespace and repository checks.**

```powershell
git diff --check
git status --short --branch
```

Expected: no whitespace errors and only the intentional commits/working changes remain.

- [ ] **Step 4: Perform visual QA on generated pages.**

Serve the generated site:

```powershell
npm run preview
```

Inspect Ancient, Inferno, Mirage, Nuke, and Anubis at normal width and mobile width. Confirm the sourced overview remains visible, arrows and hold wedges are legible, labels do not obscure key callouts, T/CT sections stack correctly, and controls still work. If a browser-based visual inspection is unavailable, use SVG XML inspection plus local image rendering of representative files and record that limitation.

- [ ] **Step 5: Commit final verification adjustments.**

```powershell
git add web/test web/styles.css
git commit -m "test: verify active duty guide pages"
```

## Final handoff

After Task 8, report the generated-page paths, test/build output, visual-QA coverage, and any source URLs that need future replacement. Do not claim completion until the verification commands pass and `git diff --check` is clean.

