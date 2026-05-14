import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text?.trim()) throw '❌ أدخل اسم مستخدم صحيح!'
    let username = text.trim()

    m.reply(wait)

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/stalk/instagram?username=${username}`)

        let caption = `
╭━━〔 📸 *Instagram Stalk* 〕━━╮
┃ 👤 *الاسم:* ${data.name}
┃ 🆔 *المعرف:* ${data.username}
┃ 💬 *البايو:* ${data.bio}
┃ 👥 *المتابعون:* ${data.followers}
┃ 👁️ *يتابع:* ${data.following}
┃ 📷 *المنشورات:* ${data.posts}
╰━━━━━━━━━━━━━━╯`.trim()

        await conn.sendMessage(m.chat, { image: { url: data.avatar }, caption }, { quoted: m })
    } catch (err) {
        m.reply('❌ خطأ: ' + err.message)
    }
}

handler.help = ['igstalk']
handler.tags = ['stalk']
handler.command = /^(igstalk|instagramstalk)$/i
handler.register = true
handler.limit = true

export default handler
