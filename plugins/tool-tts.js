import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join } from 'path'

const defaultLang = 'ar'
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let lang = args[0]
    let text = args.slice(1).join(' ')
    if ((args[0] || '').length !== 2) {
        lang = defaultLang
        text = args.join(' ')
    }
    if (!text && m.quoted?.text) text = m.quoted.text

    let res
    try { res = await tts(text, lang) }
    catch (e) {
        m.reply(`❌ خطأ: ${e}\nمثال: ${usedPrefix}${command} ar مرحبا بك`)
        text = args.join(' ')
        if (!text) throw `مثال: ${usedPrefix}${command} ar مرحبا بك`
        res = await tts(text, defaultLang)
    } finally {
        if (res) conn.sendFile(m.chat, res, 'tts.opus', null, m, true)
    }
}
handler.help = ['tts <لغة> <نص>']
handler.tags = ['tools']
handler.command = /^g?tts$/i
handler.register = true

export default handler

function tts(text, lang = 'ar') {
    return new Promise((resolve, reject) => {
        try {
            let ttsObj = gtts(lang)
            let filePath = join(global.__dirname(import.meta.url), '../tmp', (1 * new Date) + '.wav')
            ttsObj.save(filePath, text, () => {
                resolve(readFileSync(filePath))
                unlinkSync(filePath)
            })
        } catch (e) { reject(e) }
    })
}
