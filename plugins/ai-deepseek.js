import fetch from "node-fetch"

const handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) throw `❌ أدخل سؤالك بعد الأمر`

    try {
        let anu = 'أنت مساعد ذكي اسمه كوفيد AI، تتحدث العربية بطلاقة، مفيد ومؤدب.'
        let response = await fetch(`${APIs.ryzumi}/api/ai/deepseek?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(anu)}&session=deepseek-${encodeURIComponent(global.namebot)}-${encodeURIComponent(m.sender)}`)
        if (!response.ok) throw new Error("❌ فشل الاتصال بـ DeepSeek AI")
        let result = await response.json()
        await conn.sendMessage(m.chat, {
            text: `╭━━〔 🧠 *DeepSeek AI* 〕━━╮\n\n${result.answer}\n\n╰━━━━━━━━━━━━━━╯`
        })
    } catch (error) {
        await conn.sendMessage(m.chat, { text: `❌ خطأ: ${error?.message || 'حدث خطأ، حاول مرة أخرى'}` })
    }
}

handler.help = ['deepseek <سؤال>']
handler.tags = ['ai']
handler.command = /^(deepseek)$/i
handler.limit = 6
handler.premium = false
handler.register = true

export default handler
