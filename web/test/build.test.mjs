import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
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
  await access(path.join(outputDir, 'assets', 'positioning-overview.svg'));
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

test('buildSite identifies a missing positioning SVG after finding all Inferno Markdown', async () => {
  const fakeRoot = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-missing-svg-'));
  const infernoDir = path.join(fakeRoot, 'maps', 'inferno');
  await mkdir(path.join(infernoDir, 'assets'), { recursive: true });
  await Promise.all([
    writeFile(path.join(infernoDir, 'README.md'), '# Inferno'),
    writeFile(path.join(infernoDir, 'offense.md'), '# Offense'),
    writeFile(path.join(infernoDir, 'defense.md'), '# Defense'),
    writeFile(path.join(infernoDir, 'utility.md'), '# Utility priorities'),
  ]);

  await assert.rejects(
    buildSite({ rootDir: fakeRoot, outputDir: path.join(fakeRoot, 'dist') }),
    /maps\/inferno\/assets\/positioning-overview\.svg/
  );
});
