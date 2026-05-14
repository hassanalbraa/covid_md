import { randomBytes } from 'crypto'

let handler = async (m, { conn, text }) => {
  let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0])
  let cc = text ? m : m.quoted ? await m.getQuotedObj() : false || m
  let teks = text ? text : cc.text
  conn.reply(m.chat, `📢 _جارٍ إرسال البث إلى ${groups.length} مجموعة..._`, m)
  for (let id of groups) await conn.copyNForward(id, conn.cMod(m.chat, cc, `${htki} *📣 بث للمجموعات* ${htka}\n` + teks), true).catch(_ => _)
  m.reply('✅ تم إرسال البث لجميع المجموعات')
}
handler.help = ['بث_جماعي', 'bcgc'].map(v => v + ' <نص>')
handler.tags = ['owner']
handler.command = /^(broadcast|bc)(group|grup|gc)|بث_جماعي$/i
handler.owner = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)
