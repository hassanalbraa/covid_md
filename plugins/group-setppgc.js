import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) {
      throw '📸 رد على صورة'
    }

    m.reply('⏳ جاري تغيير صورة القروب...')

    let media = await q.download()

    await conn.updateProfilePicture(m.chat, media)

    m.reply('✅ تم تغيير صورة القروب')

  } catch (e) {
    console.log(e)
    m.reply('❌ فشل تغيير الصورة (واتساب رفضها أو البوت ما عنده صلاحية)')
  }
}
handler.help = ['برو']
handler.tags = ['group']
handler.command = /^(برو|setppgc)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler