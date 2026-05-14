let handler = async (m, { conn }) => {
    try {
        let rest = await conn.groupRevokeInvite(m.chat);
        let linked = 'https://chat.whatsapp.com/' + rest;
        m.reply(`✅ تم تجديد رابط القروب بنجاح!\n\n🔗 ${linked}`);
    } catch (error) {
        console.error(error);
        m.reply('❌ فشل تجديد رابط القروب');
    }
};

handler.help = ['تجديد_لينك'];
handler.tags = ['group'];
handler.command = /^(تجديد|revoke)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
