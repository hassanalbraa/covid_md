import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) throw `‣ مثال: ${usedPrefix + command} جزء-من-الاسم`

   try {
      let pluginsDir = 'plugins'
      let files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))

// ᴍᴏᴅᴇ ʙʏ : https://t.me/whatsapp_botz
      let matches = files.filter(f => f.toLowerCase().includes(text.toLowerCase()))

      if (matches.length === 0) {
         m.reply(`⚠️ لا يوجد أي ملف يحتوي على: "${text}"`)
      } else {
         let list = matches.map(f => `- ${path.basename(f, '.js')}`).join('\n')
         m.reply(`🔍 نتائج البحث عن "${text}":\n\n${list}`)
      }
   } catch (error) {
      console.error(error)
      throw 'Error: ' + error.message
   }
}

handler.help = ['ايجاد']
handler.tags = ['owner']
handler.command = ['sfp', 'تحقق', 'searchplugin', 'ايجاد', 'sp', 'بحث_شامل', 'إيجاد']

handler.rowner = true

export default handler