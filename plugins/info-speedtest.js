import { promisify } from 'util'
import { exec as execCallback } from 'child_process'
import os from 'os'

const exec = promisify(execCallback)

const handler = async (m, { conn }) => {
    await m.reply('📡 _جارٍ قياس سرعة الإنترنت..._\n\nانتظر قليلاً (30-60 ثانية)')

    try {
        const pythonCmd = os.platform() === 'win32' ? 'python' : 'python3'
        const { stdout } = await exec(`${pythonCmd} speed.py --share --secure`)
        await m.reply(stdout.trim())
    } catch (error) {
        try {
            await m.reply('⏳ _جارٍ المحاولة بطريقة بديلة..._')
            const { stdout } = await exec(`curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 - --simple`)
            const lines = stdout.trim().split('\n')

            if (lines.length >= 3) {
                const ping = lines[0].replace('Ping: ', '').replace(' ms', '')
                const download = lines[1].replace('Download: ', '').replace(' Mbit/s', '')
                const upload = lines[2].replace('Upload: ', '').replace(' Mbit/s', '')

                await m.reply(`
╭━━〔 📡 *نتيجة السرعة* 〕━━╮
┃ ⬇️ *التحميل:* ${download} Mbps
┃ ⬆️ *الرفع:* ${upload} Mbps
┃ 🏓 *البينج:* ${ping} ms
╰━━━━━━━━━━━━━━╯`.trim())
            } else {
                throw new Error('خرج غير صحيح')
            }
        } catch {
            await m.reply('❌ فشل قياس السرعة بجميع الطرق.')
        }
    }
}

handler.help = ['speedtest']
handler.tags = ['info']
handler.command = /^(speedtest|speed)$/i
handler.register = true
handler.rowner = true

export default handler
