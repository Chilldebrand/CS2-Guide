import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

export const REQUIRED_INPUTS = [
  'maps/inferno/README.md',
  'maps/inferno/offense.md',
  'maps/inferno/defense.md',
  'maps/inferno/utility.md',
  'maps/inferno/assets/positioning-overview.svg'
];

const LOCAL_MARKDOWN_LINKS = new Map([
  ['assets/map-overview-source.md', '#positioning-overview'],
  ['offense.md', '#offense'],
  ['defense.md', '#defense'],
  ['utility.md', '#utility']
]);

const HEADING_ID_OVERRIDES = new Map([
  ['Positioning visual', 'positioning-overview']
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

function rewriteLocalMarkdownLinks(html) {
  return html.replace(/href="([^"]+)"/g, (link, href) => {
    const anchor = LOCAL_MARKDOWN_LINKS.get(href);
    return anchor ? `href="${anchor}"` : link;
  });
}

function renderSection(id, label, markdown, usedIds, aliases = []) {
  return [
    `<section id="${id}">`,
    ...aliases.map((alias) => `<span id="${alias}" aria-hidden="true"></span>`),
    `<h2>${label}</h2>`,
    addHeadingIds(rewriteLocalMarkdownLinks(marked.parse(markdown)), usedIds),
    '</section>'
  ].join('\n');
}

async function validateRequiredInputs(rootDir) {
  for (const relativePath of REQUIRED_INPUTS) {
    try {
      await access(path.join(rootDir, relativePath));
    } catch {
      throw new Error('Missing required Inferno source file: ' + relativePath);
    }
  }
}

export async function buildSite({ rootDir, outputDir }) {
  await validateRequiredInputs(rootDir);

  const infernoDir = path.join(rootDir, 'maps', 'inferno');
  const readme = await readFile(path.join(infernoDir, 'README.md'), 'utf8');
  const offense = await readFile(path.join(infernoDir, 'offense.md'), 'utf8');
  const defense = await readFile(path.join(infernoDir, 'defense.md'), 'utf8');
  const utility = await readFile(path.join(infernoDir, 'utility.md'), 'utf8');
  const template = await readFile(path.join(import.meta.dirname, 'template.html'), 'utf8');
  const usedIds = new Map();
  const content = [
    renderSection('round-plan', 'Round plan', readme, usedIds),
    renderSection('offense', 'Offense', offense, usedIds),
    renderSection('defense', 'Defense', defense, usedIds),
    renderSection('utility-priorities', 'Utility priorities', utility, usedIds, ['utility'])
  ].join('\n');
  const html = template.replace('{{CONTENT}}', content);
  const outputAssetsDir = path.join(outputDir, 'assets');

  await mkdir(outputAssetsDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outputDir, 'index.html'), html),
    copyFile(path.join(import.meta.dirname, 'styles.css'), path.join(outputDir, 'styles.css')),
    copyFile(path.join(import.meta.dirname, 'app.js'), path.join(outputDir, 'app.js')),
    copyFile(
      path.join(infernoDir, 'assets', 'positioning-overview.svg'),
      path.join(outputAssetsDir, 'positioning-overview.svg')
    )
  ]);
}

if (import.meta.main) {
  const rootDir = path.resolve(import.meta.dirname, '..');
  const outputDir = path.join(import.meta.dirname, 'dist');
  await buildSite({ rootDir, outputDir });
}
