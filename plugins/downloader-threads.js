import axios from 'axios'

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '❌ أرسل رابط Threads';
    m.reply(wait);

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/downloader/threads?url=${encodeURIComponent(args[0])}`);

        const toMediaList = (arr = []) =>
            arr.filter(Boolean).map(item => {
                if (typeof item === 'string') return { url: item };
                return { url: item.download || item.url || item.link };
            }).filter(x => typeof x.url === 'string' && x.url.length > 0);

        const images = toMediaList(data.image_urls || data.images);
        const videos = toMediaList(data.video_urls || data.videos);

        if (images.length === 0 && videos.length === 0) {
            throw '❌ لا توجد وسائط في هذا المنشور';
        }

        if (videos.length > 0) {
            await conn.sendMessage(m.chat, {
                video: { url: videos[0].url },
                mimetype: 'video/mp4',
                fileName: 'threads_video.mp4',
                caption: `🎬 تفضل يا @${m.sender.split('@')[0]}`,
                mentions: [m.sender],
            }, { quoted: m });
        }

        if (images.length > 0) {
            for (const item of images) {
                await conn.sendMessage(m.chat, {
                    image: { url: item.url },
                    caption: `🖼️ تفضل يا @${m.sender.split('@')[0]}`,
                    mentions: [m.sender],
                }, { quoted: m });
            }
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ حدث خطأ: ${error.message || error}`, m);
    }
}

handler.help = ['threads <رابط>']
handler.tags = ['downloader']
handler.command = /^(threads|threadsdl)$/i
handler.limit = true
handler.register = true

export default handler
