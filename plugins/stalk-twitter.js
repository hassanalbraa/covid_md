import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text?.trim()) throw '❌ أدخل اسم مستخدم صحيح!'
    let username = text.trim()

    m.reply(wait)

    try {
        let { data } = await axios.get(`${APIs.ryzumi}/api/stalk/twitter?username=${username}`)
        if (data.message !== 'OK') throw data.message || '❌ حدث خطأ أثناء جلب البيانات!'

        let user = data.user
        let caption = `
╭━━〔 🐦 *Twitter/X Stalk* 〕━━╮
┃ 🆔 *المعرف:* ${user.id}
┃ 📛 *الاسم:* ${user.name}
┃ 🐦 *المستخدم:* @${user.screen_name}
┃ 📍 *الموقع:* ${user.location || '-'}
┃ 💬 *البايو:* ${user.description || '-'}
┃ 👥 *المتابعون:* ${user.followers}
┃ 👁️ *يتابع:* ${user.following}
┃ ❤️ *الإعجابات:* ${user.likes}
┃ 🔗 *الرابط:* ${user.url || '-'}
┃ 📅 *انضم:* ${user.joined_at}
╰━━━━━━━━━━━━━━╯`.trim()

        await conn.sendMessage(m.chat, { image: { url: user.avatar_url }, caption }, { quoted: m })
    } catch (err) {
        m.reply('❌ خطأ: ' + err.message)
    }
}

handler.help = ['twitterstalk']
handler.tags = ['stalk']
handler.command = /^(twitterstalk|xstalk)$/i
handler.register = true
handler.limit = true

export default handler
