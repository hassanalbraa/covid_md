import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `❌ مثال:\n${usedPrefix + command} الرياض`;

    await m.reply(global.wait);
    let teksenc = encodeURIComponent(text);

    let res = await fetch(API('https://api.openweathermap.org', '/data/2.5/weather', {
        q: text,
        units: 'metric',
        appid: '060a6bcfa19809c2cd4d97a212b19273'
    }));

    if (!res.ok) throw '❌ الموقع غير موجود';

    let json = await res.json();
    if (json.cod != 200) throw json;

    let gustKmph = json.wind.gust * 3.6;

    let sunriseTime = json.sys.sunrise ? new Date(json.sys.sunrise * 1000).toLocaleTimeString('ar-SA', {
        hour: '2-digit', minute: '2-digit', hour12: false
    }) : 'غير متاح';
    let sunsetTime = json.sys.sunset ? new Date(json.sys.sunset * 1000).toLocaleTimeString('ar-SA', {
        hour: '2-digit', minute: '2-digit', hour12: false
    }) : 'غير متاح';

    let groundLevelPressure = json.main.grnd_level !== undefined ? json.main.grnd_level + ' hPa' : 'غير متاح';
    let seaLevelPressure = json.main.sea_level !== undefined ? json.main.sea_level + ' hPa' : 'غير متاح';

    m.reply(`
╭━━〔 🌤️ *الطقس - ${json.name}* 〕━━╮
┃ 🌍 *الموقع:* ${json.name}، ${json.sys.country}
┃ 🌦️ *الحالة:* ${json.weather[0].description}
┃ 🌡️ *درجة الحرارة:* ${json.main.temp} °م
┃ 🔥 *الأعلى:* ${json.main.temp_max} °م
┃ ❄️ *الأدنى:* ${json.main.temp_min} °م
┃ 😊 *الإحساس:* ${json.main.feels_like} °م
┃ 💧 *الرطوبة:* ${json.main.humidity}%
┃ 💨 *الرياح:* ${json.wind.speed} كم/س
┃ ☁️ *الغيوم:* ${json.clouds?.all || 0}%
┃ 🌬️ *الضغط:* ${json.main.pressure} hPa
┃ 👀 *الرؤية:* ${json.visibility ? `${(json.visibility / 1000).toFixed(2)} كم` : 'غير متاح'}
┃ 🌄 *الشروق:* ${sunriseTime}
┃ 🌅 *الغروب:* ${sunsetTime}
┃ 🗺️ *الخريطة:* https://maps.google.com/?q=${teksenc}
╰━━━━━━━━━━━━━━╯`.trim());
};

handler.help = ['طقس']
handler.tags = ['internet']
handler.command = /^(طقس|weather)$/i
handler.register = true

export default handler
