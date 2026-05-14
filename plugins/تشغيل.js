let handler = async (m, { conn, args, usedPrefix, command }) => {

    global.db.data.settings = global.db.data.settings || {}
    const settings = global.db.data.settings

    const action = (args[0] || "").toLowerCase()

    // 📌 أوامر التحكم
    if (action === "تشغيل") {
        settings.botOff = false
        return m.reply("✅ تم تشغيل البوت")
    }

    if (action === "ايقاف") {
        settings.botOff = true
        return m.reply("⛔ تم إيقاف البوت")
    }

    return m.reply(`📌 استخدم:
- ${usedPrefix + command} تشغيل
- ${usedPrefix + command} ايقاف`)
}

handler.command = /^(بوت)$/i
handler.owner = true
export default handler