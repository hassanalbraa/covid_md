let handler = async (m, { conn, text }) => {
  if (!m.quoted) throw 'رد على الملصق!'
  try {
    let [packname,...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) throw 'رد على ملصق!'
    let img = await m.quoted.download()
    if (!img) throw 'رد على ملصق صحيح!'
    conn.sendSticker(m.chat, img, m, { packname, author })
  } catch (e) {
    console.error(e)
  }
}

handler.help = ['حقوق']
handler.tags = ['maker']
handler.command = /^wm|حقوق|سرقه|سرقة$/i
handler.register = true
handler.premium = true

export default handler
