import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { GUIDE_MAPS, getRequiredInputs } from './maps.mjs';

const HEADING_ID_OVERRIDES = new Map([
  ['Positioning visual', 'positioning-overview'],
]);

export function slugifyHeading(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
function addHeadingIds(html, usedIds) {
  return html.replace(/<h2>([\s\S]*?)<\/h2>/g, (heading, contents) => {
    const text = contents.replace(/<[^>]+>/g, '');
    const baseId = HEADING_ID_OVERRIDES.get(text) ?? slugifyHeading(text);
    const occurrence = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, occurrence + 1);
    const id = occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`;

    return `<h2 id="${id}">${contents}</h2>`;
  });
}

function rewriteLocalMarkdownLinks(html, map) {
  const sourceNoteUrl = `https://github.com/Chilldebrand/CS2-Guide/blob/main/${map.sourceDir}/${map.assets.sourceNote}`;
  const localLinks = new Map([
    [map.assets.sourceNote, sourceNoteUrl],
    ['offense.md', '#offense'],
    ['defense.md', '#defense'],
    ['utility.md', '#utility'],
  ]);

  return html.replace(/href="([^"]+)"/g, (link, href) => {
    const replacement = localLinks.get(href);
    return replacement ? `href="${replacement}"` : link;
  });
}

function renderSection(id, label, markdown, map, usedIds, aliases = []) {
  return [
    `<section id="${id}">`,
    ...aliases.map((alias) => `<span id="${alias}" aria-hidden="true"></span>`),
    `<h2>${label}</h2>`,
    addHeadingIds(rewriteLocalMarkdownLinks(marked.parse(markdown), map), usedIds),
    '</section>',
  ].join('\n');
}

async function validateRequiredInputs(rootDir, map) {
  for (const relativePath of getRequiredInputs(map)) {
    try {
      await access(path.join(rootDir, relativePath));
    } catch {
      throw new Error(`Missing required ${map.title} source file: ${relativePath}`);
    }
  }
}

function renderMapTemplate({ template, map, content }) {
  return template
    .replaceAll('{{TITLE}}', map.pageTitle)
    .replaceAll('{{MAP_TITLE}}', map.title)
    .replaceAll('{{MAP_SLUG}}', map.slug)
    .replaceAll('{{CONTENT}}', content)
    .replaceAll('{{ASSET_BASE}}', '../../')
    .replaceAll('{{MAP_ASSET_BASE}}', 'assets/');
}

function renderLandingPage() {
  const links = GUIDE_MAPS.map(
    (map) => `<li><a href="maps/${map.slug}/index.html">${map.title}</a> <span>${map.poolLabel}</span></li>`,
  ).join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CS2 Guide | map guides</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <main class="landing">
      <p class="eyebrow">CS2 Guide</p>
      <h1>CS2 map guides</h1>
      <p>Choose a map for its round plan, offense, defense, utility priorities, and five-player defaults.</p>
      <ul class="map-index">${links}</ul>
    </main>
  </body>
</html>`;
}

export async function buildMapPage({ rootDir, outputDir, map, template }) {
  await validateRequiredInputs(rootDir, map);

  const mapDir = path.join(rootDir, map.sourceDir);
  const [readme, offense, defense, utility] = await Promise.all([
    readFile(path.join(mapDir, map.markdown.readme), 'utf8'),
    readFile(path.join(mapDir, map.markdown.offense), 'utf8'),
    readFile(path.join(mapDir, map.markdown.defense), 'utf8'),
    readFile(path.join(mapDir, map.markdown.utility), 'utf8'),
  ]);
  const usedIds = new Map();
  const content = [
    renderSection('round-plan', 'Round plan', readme, map, usedIds),
    renderSection('offense', 'Offense', offense, map, usedIds),
    renderSection('defense', 'Defense', defense, map, usedIds),
    renderSection('utility-priorities', 'Utility priorities', utility, map, usedIds, ['utility']),
  ].join('\n');
  const html = renderMapTemplate({ template, map, content });
  const pageDir = path.join(outputDir, 'maps', map.slug);
  const outputAssetsDir = path.join(pageDir, 'assets');
  await mkdir(outputAssetsDir, { recursive: true });
  const assetCopies = [
    ['context', 'positioning-overview.svg'],
    ['defaultT', 'default-t.svg'],
    ['defaultCt', 'default-ct.svg'],
    ['sourceMap', path.basename(map.assets.sourceMap)],
  ].map(([key, filename]) => copyFile(
    path.join(rootDir, map.sourceDir, map.assets[key]),
    path.join(outputAssetsDir, filename),
  ));

  await Promise.all([
    writeFile(path.join(pageDir, 'index.html'), html),
    ...assetCopies,
  ]);
}

export async function buildSite({ rootDir, outputDir }) {
  for (const map of GUIDE_MAPS) {
    await validateRequiredInputs(rootDir, map);
  }

  const template = await readFile(path.join(import.meta.dirname, 'template.html'), 'utf8');
  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outputDir, 'index.html'), renderLandingPage()),
    copyFile(path.join(import.meta.dirname, 'styles.css'), path.join(outputDir, 'styles.css')),
    copyFile(path.join(import.meta.dirname, 'app.js'), path.join(outputDir, 'app.js')),
    ...GUIDE_MAPS.map((map) => buildMapPage({ rootDir, outputDir, map, template })),
  ]);
}

if (import.meta.main) {
  const rootDir = path.resolve(import.meta.dirname, '..');
  const outputDir = path.join(import.meta.dirname, 'dist');
  await buildSite({ rootDir, outputDir });
}
