let handler = async (m, { conn }) => {

  if (!m.isGroup) return m.reply('🚫 داخل القروبات فقط')

  let who = m.sender

  await conn.groupParticipantsUpdate(m.chat, [who], 'promote')

  m.reply('✅ تم رفعك مشرف')
}

handler.command = /^(ارفعني)$/i
handler.group = true
handler.botAdmin = true

export default handler