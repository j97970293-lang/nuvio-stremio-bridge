import http from 'node:http';
import { manifest } from './manifest.mjs';
import { resolveStreams } from './streams.mjs';

const port = Number(process.env.PORT ?? 7000);

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body));
}

export function createServer() {
  return http.createServer(async (request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    if (request.method !== 'GET') return sendJson(response, 405, { error: 'GET only' });
    if (pathname === '/manifest.json') return sendJson(response, 200, manifest);

    const streamMatch = pathname.match(/^\/stream\/(movie|series)\/([^/]+)\.json$/);
    if (streamMatch) {
      const [, type, id] = streamMatch;
      const streams = await resolveStreams({ type, id: decodeURIComponent(id) });
      return sendJson(response, 200, { streams });
    }
    return sendJson(response, 404, { error: 'Not found' });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createServer().listen(port, () => {
    console.log(`Nuvio Stremio Bridge listening on http://localhost:${port}`);
  });
}
