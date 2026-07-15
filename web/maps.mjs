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
  {
    slug: 'ancient',
    title: 'Ancient',
    poolLabel: 'Premier / Active Duty',
    sourceDir: 'maps/ancient',
    pageTitle: 'Ancient | CS2 Guide',
    sourceMap: 'assets/ancient-callouts.png',
  },
].map((map) => ({
  ...map,
  markdown: markdownFiles,
  assets: { ...assetFiles, sourceMap: map.sourceMap },
}));

export function getRequiredInputs(map) {
  const required = [
    map.markdown.readme,
    map.markdown.offense,
    map.markdown.defense,
    map.markdown.utility,
    map.assets.sourceNote,
    map.assets.context,
    map.assets.defaultT,
    map.assets.defaultCt,
  ];
  if (map.assets.sourceMap) required.push(map.assets.sourceMap);
  return required.map((relativePath) => `${map.sourceDir}/${relativePath}`);
}
