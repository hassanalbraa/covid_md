import fetch from "node-fetch"
import { ryzenCDN } from '../lib/uploadFile.js'

const handler = async (m, { text, usedPrefix, command, conn }) => {
    try {
        if (!text && !m.quoted && !m.mtype.includes('imageMessage')) {
            throw "❌ أدخل سؤالاً أو أرسل صورة!\n\n*مثال:* ما هو الذكاء الاصطناعي؟";
        }

        let imgUrl = null;

        if (m.quoted && m.quoted.mtype === 'imageMessage') {
            let img = await m.quoted.download();
            if (img) {
                img = Buffer.from(img);
                let link = await ryzenCDN(img);
                if (!link) throw '❌ فشل رفع الصورة';
                imgUrl = typeof link === 'object' ? link.url : link;
            }
        } else if (m.mtype.includes('imageMessage')) {
            let img = await m.download();
            if (img) {
                img = Buffer.from(img);
                let link = await ryzenCDN(img);
                if (!link) throw '❌ فشل رفع الصورة';
                imgUrl = typeof link === 'object' ? link.url : link;
            }
        }

        let anu = 'أنت مساعد ذكي اسمه كوفيد AI، تتحدث العربية بطلاقة، مفيد ومؤدب.'
        let apiUrl;
        if (imgUrl) {
            apiUrl = `${APIs.ryzumi}/api/ai/gemini?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(anu)}&url=${encodeURIComponent(imgUrl)}&session=gemini-${encodeURIComponent(global.namebot)}-${encodeURIComponent(m.sender)}`;
        } else if (text) {
            apiUrl = `${APIs.ryzumi}/api/ai/gemini?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(anu)}&session=gemini-${encodeURIComponent(global.namebot)}-${encodeURIComponent(m.sender)}`;
        } else {
            throw "❌ لا يوجد نص أو صورة صالحة للمعالجة.";
        }

        let hasil = await fetch(apiUrl);
        if (!hasil.ok) throw new Error("❌ فشل الطلب: " + hasil.statusText);

        let result = await hasil.json();
        if (!result.success) throw new Error("❌ الاستجابة غير ناجحة");

        let responseMessage = result.result || "لا توجد استجابة من الذكاء الاصطناعي.";

        await conn.sendMessage(m.chat, {
            text: `╭━━〔 🤖 *Gemini AI* 〕━━╮\n\n${responseMessage}\n\n╰━━━━━━━━━━━━━━╯`
        });

    } catch (error) {
        console.error('خطأ في المعالج:', error);
        await conn.sendMessage(m.chat, { text: `❌ خطأ: ${error?.message || 'حدث خطأ، حاول مرة أخرى'}` });
    }
}

handler.help = ['gemini']
handler.tags = ['ai']
handler.command = /^(gemini)$/i
handler.limit = 8
handler.premium = false
handler.register = true

export default handler
