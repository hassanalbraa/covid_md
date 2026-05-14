let handler = async (m, { conn, text }) => {
    // استخدم try/catch داخلي لمنع انهيار الهاندلر
    try {
        if (!text) return m.reply('❌ التنسيق: .سبام رقم|نص|عدد')
        
        let [nomor, pesan, jumlah] = text.split('|')
        if (!nomor || !pesan) return m.reply('❌ تأكد من وضع العلامة | بين الرقم والنص')

        let cleanNumber = nomor.replace(/[^0-9]/g, '')
        let jid = cleanNumber + '@s.whatsapp.net'
        let count = parseInt(jumlah) || 5

        if (count > 50) return m.reply('⚠️ الحد الأقصى 50')

        await m.reply('🚀 بدأت العملية...')

        for (let i = 0; i < count; i++) {
            await conn.sendMessage(jid, { text: `${pesan}\n\n_${i + 1}_` })
            await new Promise(res => setTimeout(res, 500)) // تأخير لنصف ثانية
        }
        
        return m.reply('✅ انتهى')
    } catch (err) {
        console.error("Spam Error: ", err)
    }
}

handler.help = ['سبام']
handler.tags = ['tools']
handler.command = /^سبام|spam$/i
handler.rowner = true 

export default handler
