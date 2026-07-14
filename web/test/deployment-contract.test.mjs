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
  const buildJob = workflow.match(/^  build:\n([\s\S]*?)(?=^  deploy:)/m)?.[1];
  const deployJob = workflow.match(/^  deploy:\n([\s\S]*)$/m)?.[1];

  assert.match(workflow, /^on:\n  push:\n    branches: \[main\]\n  workflow_dispatch:$/m);
  assert.match(
    workflow,
    /^permissions:\n  contents: read\n  pages: write\n  id-token: write$/m
  );
  assert.ok(buildJob, 'workflow must define a build job before deploy');
  assert.match(buildJob, /^    runs-on: ubuntu-latest$/m);
  assert.match(buildJob, /^      - uses: actions\/checkout@v4$/m);
  assert.match(
    buildJob,
    /^      - uses: actions\/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n          cache-dependency-path: web\/package-lock\.json$/m
  );
  assert.match(buildJob, /^      - working-directory: web\n        run: npm ci$/m);
  assert.match(buildJob, /^      - working-directory: web\n        run: npm run build$/m);
  assert.match(
    buildJob,
    /^      - uses: actions\/upload-pages-artifact@v3\n        with:\n          path: web\/dist$/m
  );
  assert.ok(deployJob, 'workflow must define a deploy job');
  assert.match(deployJob, /^    needs: build$/m);
  assert.match(deployJob, /^    runs-on: ubuntu-latest$/m);
  assert.match(deployJob, /^      - uses: actions\/deploy-pages@v4$/m);
});

test('generated web output and local dependencies stay ignored', async () => {
  const gitignore = await readFile(path.join(repoRoot, '.gitignore'), 'utf8');
  assert.match(gitignore, /^web\/dist\/$/m);
  assert.match(gitignore, /^web\/node_modules\/$/m);
});
