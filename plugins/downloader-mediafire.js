import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `مثال: ${usedPrefix}${command} https://www.mediafire.com/file/...`;
    m.reply(wait);

    try {
        let res = await axios.get(`${APIs.ryzumi}/api/downloader/mediafire?url=${encodeURIComponent(args[0])}`);
        let { status, data, error } = res.data;

        if (!status || !data || !data.downloadUrl) throw '❌ فشل جلب رابط التحميل، حاول مرة أخرى';

        let { filename, filesize, downloadUrl } = data;

        m.reply(`
╭━━〔 📁 *معلومات الملف* 〕━━╮
┃ 📁 *اسم الملف:* ${filename}
┃ 📦 *الحجم:* ${filesize}
╰━━━━━━━━━━━━━━╯
`.trim());
        await conn.sendFile(m.chat, downloadUrl, filename, '', m, null, { asDocument: true });
    } catch (e) {
        throw '❌ حدث خطأ: ' + (e?.message || e);
    }
};

handler.help = ['فاير']
handler.tags = ['downloader'];
handler.command = /^(فاير|mf)$/i;
handler.limit = true
handler.register = true

export default handler
