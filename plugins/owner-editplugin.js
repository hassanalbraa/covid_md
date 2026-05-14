import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) throw `‣ مثال: ${usedPrefix + command} main-join`
   if (!m.quoted || !m.quoted.text) throw `⚠️ لازم ترد على رسالة فيها الكود الجديد.`
// ᴍᴏᴅᴇ ʙʏ : https://t.me/whatsapp_botz
   try {
      let path = `plugins/${text}.js`
      let newCode = m.quoted.text

      fs.writeFileSync(path, newCode)
      m.reply(`✅ تم تحديث الملف بنجاح:\n${path}`)
   } catch (error) {
      console.error(error)
      throw 'Error: ' + error.message
   }
}

handler.help = ['استبدال']
handler.tags = ['owner']
handler.command = ['استبدال', 'ep', 'editplugin', 'عدل', 'updateplugin', 'تحرير', 'تبديل', 'تعديل']

handler.rowner = true

export default handler