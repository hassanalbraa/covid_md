let handler = async (m, { participants }) => {
    // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    global.db.data.chats[m.chat].isBanned = true
    m.reply('تـم تعطـيل البـوت فـي المجموعـة!')
    // } else m.reply('Ada nomor host disini...')
}
handler.help = ['تعطيل']
handler.tags = ['owner']
handler.command = /^(banchat|bnc|تعطيل|اطفاء|إطفاء)$/i

handler.owner = true

export default handler