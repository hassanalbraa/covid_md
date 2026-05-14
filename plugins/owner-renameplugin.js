import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) throw `‣ مثال: ${usedPrefix + command} الاسم‌القديم|الاسم‌الجديد`

   try {
      let [oldName, newName] = text.split('|').map(v => v.trim())
      if (!oldName || !newName) throw `⚠️ لازم تكتب الاسم القديم والجديد مفصولين بـ | \nمثال:\n${usedPrefix + command} main-join|main-new`

      let oldPath = path.join('plugins', `${oldName}.js`)
      let newPath = path.join('plugins', `${newName}.js`)
// ᴍᴏᴅᴇ ʙʏ : https://t.me/whatsapp_botz
      if (!fs.existsSync(oldPath)) throw `⚠️ الملف غير موجود: ${oldPath}`
      if (fs.existsSync(newPath)) throw `⚠️ يوجد ملف بنفس الاسم الجديد: ${newPath}`

      fs.renameSync(oldPath, newPath)
      m.reply(`✅ تم تغيير اسم الملف:\nمن: ${oldPath}\nإلى: ${newPath}`)
   } catch (error) {
      console.error(error)
      throw 'Error: ' + error.message
   }
}

handler.help = ['تسمية']
handler.tags = ['owner']
handler.command = ['rp', 'تسميه', 'تسمية', 'renameplugin']

handler.rowner = true

export default handler