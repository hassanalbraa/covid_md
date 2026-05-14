import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    try {
        let res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
        let anu = await res.json()
        anu = anu.Infogempa.gempa
        let txt = `
╭━━〔 🌍 *آخر زلزال* 〕━━╮
┃ 📍 *المنطقة:* ${anu.Wilayah}
┃ 📅 *التاريخ:* ${anu.Tanggal}
┃ 🕐 *الوقت:* ${anu.Jam}
┃ ⚠️ *الخطر:* ${anu.Potensi}
┃ 📊 *القوة:* ${anu.Magnitude} ريختر
┃ 📏 *العمق:* ${anu.Kedalaman}
┃ 🌐 *الإحداثيات:* ${anu.Coordinates}
${anu.Dirasakan?.length > 3 ? `┃ 🔔 *أُحسَّ به:* ${anu.Dirasakan}` : ''}
╰━━━━━━━━━━━━━━╯`.trim()
        await conn.sendMessage(m.chat, {
            image: { url: 'https://data.bmkg.go.id/DataMKG/TEWS/' + anu.Shakemap },
            caption: txt
        }, { quoted: m })
    } catch (e) {
        console.log(e)
        m.reply(`❌ حدث خطأ في الميزة`)
    }
}

handler.help = ['زلزال']
handler.tags = ['info']
handler.command = /^(زلزال|gempa)$/i
handler.premium = false
handler.limit = false

export default handler
