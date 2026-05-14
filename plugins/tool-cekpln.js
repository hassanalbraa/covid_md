import axios from 'axios'

let handler = async (m, { conn, args }) => {
    const id = args[0]
    if (!id) throw '❌ أدخل رقم العداد\nمثال: `.cekpln 1234567890`'

    await conn.sendMessage(m.chat, { text: wait });

    try {
        let res = await axios.get(`${APIs.ryzumi}/api/tool/cek-pln?id=${id}`)
        let result = res.data

        if (!result.success || !result.result) throw '❌ لم يُرجع الـ API بيانات صحيحة'

        const data = result.result
        let text = `
╭━━〔 🔌 *فاتورة الكهرباء* 〕━━╮
┃ 🆔 *رقم المشترك:* ${data.customer_id}
┃ 👤 *الاسم:* ${data.customer_name}
┃ ⚡ *فئة الطاقة:* ${data.power_category}
┃ 📅 *الفترة:* ${data.billing_period}
┃ 🔢 *قراءة العداد:* ${data.meter_reading}
┃ 💰 *الرصيد المستحق:* ${data.outstanding_balance}
┃ 📋 *إجمالي الفواتير:* ${data.total_bills}
╰━━━━━━━━━━━━━━╯`.trim()

        await conn.sendMessage(m.chat, { text });

    } catch (e) {
        await conn.sendMessage(m.chat, { text: `❌ فشل جلب بيانات الكهرباء:\n${e}` });
    }
}

handler.help = ['cekpln <id>']
handler.tags = ['tool']
handler.command = /^(pln|cekpln)$/i
handler.register = true
handler.limit = false

export default handler
