/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ حفظ الملف ]
🏷 النوع: Plugin ESM
♲ الوظيفة: حفظ نص معين كملف في مسار محدد من خلال الرد على النص
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

import fs from 'fs'

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `ماذا؟ النص أين؟\n\nالاستخدام:\n${usedPrefix + command} <مسار_الملف>\n\nمثال:\n${usedPrefix + command} plugins/anas.js`
    if (!m.quoted?.text) throw `رد على الرسالة!`
    let path = `${text}`
    await fs.writeFileSync(path, m.quoted.text)
    m.reply(`تم الحفظ في: ${path}`)
}

handler.help = ['رفع'].map(v => v + ' <مسار>')
handler.tags = ['owner']
handler.command = /^sf|رفع$/i

handler.rowner = true

export default handler
