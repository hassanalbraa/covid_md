// كود سبام بلاغات الأرقام - نظام 𝐂𝐎𝐕𝐈𝐃 الصافي ☣️

let handler = async (m, { conn, text }) => {
    const args = text.split(/\s+/);
    if (args.length < 2) return m.reply("⚠️ *يا حسن الطريقة كدة:* .بلاغ_رقم 249xxxxxxx 15");

    const phone = args[0].replace(/[^0-9]/g, ''); // تنظيف الرقم
    const count = parseInt(args[1]);

    if (!phone || isNaN(count)) return m.reply("❌ *تأكد من كتابة الرقم والعدد صح يا حسن!*");

    await m.reply(`☣️ *بدء الهجوم المكثف (𝐂𝐎𝐕𝐈𝐃)* \n🎯 *الهدف:* ${phone}\n🔢 *الطلبات:* ${count}`);

    try {
        for (let i = 0; i < count; i++) {
            // هنا بنبعت الرقم للبوت اللي إنت شغال بيه حالياً
            // الكود بيبعت الرقم كرسالة عادية للبوت المستهدف
            await conn.sendMessage(m.chat, { text: `.تلي ${phone}` }, { quoted: m });
            
            // تأخير نص ثانية بين كل بلاغ عشان الواتساب ميدهكش بلوك
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return m.reply(`✅ *تم قصف الرقم بنجاح يا حسن!* \nأرسلنا ${count} بلاغ لنظام 𝐂𝐎𝐕𝐈𝐃.`);

    } catch (e) {
        m.reply("❌ *حصلت مشكلة في القصف:* " + e.message);
    }
};

handler.help = ["بلاغ_رقم"];
handler.tags = ["owner"];
handler.command = /^(بلاغ)$/i;
handler.owner = true;

export default handler;
