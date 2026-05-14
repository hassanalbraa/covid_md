import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
    const videoPath = path.join(process.cwd(), 'src', 'covid.mp4')
    const audioPath = path.join(process.cwd(), 'src', 'covid.mp3')

    try {
        if (!fs.existsSync(videoPath) || !fs.existsSync(audioPath)) {
            return m.reply(`❌ الملفات ناقصة يا هندسة!\nتأكد من وضع covid.mp4 و covid.mp3 في مجلد src`)
        }

        // إرسال الفيديو دائري
        await conn.sendMessage(
            m.chat,
            {
                video: fs.readFileSync(videoPath),
                mimetype: 'video/mp4',
                ptv: true // 🔥 هذا يخليه دائري
            },
            { quoted: m }
        )

        // إرسال الصوت
        await conn.sendMessage(
            m.chat,
            {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mpeg',
                ptt: false,
                fileName: 'Covid_Audio.mp3'
            },
            { quoted: m }
        )

    } catch (e) {
        console.error(e)
        m.reply('⚠️ حصل خطأ أثناء قراءة الملفات المحلية.')
    }
}

handler.help = ['كوفيد']
handler.tags = ['info']
handler.command = /^(كوفيد|covid)$/i

export default handler