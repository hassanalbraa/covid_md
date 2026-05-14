import { createHash } from 'crypto'

let handler = async function (m, { usedPrefix }) {
  let user = global.db.data.users[m.sender]

  if (!user.registered) throw `❌ لم تقم بالتسجيل بعد.\nسجّل أولاً عبر: *${usedPrefix}تسجيل اسم.عمر*`

  let sn = createHash('md5').update(m.sender).digest('hex')

  // صياغة التاريخ بشكل عربي (يوم/شهر/سنة - ساعة:دقيقة)
  let date = new Date(user.regTime)
  let regDate = `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')
  }/${date.getFullYear()} - ${
    date.getHours().toString().padStart(2, '0')
  }:${date.getMinutes().toString().padStart(2, '0')}`

  m.reply(`
━━━━━━━━━━━━━━━
📌 *معلوماتك:*
━━━━━━━━━━━━━━━
👤 الاسم : ${user.name}
🎂 العمر : ${user.age} سنة
🗓️ تاريخ التسجيل : ${regDate}
🔑 الرقم التسلسلي :
${sn}
━━━━━━━━━━━━━━━
  `.trim())
}

handler.tags = ['main']
handler.help = ['تسجيلي']
handler.command = /^(معلوماتي|تسجيلي|تسلسلي)$/i

export default handler

/* هذا الاساسي شغال بس يلا كان محفوظ ب اسم main-ceksn
************************************ 
import { createHash } from 'crypto'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix }) {
  let sn = createHash('md5').update(m.sender).digest('hex')

m.reply(`*SN:* ${sn}`)
}

handler.help = ['ceksn']
handler.tags = ['xp']
handler.command = /^(ceksn)$/i
handler.register = true
export default handler
*/