/*
💎 القسم: [ معلومات المستخدمين ]
📌 الميزة: [ قائمة المميزين ]
🏷 النوع: Plugin ESM
♲ الوظيفة: عرض قائمة المستخدمين المميزين مع وقت انتهاء الاشتراك وتصفح الصفحات
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

let handler = async (m, { conn, args }) => {
  let user = Object.entries(global.db.data.users).filter(user => (user.premiumTime || 0) > 0).map(([key, value]) => {
    return {...value, jid: key }
  })
  let name = 'Premium'
  let fkon = {
    key: { fromMe: false, participant: `${m.sender.split('@')}@s.whatsapp.net`,...(m.chat? { remoteJid: '16500000000@s.whatsapp.net' }: {}) }, message: {
      contactMessage: {
        displayName: `${name}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')}:${m.sender.split('@')}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        verified: true
      }
    }
  }
  let premTime = global.db.data.users[m.sender].premiumTime
  let prem = global.db.data.users[m.sender].premium
  let waktu = clockString(`${global.db.data.users[m.sender].premiumTime - new Date() * 1}`)
  let sortedP = user.map(toNumber('premiumTime')).sort(sort('premiumTime'))
  let page = args && /^\d+$/.test(args)? parseInt(args): 1
  let perPage = 10
  let startIndex = (page - 1) * perPage
  let endIndex = startIndex + perPage
  let usersToShow = sortedP.slice(startIndex, endIndex)
  let totalPages = Math.ceil(sortedP.length / perPage)

  await conn.reply(m.chat, `┌✦ *وقتي المميز:*
┊• *الاسم:* ${conn.getName(m.sender)}
${prem? `┊ *وقت المميز:* ${clockString(global.db.data.users[m.sender].premiumTime - new Date() * 1)}`: '┊ *وقت المميز:* منتهي'}
┗━═┅═━––––––๑

•·–––––––––––––––––––––·•
${usersToShow.map(({ jid, name, premiumTime, registered }, i) => `\n\n┌✦ ${registered? name: conn.getName(jid)}\n┊• wa.me/${jid.split('@')}\n${premiumTime > 0? `┊ *وقت المميز:* ${clockString(premiumTime - new Date() * 1)}`: '┊ *منتهي*'} ┗━═┅═━––––––๑`).join('')}
┗━═┅═━––––––๑

*الصفحة ${page} من ${totalPages}*.`.trim(), fkon)
}

handler.help = ['المميزين']
handler.tags = ['info']
handler.command = /^(listprem|المميزين|قائمةمميز)$/i

export default handler

function clockString(ms) {
  let ye = isNaN(ms)? '--': Math.floor(ms / 31104000000) % 10
  let mo = isNaN(ms)? '--': Math.floor(ms / 2592000000) % 12
  let d = isNaN(ms)? '--': Math.floor(ms / 86400000) % 30
  let h = isNaN(ms)? '--': Math.floor(ms / 3600000) % 24
  let m = isNaN(ms)? '--': Math.floor(ms / 60000) % 60
  let s = isNaN(ms)? '--': Math.floor(ms / 1000) % 60
  return ['┊ ', ye, ' *سنة*\n', '┊ ', mo, ' *شهر*\n', '┊ ', d, ' *يوم*\n', '┊ ', h, ' *ساعة*\n', '┊ ', m, ' *دقيقة*\n', '┊ ', s, ' *ثانية*'].map(v => v.toString().padStart(2, '0')).join('')
}

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
    return {...b[i], [property]: a[property] === undefined? _default: a[property] }
  }
  else return a => a === undefined? _default: a
}
