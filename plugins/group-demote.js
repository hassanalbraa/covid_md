import { areJidsSameUser } from '@whiskeysockets/baileys'
let handler = async (m, { conn, participants }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? (text.replace(/\D/g, '') + '@s.whatsapp.net') : ''
    if (!who || who == m.sender) throw 'رد او منشن العايز تنزلو'
    conn.groupParticipantsUpdate(m.chat, [who], 'demote')
    .then(_ => m.reply('تم الانزال'))

}
handler.help = ['نزل']
handler.tags = ['group']
handler.command = /^(نزل)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler