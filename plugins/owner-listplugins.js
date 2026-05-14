import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
   try {
      let pluginsDir = 'plugins'
      let files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))

      if (files.length === 0) {
         m.reply('⚠️ لا يوجد ملفات في مجلد plugins.')
         return
      }
// ᴍᴏᴅᴇ ʙʏ : https://t.me/whatsapp_botz
      let list = files.map(f => `- ${path.basename(f, '.js')}`).join('\n')
      m.reply(`عدد الملفات : ${Object.keys(global.plugins).length}\n\n📂 الملفات داخل مجلد plugins:\n\n${list}`)
   } catch (error) {
      console.error(error)
      throw 'Error: ' + error.message
   }
}

handler.help = ['الاضافات']
handler.tags = ['owner']
handler.command = ['lp', 'listplugins', 'الاضافات', 'الإضافات', 'اضافات', 'إضافات', 'بلوجنات', 'البلوجنات']

handler.rowner = true

export default handler