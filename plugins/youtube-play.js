import fetch from 'node-fetch'

const handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return m.reply(`*｢ ❤️ ｣ ~ حط رابط جنب الامر ~ ｢ 💙 ｣*`)
  
  if (!text.match(/youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\//)) {
    return m.reply(`*❌ ~ الرابط مش صحيح ~ حط رابط يوتيوب صحيح*`)
  }
  
  const isAudio = command === "اغنية" || command === "اغنيه" || command === "ytmp3"
  
  try {
    // إرسال رسالة انتظار للواتس مباشرة
    await m.reply('⏳ جاري جلب البيانات... (كوفيد في الخدمة)')

    let res = await fetch(`https://api.boxi.bot/api/yt${isAudio ? 'mp3' : 'mp4'}?url=${text}`)
    let json = await res.json()
    
    if (!json.status) throw 'API_ERROR'
    
    const { title, thumbnail, duration, url } = json.result
    const type = isAudio ? 'اغـانـي' : 'فيـديـوز'
    
    // هيكلة بوت كوفيد (𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁)
    let caption = `*｢ YouTube | يـوتـيـوب ${type} ｣*\n\n`
    caption += `❐↞┇الـعـنـون⏳↞ ${title}\n`
    caption += `❐↞┇الـمـدة🕒↞ ${duration || 'غير معروف'}\n\n`
    caption += `> _*الرجاء الانتظار قليلاً جاري التحميل...*_ \n`
    caption += `➥ 𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁`.trim()
    
    // إرسال الكابشن مع الصورة للواتس
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
    
    // إرسال الملف النهائي للواتس
    await conn.sendMessage(m.chat, isAudio ? { 
      audio: { url: url }, 
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    } : { 
      video: { url: url }, 
      caption: `*${title}*\n➥ 𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁`
    }, { quoted: m })

  } catch (e) {
    // لو حصل خطأ، يرسل تنبيه للواتس بدل ما يسكت ويرد في اللوج
    console.error(e)
    await m.reply('❌ السيرفر مشغول حالياً أو الرابط غير مدعوم، جرب مرة ثانية.')
  }
}

handler.help = ['اغنية']
handler.tags = ['downloader']
handler.command = /^(اغنية|اغنيه|ytmp3|فيديو|فديو)$/i

export default handler
