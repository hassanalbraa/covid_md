import fetch from 'node-fetch'

let timeout = 60000
let poin = 500

let handler = async (m, { conn, command }) => {
    conn.tebakAnime = conn.tebakAnime ? conn.tebakAnime : {}
    let id = m.chat
    
    // التحقق من وجود جلسة قائمة
    if (id in conn.tebakAnime) {
        conn.reply(m.chat, '❐┃لم يتم الاجابة علي السؤال بعد┃❌ ❯', conn.tebakAnime[id][0])
        throw false
    }

    // روابط خام (Raw) من GitHub لضمان عدم حدوث خطأ "لا يمكن التنزيل"
    let src = [
        {"name": "لوفي", "img": "https://raw.githubusercontent.com/HassanAlbraa/Hassan-AI-Studio/main/images/luffy.jpg"},
        {"name": "زورو", "img": "https://raw.githubusercontent.com/HassanAlbraa/Hassan-AI-Studio/main/images/zoro.jpg"},
        {"name": "ناروتو", "img": "https://raw.githubusercontent.com/HassanAlbraa/Hassan-AI-Studio/main/images/naruto.jpg"},
        {"name": "ساسكي", "img": "https://raw.githubusercontent.com/HassanAlbraa/Hassan-AI-Studio/main/images/sasuke.jpg"}
    ]

    let json = src[Math.floor(Math.random() * src.length)]
    
    let caption = `*｢ مـن هـذه الـشـخـصـيـة؟ 👤 ｣*
❐↞┇الـوقـت⏳↞ ${(timeout / 1000).toFixed(2)} ثانية┇
❐↞┇الـجـائـزة💰↞ ${poin} نقاط┇
➥ 𝐂𝐎𝐕𝐈𝐃 𝗕𝗼𝘁`.trim()

    // محاولة الإرسال باستخدام الطريقة الأكثر استقراراً في Zeno
    let msg = await conn.sendMessage(m.chat, { 
        image: { url: json.img }, 
        caption: caption 
    }, { quoted: m })

    conn.tebakAnime[id] = [
        msg,
        json,
        poin,
        setTimeout(() => {
            if (conn.tebakAnime[id]) {
                conn.reply(m.chat, `❮ ⌛┇انتهي الوقت┇⌛❯\n❐↞┇الاجـابـة✅↞ ${json.name}┇`, conn.tebakAnime[id][0])
                delete conn.tebakAnime[id]
            }
        }, timeout)
    ]
}

handler.help = ['انمي']
handler.tags = ['games']
handler.command = /^انمي/i

export default handler
