import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  const session = await kv.get(`google_session:${token}`);
  if (!session) return res.status(401).json({ error: 'Invalid or expired session' });

  return res.status(200).json({ email: session.email, name: session.name, picture: session.picture });
}