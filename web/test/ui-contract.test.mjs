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

test('styles and script expose responsive and reduced-motion behavior', async () => {
  const css = await readFile(path.join(webRoot, 'styles.css'), 'utf8');
  const js = await readFile(path.join(webRoot, 'app.js'), 'utf8');
  assert.match(css, /@media\s*\(max-width:/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /position:\s*sticky/);
  assert.doesNotMatch(css, /order:\s*-1/);
  assert.match(css, /\.guide-layout\.map-size-2\s*\{/);
  assert.match(css, /\.guide-layout\.map-size-3\s*\{/);
  assert.match(css, /\[data-map-overlay\]::backdrop/);
  assert.match(js, /aria-expanded/);
  assert.match(js, /localStorage/);
  assert.match(js, /cs2-guide-map-size/);
  assert.match(js, /showModal\(\)/);
  assert.match(js, /addEventListener\('keydown'/);
  assert.match(js, /overlay\.close\(\)/);
  assert.match(js, /size\.focus\(\)/);
});
