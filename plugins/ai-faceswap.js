import axios from 'axios'
import { ryzenCDN } from '../lib/uploadFile.js'

let handler = async (m, { conn, args }) => {
    try {
        if (!args[0]) throw '❌ أدخل رابط الصورة الأصلية'
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw '❌ أرسل/رد على صورة مع الأمر'
        let media = await q.download()
        if (!media) throw '❌ فشل تحميل الوسائط'
        let cdnResult = await ryzenCDN(media)
        let url = cdnResult.url || cdnResult
        if (!url) throw '❌ فشل رفع الصورة'
        m.reply(wait)

        let response = await axios.get(`${APIs.ryzumi}/api/ai/faceswap`, {
            params: { original: args[0], face: url },
            responseType: 'arraybuffer'
        })

        await conn.sendFile(m.chat, response.data, 'faceswap.jpg', `🎭 تبديل الوجه • ${global.wm}`, m)
    } catch (error) {
        m.reply(`❌ ${error.message || 'خطأ داخلي'}`)
        console.error(error)
    }
}

handler.help = ['faceswap']
handler.tags = ['ai']
handler.command = /^(faceswap)$/i
handler.register = true
handler.limit = 5

export default handler
