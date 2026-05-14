import { areJidsSameUser } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    // 1. استخراج الـ JID النظيف للبوت (بدون :15 أو غيره)
    let botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'

    try {
        // 2. استخدام الماكر "demote" لتغيير رتبة البوت
        await conn.groupParticipantsUpdate(m.chat, [botJid], 'demote')
        m.reply('⬇️ تم إنزال البوت من الإشراف بنجاح')
    } catch (e) {
        console.error(e)
        // التحقق مما إذا كان الخطأ بسبب أن البوت أصلاً ليس مشرفاً
        m.reply('❌ فشل تنفيذ الأمر\n- قد لا أملك الصلاحيات الكافية لتعديل رتبتي.')
    }
}

handler.help = ['انزل']
handler.tags = ['group']
handler.command = /^(انزل)$/i

handler.group = true
handler.botAdmin = true // هذا يضمن أن الكود لن يعمل إلا لو كان البوت مشرفاً أصلاً

export default handler
