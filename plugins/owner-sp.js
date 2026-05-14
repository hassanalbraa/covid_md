import fs from 'fs'

let handler = async (m, { text, usedPrefix, command }) => {

    if (!text) {
        throw `
╭━━〔 📁 حفظ إضافة 〕━━╮
┃
┃ ✨ اكتب اسم الإضافة
┃
┃ مثال:
┃ ${usedPrefix + command} ترحيب
┃
┃ ثم قم بالرد على رسالة
┃ تحتوي على كود الإضافة
╰━━━━━━━━━━━━━━╯
`
    }

    if (!m.quoted?.text) {
        throw `
╭━━〔 ⚠️ خطأ 〕━━╮
┃
┃ يجب الرد على رسالة
┃ تحتوي على كود الإضافة
╰━━━━━━━━━━━━━━╯
`
    }

    let path = `plugins/${text}.js`

    fs.writeFileSync(path, m.quoted.text)

    m.reply(`
╭━━〔 ✅ تم الحفظ 〕━━╮
┃
┃ تم حفظ الإضافة بنجاح
┃
┃ 📂 المسار:
┃ ${path}
┃
╰━━━━━━━━━━━━━━╯
`)
}

handler.help = ['باتش <اسم>']
handler.tags = ['owner']
handler.command = /^(sp|باتش)$/i
handler.rowner = true

export default handler