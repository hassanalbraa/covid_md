let handler = async (m, { conn, text, usedPrefix, command }) => {

    global.db.data.sticker = global.db.data.sticker || {}

    if (!m.quoted) {
        return m.reply(`❌ لازم ترد على ستيكر\n\nمثال:\n${usedPrefix + command} hello`)
    }

    if (!m.quoted.fileSha256) {
        return m.reply('❌ ما قدرت أقرأ بصمة الستيكر')
    }

    if (!text) {
        return m.reply(
`❌ اكتب النص المطلوب ربطه

مثال:
${usedPrefix + command} hello`
        )
    }

    let stickerDB = global.db.data.sticker

    let hash = Buffer.from(m.quoted.fileSha256).toString('hex')

    // منع التعديل لو مقفول
    if (stickerDB[hash]?.locked) {
        return m.reply('🚫 هذا الستيكر مقفول وما تقدر تعدله')
    }

    stickerDB[hash] = {
        text: text,
        mentionedJid: m.mentionedJid || [],
        creator: m.sender,
        at: Date.now(),
        locked: false
    }

    m.reply('✅ تم حفظ أمر الستيكر بنجاح')
}

handler.help = ['setcmd <text>']
handler.tags = ['database']
handler.command = /^setcmd$/i

export default handler