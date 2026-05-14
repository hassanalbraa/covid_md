import { areJidsSameUser } from '@whiskeysockets/baileys'

let handler = async (m, { conn, participants, text }) => {
    // التعديل هنا: أضفنا كلمة text داخل الأقواس بالأعلى ليعرف البot ما هو النص
    
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? (text.replace(/\D/g, '') + '@s.whatsapp.net') : ''
    
    if (!who || who == m.sender) throw 'منشن او رد على العايز ترفعه ❌'
    
    await conn.groupParticipantsUpdate(m.chat, [who], 'promote')
    .then(_ => m.reply('✅ تم الرفع لمشرف (Admin)'))
    .catch(e => m.reply('❌ فشل الرفع، قد لا يكون العضو موجوداً.'))
}

handler.help = ['ارفع']
handler.tags = ['group']
handler.command = /^(ارفع)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
