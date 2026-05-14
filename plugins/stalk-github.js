import axios from 'axios'

async function getBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' })
        return Buffer.from(response.data, 'binary')
    } catch (error) {
        console.error('خطأ في جلب البيانات:', error)
        return null
    }
}

var handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '❌ أدخل اسم المستخدم', m)
    await conn.reply(m.chat, '🔍 _جارٍ البحث..._', m)

    try {
        let request = await githubstalk(text)
        let { username, following, followers, type, bio, company, blog, location, email, public_repo, public_gists, profile_pic, created_at, updated_at, html_url, name } = request;

        let thumb = await getBuffer(profile_pic);
        if (!thumb) return conn.reply(m.chat, '❌ فشل جلب صورة الملف الشخصي.', m)

        let hasil = `
╭━━〔 🐙 *GitHub Stalk* 〕━━╮
┃ 👤 *المستخدم:* ${username} (${name})
┃ 🔗 *الرابط:* ${html_url}
┃ 💬 *البايو:* ${bio || '-'}
┃ 🏢 *الشركة:* ${company || '-'}
┃ 📧 *الإيميل:* ${email || '-'}
┃ 🌐 *المدونة:* ${blog || '-'}
┃ 📦 *المستودعات:* ${public_repo}
┃ 👥 *المتابعون:* ${followers}
┃ 👁️ *يتابع:* ${following}
┃ 📍 *الموقع:* ${location || '-'}
┃ 🏷️ *النوع:* ${type}
┃ 📅 *أُنشئ:* ${created_at}
┃ 🔄 *آخر تحديث:* ${updated_at}
╰━━━━━━━━━━━━━━╯`.trim()

        conn.sendFile(m.chat, thumb, 'github.jpg', hasil, m)
    } catch (e) {
        conn.reply(m.chat, '❌ لم يتم العثور على هذا المستخدم.', m)
    }
}

handler.help = ['ghstalk <username>']
handler.tags = ['stalk']
handler.command = /^(جيت|git)$/i
handler.register = true
handler.limit = true

export default handler

async function githubstalk(username) {
    const res = await axios.get(`https://api.github.com/users/${username}`)
    const json = res.data
    return {
        username: json.login,
        name: json.name,
        bio: json.bio,
        company: json.company,
        blog: json.blog,
        location: json.location,
        email: json.email,
        public_repo: json.public_repos,
        public_gists: json.public_gists,
        followers: json.followers,
        following: json.following,
        profile_pic: json.avatar_url,
        html_url: json.html_url,
        type: json.type,
        created_at: json.created_at,
        updated_at: json.updated_at,
    }
}
