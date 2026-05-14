let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `📝 إذا وجدت خطأً، أرسل تقريراً بهذا الأمر\n\nمثال:\n${usedPrefix + command} مرحباً المالك، وجدت خطأ كالتالي: <اكتب الخطأ>`
    if (text.length < 10) throw `❌ التقرير قصير جداً، الحد الأدنى 10 أحرف!`
    if (text.length > 1000) throw `❌ التقرير طويل جداً، الحد الأقصى 1000 حرف!`
    let teks = `*📩 تقرير جديد!*\n\nمن: *@${m.sender.split`@`[0]}*\n\nالرسالة: ${text}\n`
    conn.reply(global.nomorown + '@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {
        contextInfo: { mentionedJid: [m.sender] }
    })
    m.reply(`✅ _تم إرسال التقرير للمالك، سيتم الرد عليك قريباً._`)
}
handler.help = ['تقرير']
handler.tags = ['info']
handler.command = /^(تقرير|report)$/i
handler.register = true
handler.disable = false

export default handler
