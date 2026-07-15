# CS2 Guide — next-chat handoff

## Current state

- Repository: `https://github.com/Chilldebrand/CS2-Guide.git`
- Local checkout: `C:\Users\hilde\OneDrive\Documents\CS2 Guide\CS2-Guide`
- Branch: `main`
- Latest published commit: `41d5ce5 fix: constrain enlarged map layouts`
- Live guide: `https://chilldebrand.github.io/CS2-Guide/`

## Completed web companion

The published Inferno guide is generated from the authoritative Markdown source. It provides one scrollable guide, section navigation, sticky/followable and collapsible map controls, persistent 1x–3x inline map sizes, and a temporary accessible 4x overlay with Close, Escape, focus restoration, reduced-motion compatibility, mobile stacking, and a no-dialog fallback.

Verification already completed:

- 18 automated web tests pass.
- Production build passes.
- Task-level and whole-branch reviews are clean.
- GitHub Pages deployment completed successfully.

## Guide content already present

- Fifteen map folders have `README.md`, `offense.md`, `defense.md`, `utility.md`, source notes, and map assets.
- Active Duty maps are Ancient, Cache, Dust II, Inferno, Mirage, Nuke, and Anubis.
- Markdown remains the source of truth. Web output must not invent tactics, utility, callouts, geometry, or sources.

## Recommended next task: seven Active Duty five-player setup diagrams

The user requested original tactical visuals for Ancient, Cache, Dust II, Inferno, Mirage, Nuke, and Anubis.

Target outcome for each map:

1. One T-side default with all five players placed.
2. One CT-side default with all five players placed.
3. Numbered player markers, role labels, pressure/rotation arrows, essential early-utility markers, and a concise round-plan caption.
4. Original SVG diagrams based on researched tactical concepts; never copy third-party artwork or invent exact geometry/lineups without sources.
5. Diagrams embedded in each map’s Markdown and a generated web page linked from the top of each of those map guides.

## Research notes

Popular CS2 sites generally explain five-player setups in text but rarely publish reusable, consistent full-team diagrams. Useful research sources include CS2.eu, CS2Hype, CS2Flow, GetReplay, and reputable map-specific guides. Validate every setup against sources, then update the map source note and `sources/research-log.md`.

## Next-chat workflow

Resume brainstorming before implementation. First settle the standard diagram style and information density, then write and approve a design spec and implementation plan. The visual-companion server could not start in the previous environment, so use text-only design discussion unless it becomes available.

## Working rules

- Work inside the nested `CS2-Guide` repository.
- `.superpowers/` is ignored planning scratch state.
- Do not use destructive Git commands unless explicitly requested.
- Before publishing future changes, run the web test suite, production build, whitespace check, independent review, merge to `main`, push, and confirm the Pages deployment.
