import fetch from 'node-fetch'
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw `❌ أرسل/رد على صورة مع الأمر ${usedPrefix}تلوين`;
        m.reply(wait);

        let media = await q.download();
        let url = await uploadPomf(media);

        let response = await fetch(`${APIs.ryzumi}/api/ai/colorize?url=${url}`);
        if (!response.ok) throw new Error('❌ فشل جلب الصورة من الـ API');
        let hasil = Buffer.from(await response.arrayBuffer());

        await conn.sendFile(m.chat, hasil, 'colored.jpg', `🎨 تم التلوين • ${global.wm}`, m);
    } catch (error) {
        m.reply(`❌ خطأ: ${error}`);
    }
};

handler.help = ['تلوين'];
handler.tags = ['ai'];
handler.command = /^(colorize|تلوين)$/i;
handler.register = true
handler.limit = 3

export default handler
