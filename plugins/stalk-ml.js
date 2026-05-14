import axios from 'axios'

let handler = async (m, { conn, args }) => {
    const userId = args[0]
    const zoneId = args[1]

    if (!userId) throw '❌ أدخل معرف المستخدم'
    if (!zoneId) throw '❌ أدخل معرف السيرفر'

    let { key } = await conn.sendMessage(m.chat, { text: "🔍 _جارٍ جلب بيانات الحساب..._" });

    try {
        let res = await axios.get(`${APIs.ryzumi}/api/stalk/mobile-legends?userId=${userId}&zoneId=${zoneId}`)
        let result = res.data

        if (!result.success) throw '❌ لم يُرجع الـ API بيانات صحيحة'

        let text = `
╭━━〔 🎮 *Mobile Legends Stalk* 〕━━╮
┃ 👤 *الاسم:* ${result.username}
┃ 🌍 *المنطقة:* ${result.region}
╰━━━━━━━━━━━━━━╯`.trim()

        await conn.sendMessage(m.chat, { text, edit: key });
    } catch (e) {
        await conn.sendMessage(m.chat, { text: `❌ خطأ: ${e}`, edit: key });
    }
}

handler.help = ['mlstalk <ID> <ZoneID>']
handler.tags = ['stalk']
handler.command = /^(stalkml|mlstalk)$/i
handler.register = true
handler.limit = true

export default handler
