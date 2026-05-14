let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, `❌ مثال: \n.qr مرحبا بالعالم`, m)
    conn.sendFile(m.chat, `https://quickchart.io/qr?size=300&margin=2&text=${encodeURIComponent(text)}`, 'qrcode.png', `🔳 *رمز QR*\n\n${global.wm}`, m)
}

handler.help = ['qr <نص>']
handler.tags = ['tools']
handler.command = /^qr(code)?$/i

export default handler
