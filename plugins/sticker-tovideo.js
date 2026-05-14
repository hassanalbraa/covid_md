import { webp2mp4 } from '../lib/webp2mp4.js'
import { ffmpeg } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) throw `❌ رد على ملصق أو صوت تريد تحويله لفيديو بالأمر ${usedPrefix + command}`
    let mime = m.quoted.mimetype || ''
    if (!/webp|audio/.test(mime)) throw `❌ رد على ملصق أو صوت بالأمر ${usedPrefix + command}`
    
    m.reply(wait)
    let media = await m.quoted.download()
    let out = Buffer.alloc(0)
    
    if (/webp/.test(mime)) {
        out = await webp2mp4(media)
    } else if (/audio/.test(mime)) {
        out = await ffmpeg(media, [
            '-filter_complex', 'color',
            '-pix_fmt', 'yuv420p',
            '-crf', '51',
            '-c:a', 'copy',
            '-shortest'
        ], 'mp3', 'mp4')
    }
    
    await conn.sendFile(m.chat, out, 'video.mp4', '✅ تم التحويل', m, 0, { thumbnail: out })
}

handler.help = ['tovideo']
handler.tags = ['maker']
handler.command = ['tovideo', 'tomp4']
handler.register = true
handler.limit = 2

export default handler
