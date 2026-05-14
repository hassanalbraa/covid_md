import fetch from 'node-fetch'
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        let args = text.trim().split(/\s+/);
        let style = args[1] || "anime";

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw `❌ أرسل/رد على صورة مع الأمر ${usedPrefix}انمي`;
        m.reply(wait);

        let media = await q.download();
        let url = await uploadPomf(media);

        let response = await fetch(`${APIs.ryzumi}/api/ai/toanime?url=${url}&style=${style}`);
        if (!response.ok) throw new Error('❌ فشل جلب الصورة من الـ API');
        let hasil = Buffer.from(await response.arrayBuffer());

        await conn.sendFile(m.chat, hasil, 'anime.jpg', `🎌 تحويل أنيمي • ${global.wm}`, m);
    } catch (error) {
        m.reply(`❌ خطأ: ${error}`);
    }
};

handler.help = ['انمي'];
handler.tags = ['ai'];
handler.command = /^(toanime|انمي)$/i;
handler.register = true
handler.limit = 8

export default handler
