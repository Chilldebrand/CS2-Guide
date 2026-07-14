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
