import { uploadPomf } from '../lib/uploadImage.js'
import ocrapi from 'ocr-space-api-wrapper'

async function performOCR(url) {
    try {
        return await ocrapi.ocrSpace(url)
    } catch (error) {
        console.error(error)
        return null
    }
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''

        if (!mime) throw `❌ رد على صورة بالأمر ${usedPrefix}${command}`
        if (!/image\/(jpe?g|png)/.test(mime)) throw `❌ نوع الملف ${mime} غير مدعوم`

        let img = await q.download()
        let url = await uploadPomf(img)

        m.reply(wait)

        let maxRetries = 5
        let retryCount = 0
        let hasil

        do {
            hasil = await performOCR(url)
            retryCount++
        } while (!hasil && retryCount < maxRetries)

        if (hasil && hasil.ParsedResults && hasil.ParsedResults.length > 0) {
            let parsedText = hasil.ParsedResults[0].ParsedText;
            await m.reply(`╭━━〔 🔍 *نص الصورة* 〕━━╮\n\n${parsedText}\n\n╰━━━━━━━━━━━━━━╯`);
        } else {
            throw '❌ لا يوجد نص في الصورة'
        }
    } catch (error) {
        console.error(error)
        m.reply(`❌ ${error.message || error}`)
    }
}

handler.help = ['ocr']
handler.tags = ['tools']
handler.command = /^(ocr)$/i

export default handler
