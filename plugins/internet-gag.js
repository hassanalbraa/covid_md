import axios from 'axios'
import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
    m.reply(wait)

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/tool/growagarden`)
        const garden = data.data

        let teks = `╭━━〔 🌼 *Grow a Garden* 〕━━╮\n\n`

        const formatItem = (item) => {
            let time = moment(item.lastUpdated).tz('Asia/Riyadh').format('DD MMM YYYY، HH:mm:ss')
            return `• ${item.name} (${item.quantity})\n  ↳ متاح: ${item.available ? '✅' : '❌'} | آخر تحديث: ${time}\n`
        }

        teks += `🌱 *البذور*\n`
        garden.seeds.forEach(s => { teks += formatItem(s) })

        teks += `\n🧰 *المعدات*\n`
        garden.gear.forEach(g => { teks += formatItem(g) })

        teks += `\n🥚 *البيض*\n`
        garden.eggs.forEach(e => { teks += formatItem(e) })

        teks += `\n🎀 *التجميلات*\n`
        garden.cosmetics.forEach(c => { teks += formatItem(c) })

        teks += `\n🍯 *عناصر الحدث*\n`
        garden.honey.forEach(h => { teks += formatItem(h) })

        let weather = garden.weather
        teks += `\n⛅ *الطقس الحالي:* ${weather.type.toUpperCase()}\n`
        weather.effects.forEach(eff => { teks += `• ${eff}\n` })

        teks += `\n╰━━━━━━━━━━━━━━╯`

        await conn.reply(m.chat, teks.trim(), m)
    } catch (err) {
        m.reply('❌ خطأ:\n\n' + err.message)
    }
}

handler.help = ['growagarden']
handler.tags = ['internet']
handler.command = /^(growagarden|ggarden|gag)$/i
handler.register = true
handler.limit = true

export default handler
