import fs from "fs";
import crypto from "crypto";
import pino from "pino";
import { makeWASocket } from "../lib/simple.js";
import {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore
} from "@whiskeysockets/baileys";

if (!global.conns) global.conns = [];

const mssg = {
  botinfo: "📌 انسخ الكود وروح للأجهزة المرتبطة في واتساب",
  success: "✅ تم الاتصال بنجاح",
  fail: "❌ فشل الاتصال"
};

const handler = async (m, { conn, args, usedPrefix, command }) => {

  const parent = conn;

  async function startSubBot() {

    // 🧠 منع التكرار (مهم جداً)
    if (global.subBusy) return m.reply("⏳ يوجد تنصيب شغال بالفعل");
    global.subBusy = true;

    const idFolder = crypto.randomBytes(6).toString("hex");

    const path = `./rembots/${idFolder}`;
    fs.mkdirSync(path, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(path);
    const { version } = await fetchLatestBaileysVersion();

    let pairingSent = false; // 🚫 يمنع تكرار الكود

    const sock = makeWASocket({
      logger: pino({ level: "silent" }),
      browser: ["Ubuntu", "Chrome", "20.0.0"],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
      },
      version
    });

    // 🔐 إرسال كود الربط مرة واحدة فقط
    sock.ev.on("connection.update", async (update) => {
      const { connection } = update;

      if (connection === "open") {
        try {
          if (pairingSent) return;
          pairingSent = true;

          const phone = m.sender.split("@")[0];

          const code = await sock.requestPairingCode(phone);

          await parent.sendMessage(m.chat, {
            text:
`🔐 كود الربط:

${code}

${mssg.botinfo}`
          }, { quoted: m });

        } catch (e) {
          m.reply("❌ خطأ في توليد الكود");
        }
      }

      if (connection === "close") {
        global.subBusy = false;
        console.log("❌ connection closed");
      }
    });

    // 💾 حفظ الجلسة
    sock.ev.on("creds.update", saveCreds);

    // 📦 ربط الهاندلر
    const handlerFile = await import("../handler.js");
    sock.ev.on("messages.upsert", handlerFile.handler.bind(sock));

    global.conns.push(sock);
  }

  startSubBot();
};

handler.command = /^(تنصيب|serbot|code)$/i;
export default handler;