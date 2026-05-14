const anjuran = `*إِنَّ لِلَّهِ تَعَالَى تِسْعَةً وَتِسْعِينَ اسْمًا، مَنْ أَحْصَاهَا دخل الجنة*`

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let data_list = global.asmaulhusna

    // 1. إذا طلب المستخدم الأمر بدون رقم (عرض قائمة الاختيار)
    if (!args[0]) {
        let listText = `✨ *قائمة أسماء الله الحسنى* ✨\n\n`
        
        // تقسيم الأسماء لمجموعات لسهولة القراءة
        data_list.forEach((v, i) => {
            listText += `${v.index}. ${v.arabic.replace('الاسم :', '')}  `
            if ((i + 1) % 3 === 0) listText += '\n' // كل 3 أسماء في سطر
        })

        listText += `\n\n*💡 للاختيار ومعرفة المعنى، أكتب:* \n${usedPrefix + command} [رقم الاسم]`
        listText += `\n\n${anjuran}`
        
        return m.reply(listText)
    }

    // 2. إذا اختار المستخدم رقماً
    let index = parseInt(args[0])
    if (isNaN(index) || index < 1 || index > 99) {
        throw `*❌ اختيار خاطئ!* الرجاء اختيار رقم بين 1 و 99.`
    }

    let item = data_list.find(v => v.index === index)
    if (!item) throw 'الاسم غير موجود'

    let response = `
📖 *تفاصيل الاسم الجليل* 📖

✨ *${item.arabic}*
🔍 *${item.translation_id}*

📌 الرقم: [ ${item.index} ]`.trim()

    // يمكنك إضافة تفاعل (Reaction) عند الاختيار
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })
    
    m.reply(response)
}

handler.help = ['الاسماء']
handler.tags = ['islam']
handler.command = /^(أسماء_الله|أسماء|الأسماء|الاسماء)$/i

export default handler
