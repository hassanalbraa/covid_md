let handler = async(m) => {
	
	if (!m.quoted) return m.reply(
		"رد على رسالة العرض لمرة واحدة 🙂"
	);
	let typ = ["image/jpeg", "video/mp4"]
	let regMedia = typ.includes(m.quoted.mimetype);
	let view = m.quoted?.viewOnce == true ? true : false
	
	if (regMedia && view) {
		let msg = await m.getQuotedObj()?.message;
		let type = Object.keys(msg)[0];
		let media = await m.quoted?.download() || await m.getQuotedObj()
		.download();
		if (!media) return m.reply("حصل خطأ ❌")
	
		await conn.sendFile(
		m.chat, media, 'error.mp4', msg[type]?.caption || '', m
		);
	} else m.reply("هذه ليست عرض لمرة واحدة");
};

handler.help = ['1']
handler.tags = ['tools']
handler.command = /^1/i

handler.register = true

export default handler
