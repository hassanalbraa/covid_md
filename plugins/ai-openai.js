import fetch from "node-fetch"
import { ryzenCDN } from '../lib/uploadFile.js'

const handler = async (m, { text, conn }) => {
    try {
        if (!text && !m.quoted && !m.mtype.includes('imageMessage')) {
            throw "❌ أدخل سؤالاً أو أرسل صورة!\n\n*مثال:* ما هو الذكاء الاصطناعي؟";
        }

        let imgUrl = null

        if (m.quoted && m.quoted.mtype === 'imageMessage') {
            let img = await m.quoted.download()
            if (img) {
                img = Buffer.from(img)
                let link = await ryzenCDN(img)
                if (!link) throw '❌ فشل رفع الصورة'
                imgUrl = typeof link === 'object' ? link.url : link
            }
        } else if (m.mtype.includes('imageMessage')) {
            let img = await m.download()
            if (img) {
                img = Buffer.from(img)
                let link = await ryzenCDN(img)
                if (!link) throw '❌ فشل رفع الصورة'
                imgUrl = typeof link === 'object' ? link.url : link
            }
        }

        let anu = 'أنت مساعد ذكي اسمه كوفيد AI، تتحدث العربية بطلاقة، مفيد ومؤدب.'
        let apiUrl

        if (imgUrl) {
            apiUrl = `${APIs.ryzumi}/api/ai/v2/chatgpt?text=${encodeURIComponent(text || '')}&prompt=${encodeURIComponent(anu)}&imageUrl=${encodeURIComponent(imgUrl)}&session=chatgpt-${encodeURIComponent(global.namebot)}-${encodeURIComponent(m.sender)}`
        } else if (text) {
            apiUrl = `${APIs.ryzumi}/api/ai/v2/chatgpt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(anu)}&session=chatgpt-${encodeURIComponent(global.namebot)}-${encodeURIComponent(m.sender)}`
        } else {
            throw "❌ لا يوجد نص أو صورة صالحة للمعالجة."
        }

        let hasil = await fetch(apiUrl)
        if (!hasil.ok) throw new Error("❌ فشل الطلب: " + hasil.statusText)

        let result = await hasil.json()
        let responseMessage = result.result || "لا توجد استجابة من الذكاء الاصطناعي."

        await conn.sendMessage(m.chat, {
            text: `╭━━〔 🤖 *ChatGPT AI* 〕━━╮\n\n${responseMessage}\n\n╰━━━━━━━━━━━━━━╯`
        })

    } catch (error) {
        console.error('خطأ في المعالج:', error)
        await conn.sendMessage(m.chat, { text: `❌ خطأ: ${error?.message || 'حدث خطأ، حاول مرة أخرى'}` })
    }
}

handler.help = ['شات']
handler.tags = ['ai']
handler.command = /^(جيبيتي)$/i
handler.limit = 6
handler.premium = false
handler.register = true

export default handler
