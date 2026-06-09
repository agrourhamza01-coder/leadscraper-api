export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { query, key } = req.query;
  if (!query || !key) return res.status(400).json({ error: 'Paramètres manquants' });

  try {
    // --- ÉTAPE 1 : Text Search pour récupérer les place_id ---
    let allResults = [];
    let nextPageToken = null;

    do {
      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=fr&key=${key}`;
      if (nextPageToken) {
        url += `&pagetoken=${nextPageToken}`;
        await new Promise(r => setTimeout(r, 2000));
      }
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        return res.status(200).json({ error: data.status, results: allResults });
      }

      allResults = [..
