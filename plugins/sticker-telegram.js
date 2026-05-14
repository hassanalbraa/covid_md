import fetch from "node-fetch"

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `مثال:\n${usedPrefix + command} https://t.me/addstickers/اسم_الملصق`
    if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) throw `❌ الرابط غير صحيح`

    let apiUrl = `${APIs.ryzumi}/api/image/sticker-tele?url=${encodeURIComponent(args[0])}`
    let res = await fetch(apiUrl)
    if (!res.ok) throw `❌ خطأ: ${res.status}`

    let json = await res.json()
    let stickers = json.stickers?.stickers || []
    if (!stickers.length) throw `❌ لم يتم العثور على ملصقات`

    m.reply(`📦 *إجمالي الملصقات:* ${stickers.length}\n⏳ جارٍ الإرسال...`)

    for (let s of stickers) {
        if (!s.is_animated && s.image_url) {
            try {
                let imgRes = await fetch(s.image_url)
                conn.sendSticker(m.chat, imgRes, m)
                await delay(5000)
            } catch (e) {
                console.error(`❌ فشل معالجة ملصق: ${e}`)
            }
        }
    }

    m.reply('✅ *تم إرسال جميع الملصقات*')
}

handler.help = ['stickertele']
handler.tags = ['maker']
handler.command = /^(stic?kertele(gram)?)$/i
handler.limit = 15
handler.register = true

export default handler

const delay = time => new Promise(res => setTimeout(res, time))
