import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*أين مسار الملف؟* ⚠️\nمثال:\n${usedPrefix + command} plugins/menu.js\n${usedPrefix + command} handler.js`, m)

    // تحديد المسار الكامل للملف من مجلد البوت الرئيسي
    let path = join(process.cwd(), text)

    // التأكد من وجود الملف
    if (!existsSync(path)) {
        return conn.reply(m.chat, `*الملف غير موجود!* ❌\nتأكد من كتابة المسار الصحيح.`, m)
    }

    try {
        let file = readFileSync(path)
        let fileName = text.split('/').pop() // استخراج اسم الملف فقط للإرسال
        
        await conn.sendMessage(m.chat, { 
            document: file, 
            mimetype: 'application/javascript', 
            fileName: fileName,
            caption: `✅ تم استخراج الملف:\n*${text}*`
        }, { quoted: m })
        
    } catch (e) {
        console.error(e)
        conn.reply(m.chat, `*حدث خطأ أثناء جلب الملف!* ⚠️`, m)
    }
}

handler.help = ['جلب <المسار>']
handler.tags = ['owner']
handler.command = /^(جلب|getfile|getplugin)$/i

handler.rowner = true // للمطور فقط

export default handler
