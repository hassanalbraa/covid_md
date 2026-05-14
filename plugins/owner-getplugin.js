import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) throw `‣ مثال: ${usedPrefix + command} main-join`

   try {
      let path = `plugins/${text}.js`
// ᴍᴏᴅᴇ ʙʏ : https://t.me/whatsapp_botz
      if (fs.existsSync(path)) {
         let content = fs.readFileSync(path, 'utf-8')

         // لو الكود طويل جداً، يصير كملف نصي
         if (content.length > 4000) {
            await conn.sendMessage(m.chat, { document: { url: path }, mimetype: 'text/plain', fileName: `${text}.js` }, { quoted: m })
         } else {
            m.reply(`//By https://t.me/whatsapp_botz\n\n${content}`)
         }
      } else {
         throw `⚠️ الملف غير موجود: ${path}`
      }
   } catch (error) {
      console.error(error)
      throw 'Error: ' + error.message
   }
}

handler.help = ['عرض']
handler.tags = ['owner']
handler.command = ['gp', 'عرض', 'getplugin', 'جلب']

handler.rowner = true

export default handler