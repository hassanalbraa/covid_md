let handler = async (m, { conn, text, usedPrefix, command }) => {

    let target =
        m.mentionedJid?.[0] ||
        (m.quoted ? m.quoted.sender : null)

    let days

    if (m.isGroup) {
        let args = (text || '').trim().split(/\s+/)
        days = args.pop()
    } else {
        let [num, d] = (text || '').trim().split(/\s+/)
        target = target || (num ? num.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)
        days = d
    }

    if (!target) return m.reply('❌ منشن أو رد على الشخص')
    if (!days || isNaN(days)) return m.reply('❌ اكتب عدد الأيام')

    let jid = conn.decodeJid(target)

    global.db.data.users[jid] = global.db.data.users[jid] || {}

    let user = global.db.data.users[jid]
    let now = Date.now()

    let add = 86400000 * parseInt(days)

    user.role = 'Premium user'
    user.premium = true

    user.premiumTime =
        user.premiumTime && user.premiumTime > now
            ? user.premiumTime + add
            : now + add

    m.reply(`
✔️ تم الترقية بنجاح
👤 المستخدم: ${await conn.getName(jid)}
📅 الأيام: ${days}
⏳ ينتهي في: ${new Date(user.premiumTime).toLocaleString()}
`)
}

handler.help = ['مميز']
handler.tags = ['owner']
handler.command = /^(مميز|رفع_مميز)$/i
handler.rowner = true

export default handler