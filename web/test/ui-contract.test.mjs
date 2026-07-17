import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const webRoot = path.resolve(import.meta.dirname, '..');
const appScript = await readFile(path.join(webRoot, 'app.js'), 'utf8');

class MockClassList {
  #classes = new Set();

  add(...names) {
    names.forEach((name) => this.#classes.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.#classes.delete(name));
  }

  toggle(name, force) {
    const enabled = force ?? !this.#classes.has(name);
    enabled ? this.#classes.add(name) : this.#classes.delete(name);
    return enabled;
  }

  contains(name) {
    return this.#classes.has(name);
  }
}

class MockElement {
  #listeners = new Map();
  #attributes = new Map();

  constructor() {
    this.checked = false;
    this.classList = new MockClassList();
    this.dataset = {};
    this.focusCalls = 0;
    this.hidden = false;
    this.textContent = '';
    this.tabIndex = 0;
    this.value = '';
  }

  addEventListener(type, listener) {
    const listeners = this.#listeners.get(type) ?? [];
    listeners.push(listener);
    this.#listeners.set(type, listeners);
  }

  dispatch(type, properties = {}) {
    const event = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      target: this,
      type,
      ...properties,
    };

    for (const listener of this.#listeners.get(type) ?? []) {
      listener(event);
    }

    return event;
  }

  focus() {
    this.focusCalls += 1;
  }

  getAttribute(name) {
    return this.#attributes.get(name) ?? null;
  }

  setAttribute(name, value) {
    this.#attributes.set(name, String(value));
  }
}

function runApp({ dialog = 'full', preferences = {} } = {}) {
  const storedPreferences = new Map(Object.entries(preferences));
  const elements = {
    collapse: new MockElement(),
    follow: new MockElement(),
    layout: new MockElement(),
    overlay: new MockElement(),
    overlayClose: new MockElement(),
    panel: new MockElement(),
    size: new MockElement(),
    sideTabs: [new MockElement(), new MockElement()],
    sideViews: [new MockElement(), new MockElement(), new MockElement(), new MockElement()],
  };
  elements.sideTabs[0].dataset.mapSideTab = 't';
  elements.sideTabs[1].dataset.mapSideTab = 'ct';
  elements.sideViews.forEach((view, index) => {
    view.dataset.mapDefault = index % 2 === 0 ? 't' : 'ct';
  });
  const selectors = new Map([
    ['[data-map-follow]', elements.follow],
    ['[data-map-collapse]', elements.collapse],
    ['[data-map-panel]', elements.panel],
    ['[data-map-size]', elements.size],
    ['[data-map-overlay]', elements.overlay],
    ['[data-map-overlay-close]', elements.overlayClose],
    ['.guide-layout', elements.layout],
  ]);
  const queryAll = new Map([
    ['[data-map-side-tab]', elements.sideTabs],
    ['[data-map-default]', elements.sideViews],
  ]);

  elements.overlay.closeCalls = 0;
  elements.overlay.showModalCalls = 0;

  if (dialog === 'full' || dialog === 'showModalOnly') {
    elements.overlay.showModal = () => {
      elements.overlay.showModalCalls += 1;
      elements.overlay.open = true;
    };
  }

  if (dialog === 'full') {
    elements.overlay.close = () => {
      elements.overlay.closeCalls += 1;
      elements.overlay.open = false;
      elements.overlay.dispatch('close');
    };
  }

  const localStorage = {
    getItem(key) {
      return storedPreferences.get(key) ?? null;
    },
    setItem(key, value) {
      storedPreferences.set(key, String(value));
    },
  };

  vm.runInNewContext(appScript, {
    document: {
      querySelector(selector) {
        return selectors.get(selector) ?? null;
      },
      querySelectorAll(selector) {
        return queryAll.get(selector) ?? [];
      },
    },
    window: { localStorage },
  });

  return { elements, storedPreferences };
}

test('template exposes accessible map controls', async () => {
  const template = await readFile(path.join(webRoot, 'template.html'), 'utf8');
  assert.match(template, /id="map-follow"/);
  assert.match(template, /aria-controls="map-body"/);
  assert.match(template, /aria-expanded="true"/);
  assert.match(template, /data-map-side="t"/);
  assert.match(template, /data-map-side="ct"/);
  assert.match(template, /role="tablist"/);
  assert.match(template, /data-map-side-tab="t"/);
  assert.match(template, /data-map-side-tab="ct"/);
  assert.doesNotMatch(template, /positioning-overview\.svg/);
});

test('template exposes map sizing and modal controls', async () => {
  const template = await readFile(path.join(webRoot, 'template.html'), 'utf8');

  assert.match(template, /<label[^>]*for="map-size"[^>]*>Map size<\/label>/);
  assert.match(template, /<select[^>]*id="map-size"[^>]*data-map-size/);
  assert.match(template, /<option value="1">1×<\/option>/);
  assert.match(template, /<option value="4">4×<\/option>/);
  assert.match(template, /<dialog[^>]*id="map-overlay"[^>]*data-map-overlay/);
  assert.match(template, /data-map-overlay-close/);
  assert.match(template, /aria-label="Expanded \{\{MAP_TITLE\}\} map"/);
});

test('styles and script expose responsive and reduced-motion behavior', async () => {
  const css = await readFile(path.join(webRoot, 'styles.css'), 'utf8');
  const js = await readFile(path.join(webRoot, 'app.js'), 'utf8');
  assert.match(css, /@media\s*\(max-width:/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /position:\s*sticky/);
  assert.doesNotMatch(css, /order:\s*-1/);
  assert.match(css, /\.guide-layout\.map-size-2\s*\{/);
  assert.match(css, /\.guide-layout\.map-size-3\s*\{/);
  assert.match(css, /\[data-map-overlay\]:not\(\[open\]\)\s*\{\s*display:\s*none;/);
  assert.match(css, /\[data-map-overlay\]::backdrop/);
  assert.match(js, /aria-expanded/);
  assert.match(js, /localStorage/);
  assert.match(js, /cs2-guide-map-size/);
  assert.match(js, /showModal\(\)/);
  assert.match(js, /addEventListener\('keydown'/);
  assert.match(js, /overlay\.close\(\)/);
  assert.match(js, /size\.focus\(\)/);
});

test('4x dialog assigns a viewport-constrained width to the enlarged map', async () => {
  const css = await readFile(path.join(webRoot, 'styles.css'), 'utf8');
  const overlayRule = css.match(/\[data-map-overlay\]\s*\{([^}]*)\}/s)?.[1] ?? '';
  const overlayImageRule = css.match(/\[data-map-overlay\]\s+img\s*\{([^}]*)\}/s)?.[1] ?? '';

  assert.match(overlayRule, /^\s*width:\s*min\(96vw,\s*90rem\);/m);
  assert.match(overlayImageRule, /^\s*width:\s*100%;/m);
});

test('size 3 stacks before mobile while roomy map sizes retain desktop columns', async () => {
  const css = await readFile(path.join(webRoot, 'styles.css'), 'utf8');

  assert.match(
    css,
    /\.guide-layout\.map-size-2\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(24rem,\s*38rem\);\s*\}/,
  );
  assert.match(
    css,
    /\.guide-layout\.map-size-3\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(30rem,\s*48rem\);\s*\}/,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*64rem\)\s*\{[\s\S]*?\.guide-layout\.map-size-3\s*\{\s*grid-template-columns:\s*1fr;\s*\}/,
  );
});

test('1x through 3x update only the active layout class and saved size', () => {
  const { elements, storedPreferences } = runApp({
    preferences: { 'cs2-guide-map-size': '2' },
  });

  for (const selected of ['1', '2', '3']) {
    elements.size.value = selected;
    elements.size.dispatch('change');

    for (const candidate of ['1', '2', '3']) {
      assert.equal(
        elements.layout.classList.contains(`map-size-${candidate}`),
        candidate === selected,
      );
    }
    assert.equal(elements.size.value, selected);
    assert.equal(storedPreferences.get('cs2-guide-map-size'), selected);
  }
});

test('side tabs switch between T and CT drawings and persist the choice', () => {
  const { elements, storedPreferences } = runApp({
    preferences: { 'cs2-guide-map-side': 't' },
  });

  assert.equal(elements.sideTabs[0].getAttribute('aria-selected'), 'true');
  assert.equal(elements.sideTabs[1].getAttribute('aria-selected'), 'false');
  assert.equal(elements.sideViews[0].hidden, false);
  assert.equal(elements.sideViews[1].hidden, true);

  elements.sideTabs[1].dispatch('click');

  assert.equal(elements.sideTabs[0].getAttribute('aria-selected'), 'false');
  assert.equal(elements.sideTabs[1].getAttribute('aria-selected'), 'true');
  assert.equal(elements.sideViews[0].hidden, true);
  assert.equal(elements.sideViews[1].hidden, false);
  assert.equal(elements.sideViews[2].hidden, true);
  assert.equal(elements.sideViews[3].hidden, false);
  assert.equal(storedPreferences.get('cs2-guide-map-side'), 'ct');
});

test('4x is temporary and closing restores the saved inline size', () => {
  const { elements, storedPreferences } = runApp({
    preferences: { 'cs2-guide-map-size': '2' },
  });

  elements.size.value = '4';
  elements.size.dispatch('change');

  assert.equal(elements.overlay.showModalCalls, 1);
  assert.equal(elements.layout.classList.contains('map-size-2'), true);
  assert.equal(storedPreferences.get('cs2-guide-map-size'), '2');

  elements.overlayClose.dispatch('click');
  assert.equal(elements.overlay.closeCalls, 1);
  assert.equal(elements.size.value, '2');
  assert.equal(elements.size.focusCalls, 1);
});

test('missing either dialog method falls back to and reapplies the saved inline size', () => {
  for (const dialog of ['none', 'showModalOnly']) {
    const { elements, storedPreferences } = runApp({
      dialog,
      preferences: { 'cs2-guide-map-size': '3' },
    });

    elements.layout.classList.remove('map-size-3');
    elements.size.value = '4';
    elements.size.dispatch('change');

    assert.equal(elements.overlay.showModalCalls, 0);
    assert.equal(elements.size.value, '3');
    assert.equal(elements.layout.classList.contains('map-size-3'), true);
    assert.equal(storedPreferences.get('cs2-guide-map-size'), '3');
  }
});

test('Close and Escape are safe and restore focus according to dialog support', () => {
  const supported = runApp({ preferences: { 'cs2-guide-map-size': '2' } });

  supported.elements.size.value = '4';
  supported.elements.size.dispatch('change');
  supported.elements.overlayClose.dispatch('click');

  supported.elements.size.value = '4';
  supported.elements.size.dispatch('change');
  const escape = supported.elements.overlay.dispatch('keydown', { key: 'Escape' });

  assert.equal(escape.defaultPrevented, true);
  assert.equal(supported.elements.overlay.closeCalls, 2);
  assert.equal(supported.elements.size.value, '2');
  assert.equal(supported.elements.size.focusCalls, 2);

  const unsupported = runApp({ dialog: 'none' });
  assert.doesNotThrow(() => unsupported.elements.overlayClose.dispatch('click'));
  assert.doesNotThrow(() => unsupported.elements.overlay.dispatch('keydown', { key: 'Escape' }));
});

test('follow and collapse controls remain independent', () => {
  const { elements, storedPreferences } = runApp();

  assert.equal(elements.panel.classList.contains('is-sticky'), true);
  assert.equal(elements.panel.classList.contains('is-collapsed'), false);

  elements.follow.checked = false;
  elements.follow.dispatch('change');
  assert.equal(elements.panel.classList.contains('is-sticky'), false);
  assert.equal(elements.panel.classList.contains('is-collapsed'), false);

  elements.collapse.dispatch('click');
  assert.equal(elements.panel.classList.contains('is-sticky'), false);
  assert.equal(elements.panel.classList.contains('is-collapsed'), true);
  assert.equal(elements.collapse.getAttribute('aria-expanded'), 'false');

  elements.follow.checked = true;
  elements.follow.dispatch('change');
  assert.equal(elements.panel.classList.contains('is-sticky'), true);
  assert.equal(elements.panel.classList.contains('is-collapsed'), true);
  assert.equal(storedPreferences.get('cs2-guide-map-follow'), 'true');
  assert.equal(storedPreferences.get('cs2-guide-map-collapsed'), 'true');
});
