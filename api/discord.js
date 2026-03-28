// Vercel serverless funkce pro Discord OAuth2
export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  const client_id = '1487478912719130788';
  const client_secret = 'SnxRVmP5uqhc_iAkCJ1Vi2ESydA7t_qW';
  const redirect_uri = 'https://clown-crewdatabase.vercel.app/';

  // 1. Získání access tokenu
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id,
      client_secret,
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      scope: 'identify'
    })
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return res.status(401).json({ error: 'Token exchange failed', details: tokenData });
  }

  // 2. Získání uživatelských dat
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const user = await userRes.json();

  // 3. Přesměrování zpět na frontend s daty v query stringu (nebo použij cookie/localStorage)
  const params = new URLSearchParams({
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar || '',
    id: user.id
  });
  res.writeHead(302, { Location: `https://clown-crewdatabase.vercel.app/?${params.toString()}` });
  res.end();
}
