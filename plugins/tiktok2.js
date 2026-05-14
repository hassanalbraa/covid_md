let handler = async (m, { conn }) => {

    let session = global.tt?.[m.sender]
    if (!session) return

    let text = m.text?.trim()

    // 🎬 فيديو
    if (text === "1") {
        await conn.sendMessage(m.chat, {
            video: { url: session.videoUrl },
            caption: "🎬 فيديو TikTok"
        }, { quoted: m })

        delete global.tt[m.sender]
    }

    // 🎵 صوت
    else if (text === "2") {
        await conn.sendMessage(m.chat, {
            audio: { url: session.audioUrl },
            mimetype: "audio/mpeg",
            fileName: "tiktok.mp3"
        }, { quoted: m })

        delete global.tt[m.sender]
    }

    // 📦 الاثنين
    else if (text === "3") {
        await conn.sendMessage(m.chat, {
            video: { url: session.videoUrl },
            caption: "🎬 الفيديو"
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            audio: { url: session.audioUrl },
            mimetype: "audio/mpeg",
            fileName: "tiktok.mp3"
        }, { quoted: m })

        delete global.tt[m.sender]
    }
}

export default handler