import axios from 'axios'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply("ارسل رابط TikTok")

    try {
        m.reply("⏳ جاري التحميل...")

        const { data } = await axios.post(
            "https://www.tikwm.com/api/",
            { url: args[0], hd: 0 }
        )

        let videoUrl = data?.data?.play || data?.data?.wmplay
        let audioUrl = data?.data?.music
        let title = data?.data?.title || "TikTok"

        if (!videoUrl) return m.reply("فشل تحميل الفيديو")

        // 🎬 فيديو
        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: `🎬 ${title}`
        }, { quoted: m })

        // 🎵 MP3 عادي
        if (audioUrl) {
            await conn.sendMessage(m.chat, {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: "tiktok.mp3"
            }, { quoted: m })
        }

        // 🎙️ تسجيل (FIXED)
        if (audioUrl) {
            const audio = await axios.get(audioUrl, {
                responseType: "arraybuffer"
            })

            await conn.sendMessage(m.chat, {
                audio: Buffer.from(audio.data),
                mimetype: "audio/ogg; codecs=opus",
                ptt: true
            }, { quoted: m })
        }

    } catch (e) {
        console.log(e)
        m.reply("فشل التسجيل")
    }
}

handler.command = /^(tt|تيك)$/i
export default handler