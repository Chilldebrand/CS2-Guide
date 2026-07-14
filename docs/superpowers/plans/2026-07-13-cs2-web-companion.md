# CS2 Guide Web Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a one-page Inferno web companion generated from the existing Markdown guide with a collapsible, optionally sticky map panel.

**Architecture:** A Node build script reads the four Inferno Markdown files, converts them into one static HTML document, copies the existing local SVG, and writes `web/dist/`. A small browser script owns only follow-scroll and collapse state. GitHub Actions builds and deploys `web/dist/` to GitHub Pages.

**Tech Stack:** Node.js, `marked`, Node's built-in `node:test`, semantic HTML, CSS media queries, vanilla browser JavaScript, GitHub Pages Actions.

## Global Constraints

- The Markdown repository remains the source of truth.
- Start with Inferno as the proof of concept.
- Keep one map panel; do not swap visuals while the reader scrolls.
- Provide a visible `Map follows scroll` control.
- Allow the map panel to be collapsed and expanded.
- Support desktop two-column and mobile stacked layouts.
- Respect `prefers-reduced-motion: reduce`.
- If JavaScript fails, leave the guide content and map visible as a normal static document.
- The build must fail clearly if a required Markdown input or positioning SVG is missing.
- GitHub Pages deploys only from successful builds on `main` or manual dispatch.

---

## File map

- Create `web/package.json`: build, test, and preview scripts plus the Markdown dependency.
- Create `web/package-lock.json`: reproducible dependency resolution.
- Create `web/build.mjs`: source discovery, Markdown conversion, heading IDs, template rendering, and asset copying.
- Create `web/template.html`: static page shell, navigation, map controls, and content placeholders.
- Create `web/styles.css`: typography, two-column layout, sticky behavior, collapse state, mobile layout, focus states, and reduced-motion rules.
- Create `web/app.js`: follow-scroll, collapse/expand, and safe preference persistence.
- Create `web/test/build.test.mjs`: build output and missing-input tests.
- Create `web/test/ui-contract.test.mjs`: static accessibility and behavior-contract tests.
- Create `web/test/deployment-contract.test.mjs`: README link and Pages workflow tests.
- Modify `.gitignore`, `README.md`, `docs/qa-report.md`, and `HANDOFF.md\).
- Create `.github/workflows/deploy-web-guide.yml`.

## Task 1: Establish the build contract with failing tests

**Files:**
- Create: `web/package.json`
- Create: `web/test/build.test.mjs`

**Interfaces:**
- Consumes: the existing `maps/inferno/` Markdown files and local positioning SVG.
- Produces: tests defining `buildSite({ rootDir, outputDir })` and the required output contract.

- [ ] **Step 1: Create the package manifest**

Create `web/package.json`:

    {
      "name": "cs2-guide-web",
      "private": true,
      "type": "module",
      "scripts": {
        "build": "node build.mjs",
        "test": "node --test",
        "preview": "python -m http.server 4173 --directory dist"
      },
      "dependencies": {
        "marked": "latest"
      }
    }

Run from `web/`:

    npm install

Expected: `package-lock.json` is created and installation succeeds.

- [ ] **Step 2: Write the failing build test**

Create `web/test/build.test.mjs`:

    import assert from 'node:assert/strict';
    import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
    import os from 'node:os';
    import path from 'node:path';
    import test from 'node:test';
    import { buildSite } from '../build.mjs';

    const repoRoot = path.resolve(import.meta.dirname, '..', '..');

    test('buildSite emits one Inferno document and copies the positioning SVG', async () => {
      const outputDir = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-web-'));
      await buildSite({ rootDir: repoRoot, outputDir });

      const html = await readFile(path.join(outputDir, 'index.html'), 'utf8');
      assert.match(html, /Inferno/);
      assert.match(html, /id="round-plan"/);
      assert.match(html, /id="offense"/);
      assert.match(html, /id="defense"/);
      assert.match(html, /id="utility-priorities"/);
      assert.match(html, /assets\/positioning-overview\.svg/);
      assert.match(html, /Markdown source/);
    });

    test('buildSite fails when a required source file is missing', async () => {
      const fakeRoot = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-missing-'));
      await mkdir(path.join(fakeRoot, 'maps', 'inferno', 'assets'), { recursive: true });
      await writeFile(path.join(fakeRoot, 'maps', 'inferno', 'README.md'), '# Inferno');

      await assert.rejects(
        buildSite({ rootDir: fakeRoot, outputDir: path.join(fakeRoot, 'dist') }),
        /Missing required Inferno source file/
      );
    });

- [ ] **Step 3: Run the test and confirm the failure**

Run:

    npm test

Expected: FAIL because `web/build.mjs` and `buildSite` do not exist. Do not add implementation before recording this failure.

- [ ] **Step 4: Commit the test contract**

    git add web/package.json web/package-lock.json web/test/build.test.mjs
    git commit -m "test: define Inferno web build contract"

## Task 2: Implement the Markdown-to-static-page builder

**Files:**
- Create: `web/build.mjs`
- Create: `web/template.html`
- Modify: `web/test/build.test.mjs`

**Interfaces:**
- Consumes: `buildSite({ rootDir, outputDir })`.
- Produces: `buildSite`, `slugifyHeading`, stable section IDs, generated `index.html`, and copied positioning SVG.

- [ ] **Step 1: Add the source-order test**

Append to `web/test/build.test.mjs`:

    test('generated document preserves guide order and stable heading IDs', async () => {
      const outputDir = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-order-'));
      await buildSite({ rootDir: repoRoot, outputDir });
      const html = await readFile(path.join(outputDir, 'index.html'), 'utf8');

      assert.ok(html.indexOf('Round plan') < html.indexOf('Offense'));
      assert.ok(html.indexOf('Offense') < html.indexOf('Defense'));
      assert.ok(html.indexOf('Defense') < html.indexOf('Utility priorities'));
      assert.match(html, /href="#round-plan"/);
      assert.match(html, /href="#offense"/);
      assert.match(html, /href="#defense"/);
    });

- [ ] **Step 2: Implement the required source map and slugger**

In `web/build.mjs`, define:

    export const REQUIRED_INPUTS = [
      'maps/inferno/README.md',
      'maps/inferno/offense.md',
      'maps/inferno/defense.md',
      'maps/inferno/utility.md',
      'maps/inferno/assets/positioning-overview.svg'
    ];

    export function slugifyHeading(text) {
      return text.toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

Validate every path from `rootDir`. Throw `Error('Missing required Inferno source file: ' + relativePath)` for the first missing input. Use `marked.parse()` for Markdown conversion.

- [ ] **Step 3: Implement `buildSite`**

Implement:

    export async function buildSite({ rootDir, outputDir }) {
      // Validate REQUIRED_INPUTS.
      // Read README, offense, defense, and utility in that order.
      // Convert Markdown to HTML with marked.
      // Add stable IDs to generated h2 headings.
      // Render template.html.
      // Write index.html and copy positioning-overview.svg.
    }

Use exact section IDs `round-plan`, `offense`, `defense`, and `utility-priorities`. Add a page-level link to the Inferno README on GitHub. Preserve source URLs in converted content.

- [ ] **Step 4: Create the template contract**

Create `web/template.html` with these required elements:

    <header class="site-header">
      <a class="brand" href="https://github.com/Chilldebrand/CS2-Guide">CS2 Guide</a>
      <nav aria-label="Inferno sections">
        <a href="#round-plan">Round plan</a>
        <a href="#offense">Offense</a>
        <a href="#defense">Defense</a>
        <a href="#utility-priorities">Utility</a>
      </nav>
      <a href="https://github.com/Chilldebrand/CS2-Guide/blob/main/maps/inferno/README.md">Markdown source â†—</a>
    </header>
    <main class="guide-layout">
      <article id="guide-content">{{CONTENT}}</article>
      <aside class="map-panel" id="inferno-map" data-map-panel>
        <div class="map-controls">
          <label><input type="checkbox" id="map-follow" data-map-follow checked> Map follows scroll</label>
          <button type="button" id="map-collapse" data-map-collapse
                  aria-controls="map-body" aria-expanded="true">Collapse map</button>
        </div>
        <div id="map-body" data-map-body>
          <img src="assets/positioning-overview.svg"
               alt="Inferno positioning teaching diagram showing CT Banana anchor and support, A anchor, mid rotator, T pressure, danger zones, and rotation paths">
          <p>Teaching diagram, not a pixel-perfect radar replacement.
            <a href="https://github.com/Chilldebrand/CS2-Guide/blob/main/maps/inferno/assets/map-overview-source.md">View source note</a>.
          </p>
        </div>
      </aside>
    </main>

The builder may add metadata and a footer, but must retain the labels, IDs, controls, and fallback content above.

- [ ] **Step 5: Copy the SVG and run tests**

For this task, copy the positioning SVG and emit `index.html`; Task 3 will extend the builder to copy `styles.css` and `app.js`. Run:

    npm test
    npm run build
    Test-Path dist\index.html
    Test-Path dist\assets\positioning-overview.svg

Expected: tests PASS after the builder exists; both path checks return `True`.

- [ ] **Step 6: Commit the static builder**

    git add web/build.mjs web/template.html web/test/build.test.mjs
    git commit -m "feat: generate Inferno web guide"

## Task 3: Add layout, map controls, and accessibility behavior

**Files:**
- Create: `web/styles.css`
- Create: `web/app.js`
- Create: `web/test/ui-contract.test.mjs`
- Modify: `web/template.html`
- Modify: `web/build.mjs`

**Interfaces:**
- Consumes: template controls and IDs from Task 2.
- Produces: responsive layout, keyboard-accessible controls, reduced-motion rules, and static UI contracts.

- [ ] **Step 1: Write failing UI contract tests**

Create `web/test/ui-contract.test.mjs`:

    import assert from 'node:assert/strict';
    import { readFile } from 'node:fs/promises';
    import path from 'node:path';
    import test from 'node:test';

    const webRoot = path.resolve(import.meta.dirname, '..');

    test('template exposes accessible map controls', async () => {
      const template = await readFile(path.join(webRoot, 'template.html'), 'utf8');
      assert.match(template, /id="map-follow"/);
      assert.match(template, /aria-controls="map-body"/);
      assert.match(template, /aria-expanded="true"/);
      assert.match(template, /alt="Inferno positioning teaching diagram/);
    });

    test('styles and script expose responsive and reduced-motion behavior', async () => {
      const css = await readFile(path.join(webRoot, 'styles.css'), 'utf8');
      const js = await readFile(path.join(webRoot, 'app.js'), 'utf8');
      assert.match(css, /@media\s*\(max-width:/);
      assert.match(css, /prefers-reduced-motion/);
      assert.match(css, /position:\s*sticky/);
      assert.match(js, /aria-expanded/);
      assert.match(js, /localStorage/);
    });

Run `npm test`. Expected: FAIL because `styles.css` and `app.js` do not exist.

- [ ] **Step 2: Implement the responsive CSS**

In `web/styles.css`, define:

    .guide-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(18rem, 28rem);
      gap: 2rem;
    }

    .map-panel.is-sticky {
      position: sticky;
      top: 1rem;
      align-self: start;
    }

    .map-panel.is-collapsed [data-map-body] { display: none; }

    @media (max-width: 800px) {
      .guide-layout { grid-template-columns: 1fr; }
      .map-panel.is-sticky { position: static; }
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        transition-duration: 0.01ms !important;
      }
    }

Add dark-theme contrast, readable Markdown tables, image borders, visible `:focus-visible` outlines, and an article layout that remains useful when the map is collapsed.

- [ ] **Step 3: Implement safe control behavior**

Create `web/app.js` with these functions:

    function readPreference(key, fallback) {
      try { return window.localStorage.getItem(key) ?? fallback; }
      catch { return fallback; }
    }

    function writePreference(key, value) {
      try { window.localStorage.setItem(key, value); }
      catch { /* current-session behavior remains available */ }
    }

    function applyFollowScroll(enabled) {
      follow.checked = enabled;
      panel.classList.toggle('is-sticky', enabled);
      writePreference('cs2-guide-map-follow', String(enabled));
    }

    function applyCollapsed(collapsed) {
      panel.classList.toggle('is-collapsed', collapsed);
      collapse.setAttribute('aria-expanded', String(!collapsed));
      collapse.textContent = collapsed ? 'Show map' : 'Collapse map';
      writePreference('cs2-guide-map-collapsed', String(collapsed));
    }

Guard initialization when controls are missing. Initialize from preferences, add a checkbox `change` listener, and add a button `click` listener. The page must still render when storage is unavailable.

- [ ] **Step 4: Load CSS and JavaScript**

Add these references to `web/template.html`:

    <link rel="stylesheet" href="styles.css">
    <script type="module" src="app.js"></script>

Update `buildSite` to copy `styles.css` and `app.js` beside `index.html` in `web/dist/`.

- [ ] **Step 5: Run tests and build**

    npm test
    npm run build

Expected: all build and UI tests PASS; `web/dist/` contains `index.html`, `styles.css`, `app.js`, and `assets/positioning-overview.svg`.

- [ ] **Step 6: Commit the interactive layout**

    git add web/template.html web/styles.css web/app.js web/build.mjs web/test/ui-contract.test.mjs
    git commit -m "feat: add Inferno map controls"

## Task 4: Add GitHub Pages deployment and repository entry point

**Files:**
- Create: `.github/workflows/deploy-web-guide.yml`
- Create: `web/test/deployment-contract.test.mjs`
- Modify: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `npm run build` from Tasks 1â€“3.
- Produces: a Pages artifact from `web/dist/` and a stable public link.

- [ ] **Step 1: Write failing deployment tests**

Create `web/test/deployment-contract.test.mjs`:

    import assert from 'node:assert/strict';
    import { readFile } from 'node:fs/promises';
    import path from 'node:path';
    import test from 'node:test';

    const repoRoot = path.resolve(import.meta.dirname, '..', '..');

    test('README exposes the public web guide', async () => {
      const readme = await readFile(path.join(repoRoot, 'README.md'), 'utf8');
      assert.match(readme, /https:\/\/chilldebrand\.github\.io\/CS2-Guide\//);
    });

    test('Pages workflow builds web/dist on main and manual dispatch', async () => {
      const workflow = await readFile(path.join(repoRoot, '.github', 'workflows', 'deploy-web-guide.yml'), 'utf8');
      assert.match(workflow, /push:/);
      assert.match(workflow, /main/);
      assert.match(workflow, /workflow_dispatch/);
      assert.match(workflow, /npm ci/);
      assert.match(workflow, /npm run build/);
      assert.match(workflow, /web\/dist/);
      assert.match(workflow, /deploy-pages/);
    });

Run `npm test`. Expected: FAIL because the README link and workflow are absent.

- [ ] **Step 2: Ignore generated output**

Append to the root `.gitignore`:

    web/dist/

- [ ] **Step 3: Create the Pages workflow**

Create `.github/workflows/deploy-web-guide.yml`:

    name: Deploy CS2 web guide

    on:
      push:
        branches: [main]
      workflow_dispatch:

    permissions:
      contents: read
      pages: write
      id-token: write

    concurrency:
      group: pages
      cancel-in-progress: true

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: 22
              cache: npm
              cache-dependency-path: web/package-lock.json
          - working-directory: web
            run: npm ci
          - working-directory: web
            run: npm run build
          - uses: actions/upload-pages-artifact@v3
            with:
              path: web/dist

      deploy:
        needs: build
        runs-on: ubuntu-latest
        steps:
          - uses: actions/deploy-pages@v4

- [ ] **Step 4: Add the public link**

Add near the root README introduction:

    **[Open the web version](https://chilldebrand.github.io/CS2-Guide/)** â€” one scrollable Inferno guide with an optional map panel.

Do not remove the existing Markdown reading order.

- [ ] **Step 5: Run the deployment tests and diff check**

    npm test
    git diff --check

Expected: all tests PASS and `git diff --check` reports no whitespace errors.

- [ ] **Step 6: Commit deployment wiring**

    git add .github/workflows/deploy-web-guide.yml README.md .gitignore web/test/deployment-contract.test.mjs
    git commit -m "feat: deploy CS2 web guide to Pages"

## Task 5: Perform browser QA and update durable documentation

**Files:**
- Modify: `docs/qa-report.md`
- Modify: `HANDOFF.md`

**Interfaces:**
- Consumes: the generated site and deployment workflow from Tasks 1â€“4.
- Produces: reproducible build, browser, accessibility, and deployment evidence.

- [ ] **Step 1: Run the complete local sequence**

From `web/`:

    npm ci
    npm test
    npm run build

Expected: all tests PASS; `dist/index.html`, `dist/styles.css`, `dist/app.js`, and `dist/assets/positioning-overview.svg` exist.

- [ ] **Step 2: Start a local static preview**

Run from `web/`:

    python -m http.server 4173 --directory dist

Open `http://localhost:4173/` in the browser and confirm no console errors.

- [ ] **Step 3: Verify desktop interaction**

Confirm:

1. The page is one continuous scrollable document.
2. Section links jump to Round plan, Offense, Defense, and Utility.
3. The map follows scroll when checked.
4. Unchecking the control removes sticky behavior while leaving the map visible.
5. Collapse changes the label to `Show map`, sets `aria-expanded="false"`, and remains reversible.
6. Refreshing preserves preferences when storage is available.

- [ ] **Step 4: Verify keyboard, mobile, and reduced-motion behavior**

Use keyboard only to reach and activate the checkbox, collapse button, section links, and source links. Check a mobile-sized viewport for a stacked map panel that does not obscure content. Enable reduced motion and confirm no panel or anchor animation occurs.

- [ ] **Step 5: Update `docs/qa-report.md`**

Add a `Web companion QA` section recording the commands, generated file set, desktop/mobile checks, keyboard and reduced-motion results, both map modes, public Pages URL, and the fact that Inferno is the only generated web map in this pass.

- [ ] **Step 6: Update `HANDOFF.md`**

Replace the web-companion recommendation with the current status: Inferno is deployed as the proof of concept, Markdown remains authoritative, and the next optional work is validating the layout before reusing the template for other maps.

- [ ] **Step 7: Run final checks and commit evidence**

    npm test --prefix web
    git diff --check
    git status --short --branch

Expected: all tests PASS, no whitespace errors, and only the intended QA and handoff files are modified before commit.

    git add docs/qa-report.md HANDOFF.md
    git commit -m "docs: verify Inferno web companion"