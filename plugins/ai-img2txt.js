import fetch from 'node-fetch'
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw `❌ أرسل/رد على صورة مع الأمر ${usedPrefix}صورة_نص`;
        m.reply(wait);

        let media = await q.download();
        let url = await uploadPomf(media);

        let response = await fetch(`${APIs.ryzumi}/api/ai/image2txt?url=${url}`);
        if (!response.ok) throw new Error('❌ فشل جلب البيانات من الـ API');

        let { result: hasil } = await response.json();

        await conn.sendMessage(m.chat, {
            text: `╭━━〔 🔍 *وصف الصورة* 〕━━╮\n\n${hasil}\n\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    } catch (error) {
        m.reply(`❌ خطأ: ${error}`);
    }
};

handler.help = ['صورة_نص'];
handler.tags = ['ai'];
handler.command = /^(toprompt|img2txt|صورة_نص)$/i;
handler.register = true
handler.limit = 5

export default handler
