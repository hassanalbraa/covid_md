import fetch from 'node-fetch'

const handler = async (m, { conn, args, command, usedPrefix }) => {
    if (args.length < 1) throw `❌ أرسل رابط SlideShare\n\nمثال:\n*${usedPrefix + command} رابط_السلايد*`

    const url = args[0];
    const filetypes = ['pdf', 'pptx'];

    m.reply(wait);

    try {
        for (const filetype of filetypes) {
            const response_get = await fetch(`https://bioskop-six.vercel.app/slideshare?url=${encodeURIComponent(url)}&filetype=${filetype}`);
            const { download_url } = await response_get.json();

            conn.sendFile(m.chat, download_url, `${url.split('/').pop()}.${filetype}`, `✅ تم تحميل ملف ${filetype.toUpperCase()} بنجاح`, m);
        }
    } catch (error) {
        console.error("خطأ:", error);
        conn.reply(m.chat, `❌ حدث خطأ: ${error.message}\n\nأرسل رابط SlideShare صحيح`, m);
    }
};

handler.command = /^(slideshare|slidedl|slidesharedl|slidedownload)$/i
handler.help = ['slideshare <رابط>']
handler.tags = ['downloader']
handler.register = true
handler.limit = true

export default handler
