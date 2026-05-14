import axios from 'axios'

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '❌ أرسل رابط Pinterest';
    const sender = m.sender.split('@')[0];
    const url = args[0];

    m.reply(wait);

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/downloader/pinterest?url=${encodeURIComponent(url)}`);

        if (!data.success || !data.media || data.media.length === 0) {
            throw '❌ لا توجد وسائط متاحة';
        }

        const mediaData = data.media;

        const videos = mediaData
            .filter(item => item.extension === 'mp4')
            .sort((a, b) => (b.size || 0) - (a.size || 0));

        const images = mediaData
            .filter(item => item.extension === 'jpg')
            .sort((a, b) => {
                if (a.quality === 'original') return -1;
                if (b.quality === 'original') return 1;
                const ax = parseInt(a.quality) || 0;
                const bx = parseInt(b.quality) || 0;
                return bx - ax;
            });

        let imageBuffer = null;

        for (const img of images) {
            try {
                const res = await fetch(img.url);
                if (res.ok) {
                    imageBuffer = Buffer.from(await res.arrayBuffer());
                    break;
                }
            } catch (e) {
                console.warn('فشل جلب الصورة، جارٍ المحاولة مع التالية:', img.url);
            }
        }

        if (imageBuffer) {
            await conn.sendMessage(m.chat, {
                image: imageBuffer,
                caption: `🖼️ تفضل يا @${sender}`,
                mentions: [m.sender]
            }, { quoted: m });
        }

        if (videos.length > 0) {
            try {
                const videoUrl = videos[0].url;
                const videoBuffer = await fetch(videoUrl).then(async res => Buffer.from(await res.arrayBuffer()));

                await conn.sendMessage(m.chat, {
                    video: videoBuffer,
                    mimetype: "video/mp4",
                    fileName: `video.mp4`,
                    caption: `🎬 وهذا الفيديو يا @${sender}`,
                    mentions: [m.sender],
                }, { quoted: m });
            } catch (error) {
                console.error('خطأ في إرسال الفيديو:', error);
                await conn.reply(m.chat, `❌ فشل إرسال الفيديو: ${error.message}`, m);
            }
        }

        if (!imageBuffer && videos.length === 0) {
            throw '❌ لا توجد صور أو فيديوهات للتحميل';
        }

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ حدث خطأ: ${error}`, m);
    }
}

handler.help = ['pinterest'].map(v => v + ' <رابط>');
handler.tags = ['downloader'];
handler.command = /^(pinterestdl|pindl)$/i;
handler.limit = 2
handler.register = true

export default handler
