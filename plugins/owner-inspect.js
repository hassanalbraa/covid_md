import util from 'util'

export const handler = async (m, { conn }) => {
  try {

    const key = m.key || {}

    const info = {
      chat: m.chat,
      isGroup: m.isGroup,
      fromMe: m.fromMe,
      sender: m.sender,
      pushName: m.pushName || null,
      mtype: m.mtype,

      key: {
        id: key.id || null,
        remoteJid: key.remoteJid || m.chat,
        fromMe: key.fromMe,
        participant: key.participant || null,
      },

      decodedSender: m.sender ? conn.decodeJid(m.sender) : null,

      quoted: m.quoted ? {
        id: m.quoted.id || null,
        chat: m.quoted.chat || null,
        sender: m.quoted.sender || null,
        decodedSender: m.quoted.sender ? conn.decodeJid(m.quoted.sender) : null
      } : null,

      hasQuoted: !!m.quoted,
      mentionedJid: m.mentionedJid || [],
      timestamp: m.messageTimestamp || null
    }

    const summary = `
📩 Chat: ${info.chat}
👥 Group: ${info.isGroup}
👤 Sender: ${info.sender}
🔓 Decoded: ${info.decodedSender}
💬 Type: ${info.mtype}
🆔 Msg ID: ${info.key.id}
🔁 Quoted: ${info.hasQuoted}
`.trim()

    const detailed = util.inspect(info, {
      depth: 3,
      colors: false,
      compact: false
    })

    await m.reply(summary + '\n\n--- FULL DEBUG ---\n' + detailed)

  } catch (e) {
    await m.reply('❌ Error:\n' + (e?.stack || e))
  }
}

handler.command = /^(inspect|props|تفاصيل|debug)$/i
handler.owner = false

export default handler