let handler = async (m, { conn }) => {

    global.db.data.settings = global.db.data.settings || {}
    const settings = global.db.data.settings

    if (!settings.antiBadwords) return

    let text = (m.text || "").toLowerCase()
    if (!text) return

    let badwords = settings.badwords || []

    let found = badwords.find(word => text.includes(word))

    if (!found) return

    try {
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant || m.sender
            }
        })

    } catch (e) {
        console.log("delete error:", e)
    }

    return true
}

handler.before = true
export default handler