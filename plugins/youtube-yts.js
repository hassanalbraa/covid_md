import yts from 'yt-search'

let handler = async (m, { conn, text }) => {
    if (!text) throw '❌ ماذا تريد أن تبحث؟'
    await conn.reply(m.chat, global.wait, m)
    let results = await yts(text)
    let tes = results.all
    if (!tes || !tes.length) return m.reply('❌ لا توجد نتائج')
    let teks = results.all.map(v => {
        switch (v.type) {
            case 'video': return `
╭━━〔 🎬 *${v.title}* 〕
┃ 🔗 *الرابط:* ${v.url}
┃ ⏱️ *المدة:* ${v.timestamp}
┃ 📤 *رُفع:* ${v.ago}
┃ 👁️ *المشاهدات:* ${v.views}
╰━━━━━━━━━━━━━`
        }
    }).filter(v => v).join('\n\n')
    conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg', teks, m)
}

handler.help = ['yts <بحث>']
handler.tags = ['tools']
handler.command = /^yts(earch)?$/i
handler.register = true

export default handler
