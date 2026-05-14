import axios from 'axios'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply("ارسل رابط انستا")

    const sender = m.sender
    const url = args[0]

    try {
        await m.reply("⏳ جاري التحميل...")

        const { data } = await axios.get(
            `https://your-api.com/api/downloader/igdl?url=${encodeURIComponent(url)}`
        )

        if (!data.status || !data.data?.length) {
            return m.reply("فشل تحميل الوسائط")
        }

        let first = true

        for (const item of data.data) {
            let mediaUrl = item.url
            let type = item.type?.toLowerCase()

            let caption = first ? `📥 تفضل @${sender.split('@')[0]}` : ''
            first = false

            if (type === "video") {
                await conn.sendMessage(
                    m.chat,
                    {
                        video: { url: mediaUrl },
                        caption,
                        mentions: [sender]
                    },
                    { quoted: m }
                )
            } else {
                await conn.sendMessage(
                    m.chat,
                    {
                        image: { url: mediaUrl },
                        caption,
                        mentions: [sender]
                    },
                    { quoted: m }
                )
            }
        }

    } catch (e) {
        console.log(e)
        m.reply("❌ فشل التحميل من الانستا")
    }
}

handler.command = /^(ig|insta|انستا)$/i
export default handler