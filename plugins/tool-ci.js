let handler = async (m, { conn }) => {
    if (!m.quoted) throw 'رد على رسالة من القناة'
    try {
        let id = (await m.getQuotedObj()).msg.contextInfo.forwardedNewsletterMessageInfo
        await m.reply(`*الاسم:* ${id.newsletterName}\n*المعرف:* ${id.newsletterJid}`)
    } catch (e) {
        throw 'يجب أن تكون الدردشة من قناة'
    }
}

handler.help = handler.command = ['ايدي']
handler.tags = ['tools']

handler.register = true

export default handler
