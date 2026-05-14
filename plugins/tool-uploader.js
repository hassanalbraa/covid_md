import fetch from 'node-fetch'
import { ryzenCDN } from '../lib/uploadFile.js'

let handler = async (m) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw '❌ لا توجد وسائط';

        m.reply(wait);

        let media = await q.download();
        let link = await ryzenCDN(media);
        if (!link) throw '❌ فشل رفع الملف';
        let fileUrl = typeof link === 'object' ? link.url : link;

        let shortLink = await shortUrl(fileUrl);

        let caption = `
╭━━〔 📤 *رابط الملف* 〕━━╮
┃ 🔗 *الرابط:* ${fileUrl}
┃ 📊 *الحجم:* ${media.length} byte
┃ ⏳ *الصلاحية:* 24 ساعة
┃ 🔗 *مختصر:* ${shortLink}
╰━━━━━━━━━━━━━━╯`.trim();

        await conn.reply(m.chat, caption, m);
    } catch (error) {
        console.error('خطأ:', error);
        conn.reply(m.chat, `❌ خطأ: ${error.message || error}`, m);
    }
};

handler.help = ['upload']
handler.tags = ['tools']
handler.command = /^(tourl|upload)$/i
handler.register = true

export default handler

async function shortUrl(url) {
    try {
        let res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('❌ فشل تقصير الرابط');
        return await res.text();
    } catch (error) {
        return url;
    }
}
