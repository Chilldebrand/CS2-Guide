# CS2 Guide - next-chat handoff

## Current state

- Repository: `https://github.com/Chilldebrand/CS2-Guide.git`
- Main checkout: `C:\Users\hilde\OneDrive\Documents\CS2 Guide\CS2-Guide`
- Published branch: `main`
- Latest published commit before this work: `41d5ce5 fix: constrain enlarged map layouts`
- Current local `main` commit: `1558aee feat: add active duty five-player defaults`
- Live guide: `https://chilldebrand.github.io/CS2-Guide/`
- The feature branch was tested in `C:\Users\hilde\OneDrive\Documents\CS2 Guide\CS2-Guide\.worktrees\active-duty-defaults`, then fast-forward merged into `main` and cleaned up.
- The changes are merged locally but have not been pushed or published yet.

## Completed web companion

The guide is generated from the authoritative Markdown source. The tested branch extends the companion to a landing page plus one generated page for each Active Duty map. It preserves section navigation, sticky/followable and collapsible map controls, persistent 1x-3x inline map sizes, and the temporary accessible 4x overlay with Close, Escape, focus restoration, reduced-motion compatibility, mobile stacking, and a no-dialog fallback.

Verification on the tested branch:

- 39 automated web tests pass.
- Production build passes.
- SVG overlay contract checks pass for all 14 overlays.
- Whitespace and canvas-bound checks pass.

## Guide content

- Fifteen map folders have `README.md`, `offense.md`, `defense.md`, `utility.md`, source notes, and map assets.
- Active Duty maps are Ancient, Cache, Dust II, Inferno, Mirage, Nuke, and Anubis.
- Markdown remains the source of truth. Web output must not invent tactics, utility, callouts, geometry, or sources.

## Completed task: seven Active Duty five-player setup diagrams

Delivered for each Active Duty map:

1. One T-side default with all five players placed.
2. One CT-side default with all five players placed.
3. T-side route/initial-pressure arrows and CT-side hold-angle/first-rotation rays.
4. Hand-authored SVG annotations over remote sourced map backgrounds; source pixels are not copied into the repository.
5. Diagrams embedded in each map's Markdown and linked from the generated web page and map source notes.

## Research notes

Popular CS2 sites generally explain five-player setups in text but rarely publish reusable, consistent full-team diagrams. The tested branch records the positioning-map references in each Active Duty source note and in `sources/research-log.md`. The player assignments and routes are synthesized teaching defaults, not claims of universal timings, fixed grenade lineups, or pixel-perfect spawn geometry.

## Next-chat workflow

Push `main` when ready to publish. If map sources or geometry change, re-check the seven source notes and rebuild the web output. Remote source image rendering was blocked by the browser client during QA, so perform a browser pass after deployment.

## Working rules

- Work inside the nested `CS2-Guide` repository.
- `.superpowers/` is ignored planning scratch state.
- Do not use destructive Git commands unless explicitly requested.
- Before publishing future changes, run the web test suite, production build, whitespace check, independent review, merge to `main`, push, and confirm the Pages deployment.
