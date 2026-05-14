const insta = async (m, { text, Api, conn }) => {
  if (!text) {
    return m.reply(`
╭━━〔 📥 تحميل إنستغرام 〕━━╮
┃
┃ أرسل رابط منشور أو ريلز
┃ مع الأمر
┃
┃ مثال:
┃ .انستا الرابط
┃
╰━━━━━━━━━━━━━━╯
`)
  }

  try {
    await m.react("⏳")

    const { status, data } = await Api.download.instagram({
      url: text
    })

    if (status !== "success") {
      await m.react("❌")
      return m.reply("❌ فشل تحميل المحتوى من الرابط")
    }

    if (!Array.isArray(data)) {
      await m.react("❌")
      return m.reply("❌ لم يتم العثور على وسائط")
    }

    let thumbnail = null
    let video = null
    let images = []

    for (let item of data) {
      if (item.type === "thumbnail") {
        thumbnail = item.url
      }

      else if (item.type === "video") {
        video = item.url
      }

      else if (item.type === "image") {
        images.push(item.url)
      }
    }

    // صورة المعاينة
    if (thumbnail) {
      await conn.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: `
╭━━〔 📸 معاينة إنستغرام 〕━━╮
┃ تم العثور على المحتوى
╰━━━━━━━━━━━━━━╯
`
      }, { quoted: m })
    }

    // إرسال الصور إذا المنشور صور
    for (let img of images) {
      await conn.sendMessage(m.chat, {
        image: { url: img },
        caption: "✅ تم تحميل الصورة بنجاح"
      }, { quoted: m })
    }

    // إرسال الفيديو
    if (video) {
      await conn.sendMessage(m.chat, {
        video: { url: video },
        caption: `
╭━━〔 🎥 تم التحميل 〕━━╮
┃ تم تحميل فيديو الإنستغرام بنجاح
╰━━━━━━━━━━━━━━╯
`
      }, { quoted: m })
    }

    if (!video && images.length === 0 && !thumbnail) {
      return m.reply("❌ الرابط لا يحتوي على وسائط قابلة للتحميل")
    }

    await m.react("✅")

  } catch (error) {
    console.log(error)
    await m.react("❌")
    m.reply("حدث خطأ أثناء التحميل")
  }
}

insta.usage = ["انستا"]
insta.category = "downloads"
insta.command = ["انستا", "instagram", "ig"]
insta.admin = false

export default insta