let handler = async (m, { conn, args, isOwner }) => {

  if (!isOwner) return m.reply('🚫 هذا الأمر للمالك فقط')

  let اسم_القروب = args.join(' ')
  if (!اسم_القروب) return m.reply('اكتب اسم القروب')

  let اعضاء = [] // تقدر تضيف أرقام هنا

  let group = await conn.groupCreate(اسم_القروب, اعضاء)

  let link = await conn.groupInviteCode(group.id)
  let invite = 'https://chat.whatsapp.com/' + link

  m.reply(`✅ تم إنشاء القروب بنجاح
📛 الاسم: ${اسم_القروب}
🔗 الرابط: ${invite}`)
}

handler.command = /^(روم|انشاء_مجموعة|creategroup)$/i
export default handler