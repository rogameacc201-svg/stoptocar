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
        // 改用 GET 方式帶入 data 參數，避免 POST 在 Serverless 上的解析問題
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Overpass API responded with status ${response.status}`);
        }

        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(data);
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message });
    }
}
