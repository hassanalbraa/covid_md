import fetch from 'node-fetch';

let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
    if (!text) throw `_أدخل الرقم!_\nمثال:\n\n${usedPrefix + command} ${global.owner[0][0]}`;
    
    m.reply('⏳ _جارٍ المعالجة..._');
    const _participants = participants.map(user => user.id);
    
    const users = await Promise.all(
        text.split(',')
            .map(v => v.replace(/[^0-9]/g, ''))
            .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
            .map(async v => {
                const userCheck = await conn.onWhatsApp(v + '@s.whatsapp.net');
                return userCheck[0]?.exists ? v + '@c.us' : null;
            })
    ).then(results => results.filter(Boolean));

    if (!users.length) return m.reply('❌ لا يوجد أرقام صحيحة للإضافة');

    const response = await conn.groupParticipantsUpdate(m.chat, users, "add");

    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => null);
    const jpegThumbnail = pp ? Buffer.from(await (await fetch(pp)).arrayBuffer()) : Buffer.alloc(0);

    for (const participant of response) {
        const jid = participant.content?.attrs?.phone_number;
        if (!jid) continue;
        const status = participant.status;

        if (status === '408') {
            conn.reply(m.chat, `⚠️ لا يمكن إضافة @${jid.split('@')[0]}!\nربما غادر المجموعة مؤخراً أو تم طرده`, m);
        } else if (status === '403') {
            const inviteCode = participant.content?.content?.[0]?.attrs?.code;
            const inviteExp = participant.content?.content?.[0]?.attrs?.expiration;
            if (!inviteCode) continue;
            await m.reply(`📨 جارٍ إرسال دعوة لـ @${jid.split('@')[0]}...`);
            await conn.sendGroupV4Invite(
                m.chat, jid, inviteCode, inviteExp,
                await conn.getName(m.chat),
                '📩 دعوة للانضمام إلى مجموعة واتساب',
                jpegThumbnail
            );
        }
    }
    m.reply('✅ تمت عملية الإضافة');
};

handler.help = ['اضف', '+']
handler.tags = ['group'];
handler.command = /^(اضف|\+)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
