/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ قائمة المحظورين ]
🏷 النوع: Plugin ESM
♲ الوظيفة: عرض قائمة جميع الأرقام المحظورة من قبل البوت
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

let handler = async (m, { conn }) => {
    await conn.fetchBlocklist().then(async data => {
        let txt = `*「  قائمة الأرقام المحظورة  」*\n\n*العدد الإجمالي:* ${data.length}\n\n┌─\n`
        for (let i of data) {
            txt += `├ @${i.split("@")}\n`
        }
        txt += `└────`
        return conn.reply(m.chat, txt, m, { mentions: await conn.parseMention(txt) })
    }).catch(err => {
        console.log(err)
        throw 'لا توجد أرقام محظورة!'
    })
}

handler.tags = ['المحظورين']
handler.help = ['blocklist']
handler.command = /^(blocklist|المحظورين)$/i

handler.owner = true

export default handler
