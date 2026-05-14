let handler = m => m

handler.before = async function (m, { conn }) {
    if (!m.text) return false
    
    // تحويل النص لصغير وحذف المسافات مرة واحدة للكل
    let chat = m.text.toLowerCase().trim()
    
    // 1. أمر بوتي
    if (chat === 'بوتي' || chat === 'boty') {
        await conn.reply(m.chat, 'عيونه 👀❤', m)
        return true 
    }

    // 2. أمر بحبك
    if (chat === 'بحبك' || chat === 'love you') {
        await conn.reply(m.chat, 'وانا كمان 👀❤', m)
        return true
    }

    // 3. أمر البوسة (استخدام Regex عشان يلقط كل الصيغ)


    // 4. أمر تست
    if (chat === 'تست' || chat === 'test') {
        await conn.reply(m.chat, 'أنا هنا 🤙🏻', m)
        return true
    }

    return false
}

export default handler
