import fetch from 'node-fetch'
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw `❌ أرسل/رد على صورة مع الأمر ${usedPrefix}دقة`
        m.reply(wait)
        let media = await q.download()
        let url = await uploadPomf(media)

        let response = await fetch(`${APIs.ryzumi}/api/ai/upscaler?url=${url}`)
        if (!response.ok) {
            response = await fetch(`${APIs.ryzumi}/api/ai/waifu2x?url=${url}`)
            if (!response.ok) throw new Error('❌ فشل تحسين الصورة')
        }

        let hasil = Buffer.from(await response.arrayBuffer())
        await conn.sendFile(m.chat, hasil, 'hd.jpg', `✅ تم تحسين الجودة • ${global.wm}`, m)
    } catch (error) {
        console.error(error)
        m.reply(`❌ خطأ داخلي في الخادم: ${error.message}`)
    }
}

handler.help = ['دقة']
handler.tags = ['ai']
handler.command = /^(دقة)$/i
handler.register = true
handler.limit = 15

export default handler
