import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*⛌ أدخل الرمز التعبيري الذي تريد دمجه*\n\n*• Example:*\n- ${usedPrefix + command} 😂+😂\n- ${usedPrefix + command} 😂  😂\n\n[ الحد الأدنى 2 رموز تعبيرية ]`;

  let emojis = text.split(/[\+\s]/).filter(Boolean);
  if (emojis.length < 2) throw 'أدخل رمزين تعبيريين على الأقل للدمج';
  if (emojis.length > 2) throw 'الحد الأقصى لعدد الرموز التعبيرية التي يمكن مزجها هو 2';

  const anu = await (await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emojis.join('_'))}`)).json();

  if (!anu.results[0]) throw 'لم يتم العثور على مزيج الرموز التعبيرية';
  
  let emix = anu.results[0].media_formats.png_transparent.url;
  conn.sendSticker(m.chat, emix, m)
};

handler.help = ['دمج']
handler.tags = ['maker']
handler.command = /^(دمج|emojimix|emix)$/i
handler.register = true

export default handler