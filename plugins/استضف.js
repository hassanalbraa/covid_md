import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import fs from "fs";

// ===================== إعدادات =====================
const apiId = 36270358;
const apiHash = "34de8ed0c4ffbaa7399d8b139495b634";

const sessionStr =
"1BAAOMTQ5LjE1NC4xNjcuOTEAUCWmnckLDXAzQA5U0hT4qdC3ML/Vx7+gX0IqrKYcejySkPzswFSqmHqRDG0xgbZYoYwwMCOg1gjz2+B5fWo4w0ruEpY7wH4EvQX9h3AE+nfq9FnZtDIPq4DF1ii1RYfFzJm84NBs8r1GCO5zBdOY/T2YtTeqVWjufteigWyjEyXkh3k/wKvTZEy6sPbjQ/yXnecrRKTDqJjnWbP8R6chRV0w6DyKTGpZV9HR406XY8M4dm2RbRavQTwNXayXcORHbpE4wJEUGfR0j1HCS1zB6YjYN/pYhP8jeeZHso9DHomwlbPci3RudvxqoBLPWcTAlnmUX8slEZACB6qzVhM1g/Y=";

let stringSession = new StringSession(sessionStr);

// ===================== ملفات =====================
const BOTS_FILE = "./tg_bots.json";
const TOPBOT = "top4top_bot";

// ===================== إدارة =====================
function loadBots() {
    if (!fs.existsSync(BOTS_FILE)) {
        const init = { "1": "SOJIB_BRO_FRESH_NUMBER_BOT" };
        fs.writeFileSync(BOTS_FILE, JSON.stringify(init, null, 2));
        return init;
    }
    return JSON.parse(fs.readFileSync(BOTS_FILE));
}

function saveBot(id, username) {
    let bots = loadBots();
    bots[id] = username.replace("@", "").trim();
    fs.writeFileSync(BOTS_FILE, JSON.stringify(bots, null, 2));
}

// ===================== Telegram =====================
async function getClient() {
    if (!global.tgClient) {
        global.tgClient = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
            deviceModel: "Unified Control Panel"
        });
        await global.tgClient.connect();
        console.log("✅ Telegram Connected");
    }
    return global.tgClient;
}

async function getBotReply(client, bot) {
    try {
        const msgs = await client.getMessages(bot, { limit: 5 });
        return msgs.find(m => !m.out) || null;
    } catch {
        return null;
    }
}

// ===================== VIP MENU (الدمج الحقيقي) =====================
function menu(bot) {
return `
*⚡ 𝑻𝑬𝑳𝑬𝑮𝑹𝑨𝑴 𝑪𝑶𝑵𝑻𝑹𝑶𝑳 ⚡*

*👤 البوت النشط*
*🟢 الحالة: 𝑶𝑵𝑳𝑰𝑵𝑬*
*🤖 @${bot}*

*━━━━━━━━━━━━━━━━━━━*
*📦 𝑩𝑶𝑻 𝑴𝑨𝑵𝑨𝑮𝑬𝑴𝑬𝑵𝑻*
*━━━━━━━━━━━━━━━━━━━*
*📌 تلي بوتات*
*➕ تلي حفظ*
*🔄 بوت [𝑰𝑫]*
*🗑️ حذف [𝑰𝑫]*
*✏️ تعديل*

*━━━━━━━━━━━━━━━━━━━*
*⚙️ 𝑪𝑶𝑵𝑻𝑹𝑶𝑳*
*━━━━━━━━━━━━━━━━━━━*
*🚀 تلي بدء*
*🧠 تلي [نص]*
*🖱️ تلي زر [𝑹𝒂𝒏𝒌]*
*🔄 تلي تحديث*

*━━━━━━━━━━━━━━━━━━━*
*📤 𝑼𝑷𝑳𝑶𝑨𝑫*
*━━━━━━━━━━━━━━━━━━━*
*☁️ تلي رفع*

*━━━━━━━━━━━━━━━━━━━*
*➥𝑪𝑶𝑽𝑰𝑫 𝑩𝑶𝑻 𝑽2*
`;
}

// ===================== الهاندلر =====================
let handler = async (m, { conn, text }) => {
    let bots = loadBots();

    if (!global.currentTgBot) {
        global.currentTgBot = bots["1"] || Object.values(bots)[0];
    }

    const client = await getClient();

    // ===================== القائمة (الدمج المطلوب) =====================
    if (!text) {
        return m.reply(menu(global.currentTgBot));
    }

    const input = text.trim();

    try {

        // ===================== بوتات =====================
        if (input === "بوتات") {
            let list = Object.entries(bots)
                .map(([id, b]) => `${id} ➜ @${b}${b === global.currentTgBot ? " ✅" : ""}`)
                .join("\n");
            return m.reply("🤖 البوتات:\n\n" + list);
        }

        // ===================== حفظ =====================
        if (input.startsWith("حفظ ")) {
            let user = input.replace("حفظ ", "").replace("@", "").trim();
            let id = Object.keys(bots).length + 1;
            saveBot(id, user);
            return m.reply(`✅ تم حفظ @${user}`);
        }

        // ===================== تعديل =====================
        if (input.startsWith("تعديل ")) {
            let [, id, user] = input.split(" ");
            if (!bots[id]) return m.reply("❌ غير موجود");
            saveBot(id, user);
            return m.reply("✅ تم التعديل");
        }

        // ===================== حذف =====================
        if (input.startsWith("حذف ")) {
            let id = input.split(" ")[1];
            delete bots[id];
            fs.writeFileSync(BOTS_FILE, JSON.stringify(bots, null, 2));
            return m.reply("🗑️ تم الحذف");
        }

        // ===================== تبديل =====================
        if (input.startsWith("بوت ")) {
            let id = input.split(" ")[1];
            if (!bots[id]) return m.reply("❌ غير موجود");
            global.currentTgBot = bots[id];
            return m.reply("🔄 تم التبديل");
        }

        const target = global.currentTgBot;

        // ===================== بدء =====================
        if (input === "بدء") {
            await client.sendMessage(target, { message: "/start" });
            return m.reply("🏁 تم الإرسال");
        }

        // ===================== زر =====================
        if (input.startsWith("زر ")) {
            let i = parseInt(input.split(" ")[1]) - 1;
            let msgs = await client.getMessages(target, { limit: 5 });
            let msg = msgs.find(m => m.replyMarkup?.rows);

            if (!msg) return m.reply("❌ لا يوجد أزرار");

            let btns = [];
            msg.replyMarkup.rows.forEach(r =>
                r.buttons.forEach(b => btns.push(b.text))
            );

            if (i < 0 || i >= btns.length) return m.reply("❌ رقم غلط");

            await msg.click({ text: btns[i] });
            return m.reply("🖱️ تم الضغط");
        }

        // ===================== رفع =====================
        if (input === "رفع") {
            if (!m.quoted) return m.reply("❌ رد على ملف");

            let buffer = await m.quoted.download();
            let fileName = m.quoted.fileName || `file_${Date.now()}.bin`;

            if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp");

            let path = `./tmp/${fileName}`;
            fs.writeFileSync(path, buffer);

            await m.reply("⏳ رفع...");

            await client.sendMessage(TOPBOT, { file: path, message: "upload" });

            setTimeout(async () => {
                let msgs = await client.getMessages(TOPBOT, { limit: 5 });
                let r = msgs.find(m => !m.out);
                if (!r) return;

                let link = (r.message || "").match(/https?:\/\/\S+/)?.[0];

                await m.reply(link ? "🔗 " + link : r.message);
            }, 6000);

            return;
        }

        // ===================== إرسال =====================
        await client.sendMessage(target, { message: input });

        setTimeout(async () => {
            let r = await getBotReply(client, target);
            if (!r) return;
            await conn.reply(m.chat,
                `📩 رد:\n\n${r.message || "بدون نص"}`, m);
        }, 3000);

    } catch (e) {
        console.log(e);
        m.reply("❌ خطأ: " + e.message);
    }
};

handler.help = ["تلي"];
handler.tags = ["owner"];
handler.command = /^(تلي|بوتي|اطلب)$/i;
handler.owner = true;

export default handler;