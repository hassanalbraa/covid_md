let handler = async (m, { conn, args, command }) => {
	let group = m.chat
        await m.reply('مع السلامة , , ! 👋😃', m.chat,fkontak) 
        await  conn.groupLeave(group)
        }
handler.help = ['اطلع']
handler.tags = ['owner']
handler.command = /^(out|leavegc|اطلع|غادر)$/i

handler.rowner = true

export default handler
