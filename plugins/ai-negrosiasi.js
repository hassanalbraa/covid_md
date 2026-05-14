import axios from 'axios'
import { ryzenCDN } from '../lib/uploadFile.js'

const validFilters = ["coklat", "hitam", "nerd", "piggy", "carbon", "botak"];
const filterNames = { "coklat": "بني", "hitam": "أسود", "nerd": "ذكي", "piggy": "خنزير", "carbon": "كربون", "botak": "أصلع" };

let handler = async (m, { conn, args }) => {
    m.reply(wait);

    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw '❌ أرسل/رد على صورة مع الأمر';

        let media = await q.download();
        if (!media) throw '❌ فشل تحميل الوسائط';

        let cdnResult = await ryzenCDN(media);
        if (!cdnResult || !cdnResult.url) throw '❌ فشل رفع الصورة';
        let url = cdnResult.url;

        let filter = (args[0] || 'coklat').trim().toLowerCase();
        if (!validFilters.includes(filter)) {
            return m.reply(`❌ الفلاتر المتاحة:\n${validFilters.map(f => `• ${f} (${filterNames[f]})`).join('\n')}`);
        }

        let response = await axios.get(`${APIs.ryzumi}/api/ai/negro`, {
            params: { url, filter },
            responseType: 'arraybuffer'
        });

        await conn.sendFile(m.chat, response.data, 'filter.jpg', `🎨 فلتر ${filterNames[filter]} • ${global.wm}`, m);
    } catch (error) {
        m.reply(`❌ ${error.message || 'خطأ داخلي'}`);
        console.error(error);
    }
};

handler.help = ['hitamkan']
handler.tags = ['ai']
handler.command = /^(hitamkan)$/i
handler.register = true
handler.limit = 2

export default handler
