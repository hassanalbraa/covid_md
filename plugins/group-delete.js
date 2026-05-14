let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    // 1. التحقق من الصلاحيات
    if (!isBotAdmin) return m.reply('❌ لازم ترفع البوت أدمن عشان يحذف رسائل الأعضاء.')
    if (!m.quoted) return m.reply('⚠️ رد على الرسالة العايز تحذفها.')

    let { chat, fromMe, id, sender } = m.quoted
    
    try {
        // 2. تنفيذ عملية الحذف
        await conn.sendMessage(m.chat, { 
            delete: { 
                remoteJid: m.chat, 
                fromMe: fromMe, 
                id: id, 
                participant: sender 
            } 
        })

        // 3. التفاعل (Reaction) على رسالة الأمر اللي أنت أرسلتها
        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key // متاح في متغير m وهو يمثل رسالتك الحالية
            }
        })

    } catch (e) {
        console.error(e)
        m.reply('❌ فشل الحذف، ممكن الرسالة قديمة شديد أو البوت ما عنده صلاحية.')
    }
}

handler.help = ['delete']
handler.tags = ['group']
handler.command = /^(del|delete|حذف)$/i
handler.admin = true 

export default handler
