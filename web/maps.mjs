const markdownFiles = {
  readme: 'README.md',
  offense: 'offense.md',
  defense: 'defense.md',
  utility: 'utility.md',
};

const assetFiles = {
  sourceNote: 'assets/map-overview-source.md',
  context: 'assets/positioning-overview.svg',
  defaultT: 'assets/default-t.svg',
  defaultCt: 'assets/default-ct.svg',
};

export const ACTIVE_DUTY_MAPS = [
  { slug: 'ancient', title: 'Ancient', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/ancient', pageTitle: 'Ancient | CS2 Guide' },
  { slug: 'cache', title: 'Cache', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/cache', pageTitle: 'Cache | CS2 Guide' },
  { slug: 'dust2', title: 'Dust II', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/dust2', pageTitle: 'Dust II | CS2 Guide' },
  { slug: 'inferno', title: 'Inferno', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/inferno', pageTitle: 'Inferno | CS2 Guide' },
  { slug: 'mirage', title: 'Mirage', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/mirage', pageTitle: 'Mirage | CS2 Guide' },
  { slug: 'nuke', title: 'Nuke', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/nuke', pageTitle: 'Nuke | CS2 Guide' },
  { slug: 'anubis', title: 'Anubis', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/anubis', pageTitle: 'Anubis | CS2 Guide' },
].map((map) => ({
  ...map,
  markdown: markdownFiles,
  assets: assetFiles,
}));

export function getRequiredInputs(map) {
  return [
    map.markdown.readme,
    map.markdown.offense,
    map.markdown.defense,
    map.markdown.utility,
    map.assets.sourceNote,
    map.assets.context,
    map.assets.defaultT,
    map.assets.defaultCt,
  ].map((relativePath) => `${map.sourceDir}/${relativePath}`);
}
