// Increments the public "cards generated" count by 1 and returns the new total.
// Deployed by Netlify automatically at: /.netlify/functions/increment-card-count
//
// Note: this is a simple read-modify-write, not an atomic increment. Under heavy
// simultaneous traffic two requests could theoretically read the same starting
// value and one increment could be lost. For a "cards generated" counter on a
// tool like this, that's an acceptable tradeoff for the simplicity — if it ever
// needs to be exact under real concurrency, Netlify Blobs' conditional-write
// (matching an ETag) would be the fix.
const { getStore, connectLambda } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    connectLambda(event); // classic exports.handler functions run in "Lambda compatibility mode" —
    // Blobs isn't auto-configured there, this wires it up using the incoming event
    const store = getStore('rystcom-stats');
    const current = parseInt((await store.get('cards-generated', { type: 'text' })) || '0', 10);
    const next = current + 1;
    await store.set('cards-generated', String(next));
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ count: next })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not update count', detail: String(err) })
    };
  }
};
