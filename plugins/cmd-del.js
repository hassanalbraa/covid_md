let handler = async (m, { conn, usedPrefix, text, command }) => {
    let hash = text
    if (m.quoted && m.quoted.fileSha256) hash = Buffer.from(m.quoted.fileSha256).toString('hex')
    if (!hash) throw `❌ لا يوجد بصمة للملصق`
    let sticker = global.db.data.sticker
    if (sticker[hash] && sticker[hash].locked) throw '🔒 هذا الأمر مقفول ولا يمكن حذفه'
    delete sticker[hash]
    m.reply(`✅ تم الحذف بنجاح`)
}

handler.help = ['cmd'].map(v => 'del' + v + ' <نص>')
handler.tags = ['database', 'premium']
handler.command = ['delcmd']

export default handler
