/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ حظر المستخدم ]
🏷 النوع: Plugin ESM
♲ الوظيفة: حظر المستخدمين من استخدام البوت ومنعهم من الوصول للميزات
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

let handler = async (m, { conn, text }) => {
    if (!text) throw 'من تريد منعه؟ ☻';
    let who
    if (m.isGroup) {
        if (m.mentionedJid.length > 0) {
            who = m.mentionedJid
        } else {
            let cleanedNumber = text.replace(/\D/g, '')
            who = `${cleanedNumber}@s.whatsapp.net`
        }
    } else {
        let cleanedNumber = text.replace(/\D/g, '')
        who = `${cleanedNumber}@s.whatsapp.net`
    }

    let users = global.db.data.users
    if (!users[who]) throw 'المستخدم غير موجود'

    users[who].banned = true
    conn.reply(m.chat, `تم حظر المستخدم ${who} من البوت بنجاح! 🚫`, m)
}

handler.help = ['منع <رقم>']
handler.tags = ['owner']
handler.command = /^منع|تقييد|ban(حظر)?$/i
handler.rowner = true

export default handler
