const COUNT_KEY = 'cards-generated';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/get-card-count' && request.method === 'GET') {
      const raw = await env.COUNTER.get(COUNT_KEY);
      const count = raw ? parseInt(raw, 10) : 0;
      return json({ count });
    }

    if (url.pathname === '/increment-card-count' && request.method === 'POST') {
      const raw = await env.COUNTER.get(COUNT_KEY);
      const count = (raw ? parseInt(raw, 10) : 0) + 1;
      await env.COUNTER.put(COUNT_KEY, String(count));
      return json({ count });
    }

    // everything else — serve the static site (index.html, etc.)
    return env.ASSETS.fetch(request);
  }
};

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
