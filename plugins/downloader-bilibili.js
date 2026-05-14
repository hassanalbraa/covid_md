import axios from 'axios'
import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '❌ أرسل رابط BiliBili';
    const sender = m.sender.split('@')[0];
    const url = args[0];

    m.reply(wait);

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/downloader/bilibili?url=${encodeURIComponent(url)}`);

        if (!data.status || !data.data?.mediaList?.videoList?.length) {
            throw '❌ لا يوجد فيديو متاح';
        }

        const video = data.data.mediaList.videoList[0];
        const title = data.data.title || "فيديو";
        const views = data.data.views || "0";
        const likes = data.data.like || "0";

        if (video.url) {
            const videoBuffer = await axios.get(video.url, { responseType: 'arraybuffer' }).then(res => res.data);
            const tempFilePath = path.join('/tmp', `${video.filename || 'video'}.mp4`);
            const outputFilePath = path.join('/tmp', `${video.filename || 'video'}_fixed.mp4`);

            await fs.writeFile(tempFilePath, videoBuffer);

            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${tempFilePath} -c copy ${outputFilePath}`, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            const caption = `
╭━━〔 🎬 *BiliBili* 〕━━╮
┃ 📹 *العنوان:* ${title}
┃ 👁️ *المشاهدات:* ${views}
┃ 👍 *الإعجابات:* ${likes}
╰━━━━━━━━━━━━━━╯`;

            const fixedVideoBuffer = await fs.readFile(outputFilePath);

            await conn.sendMessage(m.chat, {
                video: fixedVideoBuffer,
                mimetype: "video/mp4",
                fileName: video.filename,
                caption: caption.trim(),
                mentions: [m.sender],
            }, { quoted: m });

            await fs.unlink(tempFilePath).catch(() => {});
            await fs.unlink(outputFilePath).catch(() => {});
        } else {
            throw '❌ لا يوجد فيديو متاح';
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ حدث خطأ: ${error.message || error}`, m);
    }
};

handler.help = ['bilibili'];
handler.tags = ['downloader'];
handler.command = /^(bili(bili)?)$/i;
handler.limit = 2
handler.register = true

export default handler
