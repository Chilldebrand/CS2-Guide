import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildSite } from '../build.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

test('buildSite emits one Ancient document and copies its supporting assets', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-web-'));
  await buildSite({ rootDir: repoRoot, outputDir });

  const html = await readFile(path.join(outputDir, 'maps', 'ancient', 'index.html'), 'utf8');
  assert.match(html, /Ancient/);
  assert.match(html, /id="round-plan"/);
  assert.match(html, /id="offense"/);
  assert.match(html, /id="defense"/);
  assert.match(html, /id="utility-priorities"/);
  assert.match(html, /assets\/positioning-overview\.svg/);
  assert.match(html, /Markdown source/);
  await access(path.join(outputDir, 'styles.css'));
  await access(path.join(outputDir, 'app.js'));
  await access(path.join(outputDir, 'maps', 'ancient', 'assets', 'positioning-overview.svg'));
  await access(path.join(outputDir, 'maps', 'ancient', 'assets', 'ancient-callouts.png'));
});

test('buildSite fails when a required source file is missing', async () => {
  const fakeRoot = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-missing-'));
  await mkdir(path.join(fakeRoot, 'maps', 'ancient', 'assets'), { recursive: true });
  await writeFile(path.join(fakeRoot, 'maps', 'ancient', 'README.md'), '# Ancient');

  await assert.rejects(
    buildSite({ rootDir: fakeRoot, outputDir: path.join(fakeRoot, 'dist') }),
    /Missing required Ancient source file/
  );
});

test('buildSite identifies a missing positioning SVG after finding all Ancient Markdown', async () => {
  const fakeRoot = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-missing-svg-'));
  const ancientDir = path.join(fakeRoot, 'maps', 'ancient');
  await mkdir(path.join(ancientDir, 'assets'), { recursive: true });
  await Promise.all([
    writeFile(path.join(ancientDir, 'README.md'), '# Ancient'),
    writeFile(path.join(ancientDir, 'offense.md'), '# Offense'),
    writeFile(path.join(ancientDir, 'defense.md'), '# Defense'),
    writeFile(path.join(ancientDir, 'utility.md'), '# Utility priorities'),
    writeFile(path.join(ancientDir, 'assets', 'map-overview-source.md'), '# Source note'),
  ]);

  await assert.rejects(
    buildSite({ rootDir: fakeRoot, outputDir: path.join(fakeRoot, 'dist') }),
    /maps\/ancient\/assets\/positioning-overview\.svg/
  );
});

test('generated document preserves guide order and stable heading IDs', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'cs2-guide-order-'));
  await buildSite({ rootDir: repoRoot, outputDir });
  const html = await readFile(path.join(outputDir, 'maps', 'ancient', 'index.html'), 'utf8');

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
  const html = await readFile(path.join(outputDir, 'maps', 'ancient', 'index.html'), 'utf8');

  assert.match(html, /href="https:\/\/github\.com\/Chilldebrand\/CS2-Guide\/blob\/main\/maps\/ancient\/assets\/map-overview-source\.md">Visual\/source note<\/a>/);
  assert.match(html, /href="https:\/\/github\.com\/Chilldebrand\/CS2-Guide\/blob\/main\/maps\/ancient\/assets\/map-overview-source\.md">Positioning source note<\/a>/);
  assert.match(html, /href="#offense">Offense plan<\/a>/);
  assert.match(html, /href="#defense">Defense plan<\/a>/);
  assert.match(html, /href="#utility">Utility priorities<\/a>/);
  assert.match(html, /id="positioning-overview"/);
  assert.match(html, /id="utility"/);
  assert.doesNotMatch(html, /href="(?!(?:https?:)?\/\/|#)[^"]*\.md(?:[?#][^"]*)?"/);
});
