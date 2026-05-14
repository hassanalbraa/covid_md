import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `الاستخدام: ${usedPrefix + command} <رابط>`
    m.reply(wait)

    try {
        let response = await axios.get(`${APIs.ryzumi}/api/downloader/spotify?url=${encodeURIComponent(args[0])}`)
        let data = response.data

        if (data.success) {
            if (data.metadata.playlistName) {
                let playlistName = data.metadata.playlistName
                let cover = data.metadata.cover
                let tracks = data.tracks

                m.reply(`🎵 *القائمة:* ${playlistName}\n🖼️ *الغلاف:* ${cover}\n🎶 *عدد المقاطع:* ${tracks.length}`)

                for (let i = 0; i < tracks.length; i++) {
                    let track = tracks[i]
                    if (track.success) {
                        let { title, artists, album, cover, releaseDate } = track.metadata
                        conn.sendMessage(m.chat, {
                            document: { url: track.link },
                            mimetype: 'audio/mpeg',
                            fileName: `${title}.mp3`,
                            caption: `
╭━━〔 🎵 *Spotify* 〕━━╮
┃ 🎵 *العنوان:* ${title}
┃ 🎤 *الفنان:* ${artists}
┃ 💿 *الألبوم:* ${album}
┃ 📅 *تاريخ الإصدار:* ${releaseDate}
╰━━━━━━━━━━━━━━╯`,
                        }, { quoted: m })
                        await conn.delay(1500)
                    } else {
                        m.reply(`❌ فشل تحميل المقطع ${i + 1}`)
                    }
                }
            } else {
                let { title, artists, album, cover, releaseDate } = data.metadata
                conn.sendMessage(m.chat, {
                    document: { url: data.link },
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`,
                    caption: `
╭━━〔 🎵 *Spotify* 〕━━╮
┃ 🎵 *العنوان:* ${title}
┃ 🎤 *الفنان:* ${artists}
┃ 💿 *الألبوم:* ${album}
┃ 📅 *تاريخ الإصدار:* ${releaseDate}
╰━━━━━━━━━━━━━━╯`,
                }, { quoted: m })
            }
        } else {
            throw '❌ فشل التحميل من Spotify'
        }
    } catch (e) {
        console.log(e)
        throw `❌ خطأ: ${e?.message || e}`
    }
}

handler.help = ['spotify <رابط>']
handler.tags = ['downloader']
handler.command = /^(spotify|سبوتيفاي)$/i
handler.limit = 2
handler.register = true

export default handler
