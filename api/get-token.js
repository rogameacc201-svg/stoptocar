// api/get-token.js
export default async function handler(req, res) {
  try {
    const response = await fetch('https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${process.env.TDX_CLIENT_ID}&client_secret=${process.env.TDX_CLIENT_SECRET}&scope=openid`
    });
    
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token' });
  }
}
