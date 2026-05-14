const fetch = globalThis.fetch ?? (await import('node-fetch')).default;

var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `❌ مثال: ${usedPrefix}${command} طبيعة`;

    try {
        const url = `${APIs.ryzumi}/api/search/gimage?query=${encodeURIComponent(text)}`;
        const res = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
            return conn.reply(m.chat, '❌ لا توجد نتائج لهذا البحث.', m);
        }

        const pick = data[Math.floor(Math.random() * data.length)];
        const link = pick.image || pick.url;

        await conn.sendFile(m.chat, link, 'google.jpg', `🔎 *نتيجة:* ${text}`, m);
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '❌ حدث خطأ أثناء جلب الصورة.', m);
    }
};

handler.help = ['gimage <بحث>', 'image <بحث>'];
handler.tags = ['internet'];
handler.command = /^(gimage|image)$/i;
handler.register = true
handler.limit = true

export default handler
