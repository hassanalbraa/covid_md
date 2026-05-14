import axios from 'axios'

let handler = async (m, { conn, args }) => {
    const noResi = args[0]
    const ekspedisi = args[1] || ''

    if (!noResi) throw '❌ أدخل رقم الشحنة\nمثال: `.cekresi SPXID054330680586 shopee-express`'

    await conn.sendMessage(m.chat, { text: wait });

    try {
        const url = `${APIs.ryzumi}/api/tool/cek-resi?resi=${noResi}${ekspedisi ? `&ekspedisi=${ekspedisi}` : ''}`;
        const res = await axios.get(url);
        const result = res.data;

        if (!result.success || !result.data) throw '❌ رقم الشحنة غير موجود أو خاطئ.';

        const data = result.data;
        const historyText = data.history?.slice(0, 5).map(item => `• ${item.tanggal}\n  ${item.keterangan}`).join('\n\n') || 'لا يوجد سجل.';

        const infoText = `
╭━━〔 📦 *تتبع الشحنة* 〕━━╮
┃ 📦 *رقم الشحنة:* ${data.resi}
┃ 🚚 *الشركة:* ${data.ekspedisi}
┃ 📊 *الحالة:* ${data.status}
┃ 📅 *تاريخ الإرسال:* ${data.tanggalKirim}
┃ 📍 *آخر موقع:* ${data.lastPosition}
╰━━━━━━━━━━━━━━╯

🕐 *آخر التحديثات:*
${historyText}`.trim();

        await conn.sendMessage(m.chat, { text: infoText });

    } catch (e) {
        await conn.sendMessage(m.chat, { text: `❌ فشل التتبع: ${e}` });
    }
}

handler.help = ['cekresi <رقم_الشحنة>']
handler.tags = ['tool']
handler.command = /^(cekresi|resi)$/i
handler.register = true
handler.limit = true

export default handler
