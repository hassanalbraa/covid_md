let handler = async (m, { conn, text, usedPrefix, command }) => {
  // التحقق من النص المدخل بعد كلمة "وضع"
  let isPublic = /عام/i.test(text)
  let isSelf = /خاص/i.test(text)

  // إذا لم يكتب المستخدم شيئاً أو كتب كلمة غير صحيحة
  if (!text || (!isPublic && !isSelf)) {
      return conn.reply(m.chat, `*استخدام خاطئ!* ⚠️\n\nيرجى كتابة:\n${usedPrefix + command} عام\nأو\n${usedPrefix + command} خاص`, m)
  }

  // التأكد من وجود كائن الإعدادات
  if (!global.db.data.settings[conn.user.jid]) global.db.data.settings[conn.user.jid] = {}

  // تغيير الحالة
  global.db.data.settings[conn.user.jid].public = isPublic

  // رسالة التأكيد
  let status = isPublic ? 'عام 🔓 (الكل يمكنه استخدام البوت)' : 'خاص 🔐 (المطور فقط يمكنه استخدامه)'

  conn.reply(m.chat, `✅ تم تغيير وضع البوت إلى: *${status}*`, m)
}

handler.help = ['وضع عام', 'وضع خاص']
handler.tags = ['owner']
handler.command = /^(وضع)$/i // يستجيب فقط لكلمة "وضع"

handler.rowner = true // للمطور الأساسي فقط

export default handler
