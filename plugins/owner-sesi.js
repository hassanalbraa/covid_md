/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ جلب الجلسة ]
🏷 النوع: Plugin ESM
♲ الوظيفة: إرسال ملف بيانات الجلسة (creds.json) لنقل الجلسة أو النسخ الاحتياطي
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

import fs from 'fs'

let handler = async (m, { conn, text }) => {
    m.reply('⏳ انتظر قليلاً، جاري جلب ملف الجلسة')
    let sesi = await fs.readFileSync('./sessions/creds.json')
    return await conn.sendMessage(m.chat, { 
        document: sesi, 
        mimetype: 'application/json', 
        fileName: 'creds.json' 
    }, { quoted: m })
}

handler.help = ['الجلسه']
handler.tags = ['owner']
handler.command = /^(الجلسه|الجلسة|g(et)?ses?si(on)?(data.json)?)$/i

handler.rowner = true

export default handler
