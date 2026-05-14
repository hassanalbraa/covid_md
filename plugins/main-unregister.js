import { createHash } from 'crypto'
let handler = async function (m, { args }) {
  if (!args[0]) throw '❌ الرقم التسلسلي فارغ\n\n• لعرض رقمك التسلسلي ومعلوماتك ارسل الأمر : *.تسجيلي*'
  let user = global.db.data.users[m.sender]
  let sn = createHash('md5').update(m.sender).digest('hex')
  if (args[0] !== sn) throw '❌ الرقم التسلسلي غير صحيح\n\n• لعرض رقمك التسلسلي ومعلوماتك ارسل الأمر : *.تسجيلي*'
  user.registered = false
  m.reply('✅ تم إلغاء التسجيل بنجاح!')
}
handler.help = ['شطب'] // .map(v => 'الغاءتسجيل' + v + ' <الرقم التسلسلي>')
handler.tags = ['main']

handler.command = /^شطب|الغاءتسجيل|الغاءالتسجيل|unreg(ister)?$/i
handler.register = true

export default handler