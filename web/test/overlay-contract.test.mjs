import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const guideMaps = [
  'ancient', 'cache', 'dust2', 'inferno', 'mirage', 'nuke', 'anubis',
  'train', 'vertigo', 'overpass', 'office', 'italy', 'boulder', 'fachwerk', 'shelter',
];
const sourceMaps = {
  ancient: 'ancient-callouts.png',
  cache: 'cache-callouts.webp',
  dust2: 'dust2-callouts.webp',
  inferno: 'inferno-callouts.webp',
  mirage: 'mirage-callouts.webp',
  nuke: 'nuke-callouts.jpg',
  anubis: 'anubis-callouts.webp',
  train: 'train-callouts.webp',
  vertigo: 'vertigo-callouts.webp',
  overpass: 'overpass-callouts.webp',
  office: 'office-callouts.png',
  italy: 'italy-callouts.jpg',
  boulder: 'boulder-map-1.webp',
  fachwerk: 'fachwerk-map-detail.webp',
  shelter: 'shelter-map.webp',
};
const sourceGeometry = {
  ancient: [1013, 1013],
  cache: [1416, 1416],
  dust2: [1920, 1080],
  inferno: [1920, 1080],
  mirage: [1920, 1080],
  nuke: [675, 659],
  anubis: [1024, 1024],
  train: [1416, 1416],
  vertigo: [1416, 1416],
  overpass: [1080, 1080],
  office: [1024, 1024],
  italy: [440, 422],
  boulder: [2048, 2048],
  fachwerk: [2048, 2048],
  shelter: [1672, 941],
};

function assertWellFormedSvg(svg, file) {
  const stack = [];
  const tags = svg.replace(/<!--[\s\S]*?-->/g, '').match(/<[^>]+>/g) ?? [];

  for (const rawTag of tags) {
    if (/^<\?/.test(rawTag) || /^<!/.test(rawTag)) continue;

    const closing = rawTag.match(/^<\/\s*([A-Za-z][\w:.-]*)/);
    if (closing) {
      assert.equal(stack.pop(), closing[1], `${file}: mismatched closing tag`);
      continue;
    }

    const opening = rawTag.match(/^<\s*([A-Za-z][\w:.-]*)/);
    if (opening && !/\/\s*>$/.test(rawTag)) stack.push(opening[1]);
  }

  assert.deepEqual(stack, [], `${file}: unclosed SVG tags`);
}

for (const map of guideMaps) {
  test(`${map} source note records the overlay background and assets`, async () => {
    const note = await readFile(
      path.join(repoRoot, 'maps', map, 'assets', 'map-overview-source.md'),
      'utf8',
    );

    assert.match(note, /Overlay background URL:\*\*?\s*https?:\/\//);
    assert.match(note, new RegExp(`assets/${sourceMaps[map]}`));
    assert.match(note, /default-t\.svg/);
    assert.match(note, /default-ct\.svg/);
    assert.doesNotMatch(note, /positioning-overview\.svg|Positioning diagram/);
  });

  for (const side of ['t', 'ct']) {
    test(`${map} ${side.toUpperCase()} default overlay has five accessible players`, async () => {
      const svg = await readFile(
        path.join(repoRoot, 'maps', map, 'assets', `default-${side}.svg`),
        'utf8',
      );
      const file = `maps/${map}/assets/default-${side}.svg`;

      assertWellFormedSvg(svg, file);
      assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
      assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
      assert.match(svg, /aria-label="legend"|>Legend</i);
      assert.match(svg, /<image\b[^>]+href="data:image\/(?:png|webp|jpeg);base64,[A-Za-z0-9+/=]+"/);
      assert.doesNotMatch(svg, /href="https?:\/\//);
      assert.doesNotMatch(svg, new RegExp(`href="${sourceMaps[map]}"`));
      const [width, height] = sourceGeometry[map];
      assert.match(svg, new RegExp(`viewBox="0 0 ${width} ${height}"`));
      assert.match(svg, new RegExp(`width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"`));
      assert.doesNotMatch(svg, /preserveAspectRatio="xMidYMid slice"/);
      assert.equal(
        [...svg.matchAll(new RegExp(`data-side="${side}"`, 'g'))].length,
        5,
      );
      for (let player = 1; player <= 5; player += 1) {
        assert.match(svg, new RegExp(`data-side="${side}" data-player="${player}"`));
      }
      assert.doesNotMatch(svg, new RegExp(`data-side="${side === 't' ? 'ct' : 't'}"`));
    });
  }
}
