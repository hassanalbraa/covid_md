/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ مسح المحادثة ]
🏷 النوع: Plugin ESM
♲ الوظيفة: حذف المحادثة كاملة من لدى البوت للمستخدم أو المجموعة المحددة
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

let handler = async (m, { conn, args }) => {
  try {
      if (!args) throw 'أدخل JID للشخص/المجموعة'
      const jid = args
      await conn.chatModify({
        delete: true,
        lastMessages: [{
          key: m.key,
          messageTimestamp: m.messageTimestamp
        }]
      }, jid)
    conn.reply(m.chat, `✅ تم مسح المحادثة بنجاح لـ ${jid}`, m)
  } catch (error) {
    console.error(error)
    conn.reply(m.chat, 'حدث خطأ أثناء حذف المحادثة، تحقق من صحة JID', m)
  }
}

handler.help = ['تنظيف الجروب']
handler.tags = ['owner']
handler.owner = true
handler.command = /^(clearchat|تنظيف)$/i

export default handler
