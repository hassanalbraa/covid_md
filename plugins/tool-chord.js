import axios from 'axios'

let handler = async (m, { text }) => {
    if (!text) throw '❌ أدخل اسم الأغنية'
    let a = await chord(text)
    m.reply(`
╭━━〔 🎸 *تابات الأغنية* 〕━━╮
┃ 🎵 *الأغنية:* ${a.title}
╰━━━━━━━━━━━━━━╯

${a.chord}`.trim())
}

handler.help = ['chord <اسم الأغنية>']
handler.tags = ['tools']
handler.command = /^(chord)$/i
handler.register = true
handler.limit = true

export default handler

export async function chord(query) {
    return new Promise(async (resolve, reject) => {
        const url = `${APIs.ryzumi}/api/search/chord?query=${query}`;
        try {
            let { data } = await axios.get(url);
            if (data?.title && data?.chord) {
                resolve({ title: data.title, chord: data.chord });
            } else {
                reject('❌ لا توجد نتائج');
            }
        } catch (error) {
            reject('❌ خطأ في جلب البيانات: ' + error.message);
        }
    });
}
