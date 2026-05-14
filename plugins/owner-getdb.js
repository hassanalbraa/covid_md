/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ جلب قاعدة البيانات ]
🏷 النوع: Plugin ESM
♲ الوظيفة: إرسال ملف قاعدة البيانات للنسخ الاحتياطي أو النقل
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

import fs from 'fs'

let handler = async (m, { conn, text }) => {
    m.reply('⏳ انتظر قليلاً، جاري جلب ملف قاعدة البيانات')
    let sesi = await fs.readFileSync('./database.json')
    return await conn.sendMessage(m.chat, { 
        document: sesi, 
        mimetype: 'application/json', 
        fileName: 'database.json' 
    }, { quoted: m })
}

handler.help = ['نسخة']
handler.tags = ['owner']
handler.command = /^(getdb|نسخه|نسخة)$/i

handler.rowner = true

export default handler
