// لاحظ: شلنا سطر الـ import fetch خالص عشان ما يعمل Error
let timeout = 30000
let poin = 500

let handler = async (m, { conn, command }) => {
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    
    if (id in conn.tebakbendera) {
        return conn.reply(m.chat, '❐┃لم يتم الاجابة علي السؤال بعد┃❌ ❯', conn.tebakbendera[id][0])
    }

    try {
        // استخدام fetch المدمجة في Node.js مباشرة
        const res = await fetch("https://gist.githubusercontent.com/Kyutaka101/799d5646ceed992bf862026847473852/raw/dcbecff259b1d94615d7c48079ed1396ed42ef67/gistfile1.txt")
        const data = await res.json()
        const json = data[Math.floor(Math.random() * data.length)]
        
        let caption = `🌍 *خمن العلم*
❐↞┇الـوقـت⏳↞ ${(timeout / 1000).toFixed(2)} ثانية ┇
*استخدم انسحب للأنسحاب*
❐↞┇الـجـائـزة💰↞ ${poin} نقاط┇
➥ 𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁
        `.trim()

        let msg = await conn.sendMessage(m.chat, { image: { url: json.img }, caption }, { quoted: m })

        conn.tebakbendera[id] = [
            msg,
            json,
            poin,
            setTimeout(() => {
                if (conn.tebakbendera[id]) {
                    conn.reply(m.chat, `⏰ *أنتهي الوقت*\nالإجابة هي : *${json.name}*`, conn.tebakbendera[id][0])
                    delete conn.tebakbendera[id]
                }
            }, timeout)
        ]
    } catch (e) {
        console.error(e)
        m.reply('*❌ حصل خطأ في جلب البيانات، تأكد من الإنترنت في تيرمكس.*')
    }
}

handler.help = ['علم']
handler.tags = ['games']
handler.command = ['علم', 'country']

export default handler
