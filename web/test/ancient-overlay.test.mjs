import assert from 'node:assert/strict';
import { access, mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildSite } from '../build.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

test('Ancient defaults use the supplied local map photo as their overlay layer', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-ancient-overlay-'));
  await buildSite({ rootDir: repoRoot, outputDir });

  const assetsDir = path.join(outputDir, 'maps', 'ancient', 'assets');
  await access(path.join(assetsDir, 'ancient-callouts.png'));

  for (const filename of ['default-t.svg', 'default-ct.svg']) {
    const svg = await readFile(path.join(assetsDir, filename), 'utf8');
    assert.match(svg, /href="data:image\/png;base64,[A-Za-z0-9+/=]+"/);
    assert.doesNotMatch(svg, /href="ancient-callouts\.png"/);
    assert.doesNotMatch(svg, /csgold\.net/);
  }
});
