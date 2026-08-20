export const manifest = {
  id: 'org.frenchhub.nuvio.bridge',
  version: '0.1.0',
  name: 'Nuvio Stremio Bridge',
  description:
    'Bridge local pour adaptateurs révisés de sources publiques compatibles.',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: [],
  behaviorHints: {
    configurable: false,
    configurationRequired: false,
  },
};
