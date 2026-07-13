# CS2 New Player Competitive Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a research-backed, folder-based Markdown guide that helps new CS2 players climb Competitive/Premier ranks through general fundamentals, map-specific offense/defense, purposeful utility, and maintainable map visuals.

**Architecture:** A root README provides navigation and the dated map-pool scope. General and utility topics live in focused numbered Markdown files. Each of the 15 in-scope maps gets its own folder with a README, offense guide, defense guide, utility guide, and visual source note; hostage maps use objective-appropriate terminology. A sources directory records official facts, community references, and editorial synthesis.

**Tech Stack:** Markdown, local PNG/JPG map visuals where available, PowerShell verification scripts/commands, Git.

## Global Constraints

- The first-pass map scope is fixed at 15 5v5 maps as of July 13, 2026: Ancient, Cache, Dust II, Inferno, Mirage, Nuke, Anubis, Train, Vertigo, Overpass, Office, Italy, Boulder, Fachwerk, and Shelter.
- Premier/Active Duty maps are Ancient, Cache, Dust II, Inferno, Mirage, Nuke, and Anubis; the remaining eight are Competitive-only.
- Each map must have `README.md`, `offense.md`, `defense.md`, `utility.md`, and `assets/map-overview-source.md`.
- The guide must contain exactly ten essential general principles.
- Utility entries must state purpose, timing, thrower, and teammate follow-up; do not create an unexplained lineup dump.
- Office, Italy, and Shelter must be written as hostage-mode guides and must not contain misleading bombsite/post-plant instructions.
- Visuals must be sourced and dated; future annotated diagrams must be easy to add without changing folder navigation.
- The root guide must state the map-pool date and link to the official Valve update and current map-pool reference.

---

### Task 1: Establish repository documentation structure and research log

**Files:**
- Create: `README.md`
- Create: `docs/superpowers/specs/2026-07-13-cs2-new-player-guide-design.md`
- Create: `sources/map-pool.md`
- Create: `sources/research-log.md`
- Create: `general/README.md`
- Create: `utility/README.md`
- Create: `maps/README.md`

**Interfaces:**
- Produces the navigation targets and terminology that all later map files must use.
- Produces the dated pool classification and source links used by later map guides.

- [ ] **Step 1: Write the root navigation and scope**

  Add a concise introduction, recommended reading order, links to `general/`, `utility/`, `maps/`, and the 15 map folders, plus a “current as of” note dated July 13, 2026.

- [ ] **Step 2: Record map-pool facts and sources**

  In `sources/map-pool.md`, list the seven Premier maps and eight Competitive-only maps. Link to Valve’s July 8, 2026 Season 5 update and the current map-pool reference. Note that Valve may rotate maps and that the date is part of the guide’s scope.

- [ ] **Step 3: Create the research log**

  In `sources/research-log.md`, separate official facts, community references, and editorial synthesis. Add a source-entry format with title, URL, date checked, and what claim it supports.

- [ ] **Step 4: Verify navigation targets exist as directories**

  Run:

  ```powershell
  $folders = 'general','utility','maps','sources'
  $folders | ForEach-Object { if (-not (Test-Path $_ -PathType Container)) { throw "Missing $_" } }
  ```

  Expected: no output and exit code 0.

- [ ] **Step 5: Commit the documentation skeleton**

  Run:

  ```powershell
  git add README.md docs sources general/README.md utility/README.md maps/README.md
  git commit -m "docs: scaffold CS2 competitive guide"
  ```

### Task 2: Write general rank-up fundamentals

**Files:**
- Create: `general/01-essential-principles.md`
- Create: `general/02-aim-movement-and-peeking.md`
- Create: `general/03-economy-and-buy-calls.md`
- Create: `general/04-communication-and-teamplay.md`
- Create: `general/05-round-flow-and-mid-rounding.md`
- Create: `general/06-practice-and-demo-review.md`

**Interfaces:**
- Consumes: general navigation from Task 1.
- Produces: the non-map curriculum linked from the root README.

- [ ] **Step 1: Write exactly ten essential principles**

  Use one numbered section per principle. Each section must include: why it raises rank, the in-game behavior, one measurable practice cue, and one common failure mode. Do not add an eleventh principle.

- [ ] **Step 2: Write aim, movement, and peeking guidance**

  Cover counter-strafing, crosshair placement, clearing order, jiggle/shoulder peeks, wide swings, isolation, and tradeable spacing. Tie each technique to when it is useful rather than presenting it as a universal rule.

- [ ] **Step 3: Write economy and buy calls**

  Cover full buy, force buy, half buy, save, anti-eco spacing, utility purchase priorities, and synchronized team buys. Include concise sample voice calls.

- [ ] **Step 4: Write communication, round flow, and review routines**

  Cover useful call structure, information confidence, default-to-execute timing, mid-round branches, post-plant positioning, a 30–45 minute practice routine, and a demo-review worksheet.

- [ ] **Step 5: Verify the general guide count**

  Run:

  ```powershell
  $text = Get-Content -Raw general/01-essential-principles.md
  $count = ([regex]::Matches($text, '(?m)^## Essential Principle \d+:')).Count
  if ($count -ne 10) { throw "Expected 10 principles, found $count" }
  ```

  Expected: no output and exit code 0.

- [ ] **Step 6: Commit general fundamentals**

  ```powershell
  git add general
  git commit -m "docs: add rank-up fundamentals"
  ```

### Task 3: Write shared utility curriculum

**Files:**
- Create: `utility/01-grenades-that-win-rounds.md`
- Create: `utility/02-practice-server-and-lineup-method.md`
- Create: `utility/03-utility-terminology.md`

**Interfaces:**
- Consumes: grenade priorities and terminology used by map-specific utility files.
- Produces: the shared utility concepts linked by every map guide.

- [ ] **Step 1: Explain grenade purpose by decision**

  Cover smokes for blocking/isolating, flashes for taking a fight, molotovs/incendiaries for denial, HEs for damage/finish, and decoys only where they have a defined information or sound purpose.

- [ ] **Step 2: Add a safe lineup-practice method**

  Include a practice-server command block, repeatability checks, landing-point checks, and a rule to learn a small set of stable lineups before adding more. Do not claim a lineup is universal if the map version may change it.

- [ ] **Step 3: Add utility vocabulary**

  Define default, pop flash, exec, one-way, re-smoke, stall, clear, anti-flash, and post-plant utility in beginner-readable language.

- [ ] **Step 4: Commit shared utility curriculum**

  ```powershell
  git add utility
  git commit -m "docs: add utility fundamentals"
  ```

### Task 4: Write Premier map guides, batch one

**Files:**
- Create: `maps/ancient/README.md`, `maps/ancient/offense.md`, `maps/ancient/defense.md`, `maps/ancient/utility.md`, `maps/ancient/assets/map-overview-source.md`
- Create: `maps/cache/README.md`, `maps/cache/offense.md`, `maps/cache/defense.md`, `maps/cache/utility.md`, `maps/cache/assets/map-overview-source.md`
- Create: `maps/dust2/README.md`, `maps/dust2/offense.md`, `maps/dust2/defense.md`, `maps/dust2/utility.md`, `maps/dust2/assets/map-overview-source.md`
- Create: `maps/inferno/README.md`, `maps/inferno/offense.md`, `maps/inferno/defense.md`, `maps/inferno/utility.md`, `maps/inferno/assets/map-overview-source.md`

**Interfaces:**
- Consumes: map template from the design specification and shared utility terminology from Task 3.
- Produces: four independently usable Premier map guides.

- [ ] **Step 1: Create the four map folder skeletons**

  Create the four required Markdown files and `assets/` folder in each directory. Each source note must state whether a local visual is present or pending and record the source/search status.

- [ ] **Step 2: Write Ancient and Cache content**

  Ancient: center the guide on mid control, lane isolation, B-site pressure, Temple/Donut denial, and CT information recovery. Cache: center it on mid control, vent/connector pressure, A main and B main spacing, and the map’s aim-heavy but utility-sensitive lanes.

- [ ] **Step 3: Write Dust II and Inferno content**

  Dust II: center it on long/mid control, cat/short timing, tunnel pressure, and post-plant crossfires. Inferno: center it on banana control, arch/library rotations, bracket pressure, and disciplined site retakes.

- [ ] **Step 4: Add purposeful utility tables**

  Each map utility file must contain at least five high-value utility entries across both sides, each with purpose, timing, thrower, teammate follow-up, and fallback if the throw is missed.

- [ ] **Step 5: Commit batch one**

  ```powershell
  git add maps/ancient maps/cache maps/dust2 maps/inferno
  git commit -m "docs: add Ancient Cache Dust2 Inferno guides"
  ```

### Task 5: Write Premier map guides, batch two

**Files:**
- Create: `maps/mirage/README.md`, `maps/mirage/offense.md`, `maps/mirage/defense.md`, `maps/mirage/utility.md`, `maps/mirage/assets/map-overview-source.md`
- Create: `maps/nuke/README.md`, `maps/nuke/offense.md`, `maps/nuke/defense.md`, `maps/nuke/utility.md`, `maps/nuke/assets/map-overview-source.md`
- Create: `maps/anubis/README.md`, `maps/anubis/offense.md`, `maps/anubis/defense.md`, `maps/anubis/utility.md`, `maps/anubis/assets/map-overview-source.md`

**Interfaces:**
- Consumes: the same map template and utility vocabulary as Task 4.
- Produces: the remaining three Premier map guides.

- [ ] **Step 1: Create the three map folder skeletons**

  Match the exact file set used in Task 4 and include a dated visual source note.

- [ ] **Step 2: Write Mirage content**

  Center it on mid control, window/connector information, A ramp and palace spacing, B apartments pressure, and the difference between contact, split, and full execute rounds.

- [ ] **Step 3: Write Nuke content**

  Center it on outside control, lower-site rotations, ramp/secret decision-making, vent timing, vertical sound cues, and the importance of communicating whether a defender is upper or lower.

- [ ] **Step 4: Write Anubis content**

  Center it on mid/connector access, water and canal pressure, B-site isolation, A-main splits, and the map changes recorded in the January 2026 update.

- [ ] **Step 5: Commit batch two**

  ```powershell
  git add maps/mirage maps/nuke maps/anubis
  git commit -m "docs: add Mirage Nuke Anubis guides"
  ```

### Task 6: Write Competitive-only defusal map guides

**Files:**
- Create: `maps/train/README.md`, `maps/train/offense.md`, `maps/train/defense.md`, `maps/train/utility.md`, `maps/train/assets/map-overview-source.md`
- Create: `maps/vertigo/README.md`, `maps/vertigo/offense.md`, `maps/vertigo/defense.md`, `maps/vertigo/utility.md`, `maps/vertigo/assets/map-overview-source.md`
- Create: `maps/overpass/README.md`, `maps/overpass/offense.md`, `maps/overpass/defense.md`, `maps/overpass/utility.md`, `maps/overpass/assets/map-overview-source.md`
- Create: `maps/boulder/README.md`, `maps/boulder/offense.md`, `maps/boulder/defense.md`, `maps/boulder/utility.md`, `maps/boulder/assets/map-overview-source.md`
- Create: `maps/fachwerk/README.md`, `maps/fachwerk/offense.md`, `maps/fachwerk/defense.md`, `maps/fachwerk/utility.md`, `maps/fachwerk/assets/map-overview-source.md`

**Interfaces:**
- Consumes: the defusal map template and research log.
- Produces: five Competitive-only defusal guides that clearly carry lower Premier priority.

- [ ] **Step 1: Create the five map folder skeletons**

  Mark each as Competitive-only in its README and source note. Record when the map entered or re-entered the rotation when the source supports it.

- [ ] **Step 2: Write Train content**

  Focus on ladder/yard control, upper/lower site distinction, connector and ivy pressure, and the need to make outside information actionable.

- [ ] **Step 3: Write Vertigo content**

  Focus on ramp control, spacing on exposed lanes, A/B rotation timing, and the risk of overcommitting to early ramp fights.

- [ ] **Step 4: Write Overpass content**

  Focus on bathrooms/connector control, toilets and short water, long/B pressure, monster timing, and CT rotation discipline. Clearly label Overpass as Competitive-only after the July 2026 Active Duty change.

- [ ] **Step 5: Write Boulder and Fachwerk content**

  Use map-specific layout research rather than assuming standard Active Duty callouts. Emphasize learning the official callouts, first-session route, and simple utility that denies the most common choke points.

- [ ] **Step 6: Commit Competitive defusal batch**

  ```powershell
  git add maps/train maps/vertigo maps/overpass maps/boulder maps/fachwerk
  git commit -m "docs: add competitive defusal map guides"
  ```

### Task 7: Write Competitive-only hostage map guides

**Files:**
- Create: `maps/office/README.md`, `maps/office/offense.md`, `maps/office/defense.md`, `maps/office/utility.md`, `maps/office/assets/map-overview-source.md`
- Create: `maps/italy/README.md`, `maps/italy/offense.md`, `maps/italy/defense.md`, `maps/italy/utility.md`, `maps/italy/assets/map-overview-source.md`
- Create: `maps/shelter/README.md`, `maps/shelter/offense.md`, `maps/shelter/defense.md`, `maps/shelter/utility.md`, `maps/shelter/assets/map-overview-source.md`

**Interfaces:**
- Consumes: hostage-mode rules and shared utility terminology.
- Produces: three objective-correct hostage-mode guides.

- [ ] **Step 1: Create hostage-map folder skeletons**

  Add an explicit `Mode: Hostage` label to each README and source note.

- [ ] **Step 2: Write attacker and defender playbooks**

  Replace offense/defense shorthand with attacker/defender objectives where helpful. Cover hostage-room access, rescue routes, return timing, safe exits, defender anchors, anti-rush utility, and anti-turtle adjustments.

- [ ] **Step 3: Add hostage-specific utility**

  Include smoke and flash uses for room isolation, molotov/incendiary uses for denial, and HE uses for clearing common holds. Do not describe bombsite executes, plants, or post-plants.

- [ ] **Step 4: Commit hostage batch**

  ```powershell
  git add maps/office maps/italy maps/shelter
  git commit -m "docs: add hostage map guides"
  ```

### Task 8: Add map visuals and source notes

**Files:**
- Add or modify: `maps/*/assets/map-overview.png` or `maps/*/assets/map-overview.jpg`
- Modify: every `maps/*/assets/map-overview-source.md`
- Modify: every map `README.md` to embed its visual and link to the source note
- Modify: `sources/research-log.md`

**Interfaces:**
- Consumes: all 15 map folders from Tasks 4–7.
- Produces: visual entry points that work offline when a local asset is available and remain maintainable when map layouts change.

- [ ] **Step 1: Gather one reliable overview or callout image per map**

  Prefer official or clearly attributed map overviews. For newly added community maps, use the most reliable current map page available and record uncertainty rather than inventing geometry.

- [ ] **Step 2: Store source metadata beside each image**

  Record source page, direct image URL if different, date checked, image type, map version/date, and replacement trigger.

- [ ] **Step 3: Embed visuals in map READMEs**

  Add a Markdown image with meaningful alt text and a link to the source note. If a local image cannot be safely obtained, use a clearly labeled source-page link and mark the asset as pending rather than presenting an unverified image as authoritative.

- [ ] **Step 4: Record visual research**

  Add one entry per map family to `sources/research-log.md` so a future annotation pass can replace overview images with local diagrams without rewriting the guide.

- [ ] **Step 5: Commit visuals and source metadata**

  ```powershell
  git add maps sources/research-log.md
  git commit -m "docs: add map visuals and source notes"
  ```

### Task 9: Perform documentation QA and prepare handoff

**Files:**
- Modify: any guide files failing the checks below
- Create: `docs/qa-report.md`

**Interfaces:**
- Consumes: the complete guide from Tasks 1–8.
- Produces: a checked, navigable repository and a short evidence report.

- [ ] **Step 1: Verify all 15 map folders and required files**

  Run:

  ```powershell
  $maps = 'ancient','cache','dust2','inferno','mirage','nuke','anubis','train','vertigo','overpass','office','italy','boulder','fachwerk','shelter'
  foreach ($map in $maps) {
    $required = @("maps/$map/README.md","maps/$map/offense.md","maps/$map/defense.md","maps/$map/utility.md","maps/$map/assets/map-overview-source.md")
    foreach ($file in $required) { if (-not (Test-Path $file -PathType Leaf)) { throw "Missing $file" } }
  }
  ```

  Expected: no output and exit code 0.

- [ ] **Step 2: Verify internal Markdown links**

  Run:

  ```powershell
  $links = Get-ChildItem -Recurse -Filter *.md | Select-String -Pattern '\]\(([^)#]+)(?:#[^)]+)?\)'
  foreach ($match in $links) {
    $target = $match.Matches[0].Groups[1].Value
    if ($target -match '^https?://') { continue }
    $base = Split-Path $match.Path -Parent
    $resolved = [IO.Path]::GetFullPath((Join-Path $base $target))
    if (-not (Test-Path $resolved)) { throw "Broken link $target in $($match.Path)" }
  }
  ```

  Expected: no output and exit code 0.

- [ ] **Step 3: Verify hostage terminology and principle count**

  Search Office, Italy, and Shelter for `bombsite`, `plant`, and `post-plant`; review any matches manually and remove misleading instructions. Re-run the ten-principle count from Task 2.

- [ ] **Step 4: Verify source coverage and visual notes**

  Confirm every map source note includes a source URL, date checked, and asset status. Confirm the root README links to `sources/map-pool.md` and `sources/research-log.md`.

- [ ] **Step 5: Write the QA report**

  In `docs/qa-report.md`, record the commands run, their results, the 15-map count, the ten-principle count, visual coverage, and any intentionally pending annotated drawings.

- [ ] **Step 6: Commit final QA documentation**

  ```powershell
  git add .
  git commit -m "docs: verify CS2 guide navigation and coverage"
  ```

