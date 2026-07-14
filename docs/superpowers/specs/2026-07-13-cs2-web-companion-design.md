# CS2 Guide Web Companion — Inferno Proof of Concept

## Goal

Add an optional GitHub Pages companion for the existing CS2 Markdown guide. The first release will be a single, scrollable Inferno page that keeps the guide content readable beside an interactive positioning map.

The Markdown repository remains the source of truth. The web companion must present the existing guide content without creating a second tactical version that can drift.

## Approved decisions

- Build a lightweight static site from the existing Markdown files.
- Deploy it through GitHub Pages using GitHub Actions.
- Start with Inferno as the proof of concept.
- Keep one map panel; do not swap visuals while the reader scrolls.
- Provide a visible `Map follows scroll` control.
- Allow the map panel to be collapsed and expanded.
- Keep the page usable as a normal single-column document when the map is not following scroll or is collapsed.
- Support desktop two-column and mobile stacked layouts.

## User experience

The page opens as one continuous guide rather than a collection of separate web pages. The top area identifies Inferno and provides quick links to the page sections and the Markdown source.

The main content follows this order:

1. Inferno introduction and win condition from `maps/inferno/README.md`.
2. Round plan and positioning explanation from the map README.
3. Offense plan from `maps/inferno/offense.md`.
4. Defense plan from `maps/inferno/defense.md`.
5. Utility priorities and visual lineup cards from `maps/inferno/utility.md`.

On desktop, the guide occupies the primary column and the existing local positioning SVG occupies a right-side map panel. The panel remains visible while the user reads when follow-scroll is enabled. When follow-scroll is disabled, the panel returns to ordinary document flow.

The map panel has a clear collapse/expand button. Collapsed state is represented by a compact control that preserves the ability to reopen the map. The follow-scroll preference and collapsed state may be persisted in `localStorage`, but the page must behave correctly when storage is unavailable or cleared.

On mobile, the map panel moves above the guide content and becomes a normal-width block. It must not cover the reading area or trap keyboard focus.

## Content and build architecture

The companion will live under `web/` and use a small Node build script:

```text
web/
  package.json
  package-lock.json
  build.mjs
  template.html
  styles.css
  app.js
  dist/                 generated locally and in CI
```

`web/build.mjs` reads the existing files directly:

- `maps/inferno/README.md`
- `maps/inferno/offense.md`
- `maps/inferno/defense.md`
- `maps/inferno/utility.md`

The build converts Markdown to HTML, preserves meaningful heading anchors, inserts the content into the page template, copies `maps/inferno/assets/positioning-overview.svg` into the generated asset directory, and emits the final static page into `web/dist/`.

The generated page must include:

- a link to `maps/inferno/README.md` on GitHub;
- a map image with meaningful alt text;
- section navigation tied to generated heading IDs;
- the existing source-note link where the Markdown content exposes it.

The build must fail with a clear error if a required Markdown input or the positioning SVG is missing. It must not silently generate a partial guide.

## Components

### Page template

Owns the document shell, site header, section navigation, content columns, map panel, and accessible control landmarks. It does not contain duplicated tactical prose beyond short interface labels.

### Markdown build script

Owns input discovery, Markdown conversion, heading-anchor generation, content ordering, asset copying, and output creation. It is the only component that knows the source file paths.

### Map panel

Owns the existing Inferno SVG, its caption, source link, legend, follow-scroll state, and collapse state. It does not alter the diagram or invent additional map geometry.

### Interaction script

Owns the follow-scroll toggle, collapse/expand behavior, preference persistence, and reduced-motion behavior. It must use native controls and work without requiring a pointer device.

### Stylesheet

Owns the visual hierarchy, readable Markdown typography, sticky panel layout, responsive breakpoint, focus styles, and reduced-motion media query. The mobile layout must remain useful with CSS disabled as a normal document.

## Accessibility and interaction requirements

- Use a real checkbox or switch-like control with a visible label for `Map follows scroll`.
- Use a real button for collapse/expand with `aria-expanded` and `aria-controls`.
- Keep keyboard focus visible against the dark visual theme.
- Use semantic `main`, `aside`, `nav`, `header`, and heading elements.
- Give the SVG an informative alt description and retain its internal title/description metadata.
- Do not communicate route meaning through color alone; retain labels and a legend.
- Respect `prefers-reduced-motion: reduce` by disabling animated panel transitions and smooth scrolling.
- If JavaScript fails, leave the guide content and map visible as a normal static document.
- If `localStorage` is unavailable, controls must still work for the current page visit.

## GitHub Pages deployment

Add a workflow at `.github/workflows/deploy-web-guide.yml` that:

1. Runs on pushes to `main` and on manual dispatch.
2. Checks out the repository.
3. Sets up the Node version used by the build.
4. Runs `npm ci` and `npm run build` from `web/`.
5. Uploads `web/dist/` as the Pages artifact.
6. Deploys the artifact through the official GitHub Pages deployment action.

Update the root `README.md` with a prominent link to:

`https://chilldebrand.github.io/CS2-Guide/`

The link should be described as an optional web version and should not replace the existing Markdown reading order.

## Verification plan

The implementation is complete only when all of the following pass:

- `npm ci` and `npm run build` succeed from `web/`.
- The generated page contains the Inferno introduction, offense, defense, utility, and source links.
- The generated SVG asset exists and the page points to the correct relative path.
- The page has one continuous scrollable document with working section anchors.
- Follow-scroll can be enabled and disabled with keyboard and pointer input.
- Collapse/expand updates the button state and remains reversible.
- The guide remains readable with the map collapsed and with follow-scroll disabled.
- Desktop and mobile layouts are checked at representative widths.
- Reduced-motion behavior is checked with the media preference enabled.
- A JavaScript-disabled or script-failure fallback still shows the guide content.
- GitHub Actions can build the artifact without depending on files outside the repository.

## Scope boundaries and future rollout

This proof of concept does not generate pages for the other fourteen maps, switch between multiple visuals, or edit Markdown content from the website. Once the Inferno page is validated, later maps can use the same build contract and page template while continuing to reuse each map folder's Markdown, SVG, and source metadata.

