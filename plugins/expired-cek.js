let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (global.db.data.chats[m.chat].expired < 1) throw 'هذا المجموعة غير مُعدة للانتهاء!';
    let who;
    if (m.isGroup) who = args? args: m.chat;
    else who = args;

    var now = new Date() * 1;

    conn.reply(m.chat, `*⌛️ الوقت المتبقي حتى الانتهاء ⌛️*\n\n${msToDate(global.db.data.chats[who].expired - now)}`, m);
}

handler.help = ['الاشتراك']
handler.tags = ['group']
handler.command = /^(cekexpired|cekkadaluarsa|checkexpired|checkkadaluarsa|الإشتراك|الاشتراك|فحص_الاشتراك|الانتهاء|التفعيل)$/i
handler.group = true

export default handler

function msToDate(ms) {
    let temp = ms
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    return `${days} يوم ${hours} ساعة ${minutes} دقيقة`;
}
