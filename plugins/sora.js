import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*[❗] مثال على الأمر:* \n${usedPrefix + command} ميسي`

    // فلتر الكلمات المحظورة
    const forbidden = ['gore', 'cp', 'porno', 'rule34', 'sex']
    if (forbidden.some(word => text.toLowerCase().includes(word))) return m.reply('⚠️ محتوى محظور')

    try {
        console.log(`🔎 جاري البحث عن صورة: ${text}`)
        
        // استخدام API بديل وأسرع من السكرايبر القديم
        let res = await fetch(`https://api.vreden.my.id/api/bingimg?query=${encodeURIComponent(text)}`)
        let json = await res.json()
        
        if (!json.status) throw 'لم يتم العثور على صور'

        // اختيار صورة عشوائية من النتائج
        let data = json.result
        let link = data[Math.floor(Math.random() * data.length)]

        if (!link) throw 'رابط الصورة غير صالح'

        // إرسال الصورة مع التأكد من النوع
        await conn.sendMessage(m.chat, { 
            image: { url: link }, 
            caption: `🔎 *النتيجة لـ:* ${text}\n🌎 *المصدر:* Bing/Google` 
        }, { quoted: m })

        console.log(`✅ تم إرسال الصورة بنجاح`)

    } catch (e) {
        console.error("DEBUG ERROR:", e)
        m.reply('❌ تعذر تحميل الصورة حالياً، جرب كلمة بحث أخرى.')
    }
}

handler.help = ['صوره']
handler.tags = ['internet']
handler.command = /^(gimage|image|صورة|imagen)$/i

export default handler
