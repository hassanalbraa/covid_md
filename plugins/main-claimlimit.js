const rewards = {
  limit: 10,
}
const cooldown = 86400000
let handler = async (m,{ conn} ) => {
  let user = global.db.data.users[m.sender]

  if (user.role === 'Free user' && user.limit >= 30) {
    conn.reply(m.chat, 'لايمكنك جمع المزيد لان اقصى حد للمستخدم العادي هو 30 نقطة', m)
    return
  }

  if (new Date - user.lastclaim < cooldown) throw `لقد قمت بالفعل بالمطالبة بالهدية اليومية! انتظر *${((user.lastclaim + cooldown) - new Date()).toTimeString()}*`
  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    user[reward] += rewards[reward]
    text += `*+${rewards[reward]}* ${reward}\n`
  }
  conn.reply(m.chat, text.trim(), m)
  user.lastclaim = new Date * 1
}

handler.tags = ['main']
handler.help = ['يومي']
handler.command = /^(claimlimit|يومي)$/i

handler.cooldown = cooldown
handler.disable = true

export default handler