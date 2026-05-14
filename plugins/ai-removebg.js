import fetch from 'node-fetch'
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, text }) => {
    try {
        let args = text.trim().split(/\s+/);
        let upscale = (args[1] && args[1].toLowerCase() === 'hd') ? "true" : "false";

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !mime.startsWith('image/')) throw `❌ أرسل/رد على صورة مع الأمر ${usedPrefix}خلفية`;

        m.reply(wait);

        let media = await q.download();
        let url = await uploadPomf(media);

        let apiUrl = `${APIs.ryzumi}/api/ai/v2/removebg?url=${url}&upscale=${upscale}`;
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error('❌ فشل جلب الصورة من الـ API');

        let hasil = Buffer.from(await response.arrayBuffer());

        await conn.sendFile(m.chat, hasil, 'nobg.jpg', `✅ تم إزالة الخلفية • ${global.wm}`, m);

        let epoch = Date.now();
        let random = Math.floor(Math.random() * 99999);
        let filename = `nobg_${random}_${epoch}.png`;

        await conn.sendFile(m.chat, hasil, filename, '', m, null, { mimetype: 'image/png', asDocument: true });
    } catch (error) {
        m.reply(`❌ خطأ: ${error.message}`);
    }
};

handler.help = ['خلفية'];
handler.tags = ['ai'];
handler.command = /^(خلفية)$/i;
handler.register = true
handler.limit = 3

export default handler
