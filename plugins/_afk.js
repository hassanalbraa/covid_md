let handler = m => m

handler.before = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  // 1️⃣ إذا أنت غائب وكتبت رسالة، ألغِ وضع AFK
  if (user && user.afk > -1) {
    let afkTime = +new Date() - user.afk
    user.afk = -1
    user.afkReason = ''
    m.reply(
      `👋 مرحباً @${m.sender.split('@')[0]}، تم إلغاء وضع الغياب.\n⏱️ كنت غائبًا لمدة ${clockString(afkTime)}.`,
      null,
      { mentions: [m.sender] }
    )
  }

  // 2️⃣ الأشخاص الذين يجب إعلامهم إذا ذكروك أو ردوا على رسائل منك
  let jidsToCheck = [
    // أي منشن
    ...(m.mentionedJid || []),
    // أو الرد على رسائلك
    ...(m.quoted && m.quoted.sender ? [m.quoted.sender] : [])
  ]

  for (let jid of jidsToCheck) {
    // إذا الشخص غائب، نتجاهل
    let mentionedUser = global.db.data.users[jid]
    if (!mentionedUser) continue
    if (mentionedUser.afk == undefined || mentionedUser.afk < 0) continue

    // إذا المستخدم AFK هو نفس الشخص الذي يرسل الرسالة الآن → نتجاهل
    if (jid === m.sender) continue

    // نتحقق هل الشخص الذي غائب هو المرسل الأصلي للرسالة
    // إذا نعم → نرسل رسالة بأن الشخص غائب
    let afkTime = +new Date() - mentionedUser.afk
    let reason = mentionedUser.afkReason || 'بدون سبب محدد'

    m.reply(
      `⚠️ @${jid.split('@')[0]} غائب حاليًا (غياب).\n📋 السبب: ${reason}\n⏱️ مدة الغياب: ${clockString(afkTime)}`,
      null,
      { mentions: [jid] }
    )
  }

  return true
}

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [
    h ? `${h} ساعة` : '',
    m ? `${m} دقيقة` : '',
    s ? `${s} ثانية` : '',
  ].filter(Boolean).join(' ')
}