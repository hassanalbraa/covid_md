import { Scrapy } from "../ws/dist/index.mjs";

let handler = async (m, { text, conn }) => {

    // إنشاء ذاكرة للمحادثة لو ما موجودة
    global.chatMemory = global.chatMemory || {}

    const user = m.sender
    const name = m.pushName || "صاحبي"

    // تحسين استلام المدخلات (نص، ريبلاي، أو وصف صورة)
    const input = text || m.quoted?.text || m.quoted?.caption || m.caption

    if (!input) return // إذا مافي نص، ما يعمل حاجة

    if (!global.chatMemory[user]) {
        global.chatMemory[user] = []
    }

    // إضافة رسالة المستخدم للذاكرة
    global.chatMemory[user].push({
        role: "user",
        content: input
    })

    // الاحتفاظ بآخر 10 رسائل فقط لضمان السرعة وعدم استهلاك الرام
    global.chatMemory[user] = global.chatMemory[user].slice(-10)

    // تحويل الذاكرة لنص يفهمه الذكاء الاصطناعي
    const history = global.chatMemory[user]
        .map(v => `${v.role === "user" ? "المستخدم" : "البوت"}: ${v.content}`)
        .join("\n")

    const prompt = `
استخدم اسلوب chat gpt وتعامله نفسه لكن اسمك هو 𝐂𝐎𝐕𝐈𝐃
- استخدم فقط هذه الإيموجي عند الحاجة:
🙂 = صدمة أو استغراب بسيط  
🙈 = خجل  
😂 = ضحك  
😭 = حزن أو مبالغة في البكاء  
😓 = زعل أو تعب  

اسم المستخدم: ${name}

المحادثة السابقة:
${history}
`

    try {
        // تفاعل "تفكير"
        await m.react("💭")

        // طلب الرد من API
        const { data: res } = await Scrapy.ZeroAI(input, prompt)
        let reply = res.answer

        // إضافة رد البوت للذاكرة عشان يفتكره المرة الجاية
        global.chatMemory[user].push({
            role: "assistant",
            content: reply
        })

        // إرسال الرد بتنسيق فخم
        await m.reply(`╭━━〔 🤖 كوفيد AI 〕━━╮\n\n${reply}\n\n╰━━━━━━━━━━━━━━╯`)

        // تفاعل "انتهاء"
        await m.react("✨")

    } catch (err) {
        console.error("خطأ في بوت كوفيد:", err)
        await m.react("❌")
        await m.reply("💔 حصل عكننة في السيرفر، جرب تاني يا حسن.")
    }
}

// الأوامر التي تستدعي البوت
handler.command = /^ai|كوفيد|ذكاء$/i
handler.category = "ai"

export default handler
