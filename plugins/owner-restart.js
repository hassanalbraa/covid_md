/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ إعادة التشغيل ]
🏷 النوع: Plugin ESM
♲ الوظيفة: إعادة تشغيل البوت عن بعد من خلال إرسال إشارة للعملية الأم
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

import { spawn } from 'child_process'

let handler = async (m, { conn, isROwner, text }) => {
    if (!process.send) throw `لا: node main.js\nنعم: node index.js`
    if (global.conn.user.jid == conn.user.jid) {
        await m.reply('🔄 جاري إعادة التشغيل...')
        process.send('reset')
    } else throw '_هذا ليس البوت الرئيسي..._'
}

handler.help = ['رستارت']
handler.tags = ['owner']
handler.command = /^(res(tart)?)$/i

handler.rowner = true

export default handler
