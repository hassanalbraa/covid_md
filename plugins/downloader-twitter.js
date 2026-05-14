import axios from 'axios'

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '❌ أرسل رابط تويتر/X';
    const sender = m.sender.split('@')[0];
    const url = args[0];

    m.reply(wait);

    try {
        let downloadResult = (await axios.get(`${APIs.ryzumi}/api/downloader/twitter?url=${url}`)).data;

        if (!downloadResult.status || !downloadResult.media || downloadResult.media.length === 0) {
            const tempResult = (await axios.get(`${APIs.ryzumi}/api/downloader/v2/twitter?url=${url}`)).data;
            downloadResult = Array.isArray(tempResult) && tempResult.length > 0
                ? { status: true, media: tempResult }
                : { status: false, media: [] };
        }

        if (!downloadResult.status || !downloadResult.media || downloadResult.media.length === 0) {
            throw '❌ فشل تحميل المحتوى من تويتر';
        }

        const type = downloadResult.type || 'video';

        if (type === 'image') {
            for (let i = 0; i < downloadResult.media.length; i++) {
                const mediaUrl = downloadResult.media[i];
                const { data: imageBuffer } = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
                const caption = i === 0 ? `🖼️ تفضل يا @${sender}` : '';
                await conn.sendMessage(m.chat, {
                    image: imageBuffer,
                    caption,
                    fileName: `image_${i + 1}.jpg`,
                    mentions: i === 0 ? [m.sender] : [],
                }, { quoted: m });
            }
        } else {
            const mediaUrl = downloadResult.media[0]?.url || downloadResult.media[0];
            const { data: videoBuffer } = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
            await conn.sendMessage(m.chat, {
                video: videoBuffer,
                mimetype: 'video/mp4',
                fileName: 'twitter_video.mp4',
                caption: `🎬 تفضل يا @${sender}`,
                mentions: [m.sender],
            }, { quoted: m });
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ حدث خطأ: ${error.message || error}`, m);
    }
}

handler.help = ['تويتر <رابط>']
handler.tags = ['downloader']
handler.command = /^(twitter|twt|تويتر|xdl)$/i
handler.limit = true
handler.register = true

export default handler
