/*
💎 القسم: [ ميزات المجتمع ]
📌 الميزة: [ سري ]
🏷 النوع: Plugin ESM
♲ الوظيفة: إرسال رسائل مصارحة مجهولة مع دعم الوسائط للمستخدمين
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.menfess = conn.menfess || {}

  if (!text) throw `*كيفية الاستخدام :*\n\n${usedPrefix + command} رقم|اسم المرسل|الرسالة\n\n*ملاحظة:* تقدر تخلي اسم المرسل مجهولاً.\n\n*مثال:* ${usedPrefix + command} ${m.sender.split('@')[0]}|عابرسبيل|السلام عليكم.`
  let [jid, name, pesan] = text.split('|')
  if (!jid || !name || !pesan) throw `*كيفية الاستخدام :*\n\n${usedPrefix + command} الرقم|اسم المرسل|الرسالة\n\n*مثال:* ${usedPrefix + command} ${m.sender.split('@')[0]}|انس|مرحبا.`

  jid = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  let data = (await conn.onWhatsApp(jid))[0] || {}
  if (!data.exists) throw 'الرقم غير مسجل على الواتساب.'
  if (jid === m.sender) throw 'لا يمكنك إرسال رسائل سرية لنفسك ☻.'

  let mf = Object.values(conn.menfess).find(v => v.status === true)
  if (mf) return !0

  let id = Date.now()
  let teks = `مرحبًا، لقد تلقيت رسالة سرية..\n\nمن: *${name}*\nالرسالة:\n${pesan}\n\nهل تريد الرد على هذه الرسالة؟ اكتب رسالتك وأرسلها. سأرسلها لك. *${name}*.`.trim()

  // cek media (reply / lampiran)
  let q = m.quoted ? m.quoted : m
  let mediaUrl = null
  if (q && typeof q.download === 'function') {
    try {
      let buf = await q.download()
      if (buf && Buffer.isBuffer(buf)) {
        mediaUrl = await uploadPomf(buf)
      }
    } catch {}
  }

  if (mediaUrl) {
    await conn.sendMessage(jid, {
      image: { url: mediaUrl },
      caption: teks,
      contextInfo: {
        externalAdReply: {
          title: 'M E N F E S S',
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIyz1dMPkZuNleUyfXPMsltHwKKdVddTf4-A&usqp=CAU',
          sourceUrl: ''
        }
      }
    })
  } else {
    await conn.sendMessage(jid, {
      text: teks,
      contextInfo: {
        externalAdReply: {
          title: 'M E N F E S S',
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIyz1dMPkZuNleUyfXPMsltHwKKdVddTf4-A&usqp=CAU',
          sourceUrl: ''
        }
      }
    })
  }

  m.reply('تم إرسال الرسالة السرية بنجاح.')
  conn.menfess[id] = {
    id,
    dari: m.sender,
    nama: name,
    penerima: jid,
    pesan,
    status: false
  }
  return !0
}

handler.tags = ['سرية']
handler.help = ['mfs']
handler.command = /^(mfs|سري|سرية|سرية)$/i

handler.register = true
handler.private = true
handler.limit = 2

export default handler
