// الأمر يُستخدم عندما تنضم المجموعة، إذا انضممت اكتب.إضافة_الاشتراك <الوقت>
// Xnuvers007

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args || (!/\d+/.test(args) &&!/[dhm]/.test(args))) {
        throw `أدخل رقم يمثل الوقت!\nمثال: ${usedPrefix + command} 30m`;
    }

    let who;
    if (m.isGroup) who = args? args: m.chat;
    else who = args;

    let match = args.match(/(\d+)([dhm])/);
    if (!match) throw 'تنسيق الوقت غير صحيح. استخدم "d" لليوم، "h" للساعة، أو "m" للدقيقة. مثال: 30m، 1h، 2d.';

    let timeValue = parseInt(match);
    let timeUnit = match.toLowerCase();

    let milliseconds;
    switch (timeUnit) {
        case 'd':
            milliseconds = timeValue * 24 * 60 * 60 * 1000;
            break;
        case 'h':
            milliseconds = timeValue * 60 * 60 * 1000;
            break;
        case 'm':
            milliseconds = timeValue * 60 * 1000;
            break;
        default:
            throw 'الوقت غير صحيح. استخدم "d" لليوم، "h" للساعة، أو "m" للدقيقة.';
    }

    var now = new Date() * 1;
    if (now < global.db.data.chats[who].expired) global.db.data.chats[who].expired = milliseconds;
    else global.db.data.chats[who].expired = now + milliseconds;

    let timeUnitText;
    switch (timeUnit) {
        case 'd':
            timeUnitText = 'يوم';
            break;
        case 'h':
            timeUnitText = 'ساعة';
            break;
        case 'm':
            timeUnitText = 'دقيقة';
            break;
    }

    conn.reply(m.chat, `تم تعيين تاريخ الانتهاء لهذه المجموعة لمدة ${args} ${timeUnitText}.\n\nالعداد: ${msToDate(global.db.data.chats[who].expired - now)}`, m);
}

handler.help = ['إضافة_الاشتراك <الوقت>']
handler.tags = ['owner']
handler.command = /^(setexpired|addsewa|tambahsewa|nyewa|تعيين_الانتهاء|إضافة_الاشتراك|تفعيل_الاشتراك|اشتراك)$/i
handler.rowner = true
handler.group = true

export default handler

function msToDate(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    return `${days} يوم ${hours} ساعة ${minutes} دقيقة`;
}
