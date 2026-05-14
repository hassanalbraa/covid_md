import axios from 'axios'

let handler = async (m, { conn, args }) => {
    const code = args[0];

    if (!code) {
        return conn.reply(m.chat, `❌ أدخل الكود المراد تحويله إلى صورة\n\nمثال:\n.carbon console.log("مرحبا")`, m);
    }

    m.reply(wait)

    try {
        const response = await axios.get(`${APIs.ryzumi}/api/tool/carbon?code=${encodeURIComponent(code)}`, {
            responseType: 'arraybuffer'
        });

        conn.sendMessage(m.chat, {
            image: response.data,
            caption: `💻 *كود Carbon*\n\n${global.wm}`
        }, { quoted: m });

    } catch (error) {
        conn.reply(m.chat, `❌ حدث خطأ أثناء توليد الصورة`, m);
    }
}

handler.help = ["carbon <كود>"];
handler.tags = ["tools"];
handler.command = /^carbon(ify)?$/i;
handler.register = true
handler.limit = true

export default handler
