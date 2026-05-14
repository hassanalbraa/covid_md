let handler = async (m, { conn, args, usedPrefix, command }) => {

    if (!args[0]) {
        throw `اكتب الاسم الجديد\n\nمثال:\n${usedPrefix + command} 𝐂𝐎𝐕𝐈𝐃`
    }

    try {
        await conn.groupUpdateSubject(m.chat, args.join(" "))
        m.reply('✅ تم تغيير اسم القروب')
    } catch (e) {
        console.log(e)
        m.reply('❌ فشل تغيير اسم القروب')
    }
}

handler.help = ['نيم <اسم جديد>']
handler.tags = ['group']
handler.command = /^نيم$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler