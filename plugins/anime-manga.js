import fetch from 'node-fetch'

var handler = async (m, { conn, text }) => {
    if (!text) throw `❌ أدخل اسم المانغا!`
    conn.reply(m.chat, '🔍 _جارٍ البحث عن المانغا..._', m)
    let res = await fetch('https://api.jikan.moe/v4/manga?q=' + encodeURIComponent(text))
    if (!res.ok) throw '❌ لم يتم العثور على نتائج'
    let json = await res.json()
    let { chapters, url, type, score, scored, scored_by, rank, popularity, members, background, status, volumes, synopsis, favorites } = json.data[0]
    let judul = json.data[0].titles.map(t => `${t.title} [${t.type}]`).join('\n');
    let authors = json.data[0].authors.map(a => `${a.name}`).join(', ');
    let genres = json.data[0].genres.map(g => `${g.name}`).join(', ');

    let info = `
╭━━〔 📚 *معلومات المانغا* 〕━━╮
┃ 📛 *العنوان:* ${judul}
┃ 📖 *الفصول:* ${chapters}
┃ 📑 *النوع:* ${type}
┃ 📊 *الحالة:* ${status}
┃ 🏷️ *التصنيفات:* ${genres}
┃ 📚 *المجلدات:* ${volumes}
┃ ❤️ *المفضلة:* ${favorites}
┃ ⭐ *التقييم:* ${score}
┃ 🏆 *الرتبة:* ${rank}
┃ 🌟 *الشعبية:* ${popularity}
┃ 👥 *الأعضاء:* ${members}
┃ ✍️ *المؤلف:* ${authors}
┃ 🔗 *الرابط:* ${url}
┃ 📝 *الملخص:*
┃ ${synopsis?.slice(0, 200)}...
╰━━━━━━━━━━━━━━╯`.trim();

    conn.sendFile(m.chat, json.data[0].images.jpg.image_url, 'manga.jpg', info, m)
}
handler.help = ['mangainfo <مانغا>']
handler.tags = ['anime']
handler.command = /^(mangainfo)$/i
handler.register = true

export default handler
