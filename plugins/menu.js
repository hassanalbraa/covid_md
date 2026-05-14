import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import { platform as getPlatform } from 'os'

const defaultMenu = {
  before: `
┏━━〔 *%me* 〕━━━⬣
┃ 👤 *المستخدم:* %name
┃ 🛡️ *الحالة:* %prems
┃ 🏅 *الرتبة:* %role
┃ 💎 *الماس:* %limit
┃ 🏷️ *المعرف:* %tag
┗━━━━━━━━━━━━━━━⬣

┏━━〔 *إحصائيات النظام* 〕━━━⬣
┃ 🌌 *الوضع:* %mode
┃ 🕒 *الوقت:* %time
┃ 📅 *التاريخ:* %date
┃ 📜 *هجري:* %islamic
┃ ⏳ *التشغيل:* %muptime
┃ 🖥️ *النظام:* %platform
┃ 👥 *المستخدمين:* %rtotalreg
┗━━━━━━━━━━━━━━━⬣

*${ucapan()} %name!*
  `.trimStart(),
  header: '┏━━⬣ *﹝ %category ﹞* ⬣━━┓',
  body: '┃ ⫸ %cmd %isPremium %islimit',
  footer: '┗━━━━━━━━━━━━━━━⬣\n',
  after: ``,
}

let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command }) => {

  let tags = {
    'main': 'القائمة الرئيسية 📜',
    'downloader': 'التحميلات ⬇️',
    'group': 'إدارة المجموعات 👥',
    'tools': 'الأدوات والخدمات 🛠',
    'internet': 'البحث والإنترنت 🪐',
    'maker': 'التحويل والصناعة 💡',
    'anime': 'عالم الأنمي 🦹🏻‍♂️',
    'stalk': 'تتبع الحسابات ↗️',
    'info': 'معلومات البوت 🔎',
    'owner': 'قسم المطور 👑',
  }

  try {
    let mode = global.db.data.settings[conn.user.jid].public ? 'عام 🔓' : 'خاص 🔐'
    let tag = `@${m.sender.split('@')[0]}`
    let d = new Date(new Date + 3600000)
    let locale = 'ar'
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let islamic = Intl.DateTimeFormat('ar-YE-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
    let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })

    let _muptime = process.uptime() * 1000
    let muptime = clockString(_muptime)

    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let name = await conn.getName(m.sender)
    let premium = global.db.data.users[m.sender].premiumTime
    let prems = `${premium > 0 ? 'عضو مميز ✨' : 'عضو عادي'}`
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    let groups = {}
    for (let tag in tags) {
      groups[tag] = help.filter(menu => menu.tags && menu.tags.includes(tag))
    }

    let _text = [
      defaultMenu.before
        .replace(/%me/g, conn.user.name)
        .replace(/%name/g, name)
        .replace(/%prems/g, prems)
        .replace(/%role/g, role)
        .replace(/%limit/g, limit)
        .replace(/%tag/g, tag)
        .replace(/%mode/g, mode)
        .replace(/%time/g, time)
        .replace(/%date/g, date)
        .replace(/%islamic/g, islamic)
        .replace(/%muptime/g, muptime)
        .replace(/%platform/g, getPlatform())
        .replace(/%rtotalreg/g, rtotalreg),
      ...Object.keys(tags).map(tag => {
        return defaultMenu.header.replace(/%category/g, tags[tag]) + '\n' +
          groups[tag].map(menu => {
            return menu.help.map(help => {
              return defaultMenu.body.replace(/%cmd/g, _p + help)
                .replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
                .replace(/%isPremium/g, menu.premium ? 'Ⓟ' : '')
            }).join('\n')
          }).join('\n') + '\n' + defaultMenu.footer
      })
    ].join('\n')

    conn.sendMessage(m.chat, {
      text: _text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "𝐂𝐎𝐕𝐈𝐃 𝐁𝐎𝐓",
          body: "𝐂𝐎𝐕𝐈𝐃 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://ibb.co/XZxMW0yL',
          sourceUrl: 'https://chat.whatsapp.com/xxxxxx',
        }
      }
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, 'عذرًا، حدث خطأ أثناء عرض القائمة ⚠️', m)
    throw e
  }
}

handler.help = ['الاوامر']
handler.tags = ['main']
handler.command = /^(اوامر|الاوامر|menu|help|\?)$/i
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return `${h}س ${m}د ${s}ث`
}

function ucapan() {
  const time = moment.tz('Africa/Cairo').format('HH')
  let res = "ليلة سعيدة 🌙"
  if (time >= 4) res = "صباح الخير ☀️"
  if (time >= 10) res = "نهارك سعيد 🌞"
  if (time >= 15) res = "مساء الخير 🌇"
  if (time >= 18) res = "مساء هادئ 🌙"
  return res
}
