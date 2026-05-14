/**
 * سكريبت لعبة XO المطور بذكاء اصطناعي بسيط
 * تم التعديل بواسطة: Gemini
 * المالك: حسن
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.xo = conn.xo ? conn.xo : {}

    // 1. أمر الاستسلام لتصفير الذاكرة
    if (text === 'استسلام') {
        let room = Object.values(conn.xo).find(room => [room.p1, room.p2].includes(m.sender))
        if (!room) return m.reply('❌ ما عندك مباراة شغالة حالياً.')
        delete conn.xo[room.id]
        return m.reply('🏳️ تم الانسحاب وتصفير الغرفة. تقدر تبدأ من جديد.')
    }

    // 2. التحقق من وجود مباراة قائمة للمستخدم
    if (Object.values(conn.xo).find(room => [room.p1, room.p2].includes(m.sender))) {
        return m.reply(`⚠️ أنت في مباراة بالفعل! أرسل *${usedPrefix + command} استسلام* عشان تبدأ غيرها.`)
    }

    // 3. تحديد الخصم
    let opponent = 'bot'
    if (m.quoted) {
        opponent = m.quoted.sender 
    } else if (m.mentionedJid && m.mentionedJid[0]) {
        opponent = m.mentionedJid[0] 
    }
    
    // منع اللعب مع النفس
    if (opponent === m.sender) return m.reply('❌ ما ينفع تلعب مع نفسك يا حسن!')

    let room = {
        id: 'xo-' + (+new Date),
        p1: m.sender,
        p2: opponent,
        board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        turn: m.sender,
        state: 'PLAYING'
    }

    conn.xo[room.id] = room
    
    let cap = `🎮 *تحدي XO جديد (نسخة الذكاء)*\n\n`
    cap += `❌ اللاعب 1: @${m.sender.split('@')[0]}\n`
    cap += `⭕ اللاعب 2: ${opponent === 'bot' ? '🤖 البوت (ذكي)' : '@' + opponent.split('@')[0]}\n\n`
    cap += renderBoard(room.board)
    cap += `\n\nالدور عند: @${room.turn.split('@')[0]}\n`
    cap += `العب بإرسال رقم الخانة (1-9).`
    
    conn.reply(m.chat, cap, m, { mentions: [m.sender, opponent].filter(v => v !== 'bot') })
}

handler.before = async function (m) {
    this.xo = this.xo ? this.xo : {}
    let room = Object.values(this.xo).find(room => room.state === 'PLAYING' && [room.p1, room.p2].includes(m.sender))
    
    if (!room || !/^[1-9]$/.test(m.text)) return false

    // التأكد من الدور
    if (m.sender !== room.turn) return true 

    let index = parseInt(m.text) - 1
    if (room.board[index] !== 0) {
        m.reply('🚫 الخانة محجوزة!')
        return true
    }

    // تنفيذ حركة اللاعب (X)
    room.board[index] = (m.sender === room.p1) ? 1 : 2
    
    // فحص الفوز أو التعادل بعد حركة اللاعب
    let win = checkWinner(room.board)
    if (win || !room.board.includes(0)) return finish(this, m, room, win)

    // منطق ذكاء البوت (O)
    if (room.p2 === 'bot') {
        let empty = room.board.map((v, i) => v === 0 ? i : null).filter(v => v !== null)
        let botMove = -1

        // 1. الهجوم: هل يمكن للبوت الفوز الآن؟
        for (let i of empty) {
            let copy = [...room.board]
            copy[i] = 2
            if (checkWinner(copy) === 2) { botMove = i; break; }
        }

        // 2. الدفاع: هل سيفوز حسن في حركته القادمة؟ (سد الخانة)
        if (botMove === -1) {
            for (let i of empty) {
                let copy = [...room.board]
                copy[i] = 1
                if (checkWinner(copy) === 1) { botMove = i; break; }
            }
        }

        // 3. السيطرة: اختيار المنتصف إذا كان فارغاً
        if (botMove === -1 && empty.includes(4)) botMove = 4

        // 4. عشوائي: إذا لم يجد خياراً أفضل
        if (botMove === -1) botMove = empty[Math.floor(Math.random() * empty.length)]

        // تنفيذ حركة البوت
        room.board[botMove] = 2
        
        let winBot = checkWinner(room.board)
        if (winBot || !room.board.includes(0)) return finish(this, m, room, winBot)
        
        m.reply(renderBoard(room.board))
    } else {
        // تبديل الدور في حال كان الخصم بشرياً
        room.turn = (m.sender === room.p1) ? room.p2 : room.p1
        m.reply(`تحركت!\n\n${renderBoard(room.board)}\n\nالدور عند: @${room.turn.split('@')[0]}`, null, { mentions: [room.turn] })
    }

    return true
}

handler.command = /^(xo|اكس)$/i
export default handler

// --- الوظائف المساعدة ---

function renderBoard(board) {
    let b = board.map(v => v === 1 ? '❌' : v === 2 ? '⭕' : '⬜')
    return `┌───┬───┬───┐
│  ${b[2]}  │  ${b[1]}  │  ${b[0]}  │
├───┼───┼───┤
│  ${b[5]}  │  ${b[4]}  │  ${b[3]}  │
├───┼───┼───┤
│  ${b[8]}  │  ${b[7]}  │  ${b[6]}  │
└───┴───┴───┘`.trim()
}

function checkWinner(b) {
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    for (let [a, b1, c] of wins) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a]
    }
    return null
}

async function finish(conn, m, room, win) {
    let res = win === 1 ? '🎉  فزت على البوت.' : win === 2 ? (room.p2 === 'bot' ? '🤖 هاردلك.. البوت غلبك!' : '🎉 فاز اللاعب ⭕!') : '🤝 تعادل!'
    await m.reply(`🏁 *انتهت المباراة*\n\n${res}\n\n${renderBoard(room.board)}`)
    delete conn.xo[room.id]
    return true
}
