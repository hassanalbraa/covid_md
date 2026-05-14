import fetch from 'node-fetch'

const handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `*｢ ❤️ ｣ ~ حط رابط جنب الامر ~ ｢ 💙 ｣*`
  
  if (!text.match(/youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\//)) {
    throw `*❌ ~ الرابط مش صحيح ~ حط رابط يوتيوب صحيح*`
  }
  
  const isAudio = command === "اغنية" || command === "اغنيه" || command === "ytmp3"
  
  try {
    m.reply('⏳ جاري جلب البيانات... (كوفيد في الخدمة)')

    // استخدام API قوي ومستقر بديل للمكتبة المفقودة
    let res = await fetch(`https://api.boxi.bot/api/yt${isAudio ? 'mp3' : 'mp4'}?url=${text}`)
    let json = await res.json()
    
    if (!json.status) throw '❌ فشل في جلب البيانات من السيرفر'
    
    const { title, thumbnail, duration, url } = json.result
    const type = isAudio ? 'اغـانـي' : 'فيـديـوز'
    
    // هيكلة بوت كوفيد (𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁) كما طلبت
    let caption = `*｢ YouTube | يـوتـيـوب ${type} ｣*\n\n`
    caption += `❐↞┇الـعـنـون⏳↞ ${title}\n`
    caption += `❐↞┇الـمـدة🕒↞ ${duration || 'غير معروف'}\n\n`
    caption += `> _*الرجاء الانتظار قليلاً جاري التحميل...*_ \n`
    caption += `➥ 𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁`.trim()
    
    await conn.sendMessage(m.chat, { 
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: "𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁 - YouTube",
          thumbnailUrl: thumbnail,
          sourceUrl: text,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
    
    // إرسال الملف
    await conn.sendMessage(m.chat, isAudio ? { 
      audio: { url: url }, 
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    } : { 
      video: { url: url }, 
      caption: `*${title}*\n➥ 𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ السيرفر مشغول حالياً أو الرابط غير مدعوم، جرب مرة ثانية.')
  }
}

handler.help = ['اغنية']
handler.tags = ['downloader']
handler.command = /^(اغنية|اغنيه|ytmp3|فيديو|فديو)$/i

export default handler
