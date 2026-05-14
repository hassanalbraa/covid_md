import axios from 'axios'

function fmtNum(n) {
    if (n === null || n === undefined) return '-'
    const v = Number(n)
    return Number.isNaN(v) ? String(n) : v.toLocaleString('ar-SA')
}

let handler = async (m, { conn, text }) => {
    const uid = (text || '').replace(/\D+/g, '')
    if (!uid) throw `❌ أدخل UID صحيح!\nمثال: .genshinstalk 819226311`

    m.reply(wait)

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/stalk/genshin?userId=${uid}`, {
            headers: { accept: 'application/json' }
        })

        if (!data?.meta) throw new Error('❌ البيانات غير موجودة!')

        const meta = data.meta || {}
        const abyss = meta.spiralAbyss || {}
        const theater = meta.theater || {}

        let caption = `
╭━━〔 🎮 *Genshin Impact Stalk* 〕━━╮
┃ 🆔 *UID:* ${meta.uid ?? uid}
┃ 📛 *الاسم:* ${meta.nickname || '-'}
┃ ✍️ *التوقيع:* ${meta.signature || '-'}
┃ 🏆 *المستوى:* ${fmtNum(meta.level)}
┃ 🌍 *مستوى العالم:* ${fmtNum(meta.worldLevel)}
┃ 🏅 *الإنجازات:* ${fmtNum(meta.achievements)}
┣━━━━━━━━━━━━━━
┃ 🌀 *برج اللولب:*
┃ • الطابق/الغرفة: ${fmtNum(abyss.floor)}/${fmtNum(abyss.chamber)}
┃ • النجوم: ${fmtNum(abyss.stars)}
┣━━━━━━━━━━━━━━
┃ 🎭 *المسرح الخيالي:*
┃ • الفصل: ${fmtNum(theater.act)}
┃ • النجوم: ${fmtNum(theater.stars)}
╰━━━━━━━━━━━━━━╯`.trim()

        m.reply(caption)
    } catch (err) {
        m.reply(`❌ ${err.message || 'حدث خطأ داخلي'}`)
    }
}

handler.help = ['genshinstalk <UID>']
handler.tags = ['stalk']
handler.command = /^(genshinstalk|genshin)$/i
handler.register = true
handler.limit = true

export default handler
