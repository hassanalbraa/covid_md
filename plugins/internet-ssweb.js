import axios from 'axios'

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) return m.reply(`❌ الاستخدام: ${usedPrefix + command} <رابط>\n\nمثال: ${usedPrefix + command} https://google.com`);

    m.reply(wait);

    if (!text.startsWith('https://') && !text.startsWith('http://')) {
        text = 'https://' + text;
    }

    const ssweb = async (url, mode) => {
        try {
            let response = await axios.get(`${APIs.ryzumi}/api/tool/ssweb`, {
                params: { url, mode },
                responseType: 'arraybuffer'
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    let mode = command === 'sshp' ? 'handphone' : 'desktop';
    let screenshot = await ssweb(text, mode);

    if (!screenshot) {
        return m.reply('❌ فشل أخذ لقطة الشاشة. تأكد من الرابط أو حاول مرة أخرى.');
    }

    await conn.sendMessage(m.chat, {
        image: screenshot,
        caption: `📸 لقطة شاشة: ${text}`
    }, { quoted: m });
};

handler.help = ['ssweb', 'sspc', 'sshp'].map(v => v + ' <رابط>');
handler.tags = ['internet'];
handler.command = /^(ssweb|sspc|sshp)$/i;
handler.limit = 1
handler.register = true

export default handler
