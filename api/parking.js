export default async function handler(req, res) {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat or lon' });
    }

    const radius = 3000;
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"="parking"](around:${radius},${lat},${lon});
          way["amenity"="parking"](around:${radius},${lat},${lon});
          relation["amenity"="parking"](around:${radius},${lat},${lon});
        );
        out center;
    `;

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        });
        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
