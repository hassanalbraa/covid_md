import axios from "axios"

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `الاستخدام: ${usedPrefix + command} <رابط>`;
    m.reply(wait);

    try {
        let response = await axios.get(`${APIs.ryzumi}/api/downloader/aiodown?url=${encodeURIComponent(args[0])}`);
        let data = response.data;

        if (!data.status || !data.result || data.result.length === 0) throw '❌ لا توجد وسائط متاحة للتحميل';

        m.reply(`╭━━〔 ⬇️ *جارٍ التحميل* 〕━━╮\n┃ 📎 *الرابط:* ${args[0]}\n╰━━━━━━━━━━━━━━╯`);

        for (const item of data.result) {
            try {
                if (item.type === 'video') {
                    await conn.sendMessage(m.chat, { video: { url: item.url }, caption: `🎬 ${item.quality || ''}` }, { quoted: m });
                } else if (item.type === 'audio') {
                    await conn.sendMessage(m.chat, { audio: { url: item.url }, mimetype: 'audio/mpeg', fileName: 'audio.mp3' }, { quoted: m });
                } else if (item.type === 'image') {
                    await conn.sendMessage(m.chat, { image: { url: item.url }, caption: `🖼️` }, { quoted: m });
                }
            } catch (e) { console.log('خطأ في إرسال عنصر:', e) }
        }
    } catch (e) {
        console.log(e);
        throw `❌ خطأ: ${e?.message || e}`;
    }
};

handler.help = ['dl <رابط>']
handler.tags = ['downloader']
handler.command = /^(dl|aio|تحميل)$/i
handler.limit = true
handler.register = true

export default handler
