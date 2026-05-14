let handler = async (m) => {
    let numberowner = global.nomorown
    let anu = `
╭━━〔 💎 *الباقات المميزة* 〕━━╮
┃ 🔗 *تيليغرام:* https://t.me/JJZZ7
┃ ━━━━━━━━━━━━━━
┃ 💰 *الأسعار:*
┃ • 10 آلاف = 15 يوماً مميزاً
┃ • 15 ألف = 30 يوماً مميزاً
┃ • 25 ألف = 60 يوماً مميزاً
┃ • 50 ألف = 180 يوماً مميزاً
┃ ━━━━━━━━━━━━━━
┃ 📞 *للتواصل:* wa.me/${numberowner}
╰━━━━━━━━━━━━━━╯`.trim()

    await conn.sendMessage(m.chat, { text: anu }, { quoted: m })
}

handler.help = ['مميز']
handler.tags = ['main']
handler.command = /^(مميز|premium)$/i

export default handler
