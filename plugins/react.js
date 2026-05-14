let handler = m => m

global.db.data.settings.chosenEmoji =
  global.db.data.settings.chosenEmoji || '✨'

const normalize = (jid = '') => jid.replace(/\D/g, '')

handler.all = async function (m) {
    if (!m || !m.message) return

    const text = (m.text || m.caption || '').trim()

    global.db.data.users = global.db.data.users || {}
    const users = global.db.data.users

    // 💎 تحديد البريميم
    const isPremium = users[m.sender]?.premium === true

    const senderNumber = normalize(m.sender)

    // أمر الرياكت
    if (text.startsWith('.رياكت')) {

        if (!isPremium) return // ❌ فقط بريميم

        const args = text.split(' ')
        const emoji = args[1]

        if (m.quoted) {
            await this.sendMessage(m.chat, {
                react: {
                    text: emoji || global.db.data.settings.chosenEmoji,
                    key: m.quoted.key
                }
            })

            if (emoji) global.db.data.settings.chosenEmoji = emoji
            return
        }

        if (emoji) {
            global.db.data.settings.chosenEmoji = emoji
            await this.sendMessage(m.chat, {
                text: `💎 تم ضبط الإيموجي لـ: ${global.db.data.settings.chosenEmoji}`
            }, { quoted: m })
        }

        return
    }

    // 💎 تفاعل تلقائي للبريميم فقط
    if (isPremium) {
        try {
            await this.sendMessage(m.chat, {
                react: {
                    text: global.db.data.settings.chosenEmoji,
                    key: m.key
                }
            })
        } catch (e) {}
    }
}

export default handler