let handler = async (m, { conn, text, participants }) => {
    const fallbackText = (
        m.quoted?.text ||
        m.quoted?.caption ||
        m.quoted?.message?.extendedTextMessage?.text ||
        m.quoted?.message?.conversation || ''
    ).trim()
    const msgText = (text || '').trim() || fallbackText
    if (!msgText) throw '❌ أدخل النص بعد الأمر أو رد على رسالة نصية'

    const fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Bot;;;\nFN:Bot\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Phone\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    }

    await conn.sendMessage(
        m.chat,
        { text: msgText, mentions: participants.map(a => a.id) },
        { quoted: fkontak }
    )
}

handler.help = ['هايدتاق <نص>']
handler.tags = ['group']
handler.command = /^(هايدتاق|hidetag|منشن_خفي)$/i
handler.admin = true
handler.group = true
handler.botAdmin = false

export default handler
