import axios from 'axios'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `الاستخدام: ${usedPrefix}${command} <رابط يوتيوب> <الجودة>`

    m.reply(wait)

    const args = text.split(' ')
    const videoUrl = args[0]
    const resolution = args[1] || '480p'

    const apiUrl = `${APIs.ryzumi}/api/downloader/ytmp4?url=${encodeURIComponent(videoUrl)}&quality=${resolution}`

    try {
        const response = await axios.get(apiUrl)
        const data = response.data

        if (!data.url) throw '❌ رابط التحميل غير موجود في الاستجابة'

        const tmpDir = path.join(process.cwd(), 'tmp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

        const safeTitle = data.title.replace(/[\\/:*?"<>|]/g, '').slice(0, 50)
        const filePath = path.join(tmpDir, `${safeTitle}.mp4`)

        const writer = fs.createWriteStream(filePath)
        const downloadResponse = await axios({ url: data.url, method: 'GET', responseType: 'stream' })

        downloadResponse.data.pipe(writer)

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })

        const caption = `
╭━━〔 🎬 *يوتيوب* 〕━━╮
┃ 📹 *العنوان:* ${data.title}
┃ 👤 *القناة:* ${data.author}
┃ ⏱️ *المدة:* ${data.lengthSeconds} ث
┃ 👁️ *المشاهدات:* ${data.views}
┃ 📅 *تاريخ الرفع:* ${data.uploadDate}
╰━━━━━━━━━━━━━━╯`

        await conn.sendMessage(m.chat, {
            video: { url: filePath },
            mimetype: 'video/mp4',
            fileName: `${safeTitle}.mp4`,
            caption,
            mentions: [m.sender],
            contextInfo: {
                externalAdReply: {
                    mediaType: 2,
                    mediaUrl: data.videoUrl,
                    title: data.title,
                    body: '🎬 تحميل يوتيوب',
                    sourceUrl: data.videoUrl,
                    thumbnail: await (await conn.getFile(data.thumbnail)).data,
                },
            },
        }, { quoted: m })

        fs.unlink(filePath, () => {})

    } catch (error) {
        console.error(`خطأ: ${error.message}`)
        throw `❌ فشل التحميل: ${error.message || error}`
    }
}

handler.help = ['يوت']
handler.tags = ['downloader']
handler.command = /^(يوت)$/i
handler.limit = 10
handler.register = true
handler.disable = false

export default handler
