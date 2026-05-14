/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ مسح المؤقت ]
🏷 النوع: Plugin ESM
♲ الوظيفة: حذف جميع الملفات المؤقتة من مجلدات tmp و os.tmpdir لتوفير المساحة
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

import { tmpdir } from 'os'
import { join } from 'path'
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs'

let handler = async (m, { conn, usedPrefix: _p, dirname, args }) => {
  const tmp = [tmpdir(), join(dirname, '../tmp')]
  const filenames = []

  tmp.forEach(dirpath => {
    if (existsSync(dirpath)) {
      readdirSync(dirpath).forEach(file => {
        const filePath = join(dirpath, file)
        if (existsSync(filePath)) {
          filenames.push(filePath)
        }
      })
    }
  })

  const deletedFiles = []

  filenames.forEach(file => {
    try {
      const stats = statSync(file)
      if (stats.isDirectory()) {
        // تخطي المجلدات
      } else {
        unlinkSync(file)
        deletedFiles.push(file)
      }
    } catch (error) {
      // تجاهل الأخطاء إذا لم يكن الملف موجوداً
    }
  })

  if (deletedFiles.length > 0) {
    conn.reply(m.chat, `✅ تم حذف ${deletedFiles.length} ملف مؤقت بنجاح!`, m)
  } else {
    conn.reply(m.chat, 'لا توجد ملفات مؤقتة للحذف', m)
  }
}

handler.help = ['رفرش']
handler.tags = ['owner']
handler.command = /^(cleartmp|رفرش|tmpclear|cleantmp|مسح‌مؤقت)$/i
handler.rowner = true

export default handler
