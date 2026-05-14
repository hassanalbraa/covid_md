import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text?.trim()) throw '❌ أدخل اسم القناة!'
    let username = text.trim()

    m.reply(wait)

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/stalk/youtube?username=${username}`)
        let channel = data.channelMetadata
        let videos = data.videoDataList || []

        let caption = `
╭━━〔 🎬 *YouTube Stalk* 〕━━╮
┃ 📛 *المستخدم:* ${channel.username}
┃ 🔗 *الرابط:* ${channel.channelUrl}
┃ 👥 *المشتركون:* ${channel.subscriberCount ?? 'غير معروف'}
┃ 🎥 *الفيديوهات:* ${channel.videoCount ?? 'غير معروف'}
┃ 👨‍👩‍👧 *مناسب للعائلة:* ${channel.isFamilySafe ? 'نعم ✅' : 'لا ❌'}
┃ 📝 *الوصف:* ${channel.description?.slice(0, 100) || '-'}...
╰━━━━━━━━━━━━━━╯`.trim()

        if (videos.length > 0) {
            caption += '\n\n*🎬 أحدث الفيديوهات:*'
            videos.slice(0, 2).forEach((video, index) => {
                caption += `\n\n*${index + 1}.* ${video.title}\n⏱️ ${video.duration}\n🔗 https://www.youtube.com${video.navigationUrl}`
            })
        }

        await conn.sendMessage(m.chat, { image: { url: channel.avatarUrl }, caption }, { quoted: m })
    } catch (err) {
        m.reply('❌ خطأ: ' + err.message)
    }
}

handler.help = ['ytstalk']
handler.tags = ['stalk']
handler.command = /^(ytstalk|youtubestalk)$/i
handler.register = true
handler.limit = true

export default handler
