import axios from 'axios'

let handler = async (m, { conn, args }) => {
    const userId = args[0]
    if (!userId) throw '❌ أدخل معرف المستخدم'

    let { key } = await conn.sendMessage(m.chat, { text: "🔍 _جارٍ جلب بيانات الحساب..._" })

    try {
        let res = await axios.get(`${APIs.ryzumi}/api/stalk/freefire?userId=${userId}`)
        let result = res.data

        if (!result.name) throw '❌ لم يُرجع الـ API بيانات صحيحة'

        let equippedItemsText = ''
        if (result.equippedItems && Array.isArray(result.equippedItems)) {
            equippedItemsText = result.equippedItems.map((item, index) => `${index + 1}. ${item.name}`).join('\n')
        }

        let text = `
╭━━〔 🎮 *Free Fire - بيانات اللاعب* 〕━━╮
┃ 👤 *الاسم:* ${result.name}
┃ 💬 *البايو:* ${result.bio}
┃ ❤️ *الإعجابات:* ${result.like}
┃ 🏆 *المستوى:* ${result.level}
┃ 💫 *الخبرة:* ${result.exp}
┃ 🌍 *المنطقة:* ${result.region}
┃ 🎖️ *درجة الشرف:* ${result.honorScore}
┃ 🏅 *رتبة BR:* ${result.brRank} (${result.brRankPoint})
┃ 📅 *أُنشئ:* ${result.accountCreated}
┃ 🕐 *آخر دخول:* ${result.lastLogin}
┃ 🎯 *الوضع المفضل:* ${result.preferMode}
┃ 🗣️ *اللغة:* ${result.language}
┣━━━━━━━━━━━━━━
┃ 🐾 *الحيوان الأليف:* ${result.petInformation.name}
┃ ⭐ *مستوى الحيوان:* ${result.petInformation.level}
┣━━━━━━━━━━━━━━
┃ 🎒 *العتاد المجهز:*
┃ ${equippedItemsText}
╰━━━━━━━━━━━━━━╯`.trim()

        await conn.sendMessage(m.chat, { text, edit: key })
    } catch (e) {
        await conn.sendMessage(m.chat, { text: `❌ خطأ: ${e}`, edit: key })
    }
}

handler.help = ['ffstalk <ID>']
handler.tags = ['stalk']
handler.command = /^(ffstalk|freefireinfo)$/i
handler.register = true
handler.limit = true

export default handler
