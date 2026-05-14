let handler = m => m

handler.before = async function (m, { conn }) {
    if (!m.text) return false

    const chat = m.text.toLowerCase().trim()

    if (chat === 'خاصك') {
        try {
            await conn.sendMessage(m.sender, {
                text: '*𝑪𝑶𝑽𝑰𝑫 𝑩𝑶𝑻 𝑽2*'
            })

            await conn.reply(m.chat, '𝑫𝑶𝑵𝑬 ✅', m)

        } catch (e) {
            console.log(e)
            await conn.reply(m.chat, '❌ ما قدرت أرسل ليك في الخاص.', m)
        }

        return true
    }

    return false
}

export default handler