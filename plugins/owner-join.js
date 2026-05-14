/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ الانضمام للمجموعة ]
🏷 النوع: Plugin ESM
♲ الوظيفة: الانضمام لبوت إلى مجموعة واتساب من خلال رابط الدعوة مع تحديد مدة البقاء
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, { conn, text, isOwner }) => {
    let [_, code, expired] = text.match(linkRegex) || []
    if (!code) throw 'رابط غير صحيح'
    let res
    try {
        res = await conn.groupAcceptInvite(code)
    } catch (error) {
        if (error && error.message) {
            if (error.message.includes('not-authorized')) {
                return m.reply(
`لا يمكن الانضمام لأن البوت تم طرده من قبل
يرجى الانتظار لمدة 7 أيام كحد أقصى`
                )
            } else if (error.message.includes('gone')) {
                return m.reply('الرابط غير صحيح/تم إعادة تعيينه من قبل الإدارة')
            }
        }
        throw error
    }
    expired = Math.floor(Math.min(999, Math.max(1, isOwner? (isNumber(expired)? parseInt(expired): 0): 3)))
    m.reply(`✅ تم الانضمام للمجموعة ${res}${expired? `\n⏰ لمدة ${expired} يوم`: ''}

إذا كانت المجموعة تستخدم موافقة الإدارة، يرجى الموافقة على هذا الرقم: ${conn.user.jid.split('@')}`)
    let chats = global.db.data.chats[res]
    if (!chats) chats = global.db.data.chats[res] = {}
    if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
}

handler.help = ['انضم']
handler.tags = ['owner']
handler.command = /^join|خش|انضمام|انضم$/i
handler.rowner = true

export default handler

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' &&!isNaN(x))
