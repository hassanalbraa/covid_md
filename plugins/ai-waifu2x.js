import fetch from 'node-fetch'
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw `❌ أرسل/رد على صورة مع الأمر ${usedPrefix}waifu2x`
        m.reply(wait)
        let media = await q.download()
        let url = await uploadPomf(media)

        let response = await fetch(`${APIs.ryzumi}/api/ai/waifu2x?url=${url}`)
        if (!response.ok) throw new Error('❌ فشل الاتصال بـ API waifu2x')

        let hasil = Buffer.from(await response.arrayBuffer())
        await conn.sendFile(m.chat, hasil, 'waifu2x.jpg', `✨ تحسين Waifu2x • ${global.wm}`, m)
    } catch (error) {
        console.error(error)
        m.reply(`❌ خطأ داخلي: ${error.message}`)
    }
}

handler.help = ['waifu2x']
handler.tags = ['anime', 'ai']
handler.command = /^(waifu2x)$/i
handler.register = true
handler.limit = 15

export default handler
