/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ حفظ الإضافة ]
🏷 النوع: Plugin ESM
♲ الوظيفة: حفظ كود الإضافة الجديدة كملف JavaScript في مجلد الإضافات مع معالجة الأخطاء
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) throw `‣ مثال: ${usedPrefix + command} main-join`
   try {
   if (!m.quoted?.text) throw `يرجى الرد على الكود.`   
   let path = `plugins/${text}.js` 
   await fs.writeFileSync(path, m.quoted.text) 
   m.reply(`✅ تم حفظ الكود بنجاح في: ${path}`)
   } catch (error) {
    console.error(error)
    throw 'خطأ: ' + error.message
   }
}

handler.help = ['ضيف']
handler.tags = ['owner'] 
handler.command = /^(sp|حفظ|ضيف|saveplugin)$/i

handler.rowner = true

export default handler
