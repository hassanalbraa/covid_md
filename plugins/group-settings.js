let handler = async (m, { conn, args, usedPrefix, command }) => {
    let isClose = {
        'فتح': 'not_announcement',
        'قفل': 'announcement',
        'open': 'not_announcement',
        'close': 'announcement',
    }[(args[0] || '').toLowerCase()]

    if (!isClose)
        throw `
*مثال :*
  *○ ${usedPrefix + command} قفل*
  *○ ${usedPrefix + command} فتح*
`.trim()

    await conn.groupSettingUpdate(m.chat, isClose)
}

handler.help = ['شات']
handler.tags = ['group']
handler.command = /^(شات)$/i

handler.admin = true
handler.botAdmin = true

export default handler