import fetch from 'node-fetch'

let timeout = 60000
let poin = 500

let handler = async (m, { conn, command }) => {

    conn.tebakAin = conn.tebakAin ? conn.tebakAin : {}

    let id = m.chat

    if (id in conn.tebakAin) {
        return conn.reply(m.chat, '❌ لا يزال هناك سؤال قيد اللعب', conn.tebakAin[id].msg)
    }

    let src = await (await fetch('https://github.com/anasmods/Nandimonai/raw/main/game/eye.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]

    let caption = `
*${command.toUpperCase()}*
⏳ الوقت: ${(timeout / 1000).toFixed(0)} ثانية
💰 الجائزة: ${poin} نقاط

❗ اكتب الجواب بسرعة!
`.trim()

    let msg = await conn.sendMessage(m.chat, {
        image: { url: json.img },
        caption
    }, { quoted: m })

    conn.tebakAin[id] = {
        msg,
        json,
        poin,
        timeout: setTimeout(() => {
            if (conn.tebakAin[id]) {
                conn.reply(
                    m.chat,
                    `⌛ انتهى الوقت!\n✅ الإجابة الصحيحة: ${json.name}`,
                    conn.tebakAin[id].msg
                )
                delete conn.tebakAin[id]
            }
        }, timeout)
    }
}

handler.help = ['عين']
handler.tags = ['games']
handler.command = /^عين/i

export default handler