var handler = async (m, { conn, text, participants }) => {

    let who = m.quoted
        ? m.quoted.sender
        : m.mentionedJid?.[0]
        ? m.mentionedJid[0]
        : ''

    if (!who) return m.reply('رد أو منشن الشخص المطلوب طرده')
    if (who === m.sender) return m.reply('ما تقدر تطرد نفسك')

    let isInGroup = participants.some(v => conn.decodeJid(v.id) === conn.decodeJid(who))
    if (!isInGroup) return m.reply('الشخص مو موجود في القروب')

    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')

    m.reply('✅ تم الطرد بنجاح')
}

handler.help = ['طرد @user']
handler.tags = ['group']
handler.command = /^(طرد)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler