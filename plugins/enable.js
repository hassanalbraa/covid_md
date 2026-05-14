var handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {

  const الخيارات = `
📋 قائمة الخيارات:
✨ الترحيب
🚫 الحذف
👁️ عرض_مرة_واحدة
🤖 وضع_البوت
🗣️ السيمي
🔞 محتوى_حساس
🔗 منع_الروابط
📞 منع_الاتصال
🚫 منع_السبام
🖼️ ستكر_تلقائي
📊 رفع_مستوى_تلقائي
🔎 كشف
❗ تقييد
👀 مراقبة
☑️ قراءة_تلقائية
💬 خاص_فقط
🏢 مجموعات_فقط
`;

  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let البوت = global.db.data.settings[conn.user.jid];

  if (typeof البوت !== 'object') global.db.data.settings[conn.user.jid] = البوت = {}

  let النوع = (args[0] || '').toLowerCase();

  let تفعيل = /تفعيل|تشغيل|true|on/i.test(command);
  let تعطيل = /تعطيل|ايقاف|false|off/i.test(command);

  let الحالة = تفعيل ? true : تعطيل ? false : null;

  if (الحالة === null) return conn.reply(m.chat, الخيارات, m);

  switch (النوع) {

    case 'الترحيب':
      if (!isOwner && !isAdmin) return conn.reply(m.chat, '🚫 فقط الأدمن أو المالك', m)
      chat.welcome = الحالة
      break

    case 'الحذف':
    case 'منع_الحذف':
      if (!isOwner && !isAdmin) return conn.reply(m.chat, '🚫 فقط الأدمن أو المالك', m)
      chat.delete = !الحالة
      break

    case 'عرض_مرة_واحدة':
      if (!isOwner && !isAdmin) return conn.reply(m.chat, '🚫 فقط الأدمن أو المالك', m)
      chat.viewonce = الحالة
      break

    case 'وضع_البوت':
      if (!isROwner) return conn.reply(m.chat, '🚫 فقط المطور', m)
      global.opts.self = الحالة
      break

    case 'السيمي':
      if (!isROwner) return conn.reply(m.chat, '🚫 فقط المطور', m)
      chat.simi = الحالة
      break

    case 'منع_الروابط':
  if (!isOwner && !isAdmin) return m.reply('🚫 فقط الأدمن أو المالك')
  chat.antiLink = الحالة
  break

    case 'منع_الاتصال':
      if (!isOwner) return conn.reply(m.chat, '🚫 فقط المالك', m)
      chat.anticall = الحالة
      break

    case 'منع_السبام':
      if (!isOwner && !isAdmin) return conn.reply(m.chat, '🚫 فقط الأدمن أو المالك', m)
      chat.antiSpam = الحالة
      break

    case 'ستكر_تلقائي':
      if (!isOwner && !isAdmin) return conn.reply(m.chat, '🚫 فقط الأدمن أو المالك', m)
      chat.autoSticker = الحالة
      break

    case 'رفع_مستوى_تلقائي':
      user.autolevelup = الحالة
      break

    case 'كشف':
      if (!isOwner && !isAdmin) return conn.reply(m.chat, '🚫 فقط الأدمن أو المالك', m)
      chat.detect = الحالة
      break

    case 'تقييد':
      if (!isOwner) return conn.reply(m.chat, '🚫 فقط المالك', m)
      البوت.restrict = الحالة
      break

    case 'قراءة_تلقائية':
      البوت.autoread = الحالة
      break

    case 'خاص_فقط':
      البوت.pconly = الحالة
      break

    case 'مجموعات_فقط':
      البوت.gconly = الحالة
      break

    case 'حالات_فقط':
      البوت.swonly = الحالة
      break

    default:
      return conn.reply(m.chat, الخيارات, m)
  }

  return conn.reply(
    m.chat,
    `✅ تم ${الحالة ? 'التفعيل' : 'التعطيل'} بنجاح\n📌 الخيار: ${النوع}`,
    m
  )
}

handler.help = ['تفعيل', 'تعطيل', 'خيارات']
handler.tags = ['settings']
handler.command = /^(تفعيل|تعطيل|خيارات)$/i

export default handler