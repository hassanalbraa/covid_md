import axios from 'axios'

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '❌ أرسل رابط فيديو فيسبوك';
    m.reply(wait);

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/downloader/fbdl?url=${encodeURIComponent(args[0])}`);

        if (!data.status || !data.data || data.data.length === 0) throw '❌ لا يوجد فيديو متاح';

        let video = data.data.find(v => v.resolution === '720p (HD)') || data.data.find(v => v.resolution === '360p (SD)');
        
        if (video && video.url) {
            conn.sendMessage(m.chat, {
                video: { url: video.url },
                mimetype: "video/mp4",
                fileName: `video.mp4`,
                caption: `🎬 تفضل يا @${m.sender.split('@')[0]}`,
                mentions: [m.sender],
            }, { quoted: m });
        } else {
            throw '❌ لا يوجد فيديو متاح';
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ حدث خطأ: ${error}`, m);
    }
}

handler.help = ['fb <رابط>']
handler.tags = ['downloader']
handler.command = /^(fbdownload|facebook|fb(dl)?)$/i
handler.limit = true
handler.register = true

export default handler
