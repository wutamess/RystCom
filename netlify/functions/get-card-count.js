// Reads the current public "cards generated" count.
// Deployed by Netlify automatically at: /.netlify/functions/get-card-count
const { getStore, connectLambda } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    connectLambda(event); // classic exports.handler functions run in "Lambda compatibility mode" —
    // Blobs isn't auto-configured there, this wires it up using the incoming event
    const store = getStore('rystcom-stats');
    const current = await store.get('cards-generated', { type: 'text' });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ count: parseInt(current || '0', 10) })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not read count', detail: String(err) })
    };
  }
};

