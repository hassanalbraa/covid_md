import { areJidsSameUser } from '@whiskeysockets/baileys'
let handler = async (m, { conn, participants }) => {
    let who = m.sender

    
    conn.groupParticipantsUpdate(m.chat, [who], 'demote')
    .then(_ => m.reply('تم انزالك ✅'))

}
handler.help = ['نزلني']
handler.tags = ['group']
handler.command = /^(نزلني)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler