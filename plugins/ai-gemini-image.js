import axios from 'axios'
import { ryzenCDN } from '../lib/uploadFile.js'

let handler = async (m, { conn, text }) => {
    m.reply(wait)

    try {
        if (!text) throw '❌ أدخل وصفاً نصياً'

        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw '❌ أرسل/رد على صورة مع الأمر'

        let media = await q.download()
        if (!media) throw '❌ فشل تحميل الوسائط'

        let cdnResult = await ryzenCDN(media)
        if (!cdnResult || !cdnResult.url) throw '❌ فشل رفع الصورة'
        let url = cdnResult.url

        let response = await axios.get(`${APIs.ryzumi}/api/ai/image/gemini`, {
            params: { text, url },
            responseType: 'arraybuffer'
        })

        await conn.sendFile(m.chat, response.data, 'gemini-edit.jpg', `🎨 تعديل بـ Gemini • ${global.wm}`, m)

    } catch (error) {
        m.reply(`❌ ${error.message || 'خطأ داخلي'}`)
        console.error(error)
    }
}

handler.help = ['geminiedit']
handler.tags = ['ai']
handler.command = /^(geminiedit)$/i
handler.register = true
handler.limit = 2

export default handler
