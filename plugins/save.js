import { promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
    // تحديد الأرقام المسموح لها بالحفظ (رقمك ومعرف الـ LID)
    const allowedNumbers = ['249961451692']
    
    // التحقق المباشر: هل المرسل هو صاحب هذه الأرقام؟
    const isSpecialUser = allowedNumbers.some(id => m.sender.includes(id)) || m.fromMe

    if (!isSpecialUser) {
        return m.reply('*🚫 هذا الأمر مخصص لصاحب الرقم المبرمج فقط.*')
    }

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw `*⚠️ يرجى الرد على (صورة/فيديو/ملف/صوت) لحفظه*`

    let downloadFolder = path.join(process.cwd(), 'downloads')
    if (!(await fs.stat(downloadFolder).catch(() => false))) {
        await fs.mkdir(downloadFolder)
    }

    m.reply('*⏳ جارٍ التحميل والحفظ...*')

    try {
        let media = await q.download()
        let extension = mime.split('/')[1] || 'bin'
        let fileName = `saved_${Date.now()}.${extension}`
        let filePath = path.join(downloadFolder, fileName)

        await fs.writeFile(filePath, media)

        m.reply(`*✅ تم الحفظ في ملفات البوت!*\n\n*📂 الملف:* ${fileName}`)
    } catch (e) {
        console.error(e)
        m.reply('*❌ فشل الحفظ!*')
    }
}

handler.help = ['تحميل']
handler.tags = ['owner']
handler.command = /^(تحميل|save)$/i
// اترك handler.rowner و handler.owner غير موجودة (false) 
// لأننا وضعنا التحقق بالرقم داخل الكود نفسه
export default handler
