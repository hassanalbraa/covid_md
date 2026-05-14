import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
    if (!text) throw `❌ أدخل اسم الأنيمي أو الفيلم`;

    const fetchData = async (url) => {
        let res = await fetch(url);
        return await res.json();
    };

    let otaku = await fetchData(`https://backend.ryzumi.vip/anime/?search=${encodeURIComponent(text)}`);
    let isAnime = true;

    if (!otaku || otaku.length === 0) {
        let movies = await fetchData(`https://ryzendesu-movie-backend.netlify.app/movies`);
        otaku = movies.filter(m => m.judul.toLowerCase().includes(text.toLowerCase()));
        isAnime = false;

        if (!otaku || otaku.length === 0) {
            throw `❌ لم يتم العثور على أنيمي أو فيلم بهذا الاسم.`;
        }
    }

    let animeSlug = otaku[0].slug;
    let animeUrl = isAnime ?
        `https://www.ryzumi.vip/anime/${animeSlug}` :
        `https://www.ryzumi.vip/movie/${animeSlug}`;

    let thumbnailUrl = `https://external-content.duckduckgo.com/iu/?u=${otaku[0].gambar}`;

    let info = `
╭━━〔 🎌 *نتيجة البحث* 〕━━╮
┃ 📛 *العنوان:* ${otaku[0].judul}
┃ 🔗 *الرابط:* ${animeUrl}
╰━━━━━━━━━━━━━━╯`.trim();

    conn.sendFile(m.chat, thumbnailUrl, 'otaku.jpeg', info, m);
};

handler.help = ['anime <عنوان>']
handler.tags = ['anime']
handler.command = /^anime$/i
handler.limit = false

export default handler
