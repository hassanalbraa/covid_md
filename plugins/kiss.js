let handler = m => m

handler.before = async function (m, { conn }) {
    // 1. التأكد أن الرسالة تحتوي على نص
    if (!m.text) return false

    // 2. تجهيز النص (حذف المسافات وتحويل الحروف الإنجليزية لصغيرة)
    let input = m.text.trim().toLowerCase()

    // --- قائمة الأوامر وردود الفعل ---

    // أمر البوسة (يدعم العربية والإنجليزية والهاء والتاء المربوطة)
    if (/^(هات بوسة|هات بوسه|kiss|بوسة|بوسه)$/i.test(input)) {
        await conn.sendMessage(m.chat, { react: { text: '💋', key: m.key } }) // تفاعل
        await conn.reply(m.chat, '💋💋💋', m) // رد
        return true 
    }

    // أمر "ابت"
    if (/^(ابت|يا بت|يبت)$/i.test(input)) {
        await conn.reply(m.chat, 'أيوة يا قلب البت، عايز شنو؟ 😂❤', m)
        return true
    }

    // أمر التست (بدون بريفكس)
    if (/^(تست|test)$/i.test(input)) {
        await conn.reply(m.chat, 'أنا هنا وشغال زي الفل 🤙🏻', m)
        return true
    }

    return false
}

export default handler
