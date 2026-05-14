/*
💎 القسم: [ ميزات المالك ]
📌 الميزة: [ معاينة ]
🏷 النوع: Plugin ESM
♲ الوظيفة: معاينة او تجربة عرض التفعيلات كيف تظهر / وهمي
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/
let handler = async (m, { conn, usedPrefix, command, args: [event], text }) => {
    if (!event) return await conn.reply(m.chat, `مثال:
${usedPrefix + command} welcome @منشن
${usedPrefix + command} bye @منشن
${usedPrefix + command} promote @منشن
${usedPrefix + command} demote @منشن

يجب أن يكون الحدث واحدا من${usedPrefix + command} welcome 9677xxxxxxx`.trim(), m, null, [['Welcome', '#simulate welcome'], ['Bye', '#simulate bye']])

    // Collect targets from mentions or raw numbers, normalize to JIDs
    const rest = text?.slice(event.length).trim() || ''
    const whoFromMention = conn.parseMention(rest)
    const whoFromNumbers = (rest.match(/\b\d{5,16}\b/g) || []).map(v => v + '@s.whatsapp.net')
    let partRaw = [...new Set([...(whoFromMention || []), ...whoFromNumbers])]
    if (!partRaw.length) partRaw = [m.sender]
    const part = await Promise.all(partRaw.map(async j => conn.getJid ? await conn.getJid(j, m.chat) : j))

    let act = false
    m.reply(`جارِ عرض معاينة ${event}...`)
    switch (event.toLowerCase()) {
        case 'add':
        case 'invite':
        case 'welcome':
            act = 'add'
            break
        case 'bye':
        case 'kick':
        case 'leave':
        case 'remove':
            act = 'remove'
            break
        case 'promote':
            act = 'promote'
            break
        case 'demote':
            act = 'demote'
            break
        default:
            return conn.reply(m.chat, 'يجب أن يكون الحدث واحدا من: welcome/bye/promote/demote', m)
    }
    if (act) return conn.participantsUpdate({
        id: m.chat,
        participants: part,
        action: act,
        simulate: true
    })
}
handler.help = ['معاينة <خيار> [رقم]']
handler.tags = ['owner']
handler.rowner = true

handler.command = /^(simulate|simulasi|اختبار|معاينه|معاينة)$/i
export default handler