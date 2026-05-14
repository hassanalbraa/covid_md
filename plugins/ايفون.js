import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('يرجى وصف الصورة التي تريد رسمها')
  
  await m.reply('جاري رسم الصورة باستخدام الذكاء الاصطناعي...')

  try {
    // استخدام محرك رسم قوي يدعم العربية (Prodia أو Pollinations)
    let imageUrl = `https://pollinations.ai/p/${encodeURIComponent(text)}?width=1080&height=1080&seed=42&model=flux`
    
    // إرسال الصورة الناتجة
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `تم الرسم بنجاح\n\nنظام كوفيد`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('حدث خطأ أثناء محاولة الرسم، يرجى المحاولة لاحقاً')
  }
}
 
handler.help = ['draw']
handler.command = /^(رسم)$/i 
handler.tags = ['tools']
 
export default handler
