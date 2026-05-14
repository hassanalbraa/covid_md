import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [atas, bawah] = text.split('|')
    let q = m.quoted? m.quoted: m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw `رد على صورة بالأمر\n\n${usedPrefix + command} <${atas? atas: 'النص العلوي'}>|<${bawah? bawah: 'النص السفلي'}>`
    if (!/image\/(jpe?g|png)/.test(mime)) throw `_*نوع الملف ${mime} غير مدعوم!*_`
    let img = await q.download()
    let url = await uploadPomf(img)
    let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas? atas: '')}/${encodeURIComponent(bawah? bawah: '')}.png?background=${url}`;
    conn.sendSticker(m.chat, meme, m)
}

handler.help = ['ميم <النص العلوي>|<النص السفلي>']
handler.tags = ['maker']
handler.command = /^(smeme|ميم)$/i

handler.register = true

export default handler
