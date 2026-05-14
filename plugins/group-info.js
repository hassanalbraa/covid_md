import axios from 'axios';

let handler = async (m, { conn, participants, groupMetadata }) => {
    const ppUrls = [
        'https://i.ibb.co/VVXTRv0/f8323e88975b4e8c15580fbb8daed698.jpg',
    ];
    let ppUrl = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null);
    if (!ppUrl) ppUrl = ppUrls[0];

    const ppBuffer = await axios.get(ppUrl, { responseType: 'arraybuffer' }).then(res => res.data).catch(_ => null);

    const { isBanned, welcome, detect, antiLink } = global.db.data.chats[m.chat] || {};
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `┃ ${i + 1}. @${v.id.split('@')[0]}`).join('\n');
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';

    let text = `
╭━━〔 ℹ️ *معلومات المجموعة* 〕━━╮
┃ 🆔 *المعرف:*
┃ ${groupMetadata.id}
┃ ━━━━━━━━━━━━━━
┃ 📛 *الاسم:* ${groupMetadata.subject}
┃ 👑 *المالك:* @${owner.split('@')[0]}
┃ 👥 *الأعضاء:* ${participants.length}
┃ 📝 *الوصف:*
┃ ${groupMetadata.desc?.toString() || 'لا يوجد وصف'}
┃ ━━━━━━━━━━━━━━
┃ ⚙️ *الإعدادات:*
┃ 🚫 محظور: ${isBanned ? '✅' : '❌'}
┃ 👋 ترحيب: ${welcome ? '✅' : '❌'}
┃ 🔗 مضاد للروابط: ${antiLink ? '✅' : '❌'}
┃ ━━━━━━━━━━━━━━
┃ 🛡️ *المشرفون:*
${listAdmin}
╰━━━━━━━━━━━━━━╯`.trim();

    let options = {
        contextInfo: {
            mentionedJid: groupAdmins.map(v => v.id)
        }
    };

    if (ppBuffer) {
        conn.sendMessage(m.chat, { image: ppBuffer, caption: text, ...options }, { quoted: m });
    } else {
        conn.reply(m.chat, text, m, options);
    }
};

handler.help = ['معلومات_قروب'];
handler.tags = ['group'];
handler.command = /^(معلومات|groupinfo|ginfo)$/i;
handler.group = true;

export default handler;
