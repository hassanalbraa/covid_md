import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `هذا الأمر يُنشئ صوراً أنيمي من النصوص.\n\nمثال:\n${usedPrefix + command} anime girl with glasses, pink short hair, bokeh`;
    await m.reply(wait);
    const apiUrl = `${APIs.ryzumi}/api/ai/text2img?prompt=${encodeURIComponent(text)}`;
    try {
        let response = await fetch(apiUrl);
        let imageBuffer = await response.buffer();
        await conn.sendFile(m.chat, imageBuffer, 'anime.jpg', `🎌 ${text}\n\n${wm}`, m);
    } catch (error) {
        conn.reply(m.chat, `❌ فشل الاتصال بالـ API، حاول مرة أخرى لاحقاً`, m);
    }
}

handler.help = ['txt2img <نص>']
handler.tags = ['ai']
handler.command = /^(text2img|txt2img)$/i
handler.premium = false
handler.limit = 15
handler.register = true

export default handler
