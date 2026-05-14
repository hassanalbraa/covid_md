import fetch from "node-fetch";
import cheerio from "cheerio";
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, command, usedPrefix }) => {

    let menu = `╭━━〔 📱 *أرقام وهمية* 〕━━╮\n┃ مرحباً @${m.sender.split("@")[0]}\n╰━━━━━━━━━━━━━━╯\n`;

    const cap = `${menu}\n*خيارات الأمر:*\n• [دولة] - عرض قائمة الدول\n• [أرقام] - عرض أرقام الدولة\n• [رسائل] - عرض رسائل للرقم\n• [كود] - نسخ كود الرسالة`;

    let lister = ["دولة", "أرقام", "رسائل", "كود"];

    const link = 'https://temporary-phone-number.com';
    const link2 = 'https://temporary-phone-number.com/countrys/';

    let [feature, ...args] = (text || '').split(" ");
    let additionalLink = args.join(" ").trim();

    if (!lister.includes(feature)) {
        return conn.reply(m.chat, cap, m);
    }

    if (feature === "دولة") {
        try {
            let response = await fetch(link2);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            let html = await response.text();
            const $ = cheerio.load(html);

            let countryList = [];
            $('a.checkout-box').each((i, el) => {
                const href = $(el).attr('href');
                const countryName = $(el).text().trim().split('\n')[0];
                if (href) countryList.push(`${i + 1}. ${countryName} → ${usedPrefix}${command} أرقام ${link2.replace(link, '') + href}`);
            });

            conn.reply(m.chat, `╭━━〔 🌍 *قائمة الدول* 〕━━╮\n\n${countryList.join('\n')}\n\n╰━━━━━━━━━━━━━━╯`, m);
        } catch (e) {
            conn.reply(m.chat, `❌ خطأ: ${e.message}`, m);
        }
    }
}

handler.help = ['فك_رقم']
handler.tags = ['tools']
handler.command = /^(رقم_وهمي|فيك|fakeno)$/i
handler.register = true

export default handler
