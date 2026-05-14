let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.quoted) throw '❌ رد على رسالة الملصق أولاً'
    if (!m.quoted.fileSha256) throw '❌ البصمة غير موجودة في هذا الملصق'
    let sticker = global.db.data.sticker
    let hash = Buffer.from(m.quoted.fileSha256).toString('hex')
    if (!(hash in sticker)) throw '❌ البصمة غير موجودة في قاعدة البيانات'
    sticker[hash].locked = !/^un/i.test(command)
    m.reply(sticker[hash].locked ? '🔒 تم قفل الأمر بنجاح' : '🔓 تم فك قفل الأمر بنجاح')
}
handler.help = ['un', ''].map(v => v + 'lockcmd')
handler.tags = ['database']
handler.command = /^(un)?خاص$/i

export default handler
