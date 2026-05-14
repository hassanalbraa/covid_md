let handler = async (m, { conn, text, participants, isAdmin, isOwner }) => {
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
    m.reply(`${text ? `${text}\n` : ''}┌─「 تاك للكل 」\n` + users.map(v => '│◦❒ @' + v.replace(/@.+/, '')).join`\n` + '\n└────', null, {
        mentions: users
    })
}

handler.help = ['تاك']
handler.tags = ['owner']
handler.command = ['تاك']
handler.owner = true
handler.group = true

export default handler
