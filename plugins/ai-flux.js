import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `هذا الأمر يُنشئ صوراً من النصوص.\n\nمثال:\n${usedPrefix + command} فتاة أنيمي بنظارات وشعر وردي قصير`;
    await m.reply(wait);
    const apiUrl = `${APIs.ryzumi}/api/ai/v2/text2img?prompt=${encodeURIComponent(text)}`;
    try {
        let response = await fetch(apiUrl, { headers: { accept: 'image/png' } });
        let imageBuffer = Buffer.from(await response.arrayBuffer());
        await conn.sendFile(m.chat, imageBuffer, 'image.jpg', `🎨 ${text}\n\n${wm}`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ خطأ: ${error.message}`, m);
    }
}

handler.help = ['flux <نص>']
handler.tags = ['ai']
handler.command = /^(flux|رسم)$/i
handler.premium = false
handler.limit = 15
handler.register = true

export default handler
