import fetch from 'node-fetch'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!args[0]) throw `مثال: ${usedPrefix}${command} ShirokamiRyzen/Nao-MD`
    let [usr, rep] = text.split`/`
    let url = `https://api.github.com/repos/${encodeURIComponent(usr)}/${encodeURIComponent(rep)}/zipball`
    let name = `${encodeURIComponent(rep)}.zip`
    m.reply(`📥 _جارٍ التحميل..._`)
    conn.sendFile(m.chat, url, name, `✅ تم تحميل المستودع: ${text}`, m)
}
handler.help = ['gitclone <username>/<repo>']
handler.tags = ['downloader']
handler.command = /gitclone/i
handler.register = true
handler.limit = false

export default handler
