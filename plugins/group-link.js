let handler = async (m, { conn, args }) => {
    m.reply('https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat))
}
handler.help = ['لينك']
handler.tags = ['group']
handler.command = /^link(لنك)?$/i
handler.admin = true
handler.group = true
handler.botAdmin = true


export default handler