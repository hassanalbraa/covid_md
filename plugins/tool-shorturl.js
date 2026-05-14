import fetch from 'node-fetch'

let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`${usedPrefix}${command} https://example.com/`)

    try {
        const response = await fetch(`https://tr.deployers.repl.co/short?url=${args[0]}`)

        if (response.ok) {
            const data = await response.json()

            const formattedData = `
╭━━〔 🔗 *تقصير الرابط* 〕━━╮
┃ 📎 *الرابط الأصلي:* ${args[0]}
┃ ━━━━━━━━━━━━━━
┃ 🔗 *Bitly:* ${data.bitly}
┃ 🔗 *Isgd:* ${data.isgd}
┃ 🔗 *TinyURL:* ${data.tinyurl}
┃ 🔗 *Vgd:* ${data.vgd}
╰━━━━━━━━━━━━━━╯`.trim();

            m.reply(formattedData)
        } else {
            m.reply('❌ فشل جلب البيانات، حاول مرة أخرى')
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ حدث خطأ، حاول مرة أخرى')
    }
}

handler.help = ['short <رابط>']
handler.tags = ['internet']
handler.command = /^(short|singkatin|singkat|bitly|tinyurl|vgd|ouo|isgd|shortlink|linkshort|قصّر)$/i
handler.register = true

export default handler
