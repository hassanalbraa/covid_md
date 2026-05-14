var handler = async (m, { conn, participants, botAdmin}) => {
    if (!botAdmin) {
        return m.reply('انا مش ادمن T-T')
    }
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? (text.replace(/\D/g, '') + '@s.whatsapp.net') : ''
		if (!who || who == m.sender) throw 'رد / منشن الي تبيه يطير من قدامك'
		if (participants.filter(v => v.id == who).length == 0) throw `المستخدم ليس في المجموعة !`
		await conn.groupParticipantsUpdate(m.chat, [who], 'remove') 
    m.reply(`تــم`)
}
handler.help = ['انقلع'] // .map(v => 'o' + v + ' @user')
handler.tags = ['owner']
handler.command = /^(okick|o-|انقلع|طير)$/i

handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
