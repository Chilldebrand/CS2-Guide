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

const activeDutyMaps = [
  { slug: 'ancient', title: 'Ancient', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/ancient', pageTitle: 'Ancient | CS2 Guide', sourceMap: 'assets/ancient-callouts.png' },
  { slug: 'cache', title: 'Cache', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/cache', pageTitle: 'Cache | CS2 Guide', sourceMap: 'assets/cache-callouts.webp' },
  { slug: 'dust2', title: 'Dust II', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/dust2', pageTitle: 'Dust II | CS2 Guide', sourceMap: 'assets/dust2-callouts.webp' },
  { slug: 'inferno', title: 'Inferno', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/inferno', pageTitle: 'Inferno | CS2 Guide', sourceMap: 'assets/inferno-callouts.webp' },
  { slug: 'mirage', title: 'Mirage', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/mirage', pageTitle: 'Mirage | CS2 Guide', sourceMap: 'assets/mirage-callouts.webp' },
  { slug: 'nuke', title: 'Nuke', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/nuke', pageTitle: 'Nuke | CS2 Guide', sourceMap: 'assets/nuke-callouts.jpg' },
  { slug: 'anubis', title: 'Anubis', poolLabel: 'Premier / Active Duty', sourceDir: 'maps/anubis', pageTitle: 'Anubis | CS2 Guide', sourceMap: 'assets/anubis-callouts.webp' },
].map((map) => ({
  ...map,
  markdown: markdownFiles,
  assets: { ...assetFiles, sourceMap: map.sourceMap },
}));

const competitiveOnlyMaps = [
  { slug: 'train', title: 'Train', poolLabel: 'Competitive-only', sourceDir: 'maps/train', pageTitle: 'Train | CS2 Guide', sourceMap: 'assets/train-callouts.webp' },
  { slug: 'vertigo', title: 'Vertigo', poolLabel: 'Competitive-only', sourceDir: 'maps/vertigo', pageTitle: 'Vertigo | CS2 Guide', sourceMap: 'assets/vertigo-callouts.webp' },
  { slug: 'overpass', title: 'Overpass', poolLabel: 'Competitive-only', sourceDir: 'maps/overpass', pageTitle: 'Overpass | CS2 Guide', sourceMap: 'assets/overpass-callouts.webp' },
  { slug: 'office', title: 'Office', poolLabel: 'Competitive-only / Hostage', sourceDir: 'maps/office', pageTitle: 'Office | CS2 Guide', sourceMap: 'assets/office-callouts.png' },
  { slug: 'italy', title: 'Italy', poolLabel: 'Competitive-only / Hostage', sourceDir: 'maps/italy', pageTitle: 'Italy | CS2 Guide', sourceMap: 'assets/italy-callouts.jpg' },
  { slug: 'boulder', title: 'Boulder', poolLabel: 'Competitive-only', sourceDir: 'maps/boulder', pageTitle: 'Boulder | CS2 Guide', sourceMap: 'assets/boulder-map-1.webp' },
  { slug: 'fachwerk', title: 'Fachwerk', poolLabel: 'Competitive-only', sourceDir: 'maps/fachwerk', pageTitle: 'Fachwerk | CS2 Guide', sourceMap: 'assets/fachwerk-map-detail.webp' },
  { slug: 'shelter', title: 'Shelter', poolLabel: 'Competitive-only / Hostage', sourceDir: 'maps/shelter', pageTitle: 'Shelter | CS2 Guide', sourceMap: 'assets/shelter-map.webp' },
].map((map) => ({
  ...map,
  markdown: markdownFiles,
  assets: { ...assetFiles, sourceMap: map.sourceMap },
}));

export const ACTIVE_DUTY_MAPS = activeDutyMaps;
export const COMPETITIVE_ONLY_MAPS = competitiveOnlyMaps;
export const GUIDE_MAPS = [...ACTIVE_DUTY_MAPS, ...COMPETITIVE_ONLY_MAPS];

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
    map.assets.sourceMap,
  ].map((relativePath) => `${map.sourceDir}/${relativePath}`);
}
