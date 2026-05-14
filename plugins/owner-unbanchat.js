let handler = async (m) => {
    global.db.data.chats[m.chat].isBanned = false
    m.reply('تـــم!')
}
handler.help = ['تفعيل']
handler.tags = ['owner']
handler.command = /^(unbanchat|تفعيل|تنشيط)$/i
handler.owner = true

export default handler