import fetch from 'node-fetch';

let handler = m => m;

handler.before = async (m) => {
    if (!m.isGroup) return
    let chat = global.db.data.chats[m.chat];
    if (chat.simi && !chat.isBanned) {
        if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return;
        if (!m.text) return;

        const url = `https://o.simsimi.com/api/chats?lc=ar&ft=1&normalProb=2&reqText=${encodeURIComponent(m.text)}&talkCnt=0`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('فشل جلب الرد من SimSimi');

            const json = await res.json();

            if (json.respSentence) {
                m.reply(json.respSentence);
            } else {
                m.reply('🤔 لم أفهم رسالتك، حاول مرة أخرى');
            }
        } catch (error) {
            console.error('خطأ:', error);
            m.reply('❌ حدث خطأ أثناء معالجة طلبك');
        }

        return !0;
    }
    return true;
};

export default handler;
