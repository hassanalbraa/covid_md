import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text?.trim()) throw '❌ أدخل اسم مستخدم صحيح!'
    let username = text.trim()

    m.reply(wait)

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/stalk/tiktok?username=${username}`)
        const user = data.userInfo

        let caption = `
╭━━〔 🎵 *TikTok Stalk* 〕━━╮
┃ 🆔 *الرقم:* ${user.id}
┃ 🐦 *المعرف:* @${user.username}
┃ 📛 *الاسم:* ${user.name}
┃ 💬 *البايو:* ${user.bio || '-'}
┃ ✅ *موثق:* ${user.verified ? 'نعم' : 'لا'}
┃ 👥 *المتابعون:* ${user.totalFollowers}
┃ 👁️ *يتابع:* ${user.totalFollowing}
┃ ❤️ *الإعجابات:* ${user.totalLikes}
┃ 🎥 *الفيديوهات:* ${user.totalVideos}
┃ 👫 *الأصدقاء:* ${user.totalFriends}
╰━━━━━━━━━━━━━━╯`.trim()

        await conn.sendMessage(m.chat, { image: { url: user.avatar }, caption }, { quoted: m })
    } catch (err) {
        m.reply('❌ خطأ: ' + err.message)
    }
}

handler.help = ['ttstalk']
handler.tags = ['stalk']
handler.command = /^(ttstalk|tiktokstalk)$/i
handler.register = true
handler.limit = true

export default handler
