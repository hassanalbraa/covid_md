import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) return m.reply(`❌ يرجى وضع رابط الفيديو.\n\n*مثال:*\n${usedPrefix + command} https://vt.tiktok.com/ZSXXXX/`);
  
  try {
    m.reply('⏳ جاري جلب الفيديو من SSSTik...');
    
    const videoData = await downloadTikTok(text);

    if (!videoData.videoUrl) {
      return m.reply("❌ فشل في استخراج رابط الفيديو، تأكد أن الرابط شغال وعام.");
    }

    // إرسال الفيديو
    await conn.sendMessage(m.chat, { 
        video: { url: videoData.videoUrl }, 
        caption: `🟢 *الوصف:* ${videoData.description || "بدون وصف"}\n👤 *المؤلف:* ${videoData.author || "غير معروف"}\n\n➥ 𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁` 
    }, { quoted: m });

    // إرسال الصوت (اختياري)
    if (videoData.audioUrl) {
      await conn.sendMessage(m.chat, { 
          audio: { url: videoData.audioUrl }, 
          mimetype: 'audio/mpeg',
          fileName: `tiktok.mp3`
      }, { quoted: m });
    }
    
  } catch (error) {
    console.error(error);
    m.reply('❌ حدث خطأ أثناء التحميل، السيرفر قد يكون محجوباً حالياً.');
  }
};

handler.help = ['تيك'];
handler.tags = ['downloader'];
handler.command = /^(h|tiktok|tt)$/i;

export default handler;

async function downloadTikTok(url) {
  let data = qs.stringify({
    'id': url,
    'locale': 'en',
    'tt': 'RFZfT00x' // قيمة ثابتة أحياناً تعمل بشكل أفضل مع ssstik
  });

  let config = {
    method: 'POST',
    url: 'https://ssstik.io/abc?url=dl',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://ssstik.io',
      'Referer': 'https://ssstik.io/en'
    },
    data: data
  };

  const response = await axios.request(config);
  const $ = cheerio.load(response.data);

  return {
    author: $('.pure-u-1-2.pure-u-md-1-3 h2').text().trim(),
    description: $('.maintext').text().trim(),
    videoUrl: 'https://ssstik.io' + $('a.download_link.without_watermark').attr('href') || $('a.download_link.without_watermark_direct').attr('href'),
    audioUrl: $('a.download_link.music').attr('href')
  };
}
