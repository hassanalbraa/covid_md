import fetch from 'node-fetch'
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw `❌ أرسل/رد على صورة بالأمر ${usedPrefix + command}`;

        m.reply(wait);

        let media = await q.download();
        let url = await uploadPomf(media);
        let hasil = await fetch(`https://api.trace.moe/search?cutBorders&url=${encodeURIComponent(url)}`);
        let response = await hasil.json();

        if (response?.result?.length > 0) {
            let firstResult = response.result[0];
            let { filename, episode, similarity, video: videoURL, image: videoIMG } = firstResult;
            let sim = Math.round(similarity * 100);

            let caption = `
╭━━〔 🔍 *نتيجة البحث* 〕━━╮
┃ 📺 *الأنيمي:* ${filename}
┃ 📺 *الحلقة:* ${episode}
┃ 📊 *التطابق:* ${sim}%
╰━━━━━━━━━━━━━━╯`.trim();

            await conn.sendFile(m.chat, videoURL, filename, caption, m);
            await conn.sendFile(m.chat, videoIMG, filename, caption, m);
        } else {
            m.reply('❌ لا توجد نتائج');
        }
    } catch (error) {
        console.error(error);
        m.reply(`❌ ${error?.message || 'حدث خطأ داخلي'}`);
    }
};

handler.help = ['animesearch']
handler.tags = ['anime']
handler.command = /^(animesearch)$/i
handler.register = true
handler.limit = false

export default handler
