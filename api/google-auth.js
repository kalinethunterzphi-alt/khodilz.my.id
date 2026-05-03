import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing authorization code' });

  // Tukar code dengan access token
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const data = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  };

  let tokenResponse;
  try {
    tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data),
    });
  } catch (err) {
    console.error('Token exchange error:', err);
    return res.status(500).json({ error: 'Network error' });
  }

  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    console.error('Token error:', errText);
    return res.status(500).json({ error: 'Token exchange failed' });
  }

  const tokenData = await tokenResponse.json();
  const { access_token } = tokenData;

  // Ambil data user dari Google
  let userInfoRes;
  try {
    userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  } catch (err) {
    console.error('User info error:', err);
    return res.status(500).json({ error: 'Failed to fetch user info' });
  }

  if (!userInfoRes.ok) {
    const errText = await userInfoRes.text();
    console.error('User info error:', errText);
    return res.status(500).json({ error: 'Failed to fetch user info' });
  }

  const userData = await userInfoRes.json();
  const { id: google_id, email, name, picture } = userData;

  // Buat token sesi (expire 5 menit)
  const sessionToken = crypto.randomUUID();
  await kv.setex(`google_session:${sessionToken}`, 300, {
    email,
    name: name || '',
    picture: picture || '',
    google_id,
  });

  // Redirect ke halaman login dengan token
  const redirectUrl = `/pages/login.html?token=${sessionToken}`;
  return res.redirect(redirectUrl);
}