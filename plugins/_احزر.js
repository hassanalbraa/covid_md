import similarity from 'similarity'
const threshold = 0.72

export async function before(m) {
    let id = m.chat
    
    // 1. تجاهل الرسايل العادية (لازم يكون ريبلاي على البوت)
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text) return !0

    // 2. قائمة بأسماء الألعاب اللي عندك في البوت (تأكد من الأسماء في ملفات الألعاب)
    // أضف أي لعبة جديدة هنا في المصفوفة دي
    const gameTypes = ['tebakAin', 'tebakbendera', 'tebakkimia', 'tebaksholawat', 'tebaktebakan', 'tebaklirik', 'tebaklagu']
    
    // 3. البحث عن أي لعبة نشطة في هذا الشات
    let activeGame = null
    for (let type of gameTypes) {
        if (this[type] && this[type][id]) {
            activeGame = { type, data: this[type][id] }
            break
        }
    }

    // 4. لو ما لقى أي لعبة نشطة، يسكت تماماً
    if (!activeGame) return !0

    // 5. التحقق من إن الرد على نفس رسالة السؤال
    if (m.quoted.id == activeGame.data[0].id) {
        let isSurrender = /^(انسحب|استسلم)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(activeGame.data[3])
            delete this[activeGame.type][id]
            return this.reply(m.chat, '*طلع فاشل و استسلم :( !*', m)
        }
        
        let json = JSON.parse(JSON.stringify(activeGame.data[1]))
        let answer = (json.name || json.jawaban || "").toLowerCase().trim()
        let userTyped = m.text.toLowerCase().trim()

        if (userTyped == answer) {
            // إجابة صحيحة (لكل الألعاب)
            global.db.data.users[m.sender].exp += activeGame.data[2]
            this.reply(m.chat, `*❐┃اجـابـة صـحـيـحـة┃✅ ❯*\n\n*❐↞┇الـجـائـزة💰↞${activeGame.data[2]} نقطه*`, m)
            clearTimeout(activeGame.data[3])
            delete this[activeGame.type][id]
        } else if (similarity(userTyped, answer) >= threshold) {
            m.reply(`*لقد كنت علي وشك النجاح!*`)
        } else {
            // إجابة خاطئة
            this.reply(m.chat, `❐┃اجـابـة خـاطـئـة┃❌ ❯`, m)
        }
    }
    return !0
}
export const exp = 0
