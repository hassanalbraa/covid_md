import fs from 'fs'

var handler = async (m, { conn }) => {
    let totalf = Object.values(global.plugins).filter(v => v.help && v.tags).length;

    await conn.reply(m.chat, `
╭━━〔 📊 *إحصائيات البوت* 〕━━╮
┃ 🔧 *إجمالي الأوامر:* ${totalf}
┃ 🤖 *اسم البوت:* ${global.namebot}
╰━━━━━━━━━━━━━━╯`.trim(), m, {
        contextInfo: {
            externalAdReply: {
                mediaType: 2,
                description: 'إحصائيات',
                title: global.namebot,
                body: 'بوت واتساب ذكي',
                previewType: 0,
                thumbnail: fs.readFileSync("./thumbnail.jpg"),
                sourceUrl: global.sig
            }
        }
    });
}

handler.help = ['totalfitur']
handler.tags = ['info']
handler.command = ['totalfitur']

export default handler
