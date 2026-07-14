import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

test('README exposes the public web guide', async () => {
  const readme = await readFile(path.join(repoRoot, 'README.md'), 'utf8');
  assert.match(readme, /https:\/\/chilldebrand\.github\.io\/CS2-Guide\//);
  assert.match(readme, /one scrollable Inferno guide with an optional map panel/);
});

test('Pages workflow builds web/dist on main and manual dispatch', async () => {
  const workflow = await readFile(
    path.join(repoRoot, '.github', 'workflows', 'deploy-web-guide.yml'),
    'utf8'
  );
  assert.match(workflow, /push:/);
  assert.match(workflow, /main/);
  assert.match(workflow, /workflow_dispatch/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /web\/dist/);
  assert.match(workflow, /deploy-pages/);
});

test('generated web output and local dependencies stay ignored', async () => {
  const gitignore = await readFile(path.join(repoRoot, '.gitignore'), 'utf8');
  assert.match(gitignore, /^web\/dist\/$/m);
  assert.match(gitignore, /^web\/node_modules\/$/m);
});
