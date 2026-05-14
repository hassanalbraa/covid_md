
import { setTimeout as delay } from "timers/promises";

const MORNING_TIME = 5;   // 5 صباحاً بتوقيت اليمن
const EVENING_TIME = 16;  // 4 مساءً بتوقيت اليمن

// أذكار الصباح
const morningAzkar = `
🌅 *أذكار الصباح* 🌅
- أصبحنا وأصبح الملك لله، والحمد لله...
- اللهم ما أصبح بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك...
- لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير...
🕔 *تقال بعد الفجر مباشرة*
`;

// أذكار المساء
const eveningAzkar = `
🌇 *أذكار المساء* 🌇
- أمسينا وأمسى الملك لله، والحمد لله...
- اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك...
- لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير...
🕓 *تقال بعد العصر مباشرة*
`;

let azkarInterval = null; // مؤقت الأذكار الحالي

// إرسال الأذكار إلى القروبات المفعلة فقط
async function sendAzkar(conn, text) {
  const chats = Object.entries(global.db.data.chats || {});
  for (let [id, data] of chats) {
    if (id.endsWith("@g.us") && data.autoAzkarEnabled) {
      await conn.sendMessage(id, { text }).catch(() => {});
      await delay(1000);
    }
  }
}

// بدء النظام (يبدأ فقط بالأمر)
async function startAutoAzkar(conn) {
  if (azkarInterval) return; // إذا كان يعمل بالفعل

  console.log("✅ تم تشغيل نظام الأذكار التلقائية");
  azkarInterval = setInterval(async () => {
    try {
      const now = new Date();
      const yemenTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Aden" }));
      const hours = yemenTime.getHours();
      const minutes = yemenTime.getMinutes();

      const settings = global.db.data.settings["autoAzkar"] || { enabled: true };
      if (!settings.enabled) return;

      if (hours === MORNING_TIME && minutes === 0) {
        console.log("🕌 إرسال أذكار الصباح...");
        await sendAzkar(conn, morningAzkar);
      }

      if (hours === EVENING_TIME && minutes === 0) {
        console.log("🕌 إرسال أذكار المساء...");
        await sendAzkar(conn, eveningAzkar);
      }
    } catch (err) {
      console.error("❌ خطأ في نظام الأذكار:", err);
    }
  }, 60000);
}

// إيقاف النظام
function stopAutoAzkar() {
  if (azkarInterval) {
    clearInterval(azkarInterval);
    azkarInterval = null;
    console.log("🚫 تم إيقاف نظام الأذكار التلقائية");
  }
}

// ⚙️ أوامر التحكم
const handler = async (m, { conn, command, isROwner, isAdmin }) => {
  const chat = global.db.data.chats[m.chat] || {};
  const settings = (global.db.data.settings["autoAzkar"] = global.db.data.settings["autoAzkar"] || { enabled: false });

  // أوامر المطور
  if (/^(تشغيل_الاذكار|ايقاف_الاذكار|حالة_الاذكار)$/i.test(command)) {
    if (!isROwner) return m.reply("⚠️ هذا الأمر مخصص للمطور فقط!");

    if (/تشغيل/i.test(command)) {
      settings.enabled = true;
      await startAutoAzkar(conn);
      m.reply("✅ *تم تشغيل نظام الأذكار التلقائية بنجاح!*");
    } else if (/ايقاف/i.test(command)) {
      settings.enabled = false;
      stopAutoAzkar();
      m.reply("🚫 *تم إيقاف نظام الأذكار التلقائية!*");
    } else {
      m.reply(`🔹 الحالة الحالية: ${settings.enabled ? "مفعلة ✅" : "معطلة 🚫"}`);
    }
    return;
  }

  // أوامر مشرفي القروبات
  if (/^(تفعيل_اذكار_القروب|تعطيل_اذكار_القروب)$/i.test(command)) {
    if (!m.isGroup) return m.reply("⚠️ هذا الأمر يعمل في القروبات فقط!");
    if (!isAdmin && !isROwner) return m.reply("👮 هذا الأمر للمشرفين فقط!");

    if (/تفعيل/i.test(command)) {
      chat.autoAzkarEnabled = true;
      m.reply("✅ *تم تفعيل الأذكار في هذا القروب!*");
    } else {
      chat.autoAzkarEnabled = false;
      m.reply("🚫 *تم تعطيل الأذكار في هذا القروب!*");
    }

    global.db.data.chats[m.chat] = chat;
  }
};

handler.command = /^(تشغيل_الاذكار|ايقاف_الاذكار|حالة_الاذكار|تفعيل_اذكار_القروب|تعطيل_اذكار_القروب)$/i;

export default handler;