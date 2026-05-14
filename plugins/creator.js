import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let pp = await conn.profilePictureUrl(who).catch(_ => global.pic)
    let name = await conn.getName(who)

    const sentMsg = await conn.sendContactArray(m.chat, [
        [`${nomorown}`, `${await conn.getName(nomorown + '@s.whatsapp.net')}`, `💌 مطور البوت`, `مطور ومبرمج`, ``, `🇸🇩 السودان`, `📍 https://wa.me/${nomorown}`, `👤 مالك البوت`],
        [`${conn.user.jid.split('@')[0]}`, `${await conn.getName(conn.user.jid)}`, `🤖 بوت واتساب`, `📵 لا تزعجني أو تتصل بي 😢`, ``, `🌍 عالمي`, `📍 ${global.sgw}`, `بوت ذكي جاهز لخدمتك`]
    ], m)
    await m.reply(`مرحبا @${m.sender.split(`@`)[0]} 👋\nهذا مطوري، تواصل معه بأدب 😊`, null, { mentions: [m.sender] })
}
handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(المطور|المالك)$/i

export default handler
