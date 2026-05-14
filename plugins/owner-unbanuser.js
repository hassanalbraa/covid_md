/*
💎 القسم: [ أدوات المالك ]
📌 الميزة: [ إلغاء الحظر ]
🏷 النوع: Plugin ESM
♲ الوظيفة: إلغاء حظر المستخدم من قاعدة البيانات
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/

let handler = async (m, { conn, text }) => {
    if (!text) throw 'من تريد إلغاء حظره؟'
    let who;
    if (m.isGroup) {
        if (m.mentionedJid.length > 0) {
            who = m.mentionedJid;
        } else {
            let cleanedNumber = text.replace(/\D/g, ''); 
            who = `${cleanedNumber}@s.whatsapp.net`;
        }
    } else {
        let cleanedNumber = text.replace(/\D/g, '');
        who = `${cleanedNumber}@s.whatsapp.net`;
    }

    let users = db.data.users;
    if (!users[who]) throw 'المستخدم غير موجود';

    users[who].banned = false;
    conn.reply(m.chat, `تم إلغاء حظر المستخدم ${who} بنجاح!`, m);
}

handler.help = ['سماح <رقم>']
handler.tags = ['owner']
handler.command = /^سماح|unban(user)?$/i
handler.rowner = true

export default handler
