import assert from 'node:assert/strict';
import test from 'node:test';
import { manifest } from '../src/manifest.mjs';
import { isAllowedCandidate, parseStremioId, resolveStreams } from '../src/streams.mjs';

test('le manifeste expose uniquement les ressources et identifiants prévus', () => {
  assert.deepEqual(manifest.resources, ['stream']);
  assert.deepEqual(manifest.types, ['movie', 'series']);
  assert.deepEqual(manifest.idPrefixes, ['tt']);
});

test('les identifiants Stremio IMDb sont interprétés sans inventer de saison', () => {
  assert.deepEqual(parseStremioId('tt0944947:1:2'), {
    imdbId: 'tt0944947',
    season: 1,
    episode: 2,
  });
  assert.equal(parseStremioId('tmdb:123'), null);
});

test('le filtre refuse les liens web, HTTP et en-têtes privés', () => {
  assert.equal(isAllowedCandidate({ url: 'https://cdn.example.test/movie.m3u8' }), true);
  assert.equal(isAllowedCandidate({ url: 'https://example.test/watch/1' }), false);
  assert.equal(isAllowedCandidate({ url: 'http://cdn.example.test/movie.mp4' }), false);
  assert.equal(
    isAllowedCandidate({
      url: 'https://cdn.example.test/movie.mp4',
      headers: { Cookie: 'session=private' },
    }),
    false,
  );
});

test('un registre vide retourne une réponse Stremio valide sans erreur', async () => {
  assert.deepEqual(await resolveStreams({ type: 'movie', id: 'tt0120737' }), []);
});
