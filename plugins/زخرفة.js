let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.fancy = conn.fancy ? conn.fancy : {}

    // 1. لو المستخدم أرسل الأمر بدون نص
    if (!text) {
        return m.reply(`*｢ زخارف بوت 𝐂𝐎𝐕𝐈𝐃 ｣*\n\n*يرجى إدخال النص المراد زخرفته*\n*مثال:* ${usedPrefix + command} COVID`)
    }

    const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const fonts = [
        "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔ＶＷＸＹＺ𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯ｗｘ𝐲𝐳",
        "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ",
        "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝒌𝒍𝒎𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇",
        "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛",
        "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝐩𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫",
        "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔫𝔥𝔦𝔧𝔨𝔩𝔪ℼ𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷",
        "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟",
        "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"
    ]

    const transform = (input, styleMap) => {
        const mapArray = Array.from(styleMap)
        return Array.from(input).map(char => {
            const i = normal.indexOf(char)
            return i !== -1 ? mapArray[i] : char
        }).join('')
    }

    // إنشاء "غرفة" زخرفة في الذاكرة بنفس فكرة XO
    let id = m.chat
    conn.fancy[id] = {
        text: text,
        fonts: fonts,
        transform: transform,
        lastMsg: null
    }

    let caption = `*｢ زخارف بوت 𝐂𝐎𝐕𝐈𝐃 ｣*\n\n`
    fonts.forEach((f, i) => {
        caption += `*${i + 1} -* ${transform(text, f)}\n`
    })
    caption += `\n*💡 رِد برقم النوع لنسخه.*`

    let q = await conn.reply(m.chat, caption, m)
    conn.fancy[id].lastMsg = q.key.id
}

handler.before = async function (m) {
    this.fancy = this.fancy ? this.fancy : {}
    let room = this.fancy[m.chat]

    // التحقق: هل يوجد ريبلاي؟ وهل هو على رسالة الزخرفة؟ وهل هو رقم؟
    if (!room || !m.quoted || m.quoted.id !== room.lastMsg || !/^[1-8]$/.test(m.text)) return false

    const index = parseInt(m.text) - 1
    const result = room.transform(room.text, room.fonts[index])

    await this.reply(m.chat, result, m)
    
    // تصفير الغرفة بعد الاختيار (اختياري، لو عايز المستخدم يختار أكتر من مرة شيل السطر الجاي)
    // delete this.fancy[m.chat]
    
    return true
}

handler.command = /^(زخرف|زخرفة|زخرفه)$/i
export default handler
