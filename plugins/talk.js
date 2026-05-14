import fetch from 'node-fetch'

const XI_API_KEY = "sk_227fd9b394171fdcfff6bbaa33476a9f9bb6833d9701da92"

// 🎤 الأصوات
const voices = {
    default: "21m00Tcm4TlvDq8ikWAM",
    male: "ErXwobaYiN019PkySvjV",
    female: "EXAVITQu4vr4xnSDxMaL",
    anime: "MF3mGyEYCl7XYWbV9V6O",

    // 🔥 صوت بنت (اللي أضفته)
    girl: "XTa3iQyMA6f1qrI4F6kZ"
}

let handler = async (m, { conn, args, usedPrefix, command }) => {

    let input = args.join(' ')
    if (!input && m.quoted?.text) input = m.quoted.text

    if (!input) {
        throw `📌 مثال الاستخدام:\n${usedPrefix + command} hello | girl`
    }

    await conn.sendPresenceUpdate('recording', m.chat)

    // ✳️ فصل النص + الصوت
    let [text, voiceName] = input.split('|').map(v => v.trim())

    if (!text) return m.reply("❌ اكتب النص أولاً")

    // 🔥 تحديد الصوت
    let voice_id = voices[voiceName?.toLowerCase()] || voices.default

    try {

        const res = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": XI_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "audio/mpeg"
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                })
            }
        )

        // ❌ لو فشل API
        if (!res.ok) {
            const err = await res.text()
            console.log("ElevenLabs Error:", err)
            return m.reply("❌ فشل تحويل النص لصوت")
        }

        // 🔊 تحويل الصوت
        const audioBuffer = Buffer.from(await res.arrayBuffer())

        await conn.sendFile(
            m.chat,
            audioBuffer,
            'tts.mp3',
            null,
            m,
            true,
            {
                type: 'audioMessage',
                ptt: true
            }
        )

    } catch (e) {
        console.log(e)
        m.reply("❌ خطأ في الاتصال بخدمة الصوت")
    }
}

handler.help = ['tts <نص | صوت>']
handler.tags = ['tools']
handler.command = /^(tts|talk|انطق|نطق)$/i

export default handler