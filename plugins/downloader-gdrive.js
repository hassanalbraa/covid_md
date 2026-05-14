import axios from 'axios'

let handler = async (m, { conn, args }) => {
    if (!(args[0] || '').match(/([\w-]){33}|([\w-]){19}/)) throw '❌ أدخل رابط Google Drive صحيح'

    const someincludes = (data, id) => {
        let res = data.find(el => id.includes(el))
        return res ? true : false
    }

    try {
        const url = `${APIs.ryzumi}/api/downloader/gdrive?url=${encodeURIComponent(args[0])}`
        const { data: res } = await axios.get(url)

        if (res.fileSize.slice(-2) == 'GB')
            return m.reply(`❌ الملف كبير جداً (${res.fileSize}) - لا يمكن إرساله`)
        if (!someincludes(['kB', 'KB'], res.fileSize.slice(-2)) && parseInt(res.fileSize) > 500)
            return m.reply(`❌ حجم الملف: ${res.fileSize}\nلا يمكن الإرسال - الحد الأقصى 500 MB`)

        let txt = `╭━━〔 ⬇️ *جارٍ التحميل* 〕━━╮\n`
        txt += `┃ 📄 *الاسم:* ${res.fileName}\n`
        txt += `┃ 📦 *الحجم:* ${res.fileSize}\n`
        txt += `┃ 🗂️ *النوع:* ${res.mimetype}\n`
        txt += `╰━━━━━━━━━━━━━━╯`
        await m.reply(txt)

        if (!res.downloadUrl) throw '❌ رابط التحميل غير متاح'
        await conn.sendFile(m.chat, res.downloadUrl, res.fileName, res.fileName, m)
    } catch (e) {
        console.log(e)
        throw '❌ البوت لا يملك صلاحية الوصول لهذا الملف في Google Drive'
    }
}

handler.help = ['gdrive'].map(v => v + ' <رابط>')
handler.tags = ['downloader']
handler.command = /^(gdrive)$/i
handler.limit = true
handler.register = true

export default handler
