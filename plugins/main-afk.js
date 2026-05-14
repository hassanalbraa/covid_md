let handler = async (m, { text }) => {
  let user = global.db.data.users[m.sender]
  user.afk = +new Date()
  user.afkReason = text || ''
  
  m.reply(
    `📴 تم تفعيل وضع الغياب.\n\n` +
    `👤 المستخدم: @${m.sender.split('@')[0]}\n` +
    `${text ? `📋 السبب: ${text}` : ''}`,
    null,
    { mentions: [m.sender] }
  )
}

handler.help = ['غياب [السبب]']
handler.tags = ['main']
handler.command = /^غياب$/i

export default handler