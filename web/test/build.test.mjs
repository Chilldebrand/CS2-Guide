import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildSite } from '../build.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

test('buildSite emits a landing page and one document per Active Duty map', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-web-'));
  await buildSite({ rootDir: repoRoot, outputDir });

  const landing = await readFile(path.join(outputDir, 'index.html'), 'utf8');
  assert.match(landing, /Ancient/);
  assert.match(landing, /href="maps\/inferno\/index\.html"/);
  assert.match(landing, /href="maps\/anubis\/index\.html"/);

  for (const map of ['ancient', 'cache', 'dust2', 'inferno', 'mirage', 'nuke', 'anubis']) {
    const html = await readFile(path.join(outputDir, 'maps', map, 'index.html'), 'utf8');
    assert.match(html, new RegExp(map === 'dust2' ? 'Dust II' : map[0].toUpperCase() + map.slice(1)));
    assert.match(html, /id="round-plan"/);
    assert.match(html, /id="offense"/);
    assert.match(html, /id="defense"/);
    assert.match(html, /id="utility-priorities"/);
    assert.match(html, /assets\/positioning-overview\.svg/);
    assert.match(html, /assets\/default-t\.svg/);
    assert.match(html, /assets\/default-ct\.svg/);
    await access(path.join(outputDir, 'maps', map, 'assets', 'default-t.svg'));
    await access(path.join(outputDir, 'maps', map, 'assets', 'default-ct.svg'));
  }

  await access(path.join(outputDir, 'styles.css'));
  await access(path.join(outputDir, 'app.js'));
});

test('buildSite fails when a required source file is missing', async () => {
  const fakeRoot = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-missing-'));
  await mkdir(path.join(fakeRoot, 'maps', 'inferno', 'assets'), { recursive: true });
  await writeFile(path.join(fakeRoot, 'maps', 'inferno', 'README.md'), '# Inferno');

  await assert.rejects(
    buildSite({ rootDir: fakeRoot, outputDir: path.join(fakeRoot, 'dist') }),
    /Missing required Ancient source file: maps\/ancient\/README\.md/
  );
});

test('buildSite identifies the first missing map source path', async () => {
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
    /Missing required Ancient source file: maps\/ancient\/README\.md/
  );
});

test('generated document preserves guide order and stable heading IDs', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-order-'));
  await buildSite({ rootDir: repoRoot, outputDir });
  const html = await readFile(path.join(outputDir, 'maps', 'inferno', 'index.html'), 'utf8');

  assert.ok(html.indexOf('Round plan') < html.indexOf('Offense'));
  assert.ok(html.indexOf('Offense') < html.indexOf('Defense'));
  assert.ok(html.indexOf('Defense') < html.indexOf('Utility priorities'));
  assert.match(html, /href="#round-plan"/);
  assert.match(html, /href="#offense"/);
  assert.match(html, /href="#defense"/);
});

test('generated document rewrites local Markdown cross-links to in-page anchors', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-links-'));
  await buildSite({ rootDir: repoRoot, outputDir });
  const html = await readFile(path.join(outputDir, 'maps', 'inferno', 'index.html'), 'utf8');

  assert.match(html, /href="https:\/\/github\.com\/Chilldebrand\/CS2-Guide\/blob\/main\/maps\/inferno\/assets\/map-overview-source\.md">Visual\/source note<\/a>/);
  assert.match(html, /href="https:\/\/github\.com\/Chilldebrand\/CS2-Guide\/blob\/main\/maps\/inferno\/assets\/map-overview-source\.md">Positioning source note<\/a>/);
  assert.match(html, /href="#offense">Offense plan<\/a>/);
  assert.match(html, /href="#defense">Defense plan<\/a>/);
  assert.match(html, /href="#utility">Utility priorities<\/a>/);
  assert.match(html, /id="positioning-overview"/);
  assert.match(html, /id="utility"/);
  assert.doesNotMatch(html, /href="(?!(?:https?:)?\/\/|#)[^"]*\.md(?:[?#][^"]*)?"/);
});
