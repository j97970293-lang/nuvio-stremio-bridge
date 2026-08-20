import { providers } from './providers/index.mjs';

const mediaExtensions = /\.(?:m3u8|mp4|m4v|mkv|webm|mov|avi)(?:$|[?#])/i;
const forbiddenHeaders = new Set(['cookie', 'authorization', 'proxy-authorization']);

export function parseStremioId(id) {
  const [imdbId, season, episode] = String(id).split(':');
  if (!/^tt\d+$/.test(imdbId)) return null;
  return {
    imdbId,
    season: Number.isSafeInteger(Number(season)) ? Number(season) : undefined,
    episode: Number.isSafeInteger(Number(episode)) ? Number(episode) : undefined,
  };
}

export function isAllowedCandidate(candidate) {
  try {
    const url = new URL(candidate?.url);
    if (url.protocol !== 'https:' || !mediaExtensions.test(url.pathname)) return false;
    const headers = candidate.headers ?? {};
    return Object.keys(headers).every(
      key => !forbiddenHeaders.has(key.toLowerCase()),
    );
  } catch {
    return false;
  }
}

function streamFromCandidate(provider, candidate) {
  const language = candidate.language ? ` • ${candidate.language}` : '';
  const quality = candidate.quality ? ` • ${candidate.quality}` : '';
  return {
    name: `Nuvio Bridge / ${provider.id}`,
    title: `${candidate.title ?? 'Flux autorisé'}${quality}${language}`,
    url: candidate.url,
    behaviorHints: {
      notWebReady: false,
    },
  };
}

export async function resolveStreams({ type, id }) {
  if (!['movie', 'series'].includes(type)) return [];
  const parsed = parseStremioId(id);
  if (!parsed) return [];

  const context = { type, ...parsed };
  const collected = [];
  for (const provider of providers) {
    if (!provider.supports?.(context)) continue;
    try {
      const candidates = await provider.resolve(context);
      for (const candidate of candidates ?? []) {
        if (isAllowedCandidate(candidate)) {
          collected.push(streamFromCandidate(provider, candidate));
        }
      }
    } catch (error) {
      // Un provider isolé ne doit jamais empêcher les autres providers.
      console.warn(`[provider:${provider.id}] ${error.message}`);
    }
  }
  return collected;
}
