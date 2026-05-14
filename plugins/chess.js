import { Chess } from 'chess.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.chess = conn.chess ? conn.chess : {}
    let room = conn.chess[m.chat]

    // 1. بدء اللعبة
    if (command === 'chess' || command === 'شطرنج') {
        if (room) return m.reply('هناك مباراة قائمة بالفعل! أرسل "استسلام" لإنهاء المباراة.')
        
        const game = new Chess()
        conn.chess[m.chat] = {
            game: game,
            p1: m.sender,
            p2: 'computer'
        }
        
        // جلب الصورة من الـ API عبر الـ FEN الابتدائي
        let fen = game.fen()
        let boardUrl = `https://www.chess.com/dynboard?fen=${encodeURIComponent(fen)}&board=green&piece=neo&size=3`
        
        return conn.sendFile(m.chat, boardUrl, 'chess.png', `🏁 *بدأت مباراة الشطرنج*\n\nدورك يا بطل (الأبيض).\nاكتب: *.move* ثم الحركة (مثال: .move e4)`, m)
    }

    // 2. تنفيذ حركة
    if (command === 'move' || command === 'تحرك') {
        if (!room) return m.reply('لا توجد مباراة قائمة. ابدأ بـ .chess')
        if (m.sender !== room.p1) return m.reply('عذراً، هذا ليس دورك!')

        try {
            const move = room.game.move(text)
            if (move === null) return m.reply('❌ حركة غير قانونية! استخدم الصيغة العالمية (e4, Nf3, d5)')

            // حركة البوت (ذكاء اصطناعي بسيط - يختار حركة عشوائية قانونية)
            if (!room.game.isGameOver()) {
                const moves = room.game.moves()
                const botMove = moves[Math.floor(Math.random() * moves.length)]
                room.game.move(botMove)
                m.reply(`حركتك: *${text}*\nحركة البوت: *${botMove}*`)
            }

            let fen = room.game.fen()
            // إنشاء رابط الصورة الجديد بعد التحركات
            let boardUrl = `https://www.chess.com/dynboard?fen=${encodeURIComponent(fen)}&board=green&piece=neo&size=3`
            
            if (room.game.isGameOver()) {
                let status = room.game.isCheckmate() ? 'كش ملك! 🏁' : 'تعادل!'
                delete conn.chess[m.chat]
                return conn.sendFile(m.chat, boardUrl, 'chess.png', `🏁 *انتهت المباراة*\nالنتيجة: ${status}`, m)
            }

            // إرسال صورة الرقعة المحدثة
            await conn.sendFile(m.chat, boardUrl, 'chess.png', `اكتب .move للحركة التالية...`, m)

        } catch (e) {
            m.reply('حدث خطأ! تأكد من كتابة الحركة بشكل صحيح (مثلاً e2e4 أو e4)')
        }
    }

    // 3. الاستسلام
    if (command === 'استسلام') {
        if (!room) return m.reply('لا توجد مباراة أصلاً!')
        delete conn.chess[m.chat]
        m.reply('🏳️ تم إنهاء المباراة.')
    }
}

handler.command = /^(chess|شطرنج|move|تحرك|استسلام)$/i
export default handler
