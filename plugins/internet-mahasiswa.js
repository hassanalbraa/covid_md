import axios from 'axios'

var handler = async (m, { conn, text }) => {
    if (!text) throw `❌ أدخل اسم الطالب للبحث!`;

    conn.reply(m.chat, '🔍 _جارٍ البحث... انتظر قليلاً_', m);

    const url = `${APIs.ryzumi}/api/search/mahasiswa?query=${encodeURIComponent(text)}`;

    try {
        let res = await axios.get(url);
        const data = res.data;

        if (!Array.isArray(data) || data.length === 0) throw '❌ لا توجد نتائج لهذا الاسم.';

        let message = `╭━━〔 🎓 *نتائج البحث: "${text}"* 〕━━╮\n\n`;

        data.forEach((mahasiswa, index) => {
            const nama = mahasiswa.nama || 'غير معروف';
            const nim = mahasiswa.nim || 'غير معروف';
            const namaPt = mahasiswa.nama_pt || 'غير معروف';
            const namaProdi = mahasiswa.nama_prodi || 'غير معروف';
            message += `*${index + 1}.* ${nama}\n📛 رقم القيد: ${nim}\n🏫 الجامعة: ${namaPt}\n📚 التخصص: ${namaProdi}\n\n`;
        });

        message += `╰━━━━━━━━━━━━━━╯`;
        conn.reply(m.chat, message, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ خطأ: ${error.message || error}`, m);
    }
};

handler.help = ['mahasiswa <اسم>'];
handler.tags = ['internet'];
handler.command = /^(mahasiswa)$/i;
handler.register = true

export default handler
