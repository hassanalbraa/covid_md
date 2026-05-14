import axios from 'axios'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply("📎 ارسل رابط YouTube")

    let url = args[0]

    try {
        m.reply("⏳ جاري التحميل...")

        const { data } = await axios.get(
            `https://api.cobalt.tools/api/json?url=${encodeURIComponent(url)}`
        )

        if (!data?.url) return m.reply("❌ فشل التحميل")

        let title = data.title || "YouTube Video"

        // 🎬 فيديو
        await conn.sendMessage(m.chat, {
            video: { url: data.url },
            caption: `🎬 ${title}`
        }, { quoted: m })

        // 🎵 صوت (لو موجود)
        if (data.audio) {
            await conn.sendMessage(m.chat, {
                audio: { url: data.audio },
                mimetype: "audio/mpeg",
                fileName: "youtube.mp3"
            }, { quoted: m })
        }

    } catch (e) {
        console.log(e)
        m.reply("❌ فشل التحميل من YouTube")
    }
}

handler.command = /^(yt|youtube)$/i
export default handler