import fetch from 'node-fetch'

var handler = async (m, { conn, text }) => {
    if (!text) throw `❌ أدخل اسم الأنيمي!`;

    let res = await fetch('https://api.jikan.moe/v4/anime?q=' + encodeURIComponent(text));
    if (!res.ok) throw '❌ لم يتم العثور على نتائج';

    let json = await res.json();
    let animeData = json.data[0];
    if (!animeData) throw '❌ الأنيمي غير موجود.';

    let { title_japanese, url, type, score, members, status, synopsis, favorites, images, genres } = animeData;
    let genreList = genres.map(g => g.name).join(', ');

    let info = `
╭━━〔 🎌 *معلومات الأنيمي* 〕━━╮
┃ 📛 *الاسم:* ${title_japanese}
┃ 🎬 *النوع:* ${type}
┃ 🏷️ *التصنيفات:* ${genreList}
┃ ⭐ *التقييم:* ${score}
┃ 👥 *الأعضاء:* ${members}
┃ 📊 *الحالة:* ${status}
┃ ❤️ *المفضلة:* ${favorites}
┃ 🔗 *الرابط:* ${url}
┃ 📝 *الملخص:*
┃ ${synopsis?.slice(0, 200)}...
╰━━━━━━━━━━━━━━╯`.trim();

    conn.sendFile(m.chat, images.jpg.image_url, 'anime.jpg', info, m);
};

handler.help = ['animeinfo <أنيمي>'];
handler.tags = ['anime'];
handler.command = /^(animeinfo)$/i;
handler.register = true

export default handler
