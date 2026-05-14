let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let q = m.quoted? m.quoted: m
  let mime = (q.msg || q).mimetype || ''

  if (!/image|video|webp/.test(mime)) {
    return m.reply('رد على صورة، فيديو أو ملصق لإنشاء ملصق.')
  }

  if (/image|video|webp/.test(mime)) {
    // معاملة GIF كفيديوهات (واتساب يرسلها كـ mp4)؛ حماية لعدم وجود بيانات وصفية
    const isVideoLike = /video|gif/.test(mime) || (q.mediaType === 'videoMessage')
    const seconds = Number(q.msg?.seconds || q.seconds || q.duration || 0)
    if (isVideoLike && seconds > 10) {
      return m.reply('يجب أن يكون الفيديو أقل من 10 ثواني.')
    }

    let media = await q.download()
    let exif
    if (text) {
      const [packname, author] = text.split(/[,|\-+&]/)
      // المفاتيح الصحيحة المتوقعة بواسطة writeExif: packName, packPublish
      exif = { packName: packname?.trim() || '', packPublish: author?.trim() || '' }
    }
    return conn.sendSticker(m.chat, media, m, exif)
  }
  return m.reply('أرسل أو رد على وسائط لتحويلها إلى ملصق.')
}

handler.help = ['ملصق']
handler.tags = ['maker']
handler.command = /^s(tic?ker)?(gif)?|ملصق$/i
handler.register = true

export default handler
