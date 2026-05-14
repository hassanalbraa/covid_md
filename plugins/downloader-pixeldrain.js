import axios from 'axios'
import * as cheerio from 'cheerio'

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '❌ أرسل رابط Pixeldrain';
    const sender = m.sender.split('@')[0];
    const url = args[0];

    m.reply(wait);

    try {
        const { url: downloadUrl, filename, filetype } = await pixeldrainDL(url);
        const caption = `🎬 تفضل يا @${sender}`;
        await conn.sendMessage(m.chat, {
            video: { url: downloadUrl },
            mimetype: filetype,
            fileName: filename,
            caption: caption,
            mentions: [m.sender],
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ حدث خطأ: ${error}`, m);
    }
}

handler.help = ['pixeldrain <رابط>']
handler.tags = ['downloader']
handler.command = /^(pddl|pixeldrain|pixeldrain(dl)?)$/i
handler.limit = true
handler.register = true

export default handler

async function pixeldrainDL(url) {
    if (typeof url !== 'string' || !isValidUrl(url)) {
        throw new Error("❌ رابط غير صحيح");
    }

    const DEFAULT_HEADERS = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'accept-language': 'ar,en;q=0.9',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
    };

    const { data } = await axios.get(url, { headers: DEFAULT_HEADERS });
    const $ = cheerio.load(data);
    const scriptData = $('script').eq(0).html();
    const jsonData = /window\.viewer_data\s*=\s*({.*?});/.exec(scriptData)?.[1];

    if (!jsonData) throw new Error("❌ فشل جلب بيانات الملف");

    const viewerData = JSON.parse(jsonData);
    const fileData = viewerData.api_response;
    const fileSizeMB = fileData.size / (1024 * 1024);

    if (fileSizeMB > 300) {
        throw new Error(`❌ الملف كبير جداً (${fileSizeMB.toFixed(2)} MB) - الحد الأقصى 300 MB`);
    }

    return {
        url: `https://pixeldrain.com/api/file/${fileData.id}?download`,
        filename: fileData.name,
        filetype: fileData.mime_type,
        filesize: fileSizeMB
    };
}

function isValidUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?pixeldrain\.com\/.*$/;
    return regex.test(url);
}
