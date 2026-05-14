let handler = async (m, { conn, isOwner, isPrems, isMods }) => {
    
    let userRole = 'مستخدم عادي (User) 👤'
    
    // فحص الرتب البرمجية بالتسلسل
    if (isOwner) {
        userRole = 'المطور الأساسي (Owner) 👑'
    } else if (isMods) {
        userRole = 'معدل/مشرف بوت (Moderator) 🛠️'
    } else if (isPrems) {
        userRole = 'مستخدم مميز (Premium) ✨'
    }

    let caption = `
*╭───「 رتبتك في نظام البوت 」───⊷*
*│*
*│ 👤 الاسم: ${m.pushName || 'غير معروف'}*
*│ 📱 المعرف: ${m.sender}*
*│ 🏷️ الرتبة: ${userRole}*
*│*
*│ 💡 ملاحظة: إذا كنت المالك ويظهر "عضو عادي"*
*│ فهذا يعني أن البوت لا يتعرف على رقمك*
*│ في ملف الإعدادات (config.js).*
*╰──────────────────⊷*`.trim()

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
}

handler.help = ['رتبتي_بوت']
handler.tags = ['main']
handler.command = /^(رتبتي|رتبتي_بوت|رتبتي_في_البوت)$/i

export default handler
