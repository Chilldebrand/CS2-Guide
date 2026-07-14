# Map enlargement controls implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Add accessible 1×–4× map enlargement controls, responsive inline map sizing, and a temporary 4× modal view.

**Architecture:** The static template gains a native size selector and a dialog that reuses the existing SVG. Vanilla JS owns saved inline size and dialog lifecycle; CSS varies the desktop grid for 1×–3× and preserves the existing mobile stack.

**Tech Stack:** Static HTML, vanilla ES modules, CSS grid, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Keep \`maps/inferno/*.md\` authoritative and unchanged.
- Keep the existing map-follow/collapse controls and guarded storage behavior.
- 1×–3× never overlap guide text; 4× is a dialog overlay.
- The dialog has a visible close control, Escape support, focus restoration, and no required animation.
- Mobile retains the existing stacked guide/map order.
- No new dependency is required.

---

### Task 1: Add accessible map-size and dialog markup

**Files:**
- Modify: \`web/template.html\`
- Modify: \`web/test/ui-contract.test.mjs\`

**Interfaces:**
- Consumes: \`aside#inferno-map[data-map-panel]\`, \`#map-body\`, and the existing SVG.
- Produces: \`select#map-size[data-map-size]\`, \`dialog#map-overlay[data-map-overlay]\`, and \`button[data-map-overlay-close]\`.

- [ ] **Step 1: Write the failing markup contract test**

Add this test:

~~~
test('template exposes map sizing and modal controls', async () => {
  const template = await readFile(path.join(webRoot, 'template.html'), 'utf8');

  assert.match(template, /<label[^>]*for="map-size"[^>]*>Map size<\/label>/);
  assert.match(template, /<select[^>]*id="map-size"[^>]*data-map-size/);
  assert.match(template, /<option value="1">1×<\/option>/);
  assert.match(template, /<option value="4">4×<\/option>/);
  assert.match(template, /<dialog[^>]*id="map-overlay"[^>]*data-map-overlay/);
  assert.match(template, /data-map-overlay-close/);
  assert.match(template, /aria-label="Expanded Inferno map"/);
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: \`node --test web/test/ui-contract.test.mjs\`

Expected: FAIL because the selector and dialog are absent.

- [ ] **Step 3: Add minimal semantic template markup**

Add to \`.map-controls\`:

~~~
<label for="map-size">Map size</label>
<select id="map-size" data-map-size>
  <option value="1">1×</option>
  <option value="2">2×</option>
  <option value="3">3×</option>
  <option value="4">4×</option>
</select>
~~~

Immediately after \`</main>\`, add:

~~~
<dialog id="map-overlay" data-map-overlay aria-label="Expanded Inferno map">
  <button type="button" data-map-overlay-close>Close expanded map</button>
  <img src="assets/positioning-overview.svg"
       alt="Inferno positioning teaching diagram showing CT Banana anchor and support, A anchor, mid rotator, T pressure, danger zones, and rotation paths">
</dialog>
~~~

- [ ] **Step 4: Run test to verify it passes**

Run: \`node --test web/test/ui-contract.test.mjs\`

Expected: PASS with the new markup contract and existing contracts.

- [ ] **Step 5: Commit**

~~~
git add web/template.html web/test/ui-contract.test.mjs
git commit -m "feat: add accessible map size controls"
~~~

### Task 2: Implement inline sizes and 4× dialog behavior

**Files:**
- Modify: \`web/app.js\`
- Modify: \`web/styles.css\`
- Modify: \`web/test/ui-contract.test.mjs\`

**Interfaces:**
- Consumes: \`data-map-panel\`, \`data-map-size\`, \`data-map-overlay\`, \`data-map-overlay-close\`, and the guarded storage helpers.
- Produces: \`map-size-1\`, \`map-size-2\`, \`map-size-3\` classes on \`.guide-layout\`, local-storage key \`cs2-guide-map-size\`, and a temporary 4× dialog that restores focus to \`#map-size\`.

- [ ] **Step 1: Write failing script and CSS contract assertions**

Append these to the existing UI script/CSS contract test:

~~~
assert.match(css, /\.guide-layout\.map-size-2\s*\{/);
assert.match(css, /\.guide-layout\.map-size-3\s*\{/);
assert.match(css, /\[data-map-overlay\]::backdrop/);
assert.match(js, /cs2-guide-map-size/);
assert.match(js, /showModal\(\)/);
assert.match(js, /addEventListener\('keydown'/);
assert.match(js, /overlay\.close\(\)/);
assert.match(js, /size\.focus\(\)/);
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: \`node --test web/test/ui-contract.test.mjs\`

Expected: FAIL because sizing classes and dialog lifecycle are absent.

- [ ] **Step 3: Implement minimal client behavior**

Query the selector, dialog, close button, and \`.guide-layout\`. Add this function and initialize it with \`readPreference('cs2-guide-map-size', '1')\`:

~~~
function applyMapSize(value) {
  const selected = ['1', '2', '3', '4'].includes(value) ? value : '1';

  if (selected === '4') {
    if (typeof overlay.showModal === 'function') overlay.showModal();
    return;
  }

  layout.classList.remove('map-size-1', 'map-size-2', 'map-size-3');
  layout.classList.add('map-size-' + selected);
  size.value = selected;
  writePreference('cs2-guide-map-size', selected);
}
~~~

On selector change, call \`applyMapSize(size.value)\`. Close the dialog from its visible button or Escape, restore the saved inline value, and call \`size.focus()\`. If a 4× request finds no \`showModal\` method, reset the selector to the saved inline value and apply that value so unsupported browsers retain usable inline controls.

- [ ] **Step 4: Implement responsive CSS**

Add these desktop grid variants and dialog rules:

~~~
.guide-layout.map-size-1 { grid-template-columns: minmax(0, 1fr) minmax(18rem, 28rem); }
.guide-layout.map-size-2 { grid-template-columns: minmax(0, 1fr) minmax(24rem, 38rem); }
.guide-layout.map-size-3 { grid-template-columns: minmax(0, 1fr) minmax(30rem, 48rem); }

[data-map-overlay] { max-width: min(96vw, 90rem); max-height: 96vh; }
[data-map-overlay]::backdrop { background: rgb(0 0 0 / 72%); }
[data-map-overlay] img { display: block; max-width: 100%; max-height: calc(96vh - 4rem); }
~~~

Inside the existing \`@media (max-width: 800px)\` block, set all three \`.guide-layout.map-size-*\` variants to \`grid-template-columns: 1fr\`.

- [ ] **Step 5: Run focused and full tests**

Run: \`node --test web/test/ui-contract.test.mjs\`

Expected: PASS with template, CSS, script, and reduced-motion contracts.

Run: \`npm.cmd test --prefix web\`

Expected: all web tests PASS.

- [ ] **Step 6: Build and perform browser QA**

Run: \`npm.cmd run build --prefix web\`

Expected: exit code 0 and generated output includes the controls.

At desktop width verify 1×–3× widen the right panel without covering guide text. At 4× verify dialog, visible close button, Escape, and focus return. At mobile width verify guide/map stacking. Enable reduced motion and verify no required animation.

- [ ] **Step 7: Commit**

~~~
git add web/app.js web/styles.css web/test/ui-contract.test.mjs
git commit -m "feat: add expandable Inferno map"
~~~

### Task 3: Record QA evidence and handoff

**Files:**
- Modify: \`docs/qa-report.md\`
- Modify: \`HANDOFF.md\`

**Interfaces:**
- Consumes: completed map sizing/dialog behavior and successful build.
- Produces: truthful QA evidence and current handoff state.

- [ ] **Step 1: Update QA evidence**

Record 1×–3× desktop resizing, 4× close/Escape/focus behavior, mobile stacking, follow/collapse regression checks, reduced-motion result, test command, and build command in \`docs/qa-report.md\`.

- [ ] **Step 2: Update handoff**

Record that the published Inferno companion supports persistent 1×–3× inline sizing and a temporary 4× overlay while Markdown remains authoritative.

- [ ] **Step 3: Run final checks**

Run:

~~~
npm.cmd test --prefix web
npm.cmd run build --prefix web
git diff --check
git status --short --branch
~~~

Expected: all tests PASS, build exits 0, whitespace check is clean, and only QA/handoff files are staged for this task.

- [ ] **Step 4: Commit**

~~~
git add docs/qa-report.md HANDOFF.md
git commit -m "docs: verify map enlargement controls"
~~~
