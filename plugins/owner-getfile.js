import fs from 'fs'

let handler = async (m, { text, usedPrefix, command }) => {

    if (!text) {
        throw `❌ اكتب اسم الملف\n\nمثال:\n${usedPrefix + command} main.js`
    }

    try {

        // منع المسارات الخطيرة
        if (text.includes('..') || text.includes('/')) {
            return m.reply('❌ مسار غير مسموح')
        }

        let data = fs.readFileSync(`./${text}`, 'utf8')

        if (!data) return m.reply('❌ الملف فارغ')

        if (data.length > 4000) {
            data = data.slice(0, 4000) + '\n... (مختصر)'
        }

        m.reply(data)

    } catch (e) {
        console.log(e)
        m.reply('❌ الملف غير موجود أو حدث خطأ')
    }
}

handler.help = ['اقرأ']
handler.tags = ['owner']
handler.command = /^(اقرأ|gf)$/i
handler.rowner = true

export default handler