import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/video/.test(mime)) throw `*📌 رد على الفيديو اللي عايز تحوله لأغنية بـ ${usedPrefix + command}*`

    try {
        await m.reply('⏳ *جاري التحويل لأغنية...*')

        let media = await q.download()
        let videoPath = join(process.cwd(), 'tmp', `${Date.now()}.mp4`)
        let audioPath = join(process.cwd(), 'tmp', `${Date.now()}.mp3`)

        if (!fs.existsSync(join(process.cwd(), 'tmp'))) fs.mkdirSync(join(process.cwd(), 'tmp'))
        fs.writeFileSync(videoPath, media)

        // التحويل باستخدام ffmpeg
        exec(`ffmpeg -i ${videoPath} -vn -ar 44100 -ac 2 -b:a 192k ${audioPath}`, async (err) => {
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath)

            if (err) {
                console.error(err)
                return m.reply('❌ فشل تحويل الفيديو لصوت. تأكد من تثبيت ffmpeg في تيرمكس.')
            }

            await conn.sendMessage(m.chat, { 
                audio: fs.readFileSync(audioPath), 
                mimetype: 'audio/mpeg', 
                ptt: false,
                fileName: `Zeno_Music_${Date.now()}.mp3`
            }, { quoted: m })

            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)
        })

    } catch (e) {
        console.error(e)
        m.reply('⚠️ حدث خطأ غير متوقع.')
    }
}

handler.help = ['لاغنية']
handler.tags = ['tools']
handler.command = /^(لاغنية|لصوت|تحويل)$/i 

export default handler
