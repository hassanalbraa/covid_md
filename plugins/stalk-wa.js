/*
💎 القسم: [ أدوات البحث ]
📌 الميزة: [ تعقب واتساب ]
🏷 النوع: Plugin ESM
♲ الوظيفة: الحصول على معلومات المستخدم من واتساب (الاسم، الصورة، الحالة، بيانات العمل)
✍️ بواسطة:
• https://t.me/YatoCoding
• https://t.me/alkaser_0_0
*/
import moment from 'moment-timezone'
import PhoneNum from 'awesome-phonenumber'

let regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

let handler = async (m, { conn, text, usedPrefix, command: cmd }) => {
	let num = m.quoted?.sender || m.mentionedJid?.[0] || text
	if (!num) throw `Ex: ${usedPrefix + cmd} @tag / 967xxx`
	num = num.replace(/\D/g, '') + '@s.whatsapp.net'
	if (!(await conn.onWhatsApp(num))[0]?.exists) throw 'User not exists'
	let img = await conn.profilePictureUrl(num, 'image').catch(_ => './src/avatar_contact.png')
	let bio = await conn.fetchStatus(num).catch(_ => { })
	let name = await conn.getName(num)
	let business = await conn.getBusinessProfile(num)
	let format = PhoneNum(`+${num.split('@')[0]}`)
	let country = regionNames.of(format.getRegionCode('international'))
	let wea = `\t\t\t\t*▾ WHATSAPP ▾*\n\n*° الدولة :* ${country.toUpperCase()}\n*° الإسم :* ${name ? name : '-'}\n*° تنسيق الرقم :* ${format.getNumber('international')}\n*° الرابط :* wa.me/${num.split('@')[0]}\n*° المنشن :* @${num.split('@')[0]}\n*° البايو :* ${bio?.status || '-'}\n*° تاريخ البايو :* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale('id').format('LL') : '-'}\n\n${business ? `\t\t\t\t*▾ BUSINESS WA ▾*\n\n*° الايدي :* ${business.wid}\n*° الموقع :* ${business.website ? business.website : '-'}\n*° الايميل :* ${business.email ? business.email : '-'}\n*° الفئة :* ${business.category}\n*° العنوان :* ${business.address ? business.address : '-'}\n*° التوفر :* ${business.business_hours.timezone ? business.business_hours.timezone : '-'}\n*° الوصف* : ${business.description ? business.description : '-'}` : '*حساب واتساب قياسي*'}`
	img ? await conn.sendMessage(m.chat, { image: { url: img }, caption: wea, mentions: [num] }, { quoted: m }) : m.reply(wea)
}

handler.help = ['واتس']
handler.tags = ['stalk']
handler.command = /^(wa|whatsapp)stalk|واتس|واتساب$/i

handler.register = true

export default handler