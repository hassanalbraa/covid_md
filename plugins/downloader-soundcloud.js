import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `الاستخدام: ${usedPrefix + command} <رابط>`
    m.reply(wait)

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/downloader/soundcloud?url=${encodeURIComponent(args[0])}`)
        const { title, thumbnail, filesize, download_url } = data || {}

        if (!download_url || !title) throw '❌ فشل جلب بيانات SoundCloud. تأكد من الرابط.'

        conn.sendMessage(m.chat, {
            document: { url: download_url },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `
╭━━〔 🎵 *SoundCloud* 〕━━╮
┃ 🎵 *العنوان:* ${title}
┃ 📦 *الحجم:* ${filesize || '-'} bytes
┃ 🖼️ *الصورة:* ${thumbnail || '-'}
╰━━━━━━━━━━━━━━╯`.trim(),
        }, { quoted: m })
    } catch (err) {
        console.error(err)
        throw `❌ خطأ: ${err?.message || err}`
    }
}

handler.help = ['soundcloud <رابط>']
handler.tags = ['downloader']
handler.command = /^(soundcloud(dl)?|sc(dl)?)$/i
handler.limit = 2
handler.register = true

export default handler
