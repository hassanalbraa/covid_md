export async function before(m) {
    this.reactGame = this.reactGame ? this.reactGame : {}
    let id = m.chat

    if (!(id in this.reactGame)) return !0
    let game = this.reactGame[id]

    // التحقق هل الرسالة هي الإيموجي المطلوب؟
    if (m.text === game.emoji) {
        let user = m.sender
        game.scores[user] = (game.scores[user] || 0) + 1

        // لو المستخدم وصل للنقاط المحددة
        if (game.scores[user] >= game.target) {
            let winnerMention = `@${user.split('@')[0]}`
            let finalMsg = `🎊 *مبروووك يا بطل* ${winnerMention}\n\nلقد وصلت لـ *${game.target}* نقاط وفزت بالمركز الأول في لعبة التفاعل! 🏆\n\n➥ 𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁`
            
            await this.sendMessage(m.chat, { text: finalMsg, mentions: [user] })
            delete this.reactGame[id] // إنهاء اللعبة
        } else {
            // كسب نقطة ولسه اللعبة مستمرة
            let currentPoints = game.scores[user]
            let mention = `@${user.split('@')[0]}`
            
            // تغيير الإيموجي للمرحلة الجاية
            const emojis = ['⚡', '🔥', '🚀', '💎', '🎯', '🦁', '👑', '🦾', '⚽', '⭐']
            game.emoji = emojis[Math.floor(Math.random() * emojis.length)]
            
            let nextMsg = `✅ نقطة لـ ${mention} (رصيدك: ${currentPoints})\n\nالمطلوب الآن: ( ${game.emoji} )`
            await this.sendMessage(m.chat, { text: nextMsg, mentions: [user] })
        }
    }
    return !0
}
