import { exec } from "child_process";

const handler = async (m, { conn }) => {
  await m.reply("♻️ جاري إعادة تشغيل البوت...");

  setTimeout(() => {
    exec("pm2 restart all || node main.js", (err) => {
      if (err) console.log(err);
    });
  }, 1500);
};
handler.owner = true
handler.command = /^رستر|restart$/i;
export default handler;