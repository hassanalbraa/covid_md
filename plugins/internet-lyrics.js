import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `❌ مثال\n*${usedPrefix}${command} اسم الأغنية - الفنان*`;

    m.reply(wait);

    try {
        const response = await axios.get(`${APIs.ryzumi}/api/search/lyrics?query=${encodeURIComponent(text)}`);
        const results = response.data;

        if (results && results.length > 0) {
            const firstResult = results[0];
            const dur = Math.floor(firstResult.duration / 60);
            const sec = (firstResult.duration % 60).toString().padStart(2, '0');

            m.reply(`
╭━━〔 🎵 *كلمات الأغنية* 〕━━╮
┃ 🎵 *العنوان:* ${firstResult.name}
┃ 🎤 *الفنان:* ${firstResult.artistName}
┃ 💿 *الألبوم:* ${firstResult.albumName}
┃ ⏱️ *المدة:* ${dur}:${sec}
╰━━━━━━━━━━━━━━╯

${firstResult.plainLyrics}`.trim());
        } else {
            throw new Error('❌ كلمات الأغنية غير موجودة');
        }
    } catch (error) {
        conn.reply(m.chat, `❌ حدث خطأ: ${error.message}`, m);
    }
};

handler.help = ['كلمات'].map(v => v + ' <بحث>');
handler.tags = ['internet'];
handler.command = /^(كلمات|lyrics|lirik|lyric)$/i;
handler.register = true

export default handler
