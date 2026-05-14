import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) throw `‣ مثال: ${usedPrefix + command} main-join`

   try {
      let path = `plugins/${text}.js`
// ᴍᴏᴅᴇ ʙʏ : https://t.me/whatsapp_botz
      if (fs.existsSync(path)) {
         fs.unlinkSync(path)
         m.reply(`🗑️ تم حذف الملف: ${path}`)
      } else {
         throw `⚠️ الملف غير موجود: ${path}`
      }
   } catch (error) {
      console.error(error)
      throw 'Error: ' + error.message
   }
}

handler.help = ['إزالة']
handler.tags = ['owner']
handler.command = ['dp', 'ازالة', 'deleteplugin', 'ازاله', 'إزالة', 'إزاله']

handler.rowner = true

export default handler