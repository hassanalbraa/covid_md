/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ تنزيل مميز ]
🏷 النوع: Plugin ESM
♲ الوظيفة: ازالة المستخدم من قائمة الاعضاء المميزين
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/
let handler = async (m, { conn, text }) => {
    if (!text && !m.mentionedJid?.length && !m.quoted) throw 'أدخل المستخدم المستهدف. مثال: .تنزيل‌مميز @المنشن أو .تنزيل‌مميز 967781994494'
    let rawTarget
    if (m.isGroup) {
        rawTarget = m.mentionedJid?.[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
    } else if (text) {
        const num = text.replace(/[^0-9]/g, '')
        if (!num) throw 'رقم خاطئ.'
        rawTarget = num + '@s.whatsapp.net'
    }

    // Normalize to phone-based JID (avoid LID)
    const decoded = typeof conn.decodeJid === 'function' ? conn.decodeJid(rawTarget) : rawTarget
    const jid = typeof conn.getJid === 'function' ? conn.getJid(decoded) : decoded

    let users = global.db.data.users
    // migrate data from rawTarget if needed
    if (!users[jid] && users[rawTarget]) users[jid] = users[rawTarget]
    if (users[jid]) {
        users[jid].premium = false
        users[jid].premiumTime = 0
        conn.reply(m.chat, 'تــم!', m)
    } else {
        throw 'المستخدم مش موجود.'
    }
}

handler.help = ['تنزيل مميز']
handler.tags = ['owner']
handler.command = /^عادي|تنزيل_مميز|تنزيل‌مميز|delprem(user)?$/i
handler.rowner = true

export default handler