# CS2 Utility Visuals and Positioning Diagrams Design

## Goal

Add a maintainable visual system for utility lineups and player positioning to the existing folder-based CS2 guide. Build and validate the format with an Inferno pilot, then roll it out across all 15 map folders.

## Approved approach

Use a hybrid system:

- Real, attributed in-game screenshots for lineup instructions where a permitted source is available.
- Deterministic local SVG annotations for positioning, movement, utility coverage, and rotation diagrams.
- Markdown sections that keep each visual tied to the existing purpose-first utility entries and map playbooks.

AI-generated map geometry is out of scope. It is not reliable enough for tactical positioning, and the repository already requires source-backed map visuals.

## Visual components

### 1. Utility lineup card

Each high-value lineup is presented as a compact three-stage card:

1. **Start:** thrower position and relevant nearby callout.
2. **Aim:** crosshair reference and throw type.
3. **Result:** landing/coverage area and the teammate action it enables.

Each card also includes:

- grenade type and target;
- side and role;
- timing/purpose copied from the map utility table;
- a fallback if the throw is missed;
- source attribution and map-version note where the screenshots are sourced.

Use stable, descriptive filenames such as `inferno-t-smoke-ct-coffins-start.png`, `inferno-t-smoke-ct-coffins-aim.png`, and `inferno-t-smoke-ct-coffins-result.png`. If a source provides a combined step image, preserve the source image and document its stages in the card instead of forcing a split.

### 2. Positioning diagram

Each map receives a local annotated diagram when a verified base overview is available. The diagram uses SVG so it remains editable and sharp in Markdown.

Annotation conventions:

- blue markers: defending players;
- red markers: attacking players;
- yellow zones: active utility or danger areas;
- white arrows: intended movement or rotation;
- short labels: role/callout only, avoiding dense prose on the map.

The companion Markdown explains the setup in numbered steps, including who starts where, what information changes the plan, and where the next rotation or trade comes from.

### 3. Map visual index

Each map README gets two entry points:

- a positioning diagram link/embed;
- a link to the utility visual lineup section.

The existing remote map overview remains the source reference until a verified local annotated asset replaces it. The visual source note records whether the local asset is complete, partial, or pending.

## Inferno pilot

The pilot will prove the format with three utility cards and one positioning diagram:

- CT Banana molotov or early Banana denial;
- T-side CT/Coffins smoke for a B execute;
- T-side Arch or Library smoke for A-side rotation pressure;
- a round-positioning diagram showing default roles, Banana/A pressure, and the main rotation paths.

The pilot should use existing Inferno utility priorities and map terminology. It must not add unexplained lineups or contradict the current offense/defense plans.

## Repository layout

Pilot and rollout assets live beside each map:

```text
maps/<map>/assets/
  map-overview-source.md
  positioning-overview.svg
  utility/
    <lineup-id>-start.png
    <lineup-id>-aim.png
    <lineup-id>-result.png
```

If a source image is not legally or technically suitable for local storage, keep it remote, link to the source page, and mark the local asset as pending. Do not copy an image without a clear attribution and permission basis.

## Content interfaces

- `maps/<map>/utility.md` remains the canonical purpose/timing/thrower/follow-up table.
- `maps/<map>/utility.md` gains a visual lineup section whose cards reference the table target names exactly.
- `maps/<map>/README.md` gains a positioning visual entry point and links back to the utility visual section.
- `maps/<map>/assets/map-overview-source.md` records source page, direct asset URL when different, date checked, map version/date, local asset status, attribution, and replacement trigger.
- `sources/research-log.md` gains a dated visual-research entry for the pilot and later map batches.

## Data flow

1. Select high-value utility entries from the existing purpose-first table.
2. Verify the current map geometry and source screenshots against the map/version in scope.
3. Store permitted screenshots under the map’s `assets/utility/` folder, or retain a clearly labeled source-page link when local storage is not appropriate.
4. Create or update the local SVG positioning diagram using the verified overview geometry.
5. Add Markdown cards and positioning notes that link to the local files or source pages.
6. Update source metadata and the research log.
7. Run link, asset, terminology, and visual metadata checks before expanding to the next map.

## Error handling and maintenance

- If a screenshot source cannot be verified, do not present it as authoritative; mark the card pending and keep the source page link.
- If map geometry or a grenade interaction changes, replace the affected local asset and update the map-version/date metadata. Do not silently leave an outdated lineup in the guide.
- If a local image is unavailable, the Markdown must still provide the purpose, timing, thrower, follow-up, and fallback from the existing utility table.
- If an SVG label becomes unreadable at normal Markdown width, shorten the map label and move explanatory text below the diagram.
- Hostage maps may use the same visual system, but positioning diagrams must show attacker/defender objective routes rather than bombsite/post-plant language.

## Verification

For the Inferno pilot and each later rollout batch:

- verify every Markdown image/link resolves locally or is an explicit HTTP source link;
- verify every local SVG and raster asset exists under the expected map folder;
- verify each lineup card identifies start, aim, result, purpose, and follow-up/fallback;
- verify each local source note includes URL, checked date, map version/date, status, and replacement trigger;
- inspect the SVG and raster assets visually at normal Markdown size;
- re-run the existing 15-map structure, internal-link, ten-principle, and hostage terminology checks;
- update `docs/qa-report.md` with visual coverage and any intentionally pending assets.

## Rollout sequence

1. Inferno pilot and format validation.
2. Remaining Premier maps: Ancient, Cache, Dust II, Mirage, Nuke, and Anubis.
3. Competitive-only defusal maps: Train, Vertigo, Overpass, Boulder, and Fachwerk.
4. Competitive-only hostage maps: Office, Italy, and Shelter, with objective-correct labels and routes.

Each batch should be reviewed for source accuracy before the next batch is started.
