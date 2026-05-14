import axios from 'axios'
import { ryzenCDN } from '../lib/uploadFile.js'

let handler = async (m, { conn }) => {
    m.reply(wait)

    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw '❌ أرسل/رد على صورة بالأمر .lens'

        let media = await q.download()
        if (!media) throw '❌ فشل تحميل الصورة!'

        let cdnResult = await ryzenCDN(media)
        if (!cdnResult?.url) throw '❌ فشل رفع الصورة!'

        let url = cdnResult.url
        let res = await axios.get(`${APIs.ryzumi}/api/search/lens`, { params: { url } })

        if (!res.data?.result?.length) throw '❌ لا توجد نتائج من Google Lens.'

        let teks = `╭━━〔 🔍 *Google Lens* 〕━━╮\n\n`

        for (let r of res.data.result) {
            teks += `📌 *${r.title}*\n`
            teks += `🔗 ${r.link}\n`
            if (r.image?.link) teks += `🖼️ ${r.image.link}\n`
            teks += `📍 *المصدر:* ${r.source}\n\n`
        }

        teks += `╰━━━━━━━━━━━━━━╯`

        await conn.reply(m.chat, teks.trim(), m)

    } catch (err) {
        console.error(err)
        m.reply('❌ ' + (err.message || 'حدث خطأ داخلي'))
    }
}

handler.help = ['lens']
handler.tags = ['internet']
handler.command = /^(googlelens|lens)$/i
handler.register = true
handler.limit = 2

export default handler
