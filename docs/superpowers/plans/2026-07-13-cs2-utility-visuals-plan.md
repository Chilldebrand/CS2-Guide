# CS2 Utility Visuals and Positioning Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a source-backed, reusable system of utility lineup cards and annotated player-positioning diagrams, prove it on Inferno, then roll it out across all 15 map folders.

**Architecture:** Keep each map’s existing utility table as the canonical tactical data. Add local assets under `maps/<map>/assets/`, use Markdown for the explanatory cards, and use editable SVG for verified positioning overlays. Remote source pages remain acceptable when local screenshot storage is not permitted or cannot be verified.

**Tech Stack:** Markdown, local PNG/JPG screenshots only where permitted, hand-authored SVG overlays, PowerShell structural/link checks, Git.

## Global Constraints

- Use the existing 15-map scope dated July 13, 2026.
- Do not generate or invent map geometry with AI.
- Utility cards must show start, aim, result, purpose, and teammate follow-up/fallback.
- Every visual source note must include URL, date checked, map version/date, asset status, attribution, and replacement trigger.
- Keep screenshots source-backed and do not copy assets without a clear attribution and permission basis.
- Keep Office, Italy, and Shelter objective-correct for hostage mode; do not add bombsite, plant, or post-plant instructions.
- Re-run the existing map-structure, Markdown-link, ten-principle, and hostage-terminology checks after each rollout batch.

---

### Task 1: Define the pilot asset contract and source metadata

**Files:**
- Modify: `maps/inferno/assets/map-overview-source.md`
- Create: `maps/inferno/assets/utility/README.md`
- Modify: `sources/research-log.md`

**Interfaces:**
- Consumes: the approved design in `docs/superpowers/specs/2026-07-13-cs2-utility-visuals-design.md` and the existing Inferno utility table.
- Produces: the exact pilot naming, attribution, and metadata contract used by later map batches.

- [ ] **Step 1: Add the pilot asset contract**

  Create `maps/inferno/assets/utility/README.md` with the following rules:

  ```markdown
  # Inferno utility visual assets

  Lineup asset names use `<map>-<side>-<grenade>-<target>-<stage>`, where `<stage>` is `start`, `aim`, or `result`.

  Each lineup card must identify:

  - the exact target from `maps/inferno/utility.md`;
  - start position, aim reference, and throw type;
  - landing/coverage result;
  - teammate action enabled;
  - missed-throw fallback;
  - source page, direct asset URL when different, date checked, and map/version note.

  A source image may remain remote when local storage is not permitted or the image cannot be verified. In that case, the card must label it `Remote source — not stored locally` and link the source page.
  ```

- [ ] **Step 2: Expand Inferno source metadata**

  Modify `maps/inferno/assets/map-overview-source.md` to retain the existing map source and add:

  - local annotated asset status;
  - positioning diagram filename once created;
  - utility screenshot source pages and direct image URLs when available;
  - checked date `2026-07-13`;
  - map-version note and replacement trigger;
  - attribution/license or permission basis for every locally stored image.

- [ ] **Step 3: Record the pilot research entry**

  Add a dated section to `sources/research-log.md` that names Inferno as the visual pilot, records the source pages checked, and distinguishes sourced in-game screenshots from hand-authored SVG annotations.

- [ ] **Step 4: Verify metadata before asset work**

  Run:

  ```powershell
  $required = @(
    'maps/inferno/assets/utility/README.md',
    'maps/inferno/assets/map-overview-source.md',
    'sources/research-log.md'
  )
  foreach ($file in $required) {
    if (-not (Test-Path $file -PathType Leaf)) { throw "Missing $file" }
  }
  $source = Get-Content -Raw 'maps/inferno/assets/map-overview-source.md'
  foreach ($token in 'http','2026-07-13','Status','replacement') {
    if ($source -notmatch [regex]::Escape($token)) { throw "Missing source-note token $token" }
  }
  ```

- [ ] **Step 5: Commit the pilot contract**

  ```powershell
  git add maps/inferno/assets sources/research-log.md
  git commit -m "docs: define Inferno visual asset contract"
  ```

### Task 2: Create the Inferno positioning diagram

**Files:**
- Create: `maps/inferno/assets/positioning-overview.svg`
- Modify: `maps/inferno/README.md`
- Modify: `maps/inferno/assets/map-overview-source.md`

**Interfaces:**
- Consumes: the verified Inferno overview source and the existing Inferno offense/defense language.
- Produces: a local SVG with a legend, player markers, utility zones, and rotation arrows that can be embedded in Markdown.

- [ ] **Step 1: Establish the SVG structure**

  Create a self-contained SVG with a `viewBox`, readable text, a neutral map-overview base layer, and a legend. Use the approved annotation colors: blue defenders, red attackers, yellow active utility/danger zones, and white movement/rotation arrows. Keep labels to callouts and role names.

- [ ] **Step 2: Add the Inferno setup**

  Show a simple round setup rather than every possible position: CT Banana anchor and support, A-side anchor, mid/rotation player, two T-side pressure points, Banana pressure, A-side pressure, and the principal rotation arrows. Mark the setup as a teaching diagram, not a pixel-perfect radar replacement.

- [ ] **Step 3: Add accessibility text**

  Include an SVG `<title>` and `<desc>` that summarize the setup, and use sufficient contrast between map background, markers, labels, and arrows.

- [ ] **Step 4: Embed the diagram in Inferno README**

  Add a `## Positioning visual` section to `maps/inferno/README.md` with the local image, meaningful alt text, a link to `assets/map-overview-source.md`, and three numbered setup notes: starting roles, information trigger, and rotation/trade path.

- [ ] **Step 5: Update source metadata**

  Record `positioning-overview.svg` as a local annotated asset, note its base overview source, set the checked date, and state that it must be replaced when the verified map geometry or callouts change.

- [ ] **Step 6: Inspect the SVG**

  Open the SVG in a browser or image viewer and verify that it is readable at the width used by the README, with no clipped labels, missing markers, or arrows that cross unrelated text.

- [ ] **Step 7: Commit the positioning diagram**

  ```powershell
  git add maps/inferno/README.md maps/inferno/assets
  git commit -m "docs: add Inferno positioning diagram"
  ```

### Task 3: Add Inferno utility lineup cards

**Files:**
- Create: `maps/inferno/assets/utility/inferno-ct-molly-banana-start.png` when a permitted local screenshot is available
- Create: `maps/inferno/assets/utility/inferno-ct-molly-banana-aim.png` when a permitted local screenshot is available
- Create: `maps/inferno/assets/utility/inferno-ct-molly-banana-result.png` when a permitted local screenshot is available
- Create: `maps/inferno/assets/utility/inferno-t-smoke-ct-coffins-start.png` when a permitted local screenshot is available
- Create: `maps/inferno/assets/utility/inferno-t-smoke-ct-coffins-aim.png` when a permitted local screenshot is available
- Create: `maps/inferno/assets/utility/inferno-t-smoke-ct-coffins-result.png` when a permitted local screenshot is available
- Create: `maps/inferno/assets/utility/inferno-t-smoke-arch-library-start.png` when a permitted local screenshot is available
- Create: `maps/inferno/assets/utility/inferno-t-smoke-arch-library-aim.png` when a permitted local screenshot is available
- Create: `maps/inferno/assets/utility/inferno-t-smoke-arch-library-result.png` when a permitted local screenshot is available
- Modify: `maps/inferno/utility.md`
- Modify: `maps/inferno/assets/map-overview-source.md`
- Modify: `sources/research-log.md`

**Interfaces:**
- Consumes: the asset contract from Task 1 and the Inferno utility table.
- Produces: three visual lineup cards that each point back to an exact utility-table target and preserve a text fallback when a local screenshot is unavailable.

- [ ] **Step 1: Verify current source pages**

  Check the referenced Inferno grenade guides and record the page title, URL, screenshot availability, date checked, map/version context, and whether local reuse is permitted. Do not download or commit an image until its attribution/permission basis is clear.

- [ ] **Step 2: Store permitted screenshots or keep remote references**

  For each of the three pilot lineups, either store the three stage images under `maps/inferno/assets/utility/` with stable filenames or keep the source page remote and label the card as not stored locally. Never substitute an unverified screenshot.

- [ ] **Step 3: Add the visual lineup section**

  Add `## Visual lineups` to `maps/inferno/utility.md`. For each card, use this exact content shape:

  ```markdown
  ### <Exact utility-table target>

  **Side / role:** <side and thrower role>  
  **Timing:** <timing from the table>  
  **Purpose:** <purpose from the table>

  1. **Start:** <position and callout>. [Start image or source page]
  2. **Aim:** <crosshair reference and throw type>. [Aim image or source page]
  3. **Result:** <landing/coverage and teammate action>. [Result image or source page]

  **Fallback:** <missed-throw fallback from the table>
  **Source:** <attributed source page and checked date>
  ```

- [ ] **Step 4: Check card completeness**

  Run:

  ```powershell
  $text = Get-Content -Raw 'maps/inferno/utility.md'
  foreach ($heading in 'CT molly Banana','T smoke CT/Coffins','T smoke Arch or Library') {
    if ($text -notmatch [regex]::Escape($heading)) { throw "Missing lineup heading $heading" }
  }
  foreach ($token in 'Start:','Aim:','Result:','Fallback:','Source:') {
    if (([regex]::Matches($text, [regex]::Escape($token))).Count -lt 3) { throw "Expected three $token labels" }
  }
  ```

- [ ] **Step 5: Update source notes and research log**

  Add the three lineup source records, local/remote status, checked date, map-version note, and replacement trigger to the Inferno source note and the visual research log.

- [ ] **Step 6: Inspect the cards in rendered Markdown**

  Verify that local images display at a readable size, remote cards are clearly labeled, alt text names the stage and target, and no card claims a local asset that does not exist.

- [ ] **Step 7: Commit the Inferno utility cards**

  ```powershell
  git add maps/inferno/utility.md maps/inferno/assets sources/research-log.md
  git commit -m "docs: add Inferno utility lineup cards"
  ```

### Task 4: Validate the Inferno pilot and update QA

**Files:**
- Modify: `docs/qa-report.md`

**Interfaces:**
- Consumes: Inferno positioning and utility visuals from Tasks 2 and 3.
- Produces: evidence that the visual format works before map-wide rollout.

- [ ] **Step 1: Verify all pilot files**

  Run:

  ```powershell
  $files = @(
    'maps/inferno/README.md',
    'maps/inferno/utility.md',
    'maps/inferno/assets/map-overview-source.md',
    'maps/inferno/assets/positioning-overview.svg',
    'maps/inferno/assets/utility/README.md'
  )
  foreach ($file in $files) { if (-not (Test-Path $file -PathType Leaf)) { throw "Missing $file" } }
  ```

- [ ] **Step 2: Verify internal links and local image targets**

  Re-run the existing link checker from `docs/qa-report.md`, then scan Markdown image targets under `maps/inferno/`. Every relative image target must resolve; every HTTP target must be explicitly recorded as remote in the source note.

- [ ] **Step 3: Re-run baseline guide checks**

  Re-run the 15-map required-file check, ten-principle count, hostage terminology check, and source-note coverage check from the existing QA workflow.

- [ ] **Step 4: Update QA evidence**

  Add an Inferno pilot subsection to `docs/qa-report.md` with asset names, local/remote status, source metadata status, and any intentionally pending screenshot.

- [ ] **Step 5: Commit pilot QA**

  ```powershell
  git add docs/qa-report.md
  git commit -m "docs: verify Inferno visual pilot"
  ```

### Task 5: Roll out the visual system to Premier maps

**Files:**
- Modify: `maps/ancient/README.md`, `maps/ancient/utility.md`, `maps/ancient/assets/map-overview-source.md`
- Modify: `maps/cache/README.md`, `maps/cache/utility.md`, `maps/cache/assets/map-overview-source.md`
- Modify: `maps/dust2/README.md`, `maps/dust2/utility.md`, `maps/dust2/assets/map-overview-source.md`
- Modify: `maps/mirage/README.md`, `maps/mirage/utility.md`, `maps/mirage/assets/map-overview-source.md`
- Modify: `maps/nuke/README.md`, `maps/nuke/utility.md`, `maps/nuke/assets/map-overview-source.md`
- Modify: `maps/anubis/README.md`, `maps/anubis/utility.md`, `maps/anubis/assets/map-overview-source.md`
- Create per map: `maps/<map>/assets/utility/README.md`, `maps/<map>/assets/positioning-overview.svg` when geometry is verified
- Modify: `sources/research-log.md`, `docs/qa-report.md`

**Interfaces:**
- Consumes: the validated Inferno card structure and SVG conventions.
- Produces: consistent visual entry points for Ancient, Cache, Dust II, Mirage, Nuke, and Anubis.

- [ ] **Step 1: Build Ancient and Cache cards/diagrams**

  Select three high-value entries from each existing utility table, preserving the exact table target names. Add the asset README, source metadata, positioning diagram, README section, utility cards, and research-log entries. Use the map-specific lessons already written: Ancient mid/B pressure and Temple/Donut denial; Cache mid/vent/connector pressure and A/B main spacing.

- [ ] **Step 2: Verify Ancient and Cache**

  Run the per-map file, card-completeness, local-image-link, and source-metadata checks before committing:

  ```powershell
  foreach ($map in 'ancient','cache') {
    foreach ($file in @("maps/$map/README.md","maps/$map/utility.md","maps/$map/assets/map-overview-source.md","maps/$map/assets/utility/README.md")) {
      if (-not (Test-Path $file -PathType Leaf)) { throw "Missing $file" }
    }
  }
  ```

- [ ] **Step 3: Commit Ancient and Cache**

  ```powershell
  git add maps/ancient maps/cache sources/research-log.md
  git commit -m "docs: add Ancient and Cache visual utility guides"
  ```

- [ ] **Step 4: Build Dust II and Mirage cards/diagrams**

  For each of `maps/dust2/` and `maps/mirage/`, create `assets/utility/README.md` and `assets/positioning-overview.svg` when geometry is verified; add three purpose-first cards to `utility.md`; add a positioning section to `README.md`; and update the map source note plus `sources/research-log.md`. Use Dust II long/mid/cat/tunnel priorities and Mirage mid/window/connector/A/B pressure priorities.

- [ ] **Step 5: Verify and commit Dust II and Mirage**

  For both maps, confirm `README.md`, `utility.md`, `assets/map-overview-source.md`, `assets/utility/README.md`, and `assets/positioning-overview.svg` exist; confirm every local Markdown image target resolves; confirm each card has Start, Aim, Result, Fallback, and Source labels; inspect the visuals; then commit:

  ```powershell
  git add maps/dust2 maps/mirage sources/research-log.md
  git commit -m "docs: add Dust2 and Mirage visual utility guides"
  ```

- [ ] **Step 6: Build Nuke and Anubis cards/diagrams**

  For each of `maps/nuke/` and `maps/anubis/`, create `assets/utility/README.md` and `assets/positioning-overview.svg` when geometry is verified; add three purpose-first cards to `utility.md`; add a positioning section to `README.md`; and update the map source note plus `sources/research-log.md`. Use Nuke outside/lower-site/vent priorities and Anubis mid/connector/water/canal/B isolation priorities. Ensure the diagrams distinguish vertical or route-sensitive positioning where relevant.

- [ ] **Step 7: Verify, update QA, and commit Nuke and Anubis**

  Run the per-map and baseline checks, append coverage to `docs/qa-report.md`, inspect the assets, then commit:

  ```powershell
  git add maps/nuke maps/anubis sources/research-log.md docs/qa-report.md
  git commit -m "docs: add Nuke and Anubis visual utility guides"
  ```

### Task 6: Roll out the visual system to Competitive-only maps

**Files:**
- Modify: `maps/train/README.md`, `maps/train/utility.md`, `maps/train/assets/map-overview-source.md`
- Modify: `maps/vertigo/README.md`, `maps/vertigo/utility.md`, `maps/vertigo/assets/map-overview-source.md`
- Modify: `maps/overpass/README.md`, `maps/overpass/utility.md`, `maps/overpass/assets/map-overview-source.md`
- Modify: `maps/boulder/README.md`, `maps/boulder/utility.md`, `maps/boulder/assets/map-overview-source.md`
- Modify: `maps/fachwerk/README.md`, `maps/fachwerk/utility.md`, `maps/fachwerk/assets/map-overview-source.md`
- Modify: `maps/office/README.md`, `maps/office/utility.md`, `maps/office/assets/map-overview-source.md`
- Modify: `maps/italy/README.md`, `maps/italy/utility.md`, `maps/italy/assets/map-overview-source.md`
- Modify: `maps/shelter/README.md`, `maps/shelter/utility.md`, `maps/shelter/assets/map-overview-source.md`
- Create when geometry is verified: `maps/train/assets/utility/README.md`, `maps/train/assets/positioning-overview.svg`, and the equivalent `assets/utility/README.md` plus `assets/positioning-overview.svg` files for `vertigo`, `overpass`, `boulder`, `fachwerk`, `office`, `italy`, and `shelter`.
- Modify: `sources/research-log.md`, `docs/qa-report.md`

**Interfaces:**
- Consumes: the validated Premier-map visual system.
- Produces: visual utility and positioning entry points for all remaining maps, including objective-correct hostage-map diagrams.

- [ ] **Step 1: Build Train, Vertigo, and Overpass visuals**

  Select three high-value entries per map, create source metadata and positioning diagrams, and link each visual from the map README and utility file. Preserve each map’s existing route and objective language.

- [ ] **Step 2: Verify and commit Train, Vertigo, and Overpass**

  Run the per-map asset/link/source checks and inspect the diagrams, then commit:

  ```powershell
  git add maps/train maps/vertigo maps/overpass sources/research-log.md
  git commit -m "docs: add Train Vertigo Overpass visual utility guides"
  ```

- [ ] **Step 3: Build Boulder and Fachwerk visuals**

  Verify community-map geometry and callouts before drawing. If reliable geometry or screenshot sources are unavailable, keep the visual marked pending and provide a source-page link instead of inventing a diagram.

- [ ] **Step 4: Verify and commit Boulder and Fachwerk**

  Run the per-map source/link checks, inspect any local diagrams, update QA, then commit:

  ```powershell
  git add maps/boulder maps/fachwerk sources/research-log.md docs/qa-report.md
  git commit -m "docs: add Boulder and Fachwerk visual utility guides"
  ```

- [ ] **Step 5: Build Office, Italy, and Shelter hostage visuals**

  Create visual cards and positioning diagrams with attacker/defender labels, hostage-room access, rescue routes, safe exits, and anti-rush/room-isolation utility. Do not use bombsite, plant, or post-plant terminology in the new sections.

- [ ] **Step 6: Verify hostage terminology and commit**

  Run:

  ```powershell
  $hostage = 'maps/office','maps/italy','maps/shelter'
  foreach ($dir in $hostage) {
    $matches = Get-ChildItem $dir -Recurse -Filter *.md | Select-String -Pattern 'bombsite|post-plant|\bplant\b'
    if ($matches) { $matches | Format-Table; throw "Hostage terminology found in $dir" }
  }
  git add maps/office maps/italy maps/shelter sources/research-log.md docs/qa-report.md
  git commit -m "docs: add hostage-map visual utility guides"
  ```

### Task 7: Final visual QA and handoff

**Files:**
- Modify: `docs/qa-report.md`
- Modify: `HANDOFF.md` if the next-chat handoff needs new follow-up notes

**Interfaces:**
- Consumes: all map visual assets, Markdown sections, and source metadata.
- Produces: a complete evidence report and a clean handoff for future map-version updates.

- [ ] **Step 1: Verify the 15-map file set**

  Run the existing required-file check for all 15 maps and confirm every map has its source note and utility asset README.

- [ ] **Step 2: Verify every local visual reference**

  Scan all Markdown image targets and confirm every relative path resolves. Scan every source note for URL, checked date, map version/date, status, attribution, and replacement trigger.

- [ ] **Step 3: Verify utility card completeness**

  For each map with visual cards, confirm each card has Start, Aim, Result, Fallback, and Source labels and that the target matches a utility-table row.

- [ ] **Step 4: Inspect a representative sample**

  Visually inspect Inferno, one other Premier map, one Competitive-only defusal map, and one hostage map at normal Markdown width. Check label readability, contrast, unclipped SVG content, and useful visual hierarchy.

- [ ] **Step 5: Update QA report and handoff**

  Record the final map count, local/remote visual coverage, intentionally pending assets, source status, and replacement triggers. Update the handoff with the next maintenance action: re-check visuals after map-pool or geometry changes.

- [ ] **Step 6: Commit final QA**

  ```powershell
  git add docs/qa-report.md HANDOFF.md
  git commit -m "docs: complete utility visual QA and handoff"
  ```
