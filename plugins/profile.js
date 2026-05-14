let handler = async (m, { conn }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''

        if (!/image/.test(mime)) {
            throw '📸 أرسل صورة مع الأمر أو رد على صورة'
        }

        let img = await q.download()

        await conn.updateProfilePicture(conn.user.jid, img)

        m.reply('✅ تم تغيير صورة البوت بنجاح')
    } catch (e) {
        console.log(e)
        m.reply('❌ فشل تغيير صورة البوت')
    }
}

handler.help = ['بروفايل']
handler.tags = ['owner']
handler.command = /^(بروفايل|setppbot)$/i

handler.rowner = true

export default handler